package handler

import (
	"net/http"

	"example.com/oa-workorder/internal/middleware"
	"example.com/oa-workorder/internal/models"
	"example.com/oa-workorder/pkg/response"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UserHandler struct {
	DB *gorm.DB
}

func (h *UserHandler) Me(c *gin.Context) {
	uid, ok := middleware.UserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "missing user")
		return
	}
	var user models.User
	if err := h.DB.First(&user, uid).Error; err != nil {
		response.Error(c, http.StatusNotFound, "NOT_FOUND", "user not found")
		return
	}

	response.OK(c, gin.H{
		"id":            user.ID,
		"username":      user.Username,
		"email":         user.Email,
		"status":        user.Status,
		"lastLogin":     user.LastLoginAt,
		"department_id": user.DepartmentID,
		"position":      user.Position,
	})
}

// List 获取所有用户列表
func (h *UserHandler) List(c *gin.Context) {
	var users []models.User
	query := h.DB.Model(&models.User{})

	// 支持按部门筛选
	if deptID := c.Query("department_id"); deptID != "" {
		query = query.Where("department_id = ?", deptID)
	}

	if err := query.Find(&users).Error; err != nil {
		response.Error(c, http.StatusInternalServerError, "DB_ERROR", err.Error())
		return
	}

	// 构建返回数据
	result := make([]gin.H, len(users))
	for i, u := range users {
		result[i] = gin.H{
			"id":            u.ID,
			"username":      u.Username,
			"email":         u.Email,
			"status":        u.Status,
			"department_id": u.DepartmentID,
			"position":      u.Position,
		}
	}

	response.OK(c, result)
}
