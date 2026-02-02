package models

import "encoding/json"

// FormData 表单数据
// 存储用户提交的自定义表单内容

type FormData struct {
	BaseModel
	FormID   uint            `gorm:"index;not null" json:"form_id"`  // 表单定义 ID
	OwnerID  uint            `gorm:"index;not null" json:"owner_id"` // 提交人
	DataJSON json.RawMessage `gorm:"type:json" json:"data_json"`     // 表单数据
	Status   string          `gorm:"size:20;index" json:"status"`    // 表单状态
}
