# AI Coding Protocol (React Vite Template)

本文档用于约束 AI 在本项目中写代码时的行为，确保输出符合当前框架与目录约定。

## 1. 项目技术基线

- 前端框架：React 19 + TypeScript
- 构建工具：Vite
- 样式：Tailwind CSS v4 + CSS 变量主题（`src/theme/*.css`）
- 路由：`react-router`（对象路由）
- 状态：Redux Toolkit（当前以 `authSlice` 为核心）
- 多语言：i18next + `react-i18next` + `public/locales`
- 请求层：`src/api` + `src/utils/httpClient.ts`

AI 生成代码必须兼容以上栈，不引入同类替代库（如 Zustand、Axios、CSS-in-JS）除非用户明确要求。

## 2. 通用编码规则

- 使用 TypeScript 严格类型，优先 `interface/type`，避免无类型对象传递。
- import 优先使用别名 `@/`（已在 `vite.config.ts` 与 `tsconfig.app.json` 配置）。
- 保持函数组件 + Hooks 写法，不使用 class 组件。
- 不在页面中直接拼接后端基地址，统一走 `request(...)` 或 `httpClient`。
- GET/DELETE 带参数时，按 `src/api/base.ts` 规范通过 `body` 传入并由请求层转 query。
- 错误提示统一走 `showGlobalError`，避免各处自定义弹窗风格。
- 不破坏已有登录态机制：`token` / `refreshToken` 存储键保持一致。

## 3. 新功能落地流程（必须遵守）

1. 先定义数据类型
- 在 `src/models` 新增/扩展 `xxxModel.ts`。
- 接口字段保留后端原始字段语义；若前端使用不同命名，在 `api` 层做映射。

2. 再封装接口
- 在 `src/api/xxxApi.ts` 增加函数。
- 统一调用 `request<T, R>`。
- `group` 必须按网关分类：`api` / `auth` / `file`。

3. 需要全局状态再进 store
- 仅当跨页面共享时，新增 slice 到 `src/store`。
- 局部 UI 状态优先 `useState`，避免过度 Redux 化。

4. 路由与页面
- 页面组件放到 `src/pages/public` 或 `src/pages/protected`。
- 路由仅在 `src/routes/publicRoutes.tsx` 或 `src/routes/protectedRoutes.tsx` 注册。
- 需要统一框架壳时放在 layout（`AppLayout` / `AuthLayout`）。

5. 组件拆分
- 可复用组件放 `src/components`。
- 基础能力组件放 `src/components/base`。
- Header 相关放 `src/components/header`。

6. 文案与主题同步
- 可见文案接入 i18n，不硬编码。
- 新增 key 时同步更新：
  - `public/locales/en/translation.json`
  - `public/locales/zhCN/translation.json`
  - 如为错误码文案，同步 `error.json`
- 颜色优先使用主题变量（`--app-*`），保证明暗主题兼容。

## 4. API 设计约束（按当前项目）

- 所有业务 API 通过 `src/api/base.ts` 的 `request` 导出，保持统一响应结构：
  - 成功：`{ code: 0, data, message }`
  - 失败：统一翻译错误码并 toast。
- 文件上传走签名 URL 方案：先拿 sign，再调用 `uploadWithSignedUrlApi`。
- 用户信息展示层使用 `UserInfo`，由 `meApi` 处理后端字段到前端字段映射。

## 5. i18n 约束

- 默认命名空间是 `translation`，错误文案用 `error` 命名空间。
- 中文语言码使用 `zhCN`（不是 `zh-CN`），遵守 `src/i18n/index.ts` 的检测转换逻辑。
- 组件中通过 `useTranslation()` 读取文案，不直接写死英文/中文。

## 6. 主题与样式约束

- 全局主题入口：`src/theme/mode.ts`。
- 主题变量定义在：
  - `src/theme/light.css`
  - `src/theme/dark.css`
- 新组件应优先使用 `var(--app-...)` 系列变量，减少写死颜色。
- 使用 Tailwind 工具类时，保持与现有命名习惯一致（简洁、可读）。

## 7. 目录放置决策表

- “接口请求函数” -> `src/api`
- “接口类型定义” -> `src/models`
- “全局状态” -> `src/store`
- “页面级组件” -> `src/pages/*`
- “布局容器” -> `src/layouts`
- “通用组件” -> `src/components`
- “工具函数（与 UI 无关）” -> `src/utils`
- “路由声明” -> `src/routes`
- “翻译文案” -> `public/locales/*`
- “主题实现” -> `src/theme`

## 8. 提交前检查清单（AI 自检）

- `pnpm lint` 可通过。
- TypeScript 无新增类型错误。
- 新增页面是否正确注册路由。
- 新增文案是否补齐 `en` + `zhCN`。
- 新接口是否放在正确 `group`。
- 是否复用 `@/api`、`@/models`、`@/utils`，避免重复造轮子。

