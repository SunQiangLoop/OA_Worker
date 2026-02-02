package models

import "encoding/json"

// FormDefinition 表单定义
// 用于描述动态表单字段结构

type FormDefinition struct {
	BaseModel
	Code       string          `gorm:"size:64;uniqueIndex;not null" json:"code"` // 表单编码
	Name       string          `gorm:"size:128;not null" json:"name"`            // 表单名称
	SchemaJSON json.RawMessage `gorm:"type:json" json:"schema_json"`             // 表单 schema
	IsActive   bool            `gorm:"default:true" json:"is_active"`            // 是否启用
	Version    int             `gorm:"default:1" json:"version"`                 // 版本号
	CreatedBy  uint            `gorm:"index" json:"created_by"`                  // 创建人
}
