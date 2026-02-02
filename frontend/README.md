# OA Workorder Frontend (Vue3)

## 开发启动

```bash
cp .env.example .env
npm install
npm run dev
```

## 环境变量

- `VITE_API_BASE_URL` 后端 API 地址，默认 `http://localhost:8080`

## 页面

- `/login` 登录
- `/tickets` 工单列表 + 新建
- `/tickets/:id` 工单详情 + 流转
