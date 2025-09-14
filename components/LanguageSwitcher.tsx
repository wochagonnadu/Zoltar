
import React from 'react';
import { useI18n } from '../hooks/useI18n';

type LanguageOption = {
  code: 'en' | 'ru' | 'de';
  labelKey: string; // Key to look up in translation files
};

// Corrected labelKeys to match keys in en.json, ru.json, de.json
const languageOptions: LanguageOption[] = [
  { code: 'en', labelKey: 'languageSwitcher.en' },
  { code: 'ru', labelKey: 'languageSwitcher.ru' },
  { code: 'de', labelKey: 'languageSwitcher.de' },
];

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useI18n();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as 'en' | 'ru' | 'de');
  };

  return (
    <div className="my-4 text-center">
      <label htmlFor="language-select" className="mr-2 text-slate-300 font-medium">
        {t('languageSwitcher.select')}
      </label>
      <select
        id="language-select"
        value={language}
        onChange={handleLanguageChange}
        className="bg-slate-700 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-yellow-500 focus:outline-none shadow-md"
        aria-label={t('languageSwitcher.select')}
      >
        {languageOptions.map((option) => (
          <option key={option.code} value={option.code}>
            {t(option.labelKey)} 
          </option>
        ))}
      </select>
    </div>
  );
};
