'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Language, LanguageInfo } from '@/types';
import { Globe, Check, Search, X, Filter, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';

interface LanguageSelectorProps {
  selectedLanguages: Language[];
  onLanguageChange: (languages: Language[]) => void;
}

const languageInfo: Record<Language, LanguageInfo & { tier: 1 | 2 | 3; region: string; speakers?: string }> = {
  // Tier 1: Most popular languages (shown by default)
  es: { code: 'es', name: 'Spanish', flag: '🇪🇸', tier: 1, region: 'Europe', speakers: '500M+' },
  fr: { code: 'fr', name: 'French', flag: '🇫🇷', tier: 1, region: 'Europe', speakers: '280M+' },
  de: { code: 'de', name: 'German', flag: '🇩🇪', tier: 1, region: 'Europe', speakers: '100M+' },
  it: { code: 'it', name: 'Italian', flag: '🇮🇹', tier: 1, region: 'Europe', speakers: '65M+' },
  pt: { code: 'pt', name: 'Portuguese', flag: '🇵🇹', tier: 1, region: 'Europe', speakers: '260M+' },
  zh: { code: 'zh', name: 'Chinese', flag: '🇨🇳', tier: 1, region: 'Asia', speakers: '1.1B+' },
  ja: { code: 'ja', name: 'Japanese', flag: '🇯🇵', tier: 1, region: 'Asia', speakers: '125M+' },
  ko: { code: 'ko', name: 'Korean', flag: '🇰🇷', tier: 1, region: 'Asia', speakers: '77M+' },
  ru: { code: 'ru', name: 'Russian', flag: '🇷🇺', tier: 1, region: 'Europe', speakers: '258M+' },
  ar: { code: 'ar', name: 'Arabic', flag: '🇸🇦', tier: 1, region: 'Middle East', speakers: '422M+' },
  hi: { code: 'hi', name: 'Hindi', flag: '🇮🇳', tier: 1, region: 'Asia', speakers: '602M+' },

  // Tier 2: Popular languages (expandable section)
  bn: { code: 'bn', name: 'Bengali', flag: '🇧🇩', tier: 2, region: 'Asia', speakers: '265M+' },
  ur: { code: 'ur', name: 'Urdu', flag: '🇵🇰', tier: 2, region: 'Asia', speakers: '170M+' },
  id: { code: 'id', name: 'Indonesian', flag: '🇮🇩', tier: 2, region: 'Asia', speakers: '199M+' },
  ms: { code: 'ms', name: 'Malay', flag: '🇲🇾', tier: 2, region: 'Asia', speakers: '77M+' },
  ta: { code: 'ta', name: 'Tamil', flag: '🇮🇳', tier: 2, region: 'Asia', speakers: '75M+' },
  te: { code: 'te', name: 'Telugu', flag: '🇮🇳', tier: 2, region: 'Asia', speakers: '74M+' },
  mr: { code: 'mr', name: 'Marathi', flag: '🇮🇳', tier: 2, region: 'Asia', speakers: '72M+' },
  gu: { code: 'gu', name: 'Gujarati', flag: '🇮🇳', tier: 2, region: 'Asia', speakers: '56M+' },
  pa: { code: 'pa', name: 'Punjabi', flag: '🇮🇳', tier: 2, region: 'Asia', speakers: '113M+' },
  uk: { code: 'uk', name: 'Ukrainian', flag: '🇺🇦', tier: 2, region: 'Europe', speakers: '40M+' },
  ro: { code: 'ro', name: 'Romanian', flag: '🇷🇴', tier: 2, region: 'Europe', speakers: '24M+' },
  el: { code: 'el', name: 'Greek', flag: '🇬🇷', tier: 2, region: 'Europe', speakers: '13M+' },
  he: { code: 'he', name: 'Hebrew', flag: '🇮🇱', tier: 2, region: 'Middle East', speakers: '9M+' },
  cs: { code: 'cs', name: 'Czech', flag: '🇨🇿', tier: 2, region: 'Europe', speakers: '10M+' },
  hu: { code: 'hu', name: 'Hungarian', flag: '🇭🇺', tier: 2, region: 'Europe', speakers: '13M+' },
  bg: { code: 'bg', name: 'Bulgarian', flag: '🇧🇬', tier: 2, region: 'Europe', speakers: '9M+' },
  hr: { code: 'hr', name: 'Croatian', flag: '🇭🇷', tier: 2, region: 'Europe', speakers: '5M+' },
  sk: { code: 'sk', name: 'Slovak', flag: '🇸🇰', tier: 2, region: 'Europe', speakers: '5M+' },
  sl: { code: 'sl', name: 'Slovenian', flag: '🇸🇮', tier: 2, region: 'Europe', speakers: '2M+' },
  lt: { code: 'lt', name: 'Lithuanian', flag: '🇱🇹', tier: 2, region: 'Europe', speakers: '3M+' },
  lv: { code: 'lv', name: 'Latvian', flag: '🇱🇻', tier: 2, region: 'Europe', speakers: '2M+' },
  et: { code: 'et', name: 'Estonian', flag: '🇪🇪', tier: 2, region: 'Europe', speakers: '1M+' },
  sw: { code: 'sw', name: 'Swahili', flag: '🇰🇪', tier: 2, region: 'Africa', speakers: '16M+' },
  am: { code: 'am', name: 'Amharic', flag: '🇪🇹', tier: 2, region: 'Africa', speakers: '32M+' },
  yo: { code: 'yo', name: 'Yoruba', flag: '🇳🇬', tier: 2, region: 'Africa', speakers: '20M+' },
  ig: { code: 'ig', name: 'Igbo', flag: '🇳🇬', tier: 2, region: 'Africa', speakers: '24M+' },
  ha: { code: 'ha', name: 'Hausa', flag: '🇳🇬', tier: 2, region: 'Africa', speakers: '70M+' },
  fa: { code: 'fa', name: 'Persian', flag: '🇮🇷', tier: 2, region: 'Middle East', speakers: '70M+' },
  uz: { code: 'uz', name: 'Uzbek', flag: '🇺🇿', tier: 2, region: 'Asia', speakers: '34M+' },
  kk: { code: 'kk', name: 'Kazakh', flag: '🇰🇿', tier: 2, region: 'Asia', speakers: '13M+' },
  az: { code: 'az', name: 'Azerbaijani', flag: '🇦🇿', tier: 2, region: 'Asia', speakers: '23M+' },
  ky: { code: 'ky', name: 'Kyrgyz', flag: '🇰🇬', tier: 2, region: 'Asia', speakers: '4M+' },

  // Tier 3: Additional languages (expandable section)
  nl: { code: 'nl', name: 'Dutch', flag: '🇳🇱', tier: 3, region: 'Europe', speakers: '24M+' },
  sv: { code: 'sv', name: 'Swedish', flag: '🇸🇪', tier: 3, region: 'Europe', speakers: '10M+' },
  da: { code: 'da', name: 'Danish', flag: '🇩🇰', tier: 3, region: 'Europe', speakers: '6M+' },
  no: { code: 'no', name: 'Norwegian', flag: '🇳🇴', tier: 3, region: 'Europe', speakers: '5M+' },
  fi: { code: 'fi', name: 'Finnish', flag: '🇫🇮', tier: 3, region: 'Europe', speakers: '5M+' },
  pl: { code: 'pl', name: 'Polish', flag: '🇵🇱', tier: 3, region: 'Europe', speakers: '45M+' },
  tr: { code: 'tr', name: 'Turkish', flag: '🇹🇷', tier: 3, region: 'Europe', speakers: '88M+' },
  th: { code: 'th', name: 'Thai', flag: '🇹🇭', tier: 3, region: 'Asia', speakers: '61M+' },
  vi: { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', tier: 3, region: 'Asia', speakers: '85M+' },
  ca: { code: 'ca', name: 'Catalan', flag: '🇪🇸', tier: 3, region: 'Europe', speakers: '10M+' },
  eu: { code: 'eu', name: 'Basque', flag: '🇪🇸', tier: 3, region: 'Europe', speakers: '750K+' },
  gl: { code: 'gl', name: 'Galician', flag: '🇪🇸', tier: 3, region: 'Europe', speakers: '2M+' },
  is: { code: 'is', name: 'Icelandic', flag: '🇮🇸', tier: 3, region: 'Europe', speakers: '314K+' },
  mt: { code: 'mt', name: 'Maltese', flag: '🇲🇹', tier: 3, region: 'Europe', speakers: '520K+' },
  cy: { code: 'cy', name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', tier: 3, region: 'Europe', speakers: '562K+' },
  ga: { code: 'ga', name: 'Irish', flag: '🇮🇪', tier: 3, region: 'Europe', speakers: '170K+' },
  sq: { code: 'sq', name: 'Albanian', flag: '🇦🇱', tier: 3, region: 'Europe', speakers: '6M+' },
  mk: { code: 'mk', name: 'Macedonian', flag: '🇲🇰', tier: 3, region: 'Europe', speakers: '2M+' },
  be: { code: 'be', name: 'Belarusian', flag: '🇧🇾', tier: 3, region: 'Europe', speakers: '5M+' },
  ka: { code: 'ka', name: 'Georgian', flag: '🇬🇪', tier: 3, region: 'Asia', speakers: '4M+' },
  hy: { code: 'hy', name: 'Armenian', flag: '🇦🇲', tier: 3, region: 'Asia', speakers: '7M+' },
  ne: { code: 'ne', name: 'Nepali', flag: '🇳🇵', tier: 3, region: 'Asia', speakers: '16M+' },
  si: { code: 'si', name: 'Sinhala', flag: '🇱🇰', tier: 3, region: 'Asia', speakers: '17M+' },
  my: { code: 'my', name: 'Burmese', flag: '🇲🇲', tier: 3, region: 'Asia', speakers: '33M+' },
  km: { code: 'km', name: 'Khmer', flag: '🇰🇭', tier: 3, region: 'Asia', speakers: '16M+' },
  lo: { code: 'lo', name: 'Lao', flag: '🇱🇦', tier: 3, region: 'Asia', speakers: '7M+' },
  mn: { code: 'mn', name: 'Mongolian', flag: '🇲🇳', tier: 3, region: 'Asia', speakers: '5M+' },
  bo: { code: 'bo', name: 'Tibetan', flag: '🇨🇳', tier: 3, region: 'Asia', speakers: '1M+' },
  dz: { code: 'dz', name: 'Dzongkha', flag: '🇧🇹', tier: 3, region: 'Asia', speakers: '171K+' },
  ml: { code: 'ml', name: 'Malayalam', flag: '🇮🇳', tier: 3, region: 'Asia', speakers: '34M+' },
  kn: { code: 'kn', name: 'Kannada', flag: '🇮🇳', tier: 3, region: 'Asia', speakers: '44M+' },
  or: { code: 'or', name: 'Odia', flag: '🇮🇳', tier: 3, region: 'Asia', speakers: '38M+' },
};

const regions = ['All', 'Europe', 'Asia', 'Middle East', 'Africa'];

export function LanguageSelector({ selectedLanguages, onLanguageChange }: LanguageSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [showOnlyPopular, setShowOnlyPopular] = useState(false);
  const [showExpandedLanguages, setShowExpandedLanguages] = useState(true);

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

    // Filter by popularity (tier 1 only)
    if (showOnlyPopular) {
      languages = languages.filter(lang => lang.tier === 1);
    }

    // Filter by tier visibility (if not searching and not showing expanded)
    if (!searchQuery && !showExpandedLanguages && !showOnlyPopular) {
      languages = languages.filter(lang => lang.tier <= 2); // Show tier 1 and 2 by default
    }

    // Sort: selected first, then by tier, then alphabetical
    return languages.sort((a, b) => {
      const aSelected = selectedLanguages.includes(a.code);
      const bSelected = selectedLanguages.includes(b.code);
      
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      
      if (a.tier !== b.tier) return a.tier - b.tier;
      
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedRegion, showOnlyPopular, selectedLanguages, showExpandedLanguages]);

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

  const popularLanguages = Object.values(languageInfo).filter(lang => lang.tier === 1);
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
            {areAllPopularSelected ? 'Unselect' : 'Select'} Most Popular
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
            Most Popular Only
          </button>

          {/* Show More Languages Toggle */}
          {!searchQuery && !showOnlyPopular && (
            <button
              onClick={() => setShowExpandedLanguages(!showExpandedLanguages)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                showExpandedLanguages
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {showExpandedLanguages ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {showExpandedLanguages ? 'Show Less' : 'Show More Languages'}
            </button>
          )}
        </div>
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 mb-6">
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
                  delay: index * 0.02, 
                  duration: 0.15,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                className="relative group"
              >
                <motion.button
                  onClick={() => handleLanguageToggle(lang.code)}
                  className={`w-full p-2 rounded-lg border transition-all duration-200 group-hover:scale-[1.01] ${
                    isSelected
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white/70 dark:bg-slate-700/30 hover:bg-white dark:hover:bg-slate-700/50'
                  }`}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    {/* Custom Checkbox */}
                    <div className={`relative w-4 h-4 rounded-full border transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
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
                            <Check className="w-2.5 h-2.5 text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Flag and Language Info */}
                    <div className="flex items-center gap-2 flex-1 text-left">
                      <div className="relative">
                        <span className="text-lg" role="img" aria-label={lang.name}>
                          {lang.flag}
                        </span>
                        {lang.tier === 1 && (
                          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full flex items-center justify-center">
                            <Star className="w-1 h-1 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`font-medium text-xs transition-colors truncate ${
                          isSelected
                            ? 'text-blue-700 dark:text-blue-300'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {lang.name}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">
                          {lang.code}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.button>

                {/* Selection Ring Animation */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="absolute inset-0 rounded-lg border border-blue-300 pointer-events-none"
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