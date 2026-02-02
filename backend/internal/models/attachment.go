package models

// Attachment 附件

type Attachment struct {
	BaseModel
	ReimbursementID uint   `gorm:"index;not null" json:"reimbursement_id"` // 报销单 ID
	FileName        string `gorm:"size:255" json:"file_name"`              // 文件名
	FileSize        int64  `json:"file_size"`                              // 文件大小
	MimeType        string `gorm:"size:100" json:"mime_type"`              // MIME 类型
	StoragePath     string `gorm:"size:255" json:"storage_path"`           // 存储路径
}
