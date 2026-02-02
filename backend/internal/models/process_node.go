package models

import "encoding/json"

// ProcessNode 流程节点

type ProcessNode struct {
	BaseModel
	TemplateID    uint            `gorm:"index;not null" json:"template_id"` // 模板 ID
	NodeKey       string          `gorm:"size:64;index" json:"node_key"`     // 节点标识
	NodeType      string          `gorm:"size:20;index" json:"node_type"`    // 节点类型
	AssigneeRule  json.RawMessage `gorm:"type:json" json:"assignee_rule"`    // 审批人规则
	ConditionRule json.RawMessage `gorm:"type:json" json:"condition_rule"`   // 条件规则
	NextNodeKey   string          `gorm:"size:64" json:"next_node_key"`      // 下一节点
}
