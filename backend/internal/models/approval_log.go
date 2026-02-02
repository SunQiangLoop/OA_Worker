package models

// ApprovalLog 审批日志

type ApprovalLog struct {
	BaseModel
	InstanceID uint   `gorm:"index;not null" json:"instance_id"` // 流程实例 ID
	NodeKey    string `gorm:"size:64;index" json:"node_key"`     // 节点标识
	ActorID    uint   `gorm:"index" json:"actor_id"`             // 操作人
	Action     string `gorm:"size:20" json:"action"`             // 动作
	Comment    string `gorm:"size:255" json:"comment"`           // 备注
}
