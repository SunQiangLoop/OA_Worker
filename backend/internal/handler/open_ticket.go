package handler

import (
	"net/http"

	"example.com/oa-workorder/internal/models"
	"example.com/oa-workorder/pkg/response"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type OpenHandler struct {
	DB *gorm.DB
}

type openTicketRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	Priority    string `json:"priority"`
	AssigneeID  *uint  `json:"assignee_id"`
}

func (h *OpenHandler) CreateTicket(c *gin.Context) {
	var req openTicketRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid payload")
		return
	}

	ticket := models.Ticket{
		Title:       req.Title,
		Description: req.Description,
		Priority:    normalizePriority(req.Priority),
		Status:      "open",
		CreatedBy:   0,
		AssigneeID:  req.AssigneeID,
	}
	if err := h.DB.Create(&ticket).Error; err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to create ticket")
		return
	}
	response.Created(c, ticket)
}
