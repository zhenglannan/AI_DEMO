# 现代化前后端分离后台管理系统

## 技术栈
- 前端: Vue 3 + Vite 6 + TypeScript + Pinia + Vue Router + Element Plus + Axios
- 后端: NestJS 11 + Prisma + PostgreSQL 16 + Redis 7 + JWT + Passport
- 工程化: pnpm workspace + Docker Compose + ESLint/TypeScript

## 目录结构
- `apps/admin`: Vue3 管理后台
- `services/api`: NestJS API 服务

## 快速启动
### 方式一: 一键脚本（推荐，Windows）
1. 直接执行
   - `./start-dev.ps1`
   - 或双击 `start-dev.bat`
2. 或使用 pnpm 脚本
   - `pnpm run dev:up`
3. 已安装依赖时快速启动
   - `pnpm run dev:up:fast`

### 方式二: 手动启动
1. 安装依赖
   - `pnpm install`
2. 启动数据库与缓存
   - `docker compose up -d`
3. 初始化后端环境变量
   - 复制 `services/api/.env.example` 为 `services/api/.env`
4. 执行 Prisma
   - `pnpm --filter api prisma:generate`
   - `pnpm --filter api prisma:migrate`
   - `pnpm --filter api prisma:seed`
5. 启动开发
   - `pnpm dev`

## 默认账号
- 用户名: `admin`
- 密码: `admin123456`

## 访问地址
- 前端: `http://localhost:5173`
- 后端: `http://localhost:3000/api`

## 停止开发环境
- 停止开发服务（按当前终端 `Ctrl + C`）
- 停止容器
   - `pnpm run dev:down`
   - 或双击 `stop-dev.bat`
