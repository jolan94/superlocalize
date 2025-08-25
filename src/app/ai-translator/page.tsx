'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { JsonEditor } from '@/components/JsonEditor';
import { FileDropZone } from '@/components/FileDropZone';
import { LanguagePopup } from '@/components/LanguagePopup';
import { ResultsPanel } from '@/components/ResultsPanel';
import { ToneSelector } from '@/components/ToneSelector';
import { AiTranslationProgress } from '@/components/AiTranslationProgress';
import { useEnhancedAiTranslation } from '@/hooks/useEnhancedAiTranslation';
import { useJsonValidation } from '@/hooks/useJsonValidation';
import { Language } from '@/types';
import { Play, RotateCcw, Zap, Layers, Globe, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

export default function AiTranslatorPage() {
  const [inputJson, setInputJson] = useState('{\n  "welcome": "Welcome to our app",\n  "login": "Sign in to continue",\n  "email": "Email address",\n  "password": "Password",\n  "submit": "Submit form",\n  "cancel": "Cancel action",\n  "save": "Save changes",\n  "loading": "Please wait..."\n}');
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(['es', 'fr']);
  const [translationMode, setTranslationMode] = useState<'batch' | 'stream'>('batch');
  const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);

  const { isValid, error: validationError } = useJsonValidation(inputJson);
  const { 
    translations, 
    isTranslating, 
    progress, 
    error: translationError,
    tone,
    setTone,
    translateJsonBatch,
    translateJsonStream,
    clearTranslations 
  } = useEnhancedAiTranslation();

  const handleTranslate = useCallback(async () => {
    if (!isValid || selectedLanguages.length === 0) {
      toast.error('Please provide valid JSON and select at least one language');
      return;
    }

    if (translationMode === 'batch') {
      await translateJsonBatch(inputJson, selectedLanguages);
    } else {
      await translateJsonStream(inputJson, selectedLanguages);
    }
  }, [inputJson, selectedLanguages, isValid, translationMode, translateJsonBatch, translateJsonStream]);

  const handleClear = useCallback(() => {
    setInputJson('');
    clearTranslations();
    toast.success('All data cleared');
  }, [clearTranslations]);

  const handleLanguageToggle = useCallback((language: Language) => {
    setSelectedLanguages(prev => 
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  }, []);

  const handleSelectAllLanguages = useCallback(() => {
    // Add all available languages from the Language type
    const allLanguages: Language[] = [
      'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ru', 'ar', 'hi',
      'bn', 'ur', 'id', 'ms', 'ta', 'te', 'mr', 'gu', 'pa', 'uk', 'ro',
      'el', 'he', 'cs', 'hu', 'bg', 'hr', 'sk', 'sl', 'lt', 'lv', 'et',
      'sw', 'am', 'yo', 'ig', 'ha', 'fa', 'uz', 'kk', 'az', 'ky',
      'nl', 'sv', 'da', 'no', 'fi', 'pl', 'tr', 'th', 'vi', 'ca', 'eu',
      'gl', 'is', 'mt', 'cy', 'ga', 'sq', 'mk', 'be', 'ka', 'hy',
      'ne', 'si', 'my', 'km', 'lo', 'mn', 'bo', 'dz', 'ml', 'kn', 'or'
    ];
    setSelectedLanguages(allLanguages);
    toast.success('All languages selected');
  }, []);

  const handleRemoveAllLanguages = useCallback(() => {
    setSelectedLanguages([]);
    toast.success('All languages removed');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50 dark:from-slate-900 dark:via-purple-900/10 dark:to-indigo-900/20 overflow-hidden">
      {/* Minimal background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <Header />
      
      <main className="container mx-auto px-6 py-8 max-w-6xl relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Tone Selector - moved up and made more compact */}
          <motion.div variants={itemVariants}>
            <ToneSelector selectedTone={tone} onToneChange={setTone} />
          </motion.div>



          {/* Translation Mode Selector */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-center">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-1 shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setTranslationMode('batch')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      translationMode === 'batch'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    Batch Mode
                  </button>
                  <button
                    onClick={() => setTranslationMode('stream')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      translationMode === 'stream'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    Stream Mode
                  </button>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-2">
              {translationMode === 'batch' 
                ? 'Process all languages in a single optimized API call'
                : 'Stream translations one language at a time for real-time feedback'
              }
            </p>
          </motion.div>

          {/* Language Selection */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-center">
              <button
                onClick={() => setIsLanguagePopupOpen(true)}
                className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Globe className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    Target Languages
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {selectedLanguages.length} language{selectedLanguages.length !== 1 ? 's' : ''} selected
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center justify-center gap-4"
          >
            <motion.button
              onClick={handleTranslate}
              disabled={!isValid || selectedLanguages.length === 0 || isTranslating}
              className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              <Play className="w-5 h-5" />
              {isTranslating ? 'Translating...' : `Enhanced AI Translate (${translationMode})`}
            </motion.button>

            <motion.button
              onClick={handleClear}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              <RotateCcw className="w-4 h-4" />
              Clear
            </motion.button>
          </motion.div>

          {/* Translation Progress */}
          <AnimatePresence>
            {isTranslating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AiTranslationProgress progress={progress} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Display */}
          {(validationError || translationError) && (
            <motion.div 
              variants={itemVariants}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
            >
              <p className="text-red-600 dark:text-red-400 text-sm">
                {validationError || translationError}
              </p>
            </motion.div>
          )}

          {/* Main Content */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* JSON Editor */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"></div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                  Source JSON
                </h2>
              </div>
              
              {/* File Drop Zone */}
              <FileDropZone
                onFileContent={setInputJson}
                className="mb-4"
              />
              
              <JsonEditor
                value={inputJson}
                onChange={setInputJson}
                isValid={isValid}
                error={validationError}
              />
            </div>

            {/* Results Panel */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                  AI Translations
                </h2>
              </div>
              
              <ResultsPanel 
                translations={translations} 
                selectedLanguages={selectedLanguages}
                originalJson={inputJson}
              />
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Language Selection Popup */}
      <LanguagePopup
        isOpen={isLanguagePopupOpen}
        onClose={() => setIsLanguagePopupOpen(false)}
        selectedLanguages={selectedLanguages}
        onLanguageToggle={handleLanguageToggle}
        onSelectAll={handleSelectAllLanguages}
        onRemoveAll={handleRemoveAllLanguages}
      />
    </div>
  );
}