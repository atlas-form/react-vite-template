import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { meApi, loginApi } from "@/api";
import type { LoginRequest } from "@/models/authModel";
import { loginSuccess } from "@/store/authSlice";

export default function LoginPage() {
  const { t } = useTranslation();
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
      const refreshToken = res.refreshToken;

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)] sm:grid-cols-2">
      <section className="relative hidden flex-col justify-between border-r border-[var(--app-border)] bg-[linear-gradient(155deg,var(--app-active-bg)_0%,var(--app-surface)_65%)] p-10 text-[var(--app-text)] sm:flex">
        <div>
          <p className="text-xs tracking-[0.22em] text-[var(--app-muted-text)]">
            {t("login.brand")}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight [font-family:Space_Grotesk,ui-sans-serif,system-ui]">
            {t("login.hero.titleLine1")}
            <br />
            {t("login.hero.titleLine2")}
          </h1>
        </div>
        <div className="space-y-3 text-sm text-[var(--app-muted-text)]">
          <p>{t("login.hero.desc1")}</p>
          <p>{t("login.hero.desc2")}</p>
        </div>
        <div className="pointer-events-none absolute -bottom-14 -right-14 h-44 w-44 rounded-full border border-[var(--app-border)]" />
      </section>

      <section className="p-8 sm:p-10">
        <div className="mb-8">
          <p className="text-xs font-medium tracking-[0.16em] text-[var(--app-muted-text)]">
            {t("login.welcome")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--app-text)] [font-family:Manrope,ui-sans-serif,system-ui]">
            {t("login.title")}
          </h2>
          <p className="mt-2 text-sm text-[var(--app-muted-text)]">{t("login.subtitle")}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--app-text)]">
              {t("login.form.identifier.label")}
            </span>
            <input
              type="text"
              placeholder={t("login.form.identifier.placeholder")}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-[var(--app-text)] outline-none transition placeholder:text-[var(--app-muted-text)] focus:border-[var(--app-active-text)] focus:ring-4 focus:ring-[var(--app-active-bg)]"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--app-text)]">
              {t("login.form.password.label")}
            </span>
            <input
              type="password"
              placeholder={t("login.form.password.placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-[var(--app-text)] outline-none transition placeholder:text-[var(--app-muted-text)] focus:border-[var(--app-active-text)] focus:ring-4 focus:ring-[var(--app-active-bg)]"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--app-active-bg)] px-4 py-3 text-sm font-semibold text-[var(--app-active-text)] shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t("login.form.submitting") : t("login.form.submit")}
          </button>
        </form>

        <p className="mt-6 text-sm text-[var(--app-muted-text)]">
          {t("login.footer.toRegisterPrefix")}{" "}
          <Link
            to="/register"
            className="font-medium text-[var(--app-active-text)] hover:underline"
          >
            {t("login.footer.toRegisterAction")}
          </Link>
        </p>
      </section>
    </div>
  );
}
