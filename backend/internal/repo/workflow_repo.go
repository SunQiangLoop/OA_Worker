package repo

import (
	"context"

	"example.com/oa-workorder/internal/models"
	"gorm.io/gorm"
)

// WorkflowRepo 定义流程模板/实例的读写接口
// NOTE: 具体实现由 workflow_repo_impl.go 提供
// 所有方法约定使用 context 进行超时/取消控制

type WorkflowRepo interface {
	WithTx(tx *gorm.DB) WorkflowRepo

	CreateTemplate(ctx context.Context, template *models.WorkflowTemplate) error
	GetTemplateByID(ctx context.Context, id uint) (*models.WorkflowTemplate, error)
	ListTemplates(ctx context.Context, activeOnly bool) ([]models.WorkflowTemplate, error)

	CreateInstance(ctx context.Context, instance *models.WorkflowInstance) error
	GetInstanceByID(ctx context.Context, id uint) (*models.WorkflowInstance, error)
	UpdateInstance(ctx context.Context, instance *models.WorkflowInstance) error
}
