package repo

import (
	"context"

	"example.com/oa-workorder/internal/models"
	"gorm.io/gorm"
)

type WorkRepo interface {
	Create(ctx context.Context, w *models.Work) error
	FindByID(ctx context.Context, id uint) (*models.Work, error)
	FindBySlug(ctx context.Context, slug string) (*models.Work, error)
	List(ctx context.Context, page, size int) ([]models.Work, int64, error)
	Delete(ctx context.Context, id uint) error
	ExistsBySlug(ctx context.Context, slug string) (bool, error)
}

type WorkRepoImpl struct {
	db *gorm.DB
}

func NewWorkRepo(db *gorm.DB) *WorkRepoImpl {
	return &WorkRepoImpl{db: db}
}

func (r *WorkRepoImpl) Create(ctx context.Context, w *models.Work) error {
	return r.db.WithContext(ctx).Create(w).Error
}

func (r *WorkRepoImpl) FindByID(ctx context.Context, id uint) (*models.Work, error) {
	var w models.Work
	if err := r.db.WithContext(ctx).First(&w, id).Error; err != nil {
		return nil, err
	}
	return &w, nil
}

func (r *WorkRepoImpl) FindBySlug(ctx context.Context, slug string) (*models.Work, error) {
	var w models.Work
	if err := r.db.WithContext(ctx).Where("slug = ?", slug).First(&w).Error; err != nil {
		return nil, err
	}
	return &w, nil
}

func (r *WorkRepoImpl) List(ctx context.Context, page, size int) ([]models.Work, int64, error) {
	var works []models.Work
	var total int64

	q := r.db.WithContext(ctx).Model(&models.Work{}).Where("is_published = ?", true)
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * size
	if err := q.Order("created_at DESC").Offset(offset).Limit(size).Find(&works).Error; err != nil {
		return nil, 0, err
	}
	return works, total, nil
}

func (r *WorkRepoImpl) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&models.Work{}, id).Error
}

func (r *WorkRepoImpl) ExistsBySlug(ctx context.Context, slug string) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&models.Work{}).Where("slug = ?", slug).Count(&count).Error
	return count > 0, err
}
