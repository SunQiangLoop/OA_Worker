# OA Workorder (Monorepo)

统一管理前后端，目录结构如下：

```
oa-workorder/
  backend/    # Go 后端
  frontend/   # Vue3 前端
```

## 前端启动

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## 后端启动

```bash
cd backend
cp .env.example .env
# 先解决 Go 依赖下载，然后：
go run ./cmd/server
```

## 说明

- 前端依赖安装在 `frontend/node_modules`
- Go 依赖默认在全局 module cache，如果需要本地化可用 `go mod vendor`
