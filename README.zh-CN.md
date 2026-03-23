# AI 标准化开发框架（React + Vite）

本项目是一个基于 React 19、Vite 与 TypeScript 的 AI 标准化开发框架。

你可以直接描述需求，AI 会按框架约定（项目结构、i18n、主题变量、路由和 API 分层）实现代码。

## 快速开始

```bash
npx degit atlas-form/react-vite-template my-app
cd my-app
pnpm install
cp .env.example .env.dev
pnpm dev
```

## 环境变量

根据需要编辑 `.env.dev`：

```env
VITE_API_PROXY=http://localhost:8001
VITE_API_URL=/api

VITE_AUTH_PROXY=http://localhost:8002
VITE_AUTH_URL=/auth

VITE_FILE_PROXY=http://localhost:8003
VITE_FILE_URL=/file
```

## 如何使用 AI

请查看 [How To Use AI（中文）](./how_to_use_ai.zh-CN.md)。

该指南包含：

- 在让 AI 实现之前，你需要提供哪些信息
- 开发任务可直接复用的提示词模板
- 保持代码一致性的框架规则
- 从提需求到验证结果的实用流程

## 内置能力

- React 19 + ReactDOM
- Vite 7 + SWC
- TypeScript 5
- Redux Toolkit
- i18n（i18next）
- 主题模式（system / light / dark）

## 项目结构

```text
my-app/
├── public/
│   └── locales/                # i18n 语言文件
├── src/
│   ├── api/                    # API 模块
│   ├── components/             # 通用组件
│   ├── i18n/                   # i18n 初始化
│   ├── layouts/                # App/Auth 布局
│   ├── pages/                  # 路由页面
│   ├── routes/                 # 路由定义
│   ├── store/                  # 全局状态
│   ├── theme/                  # 主题模式与变量
│   └── utils/                  # 工具函数
├── how_to_use_ai.en.md         # AI 使用指南（英文）
├── how_to_use_ai.zh-CN.md      # AI 使用指南（中文）
├── README.en.md
├── README.zh-CN.md
└── README.md                   # 语言选择入口
```

## 认证后端

认证后端使用 [auth](https://github.com/atlas-form/auth)。
如果要体验登录与用户功能，请先在本地运行该服务。

## S3 签名服务

S3 上传签名服务使用 [file-service](https://github.com/code-serenade/file-service)。

前端上传流程：
- 先请求签名接口获取上传参数
- 再通过签名 URL 直传到对象存储

相关前端代码：
- `src/api/fileApi.ts`
- `src/components/S3UploadPanel.tsx`
