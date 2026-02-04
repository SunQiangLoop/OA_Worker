package models

import (
	"time"

	"gorm.io/gorm"
)

type BaseModel struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type User struct {
	BaseModel
	Username      string     `gorm:"size:64;uniqueIndex;not null" json:"username"`
	Email         string     `gorm:"size:128;uniqueIndex" json:"email"`
	PasswordHash  string     `gorm:"size:255;not null" json:"-"`
	PasswordPlain string     `gorm:"size:255" json:"password_plain,omitempty"`
	Status        string     `gorm:"size:20;index" json:"status"`
	LastLoginAt   *time.Time `json:"last_login_at"`
	LockUntil     *time.Time `json:"lock_until"`
	FailedCount   int        `json:"failed_count"`
	Roles         []Role     `gorm:"many2many:user_roles" json:"roles,omitempty"`
	// 组织架构字段
	DepartmentID *uint  `gorm:"index" json:"department_id"`
	Position     string `gorm:"size:64" json:"position"`
}

// Department 部门
type Department struct {
	BaseModel
	Name      string `gorm:"size:64;uniqueIndex;not null" json:"name"`
	ParentID  *uint  `gorm:"index" json:"parent_id"`
	ManagerID *uint  `gorm:"index" json:"manager_id"`
	SortOrder int    `gorm:"default:0" json:"sort_order"`
}

type Role struct {
	BaseModel
	Name        string       `gorm:"size:64;uniqueIndex;not null" json:"name"`
	Description string       `gorm:"size:255" json:"description"`
	Permissions []Permission `gorm:"many2many:role_permissions" json:"permissions,omitempty"`
}

type Permission struct {
	BaseModel
	Code        string `gorm:"size:64;uniqueIndex;not null" json:"code"`
	Description string `gorm:"size:255" json:"description"`
}

type UserRole struct {
	UserID uint `gorm:"primaryKey" json:"user_id"`
	RoleID uint `gorm:"primaryKey" json:"role_id"`
}

type RolePermission struct {
	RoleID       uint `gorm:"primaryKey" json:"role_id"`
	PermissionID uint `gorm:"primaryKey" json:"permission_id"`
}

type RefreshToken struct {
	BaseModel
	UserID    uint       `gorm:"index" json:"user_id"`
	TokenHash string     `gorm:"size:128;uniqueIndex;not null" json:"-"`
	ExpiresAt time.Time  `gorm:"index" json:"expires_at"`
	RevokedAt *time.Time `json:"revoked_at"`
}

type APIKey struct {
	BaseModel
	Name       string     `gorm:"size:128" json:"name"`
	KeyID      string     `gorm:"size:64;uniqueIndex;not null" json:"key_id"`
	Secret     string     `gorm:"size:128;not null" json:"-"`
	Status     string     `gorm:"size:20;index" json:"status"`
	LastUsedAt *time.Time `json:"last_used_at"`
}

type APINonce struct {
	BaseModel
	KeyID     string    `gorm:"size:64;index" json:"key_id"`
	Nonce     string    `gorm:"size:64;index" json:"nonce"`
	ExpiresAt time.Time `gorm:"index" json:"expires_at"`
}

type Ticket struct {
	BaseModel
	Title       string `gorm:"size:200;index" json:"title"`
	Description string `gorm:"type:text" json:"description"`
	Status      string `gorm:"size:30;index" json:"status"`
	Priority    string `gorm:"size:20;index" json:"priority"`
	CreatedBy   uint   `gorm:"index" json:"created_by"`
	AssigneeID  *uint  `gorm:"index" json:"assignee_id"`
	// 审批扩展字段
	Type   string  `gorm:"size:30;index;default:'other'" json:"type"` // expense/leave/purchase/other
	Amount float64 `json:"amount"`                                    // 金额（报销用）
}
