package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"example.com/oa-workorder/internal/middleware"
	"example.com/oa-workorder/internal/models"
	"example.com/oa-workorder/internal/service"
	"example.com/oa-workorder/pkg/response"
	"github.com/gin-gonic/gin"
)

// WorkflowHandler 流程模板接口

type WorkflowHandler struct {
	Svc *service.WorkflowService
}

type processNodeRequest struct {
	NodeKey       string          `json:"node_key" binding:"required"`
	NodeType      string          `json:"node_type" binding:"required"`
	AssigneeRule  json.RawMessage `json:"assignee_rule"`
	ConditionRule json.RawMessage `json:"condition_rule"`
	NextNodeKey   string          `json:"next_node_key"`
}

type createWorkflowTemplateRequest struct {
	Name        string               `json:"name" binding:"required"`
	Description string               `json:"description"`
	Nodes       []processNodeRequest `json:"nodes" binding:"required"`
}

func (h *WorkflowHandler) CreateTemplate(c *gin.Context) {
	uid, ok := middleware.UserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "missing user")
		return
	}
	var req createWorkflowTemplateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid payload")
		return
	}
	nodes := make([]models.ProcessNode, 0, len(req.Nodes))
	for _, n := range req.Nodes {
		nodes = append(nodes, models.ProcessNode{
			NodeKey:       n.NodeKey,
			NodeType:      n.NodeType,
			AssigneeRule:  n.AssigneeRule,
			ConditionRule: n.ConditionRule,
			NextNodeKey:   n.NextNodeKey,
		})
	}
	tpl := models.WorkflowTemplate{
		Name:        req.Name,
		Description: req.Description,
		Version:     1,
		IsActive:    true,
		CreatedBy:   uid,
		Nodes:       nodes,
	}
	if err := h.Svc.CreateTemplate(c.Request.Context(), &tpl); err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to create workflow template")
		return
	}
	response.Created(c, tpl)
}

func (h *WorkflowHandler) ListTemplates(c *gin.Context) {
	activeOnly := c.Query("active") == "true"
	items, err := h.Svc.ListTemplates(c.Request.Context(), activeOnly)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to list workflow templates")
		return
	}
	response.OK(c, gin.H{"items": items})
}

func (h *WorkflowHandler) GetTemplate(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid id")
		return
	}
	tpl, err := h.Svc.GetTemplate(c.Request.Context(), uint(id))
	if err != nil {
		response.Error(c, http.StatusNotFound, "NOT_FOUND", "workflow template not found")
		return
	}
	response.OK(c, tpl)
}
