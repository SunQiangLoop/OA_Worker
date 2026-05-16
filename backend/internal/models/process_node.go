package models

import "encoding/json"

// ProcessNode 流程节点

type ProcessNode struct {
	BaseModel
	TemplateID        uint            `gorm:"index;not null" json:"template_id"`             // 模板 ID
	NodeKey           string          `gorm:"size:64;index" json:"node_key"`                 // 节点标识
	NodeType          string          `gorm:"size:20;index" json:"node_type"`                // 节点类型: approval/cc/handler/condition
	NodeName          string          `gorm:"size:128" json:"node_name"`                     // 节点名称（可自定义）
	ApproveMode       string          `gorm:"size:20;default:'or_sign'" json:"approve_mode"` // or_sign / and_sign / sequential
	EmptyApproverRule string          `gorm:"size:20;default:'auto_pass'" json:"empty_approver_rule"` // auto_pass / transfer_admin
	AssigneeRule      json.RawMessage `gorm:"type:json" json:"assignee_rule"`                // 审批人规则 JSON
	ConditionRule     json.RawMessage `gorm:"type:json" json:"condition_rule"`               // 条件规则 JSON
	NextNodeKey       string          `gorm:"size:64" json:"next_node_key"`                  // 下一节点
}
