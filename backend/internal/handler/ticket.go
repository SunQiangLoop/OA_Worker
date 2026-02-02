package handler

import (
	"net/http"
	"strconv"

	"example.com/oa-workorder/internal/middleware"
	"example.com/oa-workorder/internal/models"
	"example.com/oa-workorder/pkg/response"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TicketHandler struct {
	DB *gorm.DB
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

	ticket := models.Ticket{
		Title:       req.Title,
		Description: req.Description,
		Priority:    normalizePriority(req.Priority),
		Status:      "pending",
		CreatedBy:   uid,
		AssigneeID:  req.AssigneeID,
		Type:        normalizeType(req.Type),
		Amount:      req.Amount,
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
}

func (h *TicketHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var req updateTicketRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid payload")
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
