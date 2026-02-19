import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        setting: "setting",
        monitoring: "monitornig",
        welcomeMess: "Welcome to React {{user}}",
      },
    },
    fa: {
      translation: {
        setting: "تنظیمات",
        monitoring: "پایش",
        welcomeMess: "به React خوش آمدید {{user}}",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
