import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { meApi, loginApi } from "@/api";
import type { LoginRequest } from "@/models/authModel";
import { showGlobalError } from "@/components/GlobalErrorHandler";
import { loginSuccess } from "@/store/authSlice";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname ?? "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const payload: LoginRequest = {
      identifier,
      password,
    };

    try {
      setIsSubmitting(true);
      const res = await loginApi(payload); // ✅ 发送请求
      const token = res.accessToken;
      const refreshToken = res.refresh;

      // ✅ 保存 token（可选）
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      // ✅ 使用 token 请求用户信息
      const user = await meApi(); // ⚠️ token 可以通过拦截器自动加上

      // ✅ 写入 Redux
      dispatch(loginSuccess({ token, user }));

      // ✅ 跳转到原始路径或首页
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      showGlobalError("Login failed, please check your identifier and password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-amber-100 bg-white/90 shadow-[0_30px_80px_-30px_rgba(120,53,15,0.35)] backdrop-blur sm:grid-cols-2">
      <section className="relative hidden flex-col justify-between bg-[linear-gradient(160deg,#f59e0b_0%,#f97316_60%,#ea580c_100%)] p-10 text-white sm:flex">
        <div>
          <p className="text-xs tracking-[0.22em] text-amber-100">REACT VITE TEMPLATE</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight [font-family:Space_Grotesk,ui-sans-serif,system-ui]">
            Build fast,
            <br />
            ship clean.
          </h1>
        </div>
        <div className="space-y-3 text-sm text-amber-50/90">
          <p>Unified auth flow with token refresh and route protection.</p>
          <p>Type-safe API modules, i18n-ready, and production-friendly defaults.</p>
        </div>
        <div className="pointer-events-none absolute -bottom-14 -right-14 h-44 w-44 rounded-full border border-white/20" />
      </section>

      <section className="p-8 sm:p-10">
        <div className="mb-8">
          <p className="text-xs font-medium tracking-[0.16em] text-amber-700">WELCOME BACK</p>
          <h2 className="mt-3 text-3xl font-semibold text-zinc-900 [font-family:Manrope,ui-sans-serif,system-ui]">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-zinc-500">Use your identifier and password to continue.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-700">Identifier</span>
            <input
              type="text"
              placeholder="Enter identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-700">Password</span>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-xl bg-[linear-gradient(90deg,#f59e0b_0%,#f97316_100%)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </div>
  );
}
