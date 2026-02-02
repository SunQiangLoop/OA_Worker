package repo

import (
	"context"

	"example.com/oa-workorder/internal/models"
	"gorm.io/gorm"
)

type FormRepoImpl struct {
	db *gorm.DB
}

func NewFormRepo(db *gorm.DB) *FormRepoImpl {
	return &FormRepoImpl{db: db}
}

func (r *FormRepoImpl) WithTx(tx *gorm.DB) FormRepo {
	return &FormRepoImpl{db: tx}
}

func (r *FormRepoImpl) CreateDefinition(ctx context.Context, definition *models.FormDefinition) error {
	return r.db.WithContext(ctx).Create(definition).Error
}

func (r *FormRepoImpl) GetDefinitionByID(ctx context.Context, id uint) (*models.FormDefinition, error) {
	var def models.FormDefinition
	if err := r.db.WithContext(ctx).First(&def, id).Error; err != nil {
		return nil, err
	}
	return &def, nil
}

func (r *FormRepoImpl) ListDefinitions(ctx context.Context, activeOnly bool) ([]models.FormDefinition, error) {
	var defs []models.FormDefinition
	q := r.db.WithContext(ctx).Model(&models.FormDefinition{})
	if activeOnly {
		q = q.Where("is_active = ?", true)
	}
	if err := q.Order("id desc").Find(&defs).Error; err != nil {
		return nil, err
	}
	return defs, nil
}

func (r *FormRepoImpl) CreateFormData(ctx context.Context, data *models.FormData) error {
	return r.db.WithContext(ctx).Create(data).Error
}

func (r *FormRepoImpl) GetFormDataByID(ctx context.Context, id uint) (*models.FormData, error) {
	var data models.FormData
	if err := r.db.WithContext(ctx).First(&data, id).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

func (r *FormRepoImpl) UpdateFormData(ctx context.Context, data *models.FormData) error {
	return r.db.WithContext(ctx).Save(data).Error
}
