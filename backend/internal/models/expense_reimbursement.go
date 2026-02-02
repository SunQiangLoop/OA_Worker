package models

// ExpenseReimbursement 报销单

type ExpenseReimbursement struct {
	BaseModel
	FormDataID         uint          `gorm:"index;not null" json:"form_data_id"`            // 表单数据 ID
	ReimbursementType  string        `gorm:"size:20;index" json:"reimbursement_type"`       // 报销类型
	Reason             string        `gorm:"size:255" json:"reason"`                        // 事由
	TotalAmount        float64       `json:"total_amount"`                                  // 总金额
	Currency           string        `gorm:"size:10;default:'CNY'" json:"currency"`         // 币种
	Summary            string        `gorm:"size:255" json:"summary"`                       // 总汇
	Status             string        `gorm:"size:20;index" json:"status"`                   // 状态
	WorkflowInstanceID *uint         `gorm:"index" json:"workflow_instance_id"`             // 流程实例 ID
	Items              []ExpenseItem `gorm:"foreignKey:ReimbursementID" json:"items"`       // 明细
	Attachments        []Attachment  `gorm:"foreignKey:ReimbursementID" json:"attachments"` // 附件
}
