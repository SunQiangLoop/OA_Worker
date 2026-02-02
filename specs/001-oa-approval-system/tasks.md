# Tasks: OA 工单审批系统

**Input**: Design documents from `/specs/001-oa-approval-system/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: 未在规格中要求 TDD，本任务清单不单独列测试任务。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify backend module builds and dependencies in backend/go.mod
- [x] T002 [P] Create feature docs index in backend/docs/oa-approval/README.md
- [x] T003 [P] Add database migration note in backend/docs/oa-approval/migrations.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T004 Define shared constants/enums in backend/internal/models/constants.go
- [x] T005 Implement base workflow repository interfaces in backend/internal/repo/workflow_repo.go
- [x] T006 Implement base form repository interfaces in backend/internal/repo/form_repo.go
- [x] T007 Add common request/response DTOs in backend/internal/handler/dto/common.go
- [x] T008 Add route group placeholders for forms/workflows/reimbursements in backend/internal/http/routes.go

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 费用报销提交 (Priority: P1) 🎯 MVP

**Goal**: 支持动态表单配置与报销单草稿/提交

**Independent Test**: 创建报销单草稿并提交，状态从 draft 变为 pending 且表单数据完整保存

### Implementation for User Story 1

- [x] T009 [P] [US1] Implement FormDefinition model in backend/internal/models/form_definition.go
- [x] T010 [P] [US1] Implement FormData model in backend/internal/models/form_data.go
- [x] T011 [P] [US1] Implement ExpenseReimbursement model in backend/internal/models/expense_reimbursement.go
- [x] T012 [P] [US1] Implement ExpenseItem model in backend/internal/models/expense_item.go
- [x] T013 [P] [US1] Implement Attachment model in backend/internal/models/attachment.go
- [x] T014 [US1] Implement form repo in backend/internal/repo/form_repo_impl.go
- [x] T015 [US1] Implement reimbursement repo in backend/internal/repo/reimbursement_repo_impl.go
- [x] T016 [US1] Implement form service in backend/internal/service/form_service.go
- [x] T017 [US1] Implement reimbursement service in backend/internal/service/reimbursement_service.go
- [x] T018 [US1] Add form handlers in backend/internal/handler/form_handler.go
- [x] T019 [US1] Add reimbursement handlers in backend/internal/handler/reimbursement_handler.go
- [x] T020 [US1] Wire form routes in backend/internal/http/routes.go
- [x] T021 [US1] Wire reimbursement routes in backend/internal/http/routes.go
- [x] T022 [US1] Update OpenAPI spec in backend/internal/openapi/oa_approval.yaml

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - 条件审批流转 (Priority: P2)

**Goal**: 支持审批流程模板与金额条件分支

**Independent Test**: 两笔不同金额报销单触发不同审批节点

### Implementation for User Story 2

- [x] T023 [P] [US2] Implement WorkflowTemplate model in backend/internal/models/workflow_template.go
- [x] T024 [P] [US2] Implement ProcessNode model in backend/internal/models/process_node.go
- [x] T025 [P] [US2] Implement WorkflowInstance model in backend/internal/models/workflow_instance.go
- [x] T026 [US2] Implement workflow repo in backend/internal/repo/workflow_repo_impl.go
- [x] T027 [US2] Implement workflow service in backend/internal/service/workflow_service.go
- [x] T028 [US2] Add workflow handlers in backend/internal/handler/workflow_handler.go
- [x] T029 [US2] Wire workflow routes in backend/internal/http/routes.go
- [x] T030 [US2] Add submit/approve/reject endpoints in backend/internal/handler/reimbursement_handler.go
- [x] T031 [US2] Update OpenAPI spec in backend/internal/openapi/oa_approval.yaml

**Checkpoint**: User Stories 1 and 2 should work independently

---

## Phase 5: User Story 3 - 审批记录与抄送 (Priority: P3)

**Goal**: 支持审批日志与抄送记录查询

**Independent Test**: 完成审批后可查询到日志与抄送信息

### Implementation for User Story 3

- [x] T032 [P] [US3] Implement ApprovalLog model in backend/internal/models/approval_log.go
- [x] T033 [US3] Implement approval log repo in backend/internal/repo/approval_log_repo_impl.go
- [x] T034 [US3] Implement approval log service in backend/internal/service/approval_log_service.go
- [x] T035 [US3] Add approval log handlers in backend/internal/handler/approval_log_handler.go
- [x] T036 [US3] Wire approval log routes in backend/internal/http/routes.go
- [x] T037 [US3] Update OpenAPI spec in backend/internal/openapi/oa_approval.yaml

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T038 [P] Add validation and error mapping docs in backend/docs/oa-approval/validation.md
- [x] T039 Update quickstart references in specs/001-oa-approval-system/quickstart.md
- [x] T040 [P] Add audit log notes in backend/docs/oa-approval/audit.md
- [x] T041 Run quickstart verification steps in specs/001-oa-approval-system/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1/US2

### Parallel Opportunities

- Setup tasks marked [P] can run in parallel
- Within each user story, model tasks marked [P] can run in parallel
- User stories can be run in parallel after Phase 2 if staffed

---

## Parallel Example: User Story 1

```bash
Task: "Implement FormDefinition model in backend/internal/models/form_definition.go"
Task: "Implement FormData model in backend/internal/models/form_data.go"
Task: "Implement ExpenseReimbursement model in backend/internal/models/expense_reimbursement.go"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
