# React + Vite Template

This is a minimal template for building React 19 apps with Vite, TypeScript, and SWC.

## 🚀 Getting Started

Create a new project using `degit`:

```bash
npx degit atlas-form/react-vite-template my-app
cd my-app
pnpm install
```

### Set up environment variables

Copy the example environment file and configure it for development:

```bash
cp .env.example .env.dev
```

Edit `.env.dev` as needed:

```env
# For development (proxy to backend)
VITE_API_PROXY=http://localhost:8001
VITE_API_URL=/api

VITE_AUTH_PROXY=http://localhost:8002
VITE_AUTH_URL=/auth

VITE_FILE_PROXY=http://localhost:8003
VITE_FILE_URL=/files
```

Then run the dev server:

```bash
pnpm dev
```

## 📦 Includes

- React 19 + ReactDOM
- Vite 6
- TypeScript 5
- SWC (`@vitejs/plugin-react-swc`)
- ESLint with React plugins
- pnpm support

## 📁 Project Structure

```
my-app/
├── public/                      # Static public assets
├── src/
│   ├── api/                     # API modules (e.g., authApi, base)
│   ├── assets/                  # Static assets (e.g., icons, images)
│   ├── components/              # Shared React components
│   ├── i18n/                    # i18n setup for localization
│   ├── layouts/                 # Layout components (AppLayout, AuthLayout)
│   ├── models/                  # Data models (e.g., authModel)
│   ├── pages/
│   │   ├── protected/           # Protected (authenticated) pages
│   │   └── public/              # Public (unauthenticated) pages
│   ├── routes/                  # Route definitions (index, protected/public routes)
│   ├── store/                   # Global state management (e.g., Redux slices)
│   ├── utils/                   # Utility functions (e.g., httpClient)
│   ├── index.css                # Global styles
│   ├── main.tsx                 # Application entry point
│   └── vite-env.d.ts            # Vite environment type declarations
├── index.html                   # HTML entry point
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── .env.example                 # Example environment variables
└── .eslintrc.cjs                # ESLint configuration
```

## 🛠 Environment Modes

- `.env.dev` — for development (`vite --mode dev`)
- `.env.production` — for production builds (`vite --mode production`)

Environment variables are loaded automatically by Vite depending on the mode.

## 🔐 Authentication Backend

The authentication backend for this template is powered by [auth-rs](https://github.com/arthasyou/auth-rs).  
Please make sure to run `auth-rs` locally to enable login and user-related functionality.

Default proxy setup assumes it's running at: `http://localhost:9876`
