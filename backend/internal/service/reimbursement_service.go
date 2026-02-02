package service

import (
	"context"

	"example.com/oa-workorder/internal/models"
	"example.com/oa-workorder/internal/repo"
	"gorm.io/gorm"
)

// ReimbursementService 报销单业务逻辑

type ReimbursementService struct {
	DB       *gorm.DB
	Repo     repo.ReimbursementRepo
	FormRepo repo.FormRepo
}

func NewReimbursementService(db *gorm.DB, r repo.ReimbursementRepo, f repo.FormRepo) *ReimbursementService {
	return &ReimbursementService{DB: db, Repo: r, FormRepo: f}
}

func (s *ReimbursementService) CreateDraft(ctx context.Context, formData *models.FormData, reimb *models.ExpenseReimbursement) error {
	return s.DB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		formRepo := s.FormRepo.WithTx(tx)
		reimbRepo := s.Repo.WithTx(tx)
		if err := formRepo.CreateFormData(ctx, formData); err != nil {
			return err
		}
		reimb.FormDataID = formData.ID
		return reimbRepo.Create(ctx, reimb)
	})
}

func (s *ReimbursementService) UpdateDraft(ctx context.Context, formData *models.FormData, reimb *models.ExpenseReimbursement) error {
	return s.DB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		formRepo := s.FormRepo.WithTx(tx)
		reimbRepo := s.Repo.WithTx(tx)
		if err := formRepo.UpdateFormData(ctx, formData); err != nil {
			return err
		}
		return reimbRepo.Update(ctx, reimb)
	})
}

func (s *ReimbursementService) Submit(ctx context.Context, reimb *models.ExpenseReimbursement) error {
	return s.DB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		formRepo := s.FormRepo.WithTx(tx)
		reimbRepo := s.Repo.WithTx(tx)
		formData, err := formRepo.GetFormDataByID(ctx, reimb.FormDataID)
		if err != nil {
			return err
		}
		formData.Status = models.FormStatusPending
		if err := formRepo.UpdateFormData(ctx, formData); err != nil {
			return err
		}
		reimb.Status = models.FormStatusPending
		return reimbRepo.Update(ctx, reimb)
	})
}

func (s *ReimbursementService) Complete(ctx context.Context, reimb *models.ExpenseReimbursement, status string) error {
	return s.DB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		formRepo := s.FormRepo.WithTx(tx)
		reimbRepo := s.Repo.WithTx(tx)
		formData, err := formRepo.GetFormDataByID(ctx, reimb.FormDataID)
		if err != nil {
			return err
		}
		formData.Status = status
		if err := formRepo.UpdateFormData(ctx, formData); err != nil {
			return err
		}
		reimb.Status = status
		return reimbRepo.Update(ctx, reimb)
	})
}

func (s *ReimbursementService) GetByID(ctx context.Context, id uint) (*models.ExpenseReimbursement, error) {
	return s.Repo.GetByID(ctx, id)
}

func (s *ReimbursementService) List(ctx context.Context, filter repo.ReimbursementListFilter) ([]models.ExpenseReimbursement, int64, error) {
	return s.Repo.List(ctx, filter)
}
