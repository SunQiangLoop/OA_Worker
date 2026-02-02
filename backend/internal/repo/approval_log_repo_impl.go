package repo

import (
	"context"

	"example.com/oa-workorder/internal/models"
	"gorm.io/gorm"
)

// ApprovalLogRepo 审批日志数据访问接口

type ApprovalLogRepo interface {
	WithTx(tx *gorm.DB) ApprovalLogRepo
	Create(ctx context.Context, log *models.ApprovalLog) error
	ListByInstance(ctx context.Context, instanceID uint) ([]models.ApprovalLog, error)
}

type ApprovalLogRepoImpl struct {
	db *gorm.DB
}

func NewApprovalLogRepo(db *gorm.DB) *ApprovalLogRepoImpl {
	return &ApprovalLogRepoImpl{db: db}
}

func (r *ApprovalLogRepoImpl) WithTx(tx *gorm.DB) ApprovalLogRepo {
	return &ApprovalLogRepoImpl{db: tx}
}

func (r *ApprovalLogRepoImpl) Create(ctx context.Context, log *models.ApprovalLog) error {
	return r.db.WithContext(ctx).Create(log).Error
}

func (r *ApprovalLogRepoImpl) ListByInstance(ctx context.Context, instanceID uint) ([]models.ApprovalLog, error) {
	var items []models.ApprovalLog
	if err := r.db.WithContext(ctx).
		Where("instance_id = ?", instanceID).
		Order("id asc").
		Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}
