'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { JsonEditor } from '@/components/JsonEditor';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ResultsPanel } from '@/components/ResultsPanel';
import { ToneSelector } from '@/components/ToneSelector';
import { AiTranslationProgress } from '@/components/AiTranslationProgress';
import { useAiTranslation } from '@/hooks/useAiTranslation';
import { useJsonValidation } from '@/hooks/useJsonValidation';
import { Language } from '@/types';
import { Brain, Sparkles, Play, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

export default function AiTranslatorPage() {
  const [inputJson, setInputJson] = useState('{\n  "welcome": "Welcome to our app",\n  "login": "Sign in to continue",\n  "email": "Email address",\n  "password": "Password",\n  "submit": "Submit form",\n  "cancel": "Cancel action",\n  "save": "Save changes",\n  "loading": "Please wait..."\n}');
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(['es', 'fr']);

  const { isValid, error: validationError } = useJsonValidation(inputJson);
  const { 
    translations, 
    isTranslating, 
    progress, 
    error: translationError,
    tone,
    setTone,
    translateJson,
    clearTranslations 
  } = useAiTranslation();

  const handleTranslate = useCallback(async () => {
    if (!isValid || selectedLanguages.length === 0) {
      toast.error('Please provide valid JSON and select at least one language');
      return;
    }

    await translateJson(inputJson, selectedLanguages);
  }, [inputJson, selectedLanguages, isValid, translateJson]);

  const handleClear = useCallback(() => {
    setInputJson('');
    clearTranslations();
    toast.success('All data cleared');
  }, [clearTranslations]);

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
          {/* Hero Section */}
          <motion.div 
            variants={itemVariants}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center relative">
                <Brain className="w-6 h-6 text-white" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </motion.div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              AI Translator
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Context-aware JSON translation powered by Google Gemini AI
            </p>
          </motion.div>

          {/* Tone Selector */}
          <motion.div variants={itemVariants}>
            <ToneSelector selectedTone={tone} onToneChange={setTone} />
          </motion.div>

          {/* Language Selection */}
          <motion.div variants={itemVariants}>
            <LanguageSelector
              selectedLanguages={selectedLanguages}
              onLanguageChange={setSelectedLanguages}
            />
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
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-5 h-5" />
              {isTranslating ? 'Translating...' : 'AI Translate'}
            </motion.button>

            <motion.button
              onClick={handleClear}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
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
    </div>
  );
}