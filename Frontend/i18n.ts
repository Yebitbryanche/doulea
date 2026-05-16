import i18n, { LanguageDetectorAsyncModule } from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

const LANGUAGE_KEY = "user-language";

const languageDetector: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,

  detect: async () => {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);

    if (savedLanguage) {
      return savedLanguage;
    }

    const deviceLang =
      Localization.getLocales()[0]?.languageCode || "en";

    return deviceLang;
  },

  init: () => {},

  cacheUserLanguage: async (lng: string) => {
    await AsyncStorage.setItem(LANGUAGE_KEY, lng);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;