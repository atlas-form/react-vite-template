# Directory Guide (本项目目录职责说明)

> 本文档描述当前仓库中主要目录的职责，供 AI 与开发者在新增代码时快速定位。

## 一、仓库根目录

- `.git/`
  - Git 元数据目录，不存放业务代码。
- `.vscode/`
  - 编辑器工作区配置。
- `dist/`
  - 构建产物目录（`pnpm build` 生成），不作为业务源码修改点。
- `node_modules/`
  - 依赖安装目录，不手动修改。
- `public/`
  - 原样静态资源目录，构建时直接拷贝。
- `src/`
  - 前端业务源码主目录。
- `ai_protocal/`
  - AI 开发协议目录（本次新增）：约束 AI 如何按项目规范写代码。

## 二、public 目录

- `public/locales/`
  - i18n 语言资源根目录。
- `public/locales/en/`
  - 英文翻译资源。
- `public/locales/zhCN/`
  - 简体中文翻译资源。

说明：
- `translation.json` 放通用业务文案。
- `error.json` 放错误码文案（与后端 code 对齐）。

## 三、src 目录

- `src/api/`
  - API 封装层：按业务域拆分请求函数；统一通过 `base.ts` 的 `request` 调用。
  - `base.ts`：统一请求协议、错误翻译、全局报错。
  - `authApi.ts` / `userApi.ts` / `fileApi.ts`：具体业务 API。
  - `index.ts`：API 聚合导出。

- `src/assets/`
  - 静态资源（图标、图片等）源码引用位置。

- `src/components/`
  - 可复用业务组件。
  - `base/`：基础能力组件（如 `ImageCropperModal`）。
  - `header/`：头部区域组件（主题切换、语言切换、用户菜单）。

- `src/i18n/`
  - i18next 初始化与语言检测配置。

- `src/layouts/`
  - 页面壳层布局。
  - `AppLayout.tsx`：登录后主站布局。
  - `AuthLayout.tsx`：登录页布局。

- `src/models/`
  - 类型模型定义（请求参数、响应体、领域模型）。

- `src/pages/`
  - 路由页面组件。
  - `protected/`：登录后可访问页面。
  - `public/`：公开页面（如登录页）。

- `src/routes/`
  - 路由对象定义。
  - `protectedRoutes.tsx`：受保护路由树。
  - `publicRoutes.tsx`：公开路由树。

- `src/store/`
  - Redux 状态管理。
  - `authSlice.ts`：登录状态与用户信息。
  - `index.ts`：store 组装、类型导出。

- `src/theme/`
  - 主题系统。
  - `light.css` / `dark.css`：主题变量。
  - `mode.ts`：主题模式切换与持久化。
  - `index.ts`：主题模块导出。

- `src/utils/`
  - 通用工具函数。
  - `httpClient.ts`：fetch 封装、token 刷新、流式请求。
  - `url.ts`：按 `api/auth/file` 分组解析 URL。
  - `imageCrop.ts`：头像裁剪生成文件。

- `src/main.tsx`
  - 应用入口：注入 Redux、初始化 i18n 与主题。

- `src/App.tsx`
  - 根组件：恢复会话、选择路由树、挂载全局 Toast。

- `src/index.css`
  - 全局样式入口，导入 Tailwind 与主题 CSS。

- `src/vite-env.d.ts`
  - Vite 环境类型声明。

## 四、AI 写代码时的目录选择规则

- 新增接口：放 `src/api/*Api.ts`，类型放 `src/models/*Model.ts`。
- 新增页面：放 `src/pages/**`，并同步更新 `src/routes/**`。
- 新增通用组件：放 `src/components`；仅基础能力组件放 `src/components/base`。
- 新增全局状态：放 `src/store`；仅跨页面共享才入 store。
- 新增国际化文案：同步修改 `public/locales/en` 与 `public/locales/zhCN`。
- 新增主题相关：放 `src/theme`，尽量复用 `--app-*` 变量。

