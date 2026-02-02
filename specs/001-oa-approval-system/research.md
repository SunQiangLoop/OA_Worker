# Research: OA 工单审批系统

## Decision 1: Web API Framework

**Decision**: 使用 Gin 作为 HTTP 路由与中间件框架。
**Rationale**: 现有项目已采用 Gin，便于复用路由、中间件与统一响应。
**Alternatives considered**: 标准库 net/http、自建路由层。

## Decision 2: 数据访问与 ORM

**Decision**: 使用 GORM 作为模型与持久化层。
**Rationale**: 项目已依赖 GORM，适合快速定义模型与迁移，便于复杂查询与关联。
**Alternatives considered**: 原生 SQL、sqlx。

## Decision 3: 存储引擎

**Decision**: 采用 SQLite 作为默认存储（单文件）。
**Rationale**: 与现有项目配置一致，适合中小规模内部 OA 场景，便于部署。
**Alternatives considered**: MySQL、PostgreSQL（已在项目依赖中预留）。

## Decision 4: 表单与审批数据结构

**Decision**: 表单内容使用 JSON 存储，审批日志独立记录。
**Rationale**: 动态表单字段需要灵活存储，日志独立记录便于审计追溯。
**Alternatives considered**: 固定字段表结构、将日志内嵌在表单记录中。

## Decision 5: API 合约格式

**Decision**: 使用 OpenAPI 3.0 形式输出接口合约。
**Rationale**: 与现有 `internal/openapi` 目录风格一致，便于前后端对齐与测试。
**Alternatives considered**: GraphQL、无合约文档。
