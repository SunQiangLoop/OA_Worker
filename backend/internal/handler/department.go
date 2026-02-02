package handler

import (
	"net/http"

	"example.com/oa-workorder/internal/models"
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 构建树形结构
	tree := buildDepartmentTree(departments)

	// 加载部门经理信息
	for _, node := range tree {
		h.loadManagerInfo(node)
	}

	c.JSON(http.StatusOK, gin.H{"data": tree})
}

// GetUsers 获取部门下的用户列表
func (h *DepartmentHandler) GetUsers(c *gin.Context) {
	deptID := c.Param("id")

	var users []models.User
	if err := h.DB.Where("department_id = ?", deptID).Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": users})
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
