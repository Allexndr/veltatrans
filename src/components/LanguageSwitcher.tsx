'use client';

import {useLocale} from 'next-intl';
import {useRouter, usePathname} from '@/i18n/routing';
import {useState} from 'react';

const languages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'kz', name: 'Қазақша', flag: '🇰🇿' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === locale);

  const handleLanguageChange = (languageCode: string) => {
    // Используем router для правильного переключения языков
    router.replace(pathname, {locale: languageCode});
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-velta-900 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors rounded-lg hover:bg-gray-50 active:scale-95 touch-manipulation"
        aria-label="Переключить язык"
      >
        <span className="text-sm sm:text-base">{currentLanguage?.flag}</span>
        <span className="hidden sm:inline text-xs sm:text-sm font-medium">{currentLanguage?.code.toUpperCase()}</span>
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-xl z-50 border border-gray-200 overflow-hidden">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`flex items-center w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm hover:bg-gray-50 transition-colors ${
                  locale === language.code ? 'bg-velta-50 text-velta-900 font-medium' : 'text-gray-700'
                }`}
              >
                <span className="mr-2 sm:mr-3 text-sm sm:text-base">{language.flag}</span>
                <span className="truncate">{language.name}</span>
                {locale === language.code && (
                  <svg className="ml-auto w-3 h-3 sm:w-4 sm:h-4 text-velta-900 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
