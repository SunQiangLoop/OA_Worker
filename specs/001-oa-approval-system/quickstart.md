# Quickstart: OA 工单审批系统

## Prerequisites

- Go 1.25+ 安装完成
- 已准备好 `.env` 配置文件

## Run Backend

```bash
cd /Users/sunqiang/Desktop/oa-workorder/backend
cp .env.example .env
# 编辑 .env，至少设置 JWT_SECRET

go run ./cmd/server
```

## Verify

- 后端启动后访问健康检查或任意已存在接口确认服务可用
- 使用默认管理员账号完成登录以验证系统可用
- 通过登录后访问 `/api/v1/forms` 与 `/api/v1/reimbursements` 验证 OA 审批接口

## Default Admin

- username: `ADMIN_USERNAME` (默认 admin)
- password: `ADMIN_PASSWORD` (默认 admin123)
