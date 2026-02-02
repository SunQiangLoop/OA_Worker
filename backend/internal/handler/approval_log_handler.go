package handler

import (
	"net/http"
	"strconv"

	"example.com/oa-workorder/internal/service"
	"example.com/oa-workorder/pkg/response"
	"github.com/gin-gonic/gin"
)

// ApprovalLogHandler 审批日志接口

type ApprovalLogHandler struct {
	ReimbSvc *service.ReimbursementService
	LogSvc   *service.ApprovalLogService
}

func (h *ApprovalLogHandler) ListByReimbursement(c *gin.Context) {
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
	if reimb.WorkflowInstanceID == nil {
		response.OK(c, gin.H{"items": []interface{}{}})
		return
	}
	logs, err := h.LogSvc.ListByInstance(c.Request.Context(), *reimb.WorkflowInstanceID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to list approval logs")
		return
	}
	response.OK(c, gin.H{"items": logs})
}
