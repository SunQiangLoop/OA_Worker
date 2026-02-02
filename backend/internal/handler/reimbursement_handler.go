package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"example.com/oa-workorder/internal/middleware"
	"example.com/oa-workorder/internal/models"
	"example.com/oa-workorder/internal/repo"
	"example.com/oa-workorder/internal/service"
	"example.com/oa-workorder/pkg/response"
	"github.com/gin-gonic/gin"
)

// ReimbursementHandler 报销单接口

type ReimbursementHandler struct {
	ReimbSvc    *service.ReimbursementService
	FormSvc     *service.FormService
	WorkflowSvc *service.WorkflowService
	LogSvc      *service.ApprovalLogService
}

type reimbursementItemRequest struct {
	ItemDate time.Time `json:"item_date"`
	ItemDesc string    `json:"item_desc"`
	Amount   float64   `json:"amount"`
}

type attachmentRequest struct {
	FileName    string `json:"file_name"`
	FileSize    int64  `json:"file_size"`
	MimeType    string `json:"mime_type"`
	StoragePath string `json:"storage_path"`
}

type createReimbursementRequest struct {
	FormID            uint                       `json:"form_id" binding:"required"`
	ReimbursementType string                     `json:"reimbursement_type" binding:"required"`
	Reason            string                     `json:"reason" binding:"required"`
	TotalAmount       float64                    `json:"total_amount" binding:"required"`
	Summary           string                     `json:"summary"`
	Items             []reimbursementItemRequest `json:"items"`
	Attachments       []attachmentRequest        `json:"attachments"`
	FormData          json.RawMessage            `json:"form_data"`
}

func (h *ReimbursementHandler) Create(c *gin.Context) {
	uid, ok := middleware.UserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "missing user")
		return
	}
	var req createReimbursementRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid payload")
		return
	}
	formData := models.FormData{
		FormID:   req.FormID,
		OwnerID:  uid,
		DataJSON: req.FormData,
		Status:   models.FormStatusDraft,
	}
	items := make([]models.ExpenseItem, 0, len(req.Items))
	for _, item := range req.Items {
		items = append(items, models.ExpenseItem{
			ItemDate: item.ItemDate,
			ItemDesc: item.ItemDesc,
			Amount:   item.Amount,
		})
	}
	attachments := make([]models.Attachment, 0, len(req.Attachments))
	for _, att := range req.Attachments {
		attachments = append(attachments, models.Attachment{
			FileName:    att.FileName,
			FileSize:    att.FileSize,
			MimeType:    att.MimeType,
			StoragePath: att.StoragePath,
		})
	}
	reimb := models.ExpenseReimbursement{
		ReimbursementType: normalizeReimbursementType(req.ReimbursementType),
		Reason:            req.Reason,
		TotalAmount:       req.TotalAmount,
		Summary:           req.Summary,
		Status:            models.FormStatusDraft,
		Items:             items,
		Attachments:       attachments,
	}
	if err := h.ReimbSvc.CreateDraft(c.Request.Context(), &formData, &reimb); err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to create reimbursement")
		return
	}
	response.Created(c, reimb)
}

func (h *ReimbursementHandler) List(c *gin.Context) {
	page, size := pagination(c)
	filter := repo.ReimbursementListFilter{
		Status: c.Query("status"),
		Page:   page,
		Size:   size,
	}
	items, total, err := h.ReimbSvc.List(c.Request.Context(), filter)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to list reimbursements")
		return
	}
	response.OK(c, gin.H{
		"items": items,
		"page":  page,
		"size":  size,
		"total": total,
	})
}

func (h *ReimbursementHandler) Get(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid id")
		return
	}
	reimb, err := h.ReimbSvc.GetByID(c.Request.Context(), uint(id))
	if err != nil {
		response.Error(c, http.StatusNotFound, "NOT_FOUND", "reimbursement not found")
		return
	}
	response.OK(c, reimb)
}

type updateReimbursementRequest struct {
	Reason      *string                    `json:"reason"`
	TotalAmount *float64                   `json:"total_amount"`
	Summary     *string                    `json:"summary"`
	Items       []reimbursementItemRequest `json:"items"`
	Attachments []attachmentRequest        `json:"attachments"`
	FormData    json.RawMessage            `json:"form_data"`
}

