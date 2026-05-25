import i18n from '@/i18n';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  language: string;
  setLanguage: (lang: string) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'ko',
      setLanguage: (lang) => {
        set({ language: lang });
        i18n.changeLanguage(lang);
        document.documentElement.lang = lang;
      },
    }),
    {
      name: 'app_language',

      onRehydrateStorage: () => (state) => {
        if (state && state.language) {
          i18n.changeLanguage(state.language);
          document.documentElement.lang = state.language;
        }
      },
    },
  ),
);
