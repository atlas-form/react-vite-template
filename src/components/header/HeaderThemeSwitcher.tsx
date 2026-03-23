import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getStoredThemeMode, setThemeMode, type ThemeMode } from "@/theme";

const THEME_OPTIONS: Array<{ value: ThemeMode; key: string }> = [
  { value: "system", key: "header.theme.system" },
  { value: "light", key: "header.theme.light" },
  { value: "dark", key: "header.theme.dark" },
];

export default function HeaderThemeSwitcher() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(getStoredThemeMode());
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  const currentOption =
    THEME_OPTIONS.find((item) => item.value === theme) ?? THEME_OPTIONS[0];

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1.5 text-xs font-medium text-[var(--app-text)] shadow-sm transition hover:opacity-90"
      >
        <span>{t(currentOption.key)}</span>
        <svg
          className={`h-4 w-4 text-[var(--app-muted-text)] transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 011.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-1 shadow-lg">
          {THEME_OPTIONS.map((item) => {
            const active = theme === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setTheme(item.value);
                  setThemeMode(item.value);
                  setOpen(false);
                }}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  active
                    ? "bg-[var(--app-active-bg)] text-[var(--app-active-text)]"
                    : "text-[var(--app-text)] hover:bg-[var(--app-active-bg)] hover:text-[var(--app-active-text)]"
                }`}
              >
                {t(item.key)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
