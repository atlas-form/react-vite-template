# AI Standardized Development Framework (React + Vite)

This project is an AI-standardized development framework based on React 19, Vite, and TypeScript.

You can directly describe your requirement, and AI will implement code by following the framework conventions (project structure, i18n, theme tokens, routing, and API organization).

## Getting Started

```bash
npx degit atlas-form/react-vite-template my-app
cd my-app
pnpm install
cp .env.example .env.dev
pnpm dev
```

## Environment Variables

Edit `.env.dev` as needed:

```env
VITE_API_PROXY=http://localhost:8001
VITE_API_URL=/api

VITE_AUTH_PROXY=http://localhost:8002
VITE_AUTH_URL=/auth

VITE_FILE_PROXY=http://localhost:8003
VITE_FILE_URL=/file
```

## How To Use AI

See [How To Use AI (EN)](./how_to_use_ai.en.md).

This guide includes:
- What to tell AI before implementation
- A prompt template for development tasks
- Framework rules to keep code consistent
- A practical workflow from request to verification

## Includes

- React 19 + ReactDOM
- Vite 7 + SWC
- TypeScript 5
- Redux Toolkit
- i18n (i18next)
- Theme mode (system / light / dark)

## Project Structure

```text
my-app/
├── public/
│   └── locales/                # i18n language files
├── src/
│   ├── api/                    # API modules
│   ├── components/             # Shared components
│   ├── i18n/                   # i18n bootstrap
│   ├── layouts/                # App/Auth layout
│   ├── pages/                  # Route pages
│   ├── routes/                 # Router definitions
│   ├── store/                  # Global state
│   ├── theme/                  # Theme mode + tokens
│   └── utils/                  # Utilities
├── how_to_use_ai.en.md         # AI usage guide (English)
├── how_to_use_ai.zh-CN.md      # AI usage guide (Chinese)
├── README.en.md
├── README.zh-CN.md
└── README.md                   # language selector
```

## Authentication Backend

The authentication backend is [auth-rs](https://github.com/arthasyou/auth-rs).
Run it locally if you want to use login and user features.
