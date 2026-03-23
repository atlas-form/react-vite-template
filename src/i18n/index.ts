import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "zhCN"],
    debug: false,
    ns: ["translation", "error"], // ✅ 命名空间列表
    defaultNS: "translation", // ✅ 默认命名空间
    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      convertDetectedLanguage: (lng) => {
        const normalized = lng.toLowerCase();
        if (normalized === "zh-cn" || normalized === "zh") {
          return "zhCN";
        }
        return lng;
      },
    },
  });

export default i18n;
