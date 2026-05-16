package models

import "encoding/json"

// WorkflowTemplate 流程模板

type WorkflowTemplate struct {
	BaseModel
	Name            string          `gorm:"size:128;not null" json:"name"`              // 模板名称
	Description     string          `gorm:"size:500" json:"description"`                // 描述
	Category        string          `gorm:"size:64" json:"category"`                    // 所在分组
	SubmitterScope  string          `gorm:"size:20;default:'all'" json:"submitter_scope"` // all / specified
	AdminType       string          `gorm:"size:20;default:'all_admin'" json:"admin_type"` // all_admin / specified
	FormFields      json.RawMessage `gorm:"type:json" json:"form_fields"`               // 表单字段 JSON
	VisibilityScope string          `gorm:"size:20;default:'all'" json:"visibility_scope"` // all / participant
	Version         int             `gorm:"default:1" json:"version"`                   // 版本
	IsActive        bool            `gorm:"default:true" json:"is_active"`              // 是否启用
	CreatedBy       uint            `gorm:"index" json:"created_by"`                    // 创建人
	Nodes           []ProcessNode   `gorm:"foreignKey:TemplateID" json:"nodes"`         // 流程节点
}
