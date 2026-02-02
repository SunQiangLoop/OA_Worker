# Data Model: OA 工单审批系统

## Entities

### 用户 (User)

- **Fields**: id, username, display_name, department_id, role_id, status, created_at, updated_at
- **Relationships**: 1:N with 报销单、审批日志、流程实例
- **Validation**: username 唯一；status 仅允许 active/disabled

### 流程模板 (WorkflowTemplate)

- **Fields**: id, name, description, version, is_active, created_by, created_at, updated_at
- **Relationships**: 1:N with 流程节点、流程实例
- **Validation**: name 唯一；is_active 仅允许一个启用版本

### 流程节点 (ProcessNode)

- **Fields**: id, template_id, node_key, node_type, assignee_rule, condition_rule, next_node_key, created_at
- **Relationships**: N:1 with 流程模板；1:N with 审批日志
- **Validation**: node_type 仅允许 Starter/Approver/CC/Condition；node_key 在模板内唯一

### 流程实例 (WorkflowInstance)

- **Fields**: id, template_id, business_type, business_id, status, current_node_key, started_by, started_at, finished_at
- **Relationships**: N:1 with 流程模板；1:N with 审批日志
- **Validation**: status 仅允许 running/approved/rejected

### 审批日志 (ApprovalLog)

- **Fields**: id, instance_id, node_key, actor_id, action, comment, created_at
- **Relationships**: N:1 with 流程实例；N:1 with 用户
- **Validation**: action 仅允许 submit/approve/reject/cc

### 表单定义 (FormDefinition)

- **Fields**: id, code, name, schema_json, is_active, version, created_by, created_at
- **Relationships**: 1:N with 表单数据
- **Validation**: schema_json 为可解析 JSON；code 唯一

### 表单数据 (FormData)

- **Fields**: id, form_id, owner_id, data_json, status, created_at, updated_at
- **Relationships**: N:1 with 表单定义；N:1 with 用户；1:1 with 报销单
- **Validation**: data_json 必须符合当前表单 schema；status 仅允许 draft/pending/approved/rejected

### 报销单 (ExpenseReimbursement)

- **Fields**: id, form_data_id, reimbursement_type, reason, total_amount, currency, summary, status, created_at, updated_at
- **Relationships**: 1:1 with 表单数据；1:N with 报销明细；1:N with 附件；1:1 with 流程实例
- **Validation**: reimbursement_type 仅允许 差旅/团建；total_amount >= 0

### 报销明细 (ExpenseItem)

- **Fields**: id, reimbursement_id, item_date, item_desc, amount, created_at
- **Relationships**: N:1 with 报销单
- **Validation**: amount > 0；item_date 必须在合理日期范围内

### 附件 (Attachment)

- **Fields**: id, reimbursement_id, file_name, file_size, mime_type, storage_path, created_at
- **Relationships**: N:1 with 报销单
- **Validation**: file_size 与 mime_type 需符合配置限制

## State Transitions

### 报销单状态

- **draft** -> **pending** -> **approved**
- **draft** -> **pending** -> **rejected**
- 仅草稿允许编辑；进入 pending 后仅审批动作可改变状态

### 流程实例状态

- **running** -> **approved**
- **running** -> **rejected**
