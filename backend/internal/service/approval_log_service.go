package service

import (
	"context"

	"example.com/oa-workorder/internal/models"
	"example.com/oa-workorder/internal/repo"
)

// ApprovalLogService 审批日志业务逻辑

type ApprovalLogService struct {
	Repo repo.ApprovalLogRepo
}

func NewApprovalLogService(r repo.ApprovalLogRepo) *ApprovalLogService {
	return &ApprovalLogService{Repo: r}
}

func (s *ApprovalLogService) Create(ctx context.Context, log *models.ApprovalLog) error {
	return s.Repo.Create(ctx, log)
}

func (s *ApprovalLogService) ListByInstance(ctx context.Context, instanceID uint) ([]models.ApprovalLog, error) {
	return s.Repo.ListByInstance(ctx, instanceID)
}
