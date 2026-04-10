package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"example.com/oa-workorder/internal/middleware"
	"example.com/oa-workorder/internal/models"
	"example.com/oa-workorder/pkg/response"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TicketHandler struct {
	DB *gorm.DB
}

// ApprovalRecord 审批记录条目
type ApprovalRecord struct {
	Step      string `json:"step"`
	Role      string `json:"role"`
	RoleLabel string `json:"role_label"`
	Action    string `json:"action"`
	Comment   string `json:"comment"`
	Time      string `json:"time"`
}

var roleLabelMap = map[string]string{
	"applicant":    "发起人",
	"dept_manager": "部门经理",
	"finance":      "财务",
	"gm":           "总经理",
}

var stepLabelMap = map[string]string{
	"dept_approve":    "部门经理审批",
	"finance_approve": "财务审批",
	"gm_approve":      "总经理审批",
}

type createTicketRequest struct {
	Title       string  `json:"title" binding:"required"`
	Description string  `json:"description"`
	Priority    string  `json:"priority"`
	AssigneeID  *uint   `json:"assignee_id"`
	Type        string  `json:"type"`
	Amount      float64 `json:"amount"`
}

func (h *TicketHandler) Create(c *gin.Context) {
	uid, ok := middleware.UserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "missing user")
		return
	}
	var req createTicketRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid payload")
		return
	}

	// 初始化审批记录：发起
	initRecords := []ApprovalRecord{
		{
			Step:      "start",
			Role:      "applicant",
			RoleLabel: "发起人",
			Action:    "submit",
			Comment:   "",
			Time:      time.Now().Format("2006-01-02 15:04"),
		},
	}
	recordsJSON, _ := json.Marshal(initRecords)

	ticket := models.Ticket{
		Title:           req.Title,
		Description:     req.Description,
		Priority:        normalizePriority(req.Priority),
		Status:          "pending",
		CreatedBy:       uid,
		AssigneeID:      req.AssigneeID,
		Type:            normalizeType(req.Type),
		Amount:          req.Amount,
		CurrentStep:     "dept_approve",
		ApprovalRecords: string(recordsJSON),
	}
	if err := h.DB.Create(&ticket).Error; err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to create ticket")
		return
	}
	response.Created(c, ticket)
}

func (h *TicketHandler) List(c *gin.Context) {
	var tickets []models.Ticket
	q := h.DB.Model(&models.Ticket{})
	if status := c.Query("status"); status != "" {
		q = q.Where("status = ?", status)
	}
	if priority := c.Query("priority"); priority != "" {
		q = q.Where("priority = ?", priority)
	}
	if assignee := c.Query("assignee_id"); assignee != "" {
		if id, err := strconv.Atoi(assignee); err == nil {
			q = q.Where("assignee_id = ?", id)
		}
	}
	page, size := pagination(c)
	var total int64
	_ = q.Count(&total).Error
	if err := q.Order("id desc").Limit(size).Offset((page - 1) * size).Find(&tickets).Error; err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to list tickets")
		return
	}
	response.OK(c, gin.H{
		"items": tickets,
		"page":  page,
		"size":  size,
		"total": total,
	})
}

func (h *TicketHandler) Get(c *gin.Context) {
	id := c.Param("id")
	var ticket models.Ticket
	if err := h.DB.First(&ticket, id).Error; err != nil {
		response.Error(c, http.StatusNotFound, "NOT_FOUND", "ticket not found")
		return
	}
	response.OK(c, ticket)
}

type updateTicketRequest struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
	Priority    *string `json:"priority"`
	Status      *string `json:"status"`
	AssigneeID  *uint   `json:"assignee_id"`
	CurrentStep *string `json:"current_step"`
	Comment     *string `json:"comment"`
	Role        *string `json:"role"`
}

