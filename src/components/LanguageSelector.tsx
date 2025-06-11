'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Language, LanguageInfo } from '@/types';
import { Globe, Check, Search, X, Filter, Star } from 'lucide-react';
import { useState, useMemo } from 'react';

interface LanguageSelectorProps {
  selectedLanguages: Language[];
  onLanguageChange: (languages: Language[]) => void;
}

const languageInfo: Record<Language, LanguageInfo & { popular?: boolean; region: string }> = {
  // Popular languages
  es: { code: 'es', name: 'Spanish', flag: '🇪🇸', popular: true, region: 'Europe' },
  fr: { code: 'fr', name: 'French', flag: '🇫🇷', popular: true, region: 'Europe' },
  de: { code: 'de', name: 'German', flag: '🇩🇪', popular: true, region: 'Europe' },
  it: { code: 'it', name: 'Italian', flag: '🇮🇹', popular: true, region: 'Europe' },
  pt: { code: 'pt', name: 'Portuguese', flag: '🇵🇹', popular: true, region: 'Europe' },
  zh: { code: 'zh', name: 'Chinese', flag: '🇨🇳', popular: true, region: 'Asia' },
  ja: { code: 'ja', name: 'Japanese', flag: '🇯🇵', popular: true, region: 'Asia' },
  ko: { code: 'ko', name: 'Korean', flag: '🇰🇷', popular: true, region: 'Asia' },
  ru: { code: 'ru', name: 'Russian', flag: '🇷🇺', popular: true, region: 'Europe' },
  ar: { code: 'ar', name: 'Arabic', flag: '🇸🇦', popular: true, region: 'Middle East' },
  hi: { code: 'hi', name: 'Hindi', flag: '🇮🇳', popular: true, region: 'Asia' },
  
  // Additional languages
  nl: { code: 'nl', name: 'Dutch', flag: '🇳🇱', region: 'Europe' },
  sv: { code: 'sv', name: 'Swedish', flag: '🇸🇪', region: 'Europe' },
  da: { code: 'da', name: 'Danish', flag: '🇩🇰', region: 'Europe' },
  no: { code: 'no', name: 'Norwegian', flag: '🇳🇴', region: 'Europe' },
  fi: { code: 'fi', name: 'Finnish', flag: '🇫🇮', region: 'Europe' },
  pl: { code: 'pl', name: 'Polish', flag: '🇵🇱', region: 'Europe' },
  tr: { code: 'tr', name: 'Turkish', flag: '🇹🇷', region: 'Europe' },
  th: { code: 'th', name: 'Thai', flag: '🇹🇭', region: 'Asia' },
  vi: { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', region: 'Asia' },
};

const regions = ['All', 'Europe', 'Asia', 'Middle East'];

export function LanguageSelector({ selectedLanguages, onLanguageChange }: LanguageSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [showOnlyPopular, setShowOnlyPopular] = useState(false);

  const filteredLanguages = useMemo(() => {
    let languages = Object.values(languageInfo);

    // Filter by search query
    if (searchQuery) {
      languages = languages.filter(lang => 
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by region
    if (selectedRegion !== 'All') {
      languages = languages.filter(lang => lang.region === selectedRegion);
    }

    // Filter by popularity
    if (showOnlyPopular) {
      languages = languages.filter(lang => lang.popular);
    }

    // Sort: selected first, then popular, then alphabetical
    return languages.sort((a, b) => {
      const aSelected = selectedLanguages.includes(a.code);
      const bSelected = selectedLanguages.includes(b.code);
      
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedRegion, showOnlyPopular, selectedLanguages]);

  const handleLanguageToggle = (language: Language) => {
    if (selectedLanguages.includes(language)) {
      onLanguageChange(selectedLanguages.filter(lang => lang !== language));
    } else {
      onLanguageChange([...selectedLanguages, language]);
    }
  };

  const handleSelectAll = () => {
    const visibleLanguages = filteredLanguages.map(lang => lang.code);
    const areAllSelected = visibleLanguages.every(lang => selectedLanguages.includes(lang));
    
    if (areAllSelected) {
      onLanguageChange(selectedLanguages.filter(lang => !visibleLanguages.includes(lang)));
    } else {
      onLanguageChange([...new Set([...selectedLanguages, ...visibleLanguages])]);
    }
  };

  const popularLanguages = Object.values(languageInfo).filter(lang => lang.popular);
  const areAllPopularSelected = popularLanguages.every(lang => selectedLanguages.includes(lang.code));

  const handleSelectPopular = () => {
    const popularCodes = popularLanguages.map(lang => lang.code);
    if (areAllPopularSelected) {
      onLanguageChange(selectedLanguages.filter(lang => !popularCodes.includes(lang)));
    } else {
      onLanguageChange([...new Set([...selectedLanguages, ...popularCodes])]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
              Target Languages
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Choose languages for translation
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleSelectPopular}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Star className="w-4 h-4" />
            {areAllPopularSelected ? 'Unselect' : 'Select'} Popular
          </motion.button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 text-slate-700 dark:text-slate-300"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Filters:</span>
          </div>
          
          {/* Region Filter */}
          <div className="flex items-center gap-1">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedRegion === region
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Popular Filter */}
          <button
            onClick={() => setShowOnlyPopular(!showOnlyPopular)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              showOnlyPopular
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            <Star className="w-3 h-3" />
            Popular Only
          </button>
        </div>
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
        <AnimatePresence mode="popLayout">
          {filteredLanguages.map((lang, index) => {
            const isSelected = selectedLanguages.includes(lang.code);
            
            return (
              <motion.div
                key={lang.code}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  delay: index * 0.05, 
                  duration: 0.2,
                  type: "spring",
                  stiffness: 400,
                  damping: 25
                }}
                className="relative group"
              >
                <motion.button
                  onClick={() => handleLanguageToggle(lang.code)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 group-hover:scale-[1.02] ${
                    isSelected
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 shadow-lg shadow-blue-500/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white/50 dark:bg-slate-700/30 hover:bg-white/80 dark:hover:bg-slate-700/50'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-3">
                    {/* Custom Checkbox */}
                    <div className={`relative w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500 shadow-lg shadow-blue-500/30'
                        : 'border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-600 group-hover:border-blue-400'
                    }`}>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Flag and Language Info */}
                    <div className="flex items-center gap-3 flex-1 text-left">
                      <div className="relative">
                        <span className="text-2xl" role="img" aria-label={lang.name}>
                          {lang.flag}
                        </span>
                        {lang.popular && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                            <Star className="w-1.5 h-1.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`font-semibold text-sm transition-colors truncate ${
                          isSelected
                            ? 'text-blue-700 dark:text-blue-300'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {lang.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono">
                            {lang.code}
                          </p>
                          <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {lang.region}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.button>

                {/* Selection Ring Animation */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="absolute inset-0 rounded-xl border-2 border-blue-400 pointer-events-none"
                      style={{
                        boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.2)',
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Summary and Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200/50 dark:border-slate-600/50">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {selectedLanguages.length}
            </span>
            <span className="text-slate-600 dark:text-slate-400 ml-1">
              language{selectedLanguages.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          {selectedLanguages.length > 0 && (
            <div className="flex items-center gap-1">
              {selectedLanguages.slice(0, 5).map(lang => (
                <span 
                  key={lang} 
                  className="text-lg" 
                  role="img" 
                  aria-label={languageInfo[lang].name}
                  title={languageInfo[lang].name}
                >
                  {languageInfo[lang].flag}
                </span>
              ))}
              {selectedLanguages.length > 5 && (
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  +{selectedLanguages.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        <motion.button
          onClick={handleSelectAll}
          className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {filteredLanguages.every(lang => selectedLanguages.includes(lang.code)) 
            ? 'Deselect All' 
            : 'Select All'
          }
        </motion.button>
      </div>
    </motion.div>
  );
} 