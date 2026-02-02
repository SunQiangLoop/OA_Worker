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

// FormHandler 表单定义接口

type FormHandler struct {
	Svc *service.FormService
}

type createFormDefinitionRequest struct {
	Code   string          `json:"code" binding:"required"`
	Name   string          `json:"name" binding:"required"`
	Schema json.RawMessage `json:"schema" binding:"required"`
}

func (h *FormHandler) Create(c *gin.Context) {
	uid, ok := middleware.UserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "missing user")
		return
	}
	var req createFormDefinitionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid payload")
		return
	}
	def := models.FormDefinition{
		Code:       req.Code,
		Name:       req.Name,
		SchemaJSON: req.Schema,
		IsActive:   true,
		Version:    1,
		CreatedBy:  uid,
	}
	if err := h.Svc.CreateDefinition(c.Request.Context(), &def); err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to create form definition")
		return
	}
	response.Created(c, def)
}

func (h *FormHandler) List(c *gin.Context) {
	activeOnly := c.Query("active") == "true"
	defs, err := h.Svc.ListDefinitions(c.Request.Context(), activeOnly)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to list form definitions")
		return
	}
	response.OK(c, gin.H{"items": defs})
}

func (h *FormHandler) Get(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid id")
		return
	}
	def, err := h.Svc.GetDefinition(c.Request.Context(), uint(id))
	if err != nil {
		response.Error(c, http.StatusNotFound, "NOT_FOUND", "form definition not found")
		return
	}
	response.OK(c, def)
}
