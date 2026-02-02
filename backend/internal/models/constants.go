package models

// 表单状态
const (
	FormStatusDraft    = "draft"
	FormStatusPending  = "pending"
	FormStatusApproved = "approved"
	FormStatusRejected = "rejected"
)

// 报销类型
const (
	ReimbursementTypeTravel = "差旅"
	ReimbursementTypeTeam   = "团建"
)

// 流程节点类型
const (
	NodeTypeStarter   = "Starter"
	NodeTypeApprover  = "Approver"
	NodeTypeCC        = "CC"
	NodeTypeCondition = "Condition"
)

// 流程实例状态
const (
	WorkflowStatusRunning  = "running"
	WorkflowStatusApproved = "approved"
	WorkflowStatusRejected = "rejected"
)

// 审批动作
const (
	ApprovalActionSubmit  = "submit"
	ApprovalActionApprove = "approve"
	ApprovalActionReject  = "reject"
	ApprovalActionCC      = "cc"
)