func (h *ReimbursementHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid id")
		return
	}
	var req updateReimbursementRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid payload")
		return
	}
	reimb, err := h.ReimbSvc.GetByID(c.Request.Context(), uint(id))
	if err != nil {
		response.Error(c, http.StatusNotFound, "NOT_FOUND", "reimbursement not found")
		return
	}
	if reimb.Status != models.FormStatusDraft {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "only draft can be updated")
		return
	}
	if req.Reason != nil {
		reimb.Reason = *req.Reason
	}
	if req.TotalAmount != nil {
		reimb.TotalAmount = *req.TotalAmount
	}
	if req.Summary != nil {
		reimb.Summary = *req.Summary
	}
	if req.Items != nil {
		items := make([]models.ExpenseItem, 0, len(req.Items))
		for _, item := range req.Items {
			items = append(items, models.ExpenseItem{
				ItemDate: item.ItemDate,
				ItemDesc: item.ItemDesc,
				Amount:   item.Amount,
			})
		}
		reimb.Items = items
	}
	if req.Attachments != nil {
		atts := make([]models.Attachment, 0, len(req.Attachments))
		for _, att := range req.Attachments {
			atts = append(atts, models.Attachment{
				FileName:    att.FileName,
				FileSize:    att.FileSize,
				MimeType:    att.MimeType,
				StoragePath: att.StoragePath,
			})
		}
		reimb.Attachments = atts
	}
	formData, err := h.FormSvc.GetFormData(c.Request.Context(), reimb.FormDataID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to load form data")
		return
	}
	if len(req.FormData) > 0 {
		formData.DataJSON = req.FormData
	}
	if err := h.ReimbSvc.UpdateDraft(c.Request.Context(), formData, reimb); err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to update reimbursement")
		return
	}
	response.OK(c, reimb)
}

func (h *ReimbursementHandler) Submit(c *gin.Context) {
	uid, ok := middleware.UserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "missing user")
		return
	}
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid id")
		return
	}
	reimb, err := h.ReimbSvc.GetByID(c.Request.Context(), uint(id))
	if err != nil {
		response.Error(c, http.StatusNotFound, "NOT_FOUND", "reimbursement not found")
		return
	}
	if reimb.Status != models.FormStatusDraft {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "only draft can be submitted")
		return
	}
	if reimb.WorkflowInstanceID == nil {
		templates, err := h.WorkflowSvc.ListTemplates(c.Request.Context(), true)
		if err != nil || len(templates) == 0 {
			response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "no active workflow template")
			return
		}
		inst, err := h.WorkflowSvc.StartInstanceForReimbursement(c.Request.Context(), &templates[0], reimb.ID, uid, reimb.TotalAmount)
		if err != nil {
			response.Error(c, http.StatusInternalServerError, "ERROR", "failed to start workflow")
			return
		}
		reimb.WorkflowInstanceID = &inst.ID
	}
	if err := h.ReimbSvc.Submit(c.Request.Context(), reimb); err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to submit reimbursement")
		return
	}
	if reimb.WorkflowInstanceID != nil {
		_ = h.LogSvc.Create(c.Request.Context(), &models.ApprovalLog{
			InstanceID: *reimb.WorkflowInstanceID,
			NodeKey:    "",
			ActorID:    uid,
			Action:     models.ApprovalActionSubmit,
		})
	}
	response.OK(c, reimb)
}

func (h *ReimbursementHandler) Approve(c *gin.Context) {
	uid, ok := middleware.UserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "missing user")
		return
	}
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid id")
		return
	}
	reimb, err := h.ReimbSvc.GetByID(c.Request.Context(), uint(id))
	if err != nil {
		response.Error(c, http.StatusNotFound, "NOT_FOUND", "reimbursement not found")
		return
	}
	if reimb.Status != models.FormStatusPending {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "only pending can be approved")
		return
	}
	if err := h.ReimbSvc.Complete(c.Request.Context(), reimb, models.FormStatusApproved); err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to approve reimbursement")
		return
	}
	if reimb.WorkflowInstanceID != nil {
		_ = h.WorkflowSvc.CompleteInstance(c.Request.Context(), *reimb.WorkflowInstanceID, models.WorkflowStatusApproved)
		_ = h.LogSvc.Create(c.Request.Context(), &models.ApprovalLog{
			InstanceID: *reimb.WorkflowInstanceID,
			NodeKey:    "",
			ActorID:    uid,
			Action:     models.ApprovalActionApprove,
		})
	}
	response.OK(c, reimb)
}

func (h *ReimbursementHandler) Reject(c *gin.Context) {
	uid, ok := middleware.UserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "missing user")
		return
	}
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid id")
		return
	}
	reimb, err := h.ReimbSvc.GetByID(c.Request.Context(), uint(id))
	if err != nil {
		response.Error(c, http.StatusNotFound, "NOT_FOUND", "reimbursement not found")
		return
	}
	if reimb.Status != models.FormStatusPending {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "only pending can be rejected")
		return
	}
	if err := h.ReimbSvc.Complete(c.Request.Context(), reimb, models.FormStatusRejected); err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to reject reimbursement")
		return
	}
	if reimb.WorkflowInstanceID != nil {
		_ = h.WorkflowSvc.CompleteInstance(c.Request.Context(), *reimb.WorkflowInstanceID, models.WorkflowStatusRejected)
		_ = h.LogSvc.Create(c.Request.Context(), &models.ApprovalLog{
			InstanceID: *reimb.WorkflowInstanceID,
			NodeKey:    "",
			ActorID:    uid,
			Action:     models.ApprovalActionReject,
		})
	}
	response.OK(c, reimb)
}

func normalizeReimbursementType(t string) string {
	switch t {
	case models.ReimbursementTypeTravel, models.ReimbursementTypeTeam:
		return t
	default:
		return models.ReimbursementTypeTravel
	}
}
