export type ThemeMode = "system" | "light" | "dark";

const THEME_STORAGE_KEY = "app_theme";

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(mode: ThemeMode): "light" | "dark" {
  return mode === "system" ? getSystemTheme() : mode;
}

export function getStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "system";
  const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (raw === "light" || raw === "dark" || raw === "system") return raw;
  return "system";
}

export function applyTheme(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const resolved = resolveTheme(mode);

  root.setAttribute("data-theme", resolved);
  root.setAttribute("data-theme-mode", mode);
}

export function setThemeMode(mode: ThemeMode): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  }
  applyTheme(mode);
}

export function initTheme(): () => void {
  if (typeof window === "undefined") return () => {};

  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const onSystemThemeChange = () => {
    if (getStoredThemeMode() === "system") {
      applyTheme("system");
    }
  };

  applyTheme(getStoredThemeMode());
  media.addEventListener("change", onSystemThemeChange);

  return () => {
    media.removeEventListener("change", onSystemThemeChange);
  };
}
