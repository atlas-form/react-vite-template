import { useTranslation } from "react-i18next";
import S3UploadPanel from "@/components/S3UploadPanel";

export default function Home() {
  const { t, i18n } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{t("welcome")}</h1>
      <p className="mt-2 text-gray-600">{t("description")}</p>

      <div className="mt-4 space-x-4">
        <button
          type="button"
          onClick={() => i18n.changeLanguage("zhCN")}
          className="rounded border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1 hover:bg-[var(--app-hover)]"
        >
          {t("header.language.zhCN")}
        </button>
        <button
          type="button"
          onClick={() => i18n.changeLanguage("en")}
          className="rounded border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1 hover:bg-[var(--app-hover)]"
        >
          {t("header.language.en")}
        </button>
      </div>

      <S3UploadPanel />
    </div>
  );
}
