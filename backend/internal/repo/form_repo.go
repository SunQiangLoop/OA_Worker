package repo

import (
	"context"

	"example.com/oa-workorder/internal/models"
	"gorm.io/gorm"
)

// FormRepo 定义表单配置与表单数据的读写接口

type FormRepo interface {
	WithTx(tx *gorm.DB) FormRepo

	CreateDefinition(ctx context.Context, definition *models.FormDefinition) error
	GetDefinitionByID(ctx context.Context, id uint) (*models.FormDefinition, error)
	ListDefinitions(ctx context.Context, activeOnly bool) ([]models.FormDefinition, error)

	CreateFormData(ctx context.Context, data *models.FormData) error
	GetFormDataByID(ctx context.Context, id uint) (*models.FormData, error)
	UpdateFormData(ctx context.Context, data *models.FormData) error
}
