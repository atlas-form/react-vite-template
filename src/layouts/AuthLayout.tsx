import { Outlet } from "react-router";
import HeaderLanguageSwitcher from "@/components/header/HeaderLanguageSwitcher";
import HeaderThemeSwitcher from "@/components/header/HeaderThemeSwitcher";

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(160deg,var(--app-bg)_0%,var(--app-surface)_100%)] px-4 py-6 sm:py-10">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[color-mix(in_oklab,var(--app-active-bg)_30%,transparent)] blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[color-mix(in_oklab,var(--app-hover)_80%,transparent)] blur-3xl" />

      <div className="relative z-30 mx-auto flex w-full max-w-5xl justify-end gap-3 pb-5 sm:pb-6">
        <HeaderThemeSwitcher />
        <HeaderLanguageSwitcher />
      </div>

      <Outlet />
    </div>
  );
}
