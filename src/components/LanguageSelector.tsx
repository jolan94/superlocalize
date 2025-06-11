'use client';

import { motion } from 'framer-motion';
import { Language, LanguageInfo } from '@/types';
import { Globe, Check } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguages: Language[];
  onLanguageChange: (languages: Language[]) => void;
}

const languageInfo: Record<Language, LanguageInfo> = {
  es: { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  fr: { code: 'fr', name: 'French', flag: '🇫🇷' },
  de: { code: 'de', name: 'German', flag: '🇩🇪' },
};

export function LanguageSelector({ selectedLanguages, onLanguageChange }: LanguageSelectorProps) {
  const handleLanguageToggle = (language: Language) => {
    if (selectedLanguages.includes(language)) {
      onLanguageChange(selectedLanguages.filter(lang => lang !== language));
    } else {
      onLanguageChange([...selectedLanguages, language]);
    }
  };

  const handleSelectAll = () => {
    const allLanguages = Object.keys(languageInfo) as Language[];
    if (selectedLanguages.length === allLanguages.length) {
      onLanguageChange([]);
    } else {
      onLanguageChange(allLanguages);
    }
  };

  const allLanguages = Object.values(languageInfo);
  const isAllSelected = selectedLanguages.length === allLanguages.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Target Languages
          </h3>
        </div>
        
        <motion.button
          onClick={handleSelectAll}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isAllSelected ? 'Deselect All' : 'Select All'}
        </motion.button>
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {allLanguages.map((lang, index) => {
          const isSelected = selectedLanguages.includes(lang.code);
          
          return (
            <motion.div
              key={lang.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="relative"
            >
              <motion.button
                onClick={() => handleLanguageToggle(lang.code)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-700/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="flex items-center gap-3">
                  {/* Custom Checkbox */}
                  <div className={`relative w-5 h-5 rounded border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-600'
                  }`}>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Flag and Language Info */}
                  <div className="flex items-center gap-2 flex-1 text-left">
                    <span className="text-2xl" role="img" aria-label={lang.name}>
                      {lang.flag}
                    </span>
                    <div>
                      <p className={`font-medium transition-colors ${
                        isSelected
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {lang.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                        {lang.code}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.button>

              {/* Selection Ring Animation */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="absolute inset-0 rounded-lg border-2 border-blue-400 pointer-events-none"
                  style={{
                    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            {selectedLanguages.length === 0 
              ? 'No languages selected'
              : `${selectedLanguages.length} language${selectedLanguages.length > 1 ? 's' : ''} selected`
            }
          </span>
          
          {selectedLanguages.length > 0 && (
            <div className="flex items-center gap-1">
              {selectedLanguages.map(lang => (
                <span 
                  key={lang} 
                  className="text-lg" 
                  role="img" 
                  aria-label={languageInfo[lang].name}
                >
                  {languageInfo[lang].flag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 