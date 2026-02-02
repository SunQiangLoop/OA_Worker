package service

import (
	"context"

	"example.com/oa-workorder/internal/models"
	"example.com/oa-workorder/internal/repo"
)

// FormService 表单相关业务逻辑

type FormService struct {
	Repo repo.FormRepo
}

func NewFormService(r repo.FormRepo) *FormService {
	return &FormService{Repo: r}
}

func (s *FormService) CreateDefinition(ctx context.Context, def *models.FormDefinition) error {
	return s.Repo.CreateDefinition(ctx, def)
}

func (s *FormService) GetDefinition(ctx context.Context, id uint) (*models.FormDefinition, error) {
	return s.Repo.GetDefinitionByID(ctx, id)
}

func (s *FormService) ListDefinitions(ctx context.Context, activeOnly bool) ([]models.FormDefinition, error) {
	return s.Repo.ListDefinitions(ctx, activeOnly)
}

func (s *FormService) CreateFormData(ctx context.Context, data *models.FormData) error {
	return s.Repo.CreateFormData(ctx, data)
}

func (s *FormService) GetFormData(ctx context.Context, id uint) (*models.FormData, error) {
	return s.Repo.GetFormDataByID(ctx, id)
}

func (s *FormService) UpdateFormData(ctx context.Context, data *models.FormData) error {
	return s.Repo.UpdateFormData(ctx, data)
}
