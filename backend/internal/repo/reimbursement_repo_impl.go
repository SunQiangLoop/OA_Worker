package repo

import (
	"context"

	"example.com/oa-workorder/internal/models"
	"gorm.io/gorm"
)

// ReimbursementListFilter 报销单查询条件

type ReimbursementListFilter struct {
	Status string
	Page   int
	Size   int
}

// ReimbursementRepo 报销单数据访问接口

type ReimbursementRepo interface {
	WithTx(tx *gorm.DB) ReimbursementRepo
	Create(ctx context.Context, r *models.ExpenseReimbursement) error
	GetByID(ctx context.Context, id uint) (*models.ExpenseReimbursement, error)
	Update(ctx context.Context, r *models.ExpenseReimbursement) error
	List(ctx context.Context, filter ReimbursementListFilter) ([]models.ExpenseReimbursement, int64, error)
}

type ReimbursementRepoImpl struct {
	db *gorm.DB
}

func NewReimbursementRepo(db *gorm.DB) *ReimbursementRepoImpl {
	return &ReimbursementRepoImpl{db: db}
}

func (r *ReimbursementRepoImpl) WithTx(tx *gorm.DB) ReimbursementRepo {
	return &ReimbursementRepoImpl{db: tx}
}

func (r *ReimbursementRepoImpl) Create(ctx context.Context, reimb *models.ExpenseReimbursement) error {
	return r.db.WithContext(ctx).Session(&gorm.Session{FullSaveAssociations: true}).Create(reimb).Error
}

func (r *ReimbursementRepoImpl) GetByID(ctx context.Context, id uint) (*models.ExpenseReimbursement, error) {
	var reimb models.ExpenseReimbursement
	if err := r.db.WithContext(ctx).
		Preload("Items").
		Preload("Attachments").
		First(&reimb, id).Error; err != nil {
		return nil, err
	}
	return &reimb, nil
}

func (r *ReimbursementRepoImpl) Update(ctx context.Context, reimb *models.ExpenseReimbursement) error {
	return r.db.WithContext(ctx).Session(&gorm.Session{FullSaveAssociations: true}).Save(reimb).Error
}

func (r *ReimbursementRepoImpl) List(ctx context.Context, filter ReimbursementListFilter) ([]models.ExpenseReimbursement, int64, error) {
	var items []models.ExpenseReimbursement
	q := r.db.WithContext(ctx).Model(&models.ExpenseReimbursement{})
	if filter.Status != "" {
		q = q.Where("status = ?", filter.Status)
	}
	var total int64
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	page := filter.Page
	size := filter.Size
	if page < 1 {
		page = 1
	}
	if size < 1 || size > 200 {
		size = 20
	}
	if err := q.Order("id desc").Limit(size).Offset((page - 1) * size).Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}
