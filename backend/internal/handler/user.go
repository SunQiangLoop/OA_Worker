package handler

import (
	"net/http"
	"strconv"

	"example.com/oa-workorder/internal/middleware"
	"example.com/oa-workorder/internal/models"
	"example.com/oa-workorder/pkg/crypto"
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
	if err := h.DB.Preload("Roles").First(&user, uid).Error; err != nil {
		response.Error(c, http.StatusNotFound, "NOT_FOUND", "user not found")
		return
	}

	roles := make([]string, 0, len(user.Roles))
	isAdmin := user.Username == "admin"
	for _, role := range user.Roles {
		roles = append(roles, role.Name)
		if role.Name == "admin" {
			isAdmin = true
		}
	}

	response.OK(c, gin.H{
		"id":            user.ID,
		"username":      user.Username,
		"email":         user.Email,
		"status":        user.Status,
		"lastLogin":     user.LastLoginAt,
		"department_id": user.DepartmentID,
		"position":      user.Position,
		"roles":         roles,
		"is_admin":      isAdmin,
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
			"id":             u.ID,
			"username":       u.Username,
			"email":          u.Email,
			"status":         u.Status,
			"department_id":  u.DepartmentID,
			"position":       u.Position,
			"password_plain": u.PasswordPlain,
		}
	}

	response.OK(c, result)
}

type createUserRequest struct {
	Username     string `json:"username" binding:"required"`
	Email        string `json:"email"`
	Password     string `json:"password" binding:"required"`
	Status       string `json:"status"`
	DepartmentID *uint  `json:"department_id"`
	Position     string `json:"position"`
}

func (h *UserHandler) Create(c *gin.Context) {
	var req createUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid payload")
		return
	}
	hash, err := crypto.HashPassword(req.Password)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to hash password")
		return
	}
	status := req.Status
	if status == "" {
		status = "active"
	}
	user := models.User{
		Username:      req.Username,
		Email:         req.Email,
		PasswordHash:  hash,
		PasswordPlain: req.Password,
		Status:        status,
		DepartmentID:  req.DepartmentID,
		Position:      req.Position,
	}
	if err := h.DB.Create(&user).Error; err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to create user")
		return
	}
	response.Created(c, gin.H{
		"id":             user.ID,
		"username":       user.Username,
		"email":          user.Email,
		"status":         user.Status,
		"department_id":  user.DepartmentID,
		"position":       user.Position,
		"password_plain": user.PasswordPlain,
	})
}

type updateUserRequest struct {
	Username     *string `json:"username"`
	Email        *string `json:"email"`
	Password     *string `json:"password"`
	Status       *string `json:"status"`
	DepartmentID *uint   `json:"department_id"`
	Position     *string `json:"position"`
}

func (h *UserHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid user id")
		return
	}
	var req updateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid payload")
		return
	}
	updates := map[string]interface{}{}
	if req.Username != nil {
		updates["username"] = *req.Username
	}
	if req.Email != nil {
		updates["email"] = *req.Email
	}
	if req.Status != nil {
		updates["status"] = *req.Status
	}
	if req.DepartmentID != nil {
		updates["department_id"] = req.DepartmentID
	}
	if req.Position != nil {
		updates["position"] = *req.Position
	}
	if req.Password != nil && *req.Password != "" {
		hash, err := crypto.HashPassword(*req.Password)
		if err != nil {
			response.Error(c, http.StatusInternalServerError, "ERROR", "failed to hash password")
			return
		}
		updates["password_hash"] = hash
		updates["password_plain"] = *req.Password
	}
	if len(updates) == 0 {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "no updates")
		return
	}
	if err := h.DB.Model(&models.User{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to update user")
		return
	}
	response.OK(c, gin.H{"updated": true})
}

func (h *UserHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid user id")
		return
	}
	if err := h.DB.Delete(&models.User{}, id).Error; err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to delete user")
		return
	}
	response.OK(c, gin.H{"deleted": true})
}
