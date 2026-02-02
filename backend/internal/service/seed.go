package service

import (
	"encoding/json"
	"errors"

	"example.com/oa-workorder/internal/config"
	"example.com/oa-workorder/internal/models"
	"example.com/oa-workorder/pkg/crypto"
	"gorm.io/gorm"
)

var defaultPermissions = []models.Permission{
	{Code: "ticket:read", Description: "Read tickets"},
	{Code: "ticket:write", Description: "Create/update tickets"},
	{Code: "user:read", Description: "Read users"},
	{Code: "user:write", Description: "Manage users"},
}

func SeedDefaults(db *gorm.DB, cfg config.Config) error {
	for _, p := range defaultPermissions {
		var existing models.Permission
		if err := db.Where("code = ?", p.Code).First(&existing).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				if err := db.Create(&p).Error; err != nil {
					return err
				}
			}
		}
	}

	var adminRole models.Role
	if err := db.Where("name = ?", "admin").First(&adminRole).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			adminRole = models.Role{Name: "admin", Description: "Administrator"}
			if err := db.Create(&adminRole).Error; err != nil {
				return err
			}
		}
	}

	var permissions []models.Permission
	if err := db.Find(&permissions).Error; err == nil {
		_ = db.Model(&adminRole).Association("Permissions").Replace(permissions)
	}

	var admin models.User
	if err := db.Where("username = ?", cfg.Auth.AdminUsername).First(&admin).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			hash, err := crypto.HashPassword(cfg.Auth.AdminPassword)
			if err != nil {
				return err
			}
			admin = models.User{
				Username:     cfg.Auth.AdminUsername,
				Email:        cfg.Auth.AdminEmail,
				PasswordHash: hash,
				Status:       "active",
			}
			if err := db.Create(&admin).Error; err != nil {
				return err
			}
			_ = db.Model(&admin).Association("Roles").Append(&adminRole)
		}
	}

	// 初始化部门
	if err := seedDepartments(db); err != nil {
		return err
	}

	if err := seedWorkflowTemplates(db, admin.ID); err != nil {
		return err
	}

	return nil
}

// seedDepartments 初始化部门和人员数据
func seedDepartments(db *gorm.DB) error {
	// 检查是否已有部门
	var count int64
	db.Model(&models.Department{}).Count(&count)
	if count > 0 {
		return nil
	}

	// 创建部门
	departments := []models.Department{
		{Name: "总经理办公室", SortOrder: 1},
		{Name: "市场部", SortOrder: 2},
		{Name: "财务部", SortOrder: 3},
		{Name: "技术部", SortOrder: 4},
		{Name: "销售部", SortOrder: 5},
	}

	for i := range departments {
		if err := db.Create(&departments[i]).Error; err != nil {
			return err
		}
	}

	// 获取部门ID映射
	deptMap := make(map[string]uint)
	for _, d := range departments {
		deptMap[d.Name] = d.ID
	}

	// 创建示例人员
	defaultPassword, _ := crypto.HashPassword("123456")
	users := []models.User{
		{Username: "总经理", Email: "gm@company.com", PasswordHash: defaultPassword, Status: "active", DepartmentID: ptrUint(deptMap["总经理办公室"]), Position: "总经理"},
		{Username: "市场部经理", Email: "mkt_mgr@company.com", PasswordHash: defaultPassword, Status: "active", DepartmentID: ptrUint(deptMap["市场部"]), Position: "部门经理"},
		{Username: "财务部经理", Email: "fin_mgr@company.com", PasswordHash: defaultPassword, Status: "active", DepartmentID: ptrUint(deptMap["财务部"]), Position: "部门经理"},
		{Username: "会计", Email: "accountant@company.com", PasswordHash: defaultPassword, Status: "active", DepartmentID: ptrUint(deptMap["财务部"]), Position: "会计"},
		{Username: "出纳", Email: "cashier@company.com", PasswordHash: defaultPassword, Status: "active", DepartmentID: ptrUint(deptMap["财务部"]), Position: "出纳"},
		{Username: "技术部经理", Email: "tech_mgr@company.com", PasswordHash: defaultPassword, Status: "active", DepartmentID: ptrUint(deptMap["技术部"]), Position: "部门经理"},
		{Username: "销售部经理", Email: "sales_mgr@company.com", PasswordHash: defaultPassword, Status: "active", DepartmentID: ptrUint(deptMap["销售部"]), Position: "部门经理"},
	}

	for i := range users {
		if err := db.Create(&users[i]).Error; err != nil {
			// 忽略唯一键冲突
			continue
		}
	}

	// 设置部门经理
	managerMap := map[string]string{
		"总经理办公室": "总经理",
		"市场部":    "市场部经理",
		"财务部":    "财务部经理",
		"技术部":    "技术部经理",
		"销售部":    "销售部经理",
	}

	for deptName, mgrName := range managerMap {
		var manager models.User
		if err := db.Where("username = ?", mgrName).First(&manager).Error; err == nil {
			db.Model(&models.Department{}).Where("name = ?", deptName).Update("manager_id", manager.ID)
		}
	}

	// 给所有组织架构用户分配 admin 角色（确保可以登录和审批）
	var adminRole models.Role
	if err := db.Where("name = ?", "admin").First(&adminRole).Error; err == nil {
		for _, u := range users {
			var user models.User
			if err := db.Where("username = ?", u.Username).First(&user).Error; err == nil {
				db.Model(&user).Association("Roles").Append(&adminRole)
			}
		}
	}

	return nil
}

func ptrUint(v uint) *uint {
	return &v
}

func seedWorkflowTemplates(db *gorm.DB, createdBy uint) error {
	var count int64
	db.Model(&models.WorkflowTemplate{}).Where("name = ?", "Expense Reimbursement").Count(&count)
	if count > 0 {
		return nil
	}

	nodes := []models.ProcessNode{
		{
			NodeKey:     "start",
			NodeType:    models.NodeTypeStarter,
			NextNodeKey: "dept_approve",
		},
		{
			NodeKey:      "dept_approve",
			NodeType:     models.NodeTypeApprover,
			AssigneeRule: json.RawMessage(`{"type":"department_manager"}`),
			NextNodeKey:  "gm_approve",
		},
		{
			NodeKey:      "gm_approve",
			NodeType:     models.NodeTypeApprover,
			AssigneeRule: json.RawMessage(`{"type":"position","value":"总经理"}`),
		},
	}

	tpl := models.WorkflowTemplate{
		Name:        "Expense Reimbursement",
		Description: "Default expense reimbursement workflow",
		Version:     1,
		IsActive:    true,
		CreatedBy:   createdBy,
		Nodes:       nodes,
	}
	return db.Create(&tpl).Error
}
