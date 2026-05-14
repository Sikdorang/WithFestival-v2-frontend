import LanguageIcon from '@/assets/icons/ic_international.svg?react';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const LANGUAGES = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
] as const;

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <motion.div
        whileTap={{ scale: 0.9 }}
        className="flex cursor-pointer items-center justify-center p-2"
      >
        <LanguageIcon onClick={() => setIsOpen((prev) => !prev)} />
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute top-full right-0 z-50 mt-2 w-32 overflow-hidden rounded-2xl border border-white/20 bg-white/80 p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md"
          >
            {LANGUAGES.map((lang) => (
              <motion.button
                key={lang.code}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelect(lang.code)}
                className={`relative block w-full rounded-xl px-4 py-2.5 text-left text-sm transition-colors ${
                  language === lang.code
                    ? 'text-primary-300 bg-primary-300/10 font-bold'
                    : 'text-gray-500-90 hover:bg-gray-100/50'
                }`}
              >
                {lang.label}
                {language === lang.code && (
                  <motion.div
                    layoutId="activeDot"
                    className="bg-primary-300 absolute top-1/2 right-3 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
