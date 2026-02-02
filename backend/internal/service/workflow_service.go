package service

import (
	"context"
	"errors"
	"time"

	"example.com/oa-workorder/internal/models"
	"example.com/oa-workorder/internal/repo"
)

// WorkflowService 流程相关业务逻辑

type WorkflowService struct {
	Repo repo.WorkflowRepo
}

func NewWorkflowService(r repo.WorkflowRepo) *WorkflowService {
	return &WorkflowService{Repo: r}
}

func (s *WorkflowService) CreateTemplate(ctx context.Context, tpl *models.WorkflowTemplate) error {
	return s.Repo.CreateTemplate(ctx, tpl)
}

func (s *WorkflowService) GetTemplate(ctx context.Context, id uint) (*models.WorkflowTemplate, error) {
	return s.Repo.GetTemplateByID(ctx, id)
}

func (s *WorkflowService) ListTemplates(ctx context.Context, activeOnly bool) ([]models.WorkflowTemplate, error) {
	return s.Repo.ListTemplates(ctx, activeOnly)
}

func (s *WorkflowService) StartInstanceForReimbursement(ctx context.Context, tpl *models.WorkflowTemplate, reimbursementID uint, startedBy uint, totalAmount float64) (*models.WorkflowInstance, error) {
	nodeKey := resolveApproverNode(tpl.Nodes, totalAmount)
	if nodeKey == "" {
		return nil, errors.New("no approver node")
	}
	inst := &models.WorkflowInstance{
		TemplateID:     tpl.ID,
		BusinessType:   "reimbursement",
		BusinessID:     reimbursementID,
		Status:         models.WorkflowStatusRunning,
		CurrentNodeKey: nodeKey,
		StartedBy:      startedBy,
		StartedAt:      time.Now(),
	}
	if err := s.Repo.CreateInstance(ctx, inst); err != nil {
		return nil, err
	}
	return inst, nil
}

func (s *WorkflowService) CompleteInstance(ctx context.Context, instanceID uint, status string) error {
	inst, err := s.Repo.GetInstanceByID(ctx, instanceID)
	if err != nil {
		return err
	}
	inst.Status = status
	now := time.Now()
	inst.FinishedAt = &now
	return s.Repo.UpdateInstance(ctx, inst)
}

func resolveApproverNode(nodes []models.ProcessNode, totalAmount float64) string {
	var fallback string
	for _, n := range nodes {
		if n.NodeType == models.NodeTypeApprover && fallback == "" {
			fallback = n.NodeKey
		}
	}
	if totalAmount > 5000 {
		for _, n := range nodes {
			if n.NodeKey == "gm_approve" {
				return n.NodeKey
			}
		}
	}
	for _, n := range nodes {
		if n.NodeKey == "dept_approve" {
			return n.NodeKey
		}
	}
	return fallback
}
