package models

import "time"

// ExpenseItem 报销明细

type ExpenseItem struct {
	BaseModel
	ReimbursementID uint      `gorm:"index;not null" json:"reimbursement_id"` // 报销单 ID
	ItemDate        time.Time `json:"item_date"`                              // 发生日期
	ItemDesc        string    `gorm:"size:255" json:"item_desc"`              // 明细说明
	Amount          float64   `json:"amount"`                                 // 金额
}
