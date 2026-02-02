package models

// WorkflowTemplate 流程模板

type WorkflowTemplate struct {
	BaseModel
	Name        string        `gorm:"size:128;not null" json:"name"`      // 模板名称
	Description string        `gorm:"size:255" json:"description"`        // 描述
	Version     int           `gorm:"default:1" json:"version"`           // 版本
	IsActive    bool          `gorm:"default:true" json:"is_active"`      // 是否启用
	CreatedBy   uint          `gorm:"index" json:"created_by"`            // 创建人
	Nodes       []ProcessNode `gorm:"foreignKey:TemplateID" json:"nodes"` // 流程节点
}
