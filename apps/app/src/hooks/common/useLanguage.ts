import { useEffect, useState } from 'react';

const LANGUAGE_STORAGE_KEY = 'app_language';

export const useLanguage = () => {
  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'ko';
  });

  const setLanguage = (langCode: string) => {
    setLanguageState(langCode);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, langCode);
    // TODO: i18next 등 다국어 라이브러리의 언어 변경 API 호출 연동
    // document.documentElement.lang = langCode; // DOM 언어 속성 동기화
  };

  // 탭 간 로컬 스토리지 동기화 (옵션)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LANGUAGE_STORAGE_KEY && e.newValue) {
        setLanguageState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { language, setLanguage };
};
