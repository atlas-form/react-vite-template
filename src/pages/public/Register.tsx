import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { registerApi } from "@/api";
import type { RegisterRequest } from "@/models/authModel";

export default function RegisterPage() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (password !== confirmPassword) {
      setFormError(t("register.error.passwordMismatch"));
      return;
    }

    setFormError("");
    const payload: RegisterRequest = {
      username,
      password,
      display_name: displayName || undefined,
      email: email || undefined,
    };

    try {
      setIsSubmitting(true);
      await registerApi(payload);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Register failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)] sm:grid-cols-2">
      <section className="relative hidden flex-col justify-between border-r border-[var(--app-border)] bg-[linear-gradient(155deg,var(--app-active-bg)_0%,var(--app-surface)_65%)] p-10 text-[var(--app-text)] sm:flex">
        <div>
          <p className="text-xs tracking-[0.22em] text-[var(--app-muted-text)]">
            {t("register.brand")}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight [font-family:Space_Grotesk,ui-sans-serif,system-ui]">
            {t("register.hero.titleLine1")}
            <br />
            {t("register.hero.titleLine2")}
          </h1>
        </div>
        <div className="space-y-3 text-sm text-[var(--app-muted-text)]">
          <p>{t("register.hero.desc1")}</p>
          <p>{t("register.hero.desc2")}</p>
        </div>
        <div className="pointer-events-none absolute -bottom-14 -right-14 h-44 w-44 rounded-full border border-[var(--app-border)]" />
      </section>

      <section className="p-8 sm:p-10">
        <div className="mb-8">
          <p className="text-xs font-medium tracking-[0.16em] text-[var(--app-muted-text)]">
            {t("register.welcome")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--app-text)] [font-family:Manrope,ui-sans-serif,system-ui]">
            {t("register.title")}
          </h2>
          <p className="mt-2 text-sm text-[var(--app-muted-text)]">{t("register.subtitle")}</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--app-text)]">
              {t("register.form.username.label")}
            </span>
            <input
              type="text"
              placeholder={t("register.form.username.placeholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-[var(--app-text)] outline-none transition placeholder:text-[var(--app-muted-text)] focus:border-[var(--app-active-text)] focus:ring-4 focus:ring-[var(--app-active-bg)]"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--app-text)]">
              {t("register.form.displayName.label")}
            </span>
            <input
              type="text"
              placeholder={t("register.form.displayName.placeholder")}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-[var(--app-text)] outline-none transition placeholder:text-[var(--app-muted-text)] focus:border-[var(--app-active-text)] focus:ring-4 focus:ring-[var(--app-active-bg)]"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--app-text)]">
              {t("register.form.email.label")}
            </span>
            <input
              type="email"
              placeholder={t("register.form.email.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-[var(--app-text)] outline-none transition placeholder:text-[var(--app-muted-text)] focus:border-[var(--app-active-text)] focus:ring-4 focus:ring-[var(--app-active-bg)]"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--app-text)]">
              {t("register.form.password.label")}
            </span>
            <input
              type="password"
              placeholder={t("register.form.password.placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-[var(--app-text)] outline-none transition placeholder:text-[var(--app-muted-text)] focus:border-[var(--app-active-text)] focus:ring-4 focus:ring-[var(--app-active-bg)]"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--app-text)]">
              {t("register.form.confirmPassword.label")}
            </span>
            <input
              type="password"
              placeholder={t("register.form.confirmPassword.placeholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-[var(--app-text)] outline-none transition placeholder:text-[var(--app-muted-text)] focus:border-[var(--app-active-text)] focus:ring-4 focus:ring-[var(--app-active-bg)]"
            />
          </label>

          {formError && (
            <p className="text-sm text-red-500">{formError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--app-active-bg)] px-4 py-3 text-sm font-semibold text-[var(--app-active-text)] shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t("register.form.submitting") : t("register.form.submit")}
          </button>
        </form>

        <p className="mt-6 text-sm text-[var(--app-muted-text)]">
          {t("register.footer.toLoginPrefix")}{" "}
          <Link
            to="/login"
            className="font-medium text-[var(--app-active-text)] hover:underline"
          >
            {t("register.footer.toLoginAction")}
          </Link>
        </p>
      </section>
    </div>
  );
}
