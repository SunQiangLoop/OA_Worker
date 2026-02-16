package models

import "time"

type Work struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Title       string    `gorm:"size:255;not null" json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	Slug        string    `gorm:"size:255;uniqueIndex;not null" json:"slug"`
	CoverURL    string    `gorm:"size:512" json:"cover_url"`
	Tags        string    `gorm:"size:512" json:"tags"`
	StoragePath string    `gorm:"size:512;not null" json:"storage_path"`
	EntryFile   string    `gorm:"size:255;default:index.html" json:"entry_file"`
	FileCount   int       `json:"file_count"`
	TotalSize   int64     `json:"total_size"`
	IsPublished bool      `gorm:"default:true" json:"is_published"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
