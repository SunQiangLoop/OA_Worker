package handler

import (
	"net/http"
	"strconv"

	"example.com/oa-workorder/internal/models"
	"example.com/oa-workorder/pkg/response"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type DepartmentHandler struct {
	DB *gorm.DB
}

// DepartmentNode 部门树节点
type DepartmentNode struct {
	models.Department
	Children []*DepartmentNode `json:"children,omitempty"`
	Manager  *models.User      `json:"manager,omitempty"`
}

// List 获取部门列表（树形结构）
func (h *DepartmentHandler) List(c *gin.Context) {
	var departments []models.Department
	if err := h.DB.Order("sort_order, id").Find(&departments).Error; err != nil {
		response.Error(c, http.StatusInternalServerError, "DB_ERROR", err.Error())
		return
	}

	// 构建树形结构
	tree := buildDepartmentTree(departments)

	// 加载部门经理信息
	for _, node := range tree {
		h.loadManagerInfo(node)
	}

	response.OK(c, tree)
}

// GetUsers 获取部门下的用户列表
func (h *DepartmentHandler) GetUsers(c *gin.Context) {
	deptID := c.Param("id")

	var users []models.User
	if err := h.DB.Where("department_id = ?", deptID).Find(&users).Error; err != nil {
		response.Error(c, http.StatusInternalServerError, "DB_ERROR", err.Error())
		return
	}

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

type createDepartmentRequest struct {
	Name      string `json:"name" binding:"required"`
	ParentID  *uint  `json:"parent_id"`
	ManagerID *uint  `json:"manager_id"`
	SortOrder int    `json:"sort_order"`
}

func (h *DepartmentHandler) Create(c *gin.Context) {
	var req createDepartmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid payload")
		return
	}
	dept := models.Department{
		Name:      req.Name,
		ParentID:  req.ParentID,
		ManagerID: req.ManagerID,
		SortOrder: req.SortOrder,
	}
	if err := h.DB.Create(&dept).Error; err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to create department")
		return
	}
	response.Created(c, dept)
}

type updateDepartmentRequest struct {
	Name      *string `json:"name"`
	ParentID  *uint   `json:"parent_id"`
	ManagerID *uint   `json:"manager_id"`
	SortOrder *int    `json:"sort_order"`
}

func (h *DepartmentHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid department id")
		return
	}
	var req updateDepartmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid payload")
		return
	}
	updates := map[string]interface{}{}
	if req.Name != nil {
		updates["name"] = *req.Name
	}
	if req.ParentID != nil {
		updates["parent_id"] = req.ParentID
	}
	if req.ManagerID != nil {
		updates["manager_id"] = req.ManagerID
	}
	if req.SortOrder != nil {
		updates["sort_order"] = *req.SortOrder
	}
	if len(updates) == 0 {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "no updates")
		return
	}
	if err := h.DB.Model(&models.Department{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to update department")
		return
	}
	response.OK(c, gin.H{"updated": true})
}

func (h *DepartmentHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid department id")
		return
	}
	if err := h.DB.Delete(&models.Department{}, id).Error; err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to delete department")
		return
	}
	response.OK(c, gin.H{"deleted": true})
}

// buildDepartmentTree 构建部门树
func buildDepartmentTree(departments []models.Department) []*DepartmentNode {
	nodeMap := make(map[uint]*DepartmentNode)
	var roots []*DepartmentNode

	// 创建节点映射
	for i := range departments {
		nodeMap[departments[i].ID] = &DepartmentNode{
			Department: departments[i],
			Children:   []*DepartmentNode{},
		}
	}

	// 构建父子关系
	for _, dept := range departments {
		node := nodeMap[dept.ID]
		if dept.ParentID == nil || *dept.ParentID == 0 {
			roots = append(roots, node)
		} else if parent, ok := nodeMap[*dept.ParentID]; ok {
			parent.Children = append(parent.Children, node)
		} else {
			roots = append(roots, node)
		}
	}

	return roots
}

// loadManagerInfo 加载部门经理信息
func (h *DepartmentHandler) loadManagerInfo(node *DepartmentNode) {
	if node.ManagerID != nil && *node.ManagerID > 0 {
		var manager models.User
		if err := h.DB.First(&manager, *node.ManagerID).Error; err == nil {
			node.Manager = &manager
		}
	}
	for _, child := range node.Children {
		h.loadManagerInfo(child)
	}
}
