'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Globe, Check, Plus, Minus } from 'lucide-react';
import { Language } from '@/types';

interface LanguagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguages: Language[];
  onLanguageToggle: (language: Language) => void;
  onSelectAll: () => void;
  onRemoveAll: () => void;
}

const languageInfo: Record<Language, {
  name: string;
  flag: string;
  region: string;
  speakers: string;
  tier: 1 | 2 | 3;
}> = {
  // Tier 1: Most popular languages
  es: { name: 'Spanish', flag: '🇪🇸', region: 'Europe', speakers: '500M+', tier: 1 },
  fr: { name: 'French', flag: '🇫🇷', region: 'Europe', speakers: '280M+', tier: 1 },
  de: { name: 'German', flag: '🇩🇪', region: 'Europe', speakers: '100M+', tier: 1 },
  it: { name: 'Italian', flag: '🇮🇹', region: 'Europe', speakers: '65M+', tier: 1 },
  pt: { name: 'Portuguese', flag: '🇵🇹', region: 'Europe', speakers: '260M+', tier: 1 },
  zh: { name: 'Chinese', flag: '🇨🇳', region: 'Asia', speakers: '1.1B+', tier: 1 },
  ja: { name: 'Japanese', flag: '🇯🇵', region: 'Asia', speakers: '125M+', tier: 1 },
  ko: { name: 'Korean', flag: '🇰🇷', region: 'Asia', speakers: '77M+', tier: 1 },
  ru: { name: 'Russian', flag: '🇷🇺', region: 'Europe', speakers: '258M+', tier: 1 },
  ar: { name: 'Arabic', flag: '🇸🇦', region: 'Middle East', speakers: '422M+', tier: 1 },
  hi: { name: 'Hindi', flag: '🇮🇳', region: 'Asia', speakers: '602M+', tier: 1 },

  // Tier 2: Popular languages
  bn: { name: 'Bengali', flag: '🇧🇩', region: 'Asia', speakers: '265M+', tier: 2 },
  ur: { name: 'Urdu', flag: '🇵🇰', region: 'Asia', speakers: '170M+', tier: 2 },
  id: { name: 'Indonesian', flag: '🇮🇩', region: 'Asia', speakers: '199M+', tier: 2 },
  ms: { name: 'Malay', flag: '🇲🇾', region: 'Asia', speakers: '77M+', tier: 2 },
  ta: { name: 'Tamil', flag: '🇮🇳', region: 'Asia', speakers: '75M+', tier: 2 },
  te: { name: 'Telugu', flag: '🇮🇳', region: 'Asia', speakers: '74M+', tier: 2 },
  mr: { name: 'Marathi', flag: '🇮🇳', region: 'Asia', speakers: '72M+', tier: 2 },
  gu: { name: 'Gujarati', flag: '🇮🇳', region: 'Asia', speakers: '56M+', tier: 2 },
  pa: { name: 'Punjabi', flag: '🇮🇳', region: 'Asia', speakers: '113M+', tier: 2 },
  uk: { name: 'Ukrainian', flag: '🇺🇦', region: 'Europe', speakers: '40M+', tier: 2 },
  ro: { name: 'Romanian', flag: '🇷🇴', region: 'Europe', speakers: '24M+', tier: 2 },
  el: { name: 'Greek', flag: '🇬🇷', region: 'Europe', speakers: '13M+', tier: 2 },
  he: { name: 'Hebrew', flag: '🇮🇱', region: 'Middle East', speakers: '9M+', tier: 2 },
  cs: { name: 'Czech', flag: '🇨🇿', region: 'Europe', speakers: '10M+', tier: 2 },
  hu: { name: 'Hungarian', flag: '🇭🇺', region: 'Europe', speakers: '13M+', tier: 2 },
  bg: { name: 'Bulgarian', flag: '🇧🇬', region: 'Europe', speakers: '9M+', tier: 2 },
  hr: { name: 'Croatian', flag: '🇭🇷', region: 'Europe', speakers: '5M+', tier: 2 },
  sk: { name: 'Slovak', flag: '🇸🇰', region: 'Europe', speakers: '5M+', tier: 2 },
  sl: { name: 'Slovenian', flag: '🇸🇮', region: 'Europe', speakers: '2M+', tier: 2 },
  lt: { name: 'Lithuanian', flag: '🇱🇹', region: 'Europe', speakers: '3M+', tier: 2 },
  lv: { name: 'Latvian', flag: '🇱🇻', region: 'Europe', speakers: '2M+', tier: 2 },
  et: { name: 'Estonian', flag: '🇪🇪', region: 'Europe', speakers: '1M+', tier: 2 },
  sw: { name: 'Swahili', flag: '🇰🇪', region: 'Africa', speakers: '16M+', tier: 2 },
  am: { name: 'Amharic', flag: '🇪🇹', region: 'Africa', speakers: '32M+', tier: 2 },
  yo: { name: 'Yoruba', flag: '🇳🇬', region: 'Africa', speakers: '20M+', tier: 2 },
  ig: { name: 'Igbo', flag: '🇳🇬', region: 'Africa', speakers: '24M+', tier: 2 },
  ha: { name: 'Hausa', flag: '🇳🇬', region: 'Africa', speakers: '70M+', tier: 2 },
  fa: { name: 'Persian', flag: '🇮🇷', region: 'Middle East', speakers: '70M+', tier: 2 },
  uz: { name: 'Uzbek', flag: '🇺🇿', region: 'Asia', speakers: '34M+', tier: 2 },
  kk: { name: 'Kazakh', flag: '🇰🇿', region: 'Asia', speakers: '13M+', tier: 2 },
  az: { name: 'Azerbaijani', flag: '🇦🇿', region: 'Asia', speakers: '23M+', tier: 2 },
  ky: { name: 'Kyrgyz', flag: '🇰🇬', region: 'Asia', speakers: '4M+', tier: 2 },

  // Tier 3: Additional languages
  nl: { name: 'Dutch', flag: '🇳🇱', region: 'Europe', speakers: '24M+', tier: 3 },
  sv: { name: 'Swedish', flag: '🇸🇪', region: 'Europe', speakers: '10M+', tier: 3 },
  da: { name: 'Danish', flag: '🇩🇰', region: 'Europe', speakers: '6M+', tier: 3 },
  no: { name: 'Norwegian', flag: '🇳🇴', region: 'Europe', speakers: '5M+', tier: 3 },
  fi: { name: 'Finnish', flag: '🇫🇮', region: 'Europe', speakers: '5M+', tier: 3 },
  pl: { name: 'Polish', flag: '🇵🇱', region: 'Europe', speakers: '45M+', tier: 3 },
  tr: { name: 'Turkish', flag: '🇹🇷', region: 'Europe', speakers: '88M+', tier: 3 },
  th: { name: 'Thai', flag: '🇹🇭', region: 'Asia', speakers: '61M+', tier: 3 },
  vi: { name: 'Vietnamese', flag: '🇻🇳', region: 'Asia', speakers: '85M+', tier: 3 },
  ca: { name: 'Catalan', flag: '🇪🇸', region: 'Europe', speakers: '10M+', tier: 3 },
  eu: { name: 'Basque', flag: '🇪🇸', region: 'Europe', speakers: '750K+', tier: 3 },
  gl: { name: 'Galician', flag: '🇪🇸', region: 'Europe', speakers: '2M+', tier: 3 },
  is: { name: 'Icelandic', flag: '🇮🇸', region: 'Europe', speakers: '314K+', tier: 3 },
  mt: { name: 'Maltese', flag: '🇲🇹', region: 'Europe', speakers: '520K+', tier: 3 },
  cy: { name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', region: 'Europe', speakers: '562K+', tier: 3 },
  ga: { name: 'Irish', flag: '🇮🇪', region: 'Europe', speakers: '170K+', tier: 3 },
  sq: { name: 'Albanian', flag: '🇦🇱', region: 'Europe', speakers: '6M+', tier: 3 },
  mk: { name: 'Macedonian', flag: '🇲🇰', region: 'Europe', speakers: '2M+', tier: 3 },
  be: { name: 'Belarusian', flag: '🇧🇾', region: 'Europe', speakers: '5M+', tier: 3 },
  ka: { name: 'Georgian', flag: '🇬🇪', region: 'Asia', speakers: '4M+', tier: 3 },
  hy: { name: 'Armenian', flag: '🇦🇲', region: 'Asia', speakers: '7M+', tier: 3 },
  ne: { name: 'Nepali', flag: '🇳🇵', region: 'Asia', speakers: '16M+', tier: 3 },
  si: { name: 'Sinhala', flag: '🇱🇰', region: 'Asia', speakers: '17M+', tier: 3 },
  my: { name: 'Burmese', flag: '🇲🇲', region: 'Asia', speakers: '33M+', tier: 3 },
  km: { name: 'Khmer', flag: '🇰🇭', region: 'Asia', speakers: '16M+', tier: 3 },
  lo: { name: 'Lao', flag: '🇱🇦', region: 'Asia', speakers: '7M+', tier: 3 },
  mn: { name: 'Mongolian', flag: '🇲🇳', region: 'Asia', speakers: '5M+', tier: 3 },
  bo: { name: 'Tibetan', flag: '🇨🇳', region: 'Asia', speakers: '1M+', tier: 3 },
  dz: { name: 'Dzongkha', flag: '🇧🇹', region: 'Asia', speakers: '171K+', tier: 3 },
  ml: { name: 'Malayalam', flag: '🇮🇳', region: 'Asia', speakers: '34M+', tier: 3 },
  kn: { name: 'Kannada', flag: '🇮🇳', region: 'Asia', speakers: '44M+', tier: 3 },
  or: { name: 'Odia', flag: '🇮🇳', region: 'Asia', speakers: '38M+', tier: 3 }
};

export function LanguagePopup({
  isOpen,
  onClose,
  selectedLanguages,
  onLanguageToggle,
  onSelectAll,
  onRemoveAll
}: LanguagePopupProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion] = useState<string>('all');
  const [popularityFilter, setPopularityFilter] = useState<'all' | 'popular' | 'common'>('all');

  const allLanguages = useMemo(() => {
    return Object.entries(languageInfo).map(([code, info]) => ({
      code: code as Language,
      ...info
    }));
  }, []);

  const filteredLanguages = useMemo(() => {
    return allLanguages
      .filter(lang => {
        const matchesSearch = lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            lang.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = selectedRegion === 'all' || lang.region.toLowerCase().includes(selectedRegion.toLowerCase());
        const matchesPopularity = popularityFilter === 'all' ||
                                (popularityFilter === 'popular' && lang.tier === 1) ||
                                (popularityFilter === 'common' && lang.tier <= 2);
        return matchesSearch && matchesRegion && matchesPopularity;
      })
      .sort((a, b) => {
        // Sort by tier first, then by name
        if (a.tier !== b.tier) return a.tier - b.tier;
        return a.name.localeCompare(b.name);
      });
  }, [allLanguages, searchQuery, selectedRegion, popularityFilter]);

  const isLanguageSelected = (language: Language) => {
    return selectedLanguages.includes(language);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Popup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] mx-4 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                Select Languages
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Controls */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 space-y-4">
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onSelectAll}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Select All
              </button>
              <button
                onClick={onRemoveAll}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Minus className="w-4 h-4" />
                Remove All
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={popularityFilter}
                onChange={(e) => setPopularityFilter(e.target.value as 'all' | 'popular' | 'common')}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm"
              >
                <option value="all">All Languages</option>
                <option value="popular">Most Popular</option>
                <option value="common">Common Languages</option>
              </select>
            </div>
          </div>

          {/* Language Grid */}
          <div className="p-6 overflow-y-auto max-h-96">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredLanguages.map((language) => {
                const isSelected = isLanguageSelected(language.code);
                return (
                  <motion.button
                    key={language.code}
                    onClick={() => onLanguageToggle(language.code)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left relative ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white dark:bg-slate-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{language.flag}</span>
                        <div>
                          <div className={`font-medium text-sm ${
                            isSelected
                              ? 'text-blue-700 dark:text-blue-300'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {language.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {language.speakers} speakers
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {selectedLanguages.length} language{selectedLanguages.length !== 1 ? 's' : ''} selected
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}