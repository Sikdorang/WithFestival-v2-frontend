import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGE_STORAGE_KEY = 'app_language';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'ko';
  });

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
      document.documentElement.lang = language;
    }
  }, [i18n, language]);

  const setLanguage = (langCode: string) => {
    setLanguageState(langCode);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, langCode);

    i18n.changeLanguage(langCode);
    document.documentElement.lang = langCode;
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LANGUAGE_STORAGE_KEY && e.newValue) {
        setLanguageState(e.newValue);
        i18n.changeLanguage(e.newValue);
        document.documentElement.lang = e.newValue;
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [i18n]);

  return { language, setLanguage };
};
