import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

export default defineConfig(({ mode }) => {
  // 加载 .env.[mode] 文件
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          ws: false,
        },
        "/auth": {
          target: env.VITE_AUTH_PROXY,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/auth/, ""),
          ws: false,
        },
        "/file": {
          target: env.VITE_FILE_PROXY,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/file/, ""),
          ws: false,
        },
      },
    },
  };
});
