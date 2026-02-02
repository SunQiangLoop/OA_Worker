package models

import "time"

// WorkflowInstance 流程实例

type WorkflowInstance struct {
	BaseModel
	TemplateID     uint       `gorm:"index;not null" json:"template_id"`  // 模板 ID
	BusinessType   string     `gorm:"size:50;index" json:"business_type"` // 业务类型
	BusinessID     uint       `gorm:"index" json:"business_id"`           // 业务单据 ID
	Status         string     `gorm:"size:20;index" json:"status"`        // 状态
	CurrentNodeKey string     `gorm:"size:64" json:"current_node_key"`    // 当前节点
	StartedBy      uint       `gorm:"index" json:"started_by"`            // 发起人
	StartedAt      time.Time  `json:"started_at"`                         // 开始时间
	FinishedAt     *time.Time `json:"finished_at"`                        // 结束时间
}
