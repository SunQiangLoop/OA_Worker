# OA Workorder Backend (Go)

Go + Gin + GORM 后端基础框架，包含：
- 登录/刷新/登出（JWT access + refresh）
- RBAC 权限模型（Role/Permission）
- 工单基础 CRUD
- Open API 调用（API Key + HMAC 签名）
- SQLite/MySQL/PostgreSQL 可切换

## Quick Start

```bash
cp .env.example .env
# 编辑 .env（至少修改 JWT_SECRET）

# 启动
go run ./cmd/server
```

## 默认管理员

首次启动会自动创建管理员：
- username: `ADMIN_USERNAME` (默认 admin)
- password: `ADMIN_PASSWORD` (默认 admin123)

## Open API Key

生成 Open API Key：

```bash
go run ./cmd/tools/create_apikey -name "system-a"
```

输出示例：
```
API_KEY_ID=oa_6f1a2c3d4e5f6a7b
API_KEY_SECRET=...32byteshex...
```

## Open API 签名规则

请求头必须包含：
- `X-API-Key`
- `X-API-Timestamp` (Unix 秒)
- `X-API-Nonce` (随机字符串)
- `X-API-Signature`

签名基串：
```
METHOD\nPATH\nTIMESTAMP\nNONCE\nBODY_SHA256_HEX
```

签名：
```
HMAC-SHA256(secret, baseString) -> hex
```

说明：
- `PATH` 只包含 URL path，不含 host
- body 为空时，BODY_SHA256_HEX 为对空字节数组计算的 SHA256
- timestamp 默认允许 ±5 分钟（可在 `.env` 调整）

## API 示例

登录：
```
POST /api/v1/auth/login
{
  "username": "admin",
  "password": "admin123"
}
```

创建工单（内部）：
```
POST /api/v1/tickets
Authorization: Bearer <access_token>
{
  "title": "VPN 不可用",
  "description": "无法连接",
  "priority": "high"
}
```

创建工单（Open API）：
```
POST /open/v1/tickets
X-API-Key: ...
X-API-Timestamp: 1738320000
X-API-Nonce: abc123
X-API-Signature: <signature>
{
  "title": "系统告警",
  "description": "CPU 高",
  "priority": "urgent"
}
```

## 目录结构

```
cmd/server               # HTTP 服务入口
cmd/tools/create_apikey  # Open API Key 生成工具
internal/
  config                 # 配置
  db                     # DB 连接
  handler                # HTTP handlers
  http                   # 路由
  middleware             # 中间件
  models                 # 数据模型
  service                # 业务服务（seed/apikey）
package/
  crypto                 # 加密工具
  response               # 统一响应
```