// PublicList exposes a read-only list of approvals without auth (demo use).
// Default filters: type=expense when no type is provided.
func (h *TicketHandler) PublicList(c *gin.Context) {
	var tickets []models.Ticket
	q := h.DB.Model(&models.Ticket{})

	t := c.DefaultQuery("type", "expense")
	if t != "" {
		q = q.Where("type = ?", t)
	}
	if status := c.Query("status"); status != "" {
		q = q.Where("status = ?", status)
	}
	if keyword := strings.TrimSpace(c.Query("keyword")); keyword != "" {
		like := "%" + keyword + "%"
		q = q.Where("title LIKE ? OR description LIKE ?", like, like)
	}

	page, size := pagination(c)
	var total int64
	_ = q.Count(&total).Error
	if err := q.Order("id desc").Limit(size).Offset((page - 1) * size).Find(&tickets).Error; err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to list tickets")
		return
	}
	response.OK(c, gin.H{
		"items": tickets,
		"page":  page,
		"size":  size,
		"total": total,
	})
}

func (h *TicketHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var req updateTicketRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid payload")
		return
	}

	// 先加载现有 ticket 以获取已有审批记录
	var ticket models.Ticket
	if err := h.DB.First(&ticket, id).Error; err != nil {
		response.Error(c, http.StatusNotFound, "NOT_FOUND", "ticket not found")
		return
	}

	updates := map[string]interface{}{}
	if req.Title != nil {
		updates["title"] = *req.Title
	}
	if req.Description != nil {
		updates["description"] = *req.Description
	}
	if req.Priority != nil {
		updates["priority"] = normalizePriority(*req.Priority)
	}
	if req.Status != nil {
		updates["status"] = *req.Status
	}
	if req.AssigneeID != nil {
		updates["assignee_id"] = req.AssigneeID
	}
	if req.CurrentStep != nil {
		updates["current_step"] = *req.CurrentStep
	}

	// 如果有状态变更，追加审批记录
	if req.Status != nil {
		var records []ApprovalRecord
		if ticket.ApprovalRecords != "" {
			_ = json.Unmarshal([]byte(ticket.ApprovalRecords), &records)
		}

		newStatus := *req.Status
		role := ""
		if req.Role != nil {
			role = *req.Role
		}
		commentText := ""
		if req.Comment != nil {
			commentText = *req.Comment
		}
		nowStr := time.Now().Format("2006-01-02 15:04")

		switch newStatus {
		case "reviewing":
			// 当前步骤审批通过，推进到下一步
			record := ApprovalRecord{
				Step:      ticket.CurrentStep,
				Role:      role,
				RoleLabel: roleLabelMap[role],
				Action:    "approve",
				Comment:   commentText,
				Time:      nowStr,
			}
			records = append(records, record)
		case "approved":
			// 最终审批通过
			record := ApprovalRecord{
				Step:      ticket.CurrentStep,
				Role:      role,
				RoleLabel: roleLabelMap[role],
				Action:    "approve",
				Comment:   commentText,
				Time:      nowStr,
			}
			records = append(records, record)
			// 追加完成记录
			records = append(records, ApprovalRecord{
				Step:      "completed",
				Role:      "",
				RoleLabel: "",
				Action:    "completed",
				Comment:   "",
				Time:      nowStr,
			})
		case "rejected":
			record := ApprovalRecord{
				Step:      ticket.CurrentStep,
				Role:      role,
				RoleLabel: roleLabelMap[role],
				Action:    "reject",
				Comment:   commentText,
				Time:      nowStr,
			}
			records = append(records, record)
		case "pending":
			// 撤回：重置审批记录，只保留发起记录
			records = []ApprovalRecord{
				{
					Step:      "start",
					Role:      "applicant",
					RoleLabel: "发起人",
					Action:    "submit",
					Comment:   "",
					Time:      ticket.CreatedAt.Format("2006-01-02 15:04"),
				},
			}
		}

		recordsJSON, _ := json.Marshal(records)
		updates["approval_records"] = string(recordsJSON)
	}

	if len(updates) == 0 {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "no updates")
		return
	}
	if err := h.DB.Model(&models.Ticket{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to update ticket")
		return
	}
	response.OK(c, gin.H{"updated": true})
}

func normalizePriority(p string) string {
	switch p {
	case "low", "medium", "high", "urgent":
		return p
	default:
		return "medium"
	}
}

func normalizeType(t string) string {
	switch t {
	case "expense", "leave", "purchase", "other":
		return t
	default:
		return "other"
	}
}

func pagination(c *gin.Context) (int, int) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))
	if page < 1 {
		page = 1
	}
	if size < 1 || size > 200 {
		size = 20
	}
	return page, size
}
