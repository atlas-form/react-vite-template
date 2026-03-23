import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "zhCN", label: "简体中文" },
];

export default function HeaderLanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentLang = i18n.language || "en";
  const currentOption =
    LANGUAGE_OPTIONS.find((item) => item.value === currentLang) ??
    LANGUAGE_OPTIONS.find((item) => currentLang.startsWith(item.value)) ??
    LANGUAGE_OPTIONS[0];

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

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1.5 text-xs font-medium text-[var(--app-text)] shadow-sm transition hover:opacity-90"
      >
        <span>{currentOption.label}</span>
        <svg
          className={`h-4 w-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
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
          {LANGUAGE_OPTIONS.map((item) => {
            const active =
              currentLang === item.value || currentLang.startsWith(item.value);
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  void i18n.changeLanguage(item.value);
                  setOpen(false);
                }}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  active
                    ? "bg-[var(--app-active-bg)] text-[var(--app-active-text)]"
                    : "text-[var(--app-text)] hover:bg-[var(--app-active-bg)] hover:text-[var(--app-active-text)]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
