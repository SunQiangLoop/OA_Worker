package repo

import (
	"context"

	"example.com/oa-workorder/internal/models"
	"gorm.io/gorm"
)

type WorkflowRepoImpl struct {
	db *gorm.DB
}

func NewWorkflowRepo(db *gorm.DB) *WorkflowRepoImpl {
	return &WorkflowRepoImpl{db: db}
}

func (r *WorkflowRepoImpl) WithTx(tx *gorm.DB) WorkflowRepo {
	return &WorkflowRepoImpl{db: tx}
}

func (r *WorkflowRepoImpl) CreateTemplate(ctx context.Context, template *models.WorkflowTemplate) error {
	return r.db.WithContext(ctx).Session(&gorm.Session{FullSaveAssociations: true}).Create(template).Error
}

func (r *WorkflowRepoImpl) GetTemplateByID(ctx context.Context, id uint) (*models.WorkflowTemplate, error) {
	var tpl models.WorkflowTemplate
	if err := r.db.WithContext(ctx).Preload("Nodes").First(&tpl, id).Error; err != nil {
		return nil, err
	}
	return &tpl, nil
}

func (r *WorkflowRepoImpl) ListTemplates(ctx context.Context, activeOnly bool) ([]models.WorkflowTemplate, error) {
	var items []models.WorkflowTemplate
	q := r.db.WithContext(ctx).Model(&models.WorkflowTemplate{})
	if activeOnly {
		q = q.Where("is_active = ?", true)
	}
	if err := q.Order("id desc").Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}

func (r *WorkflowRepoImpl) CreateInstance(ctx context.Context, instance *models.WorkflowInstance) error {
	return r.db.WithContext(ctx).Create(instance).Error
}

func (r *WorkflowRepoImpl) GetInstanceByID(ctx context.Context, id uint) (*models.WorkflowInstance, error) {
	var inst models.WorkflowInstance
	if err := r.db.WithContext(ctx).First(&inst, id).Error; err != nil {
		return nil, err
	}
	return &inst, nil
}

func (r *WorkflowRepoImpl) UpdateInstance(ctx context.Context, instance *models.WorkflowInstance) error {
	return r.db.WithContext(ctx).Save(instance).Error
}
