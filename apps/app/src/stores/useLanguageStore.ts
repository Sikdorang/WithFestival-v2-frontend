import i18n from '@/i18n';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  language: string;
  setLanguage: (lang: string) => void;
}

/** Shared side-effect used by setLanguage and rehydration (behavior unchanged). */
export function syncDocumentLanguage(language?: string | null) {
  if (!language) return;
  i18n.changeLanguage(language);
  document.documentElement.lang = language;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'ko',
      setLanguage: (lang) => {
        set({ language: lang });
        syncDocumentLanguage(lang);
      },
    }),
    {
      name: 'app_language',

      onRehydrateStorage: () => (state) => {
        syncDocumentLanguage(state?.language);
      },
    },
  ),
);
