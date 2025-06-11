'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { JsonEditor } from '@/components/JsonEditor';
import { LanguageSelector } from '@/components/LanguageSelector';
import { TranslationProgress } from '@/components/TranslationProgress';
import { ResultsPanel } from '@/components/ResultsPanel';
import { FileUpload } from '@/components/FileUpload';
import { ActionButtons } from '@/components/ActionButtons';
import { StatusPanel } from '@/components/StatusPanel';
import { useTranslation } from '@/hooks/useTranslation';
import { useJsonValidation } from '@/hooks/useJsonValidation';
import { Language } from '@/types';
import toast from 'react-hot-toast';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

export default function Home() {
  const [inputJson, setInputJson] = useState('{\n  "welcome": "Welcome to our app",\n  "login": "Sign in to continue",\n  "email": "Email address",\n  "password": "Password",\n  "submit": "Submit form",\n  "cancel": "Cancel action",\n  "save": "Save changes",\n  "loading": "Please wait..."\n}');
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(['es', 'fr']);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const { isValid, error: validationError, prettifiedJson } = useJsonValidation(inputJson);
  const { 
    translations, 
    isTranslating, 
    progress, 
    error: translationError,
    translateJson,
    clearTranslations 
  } = useTranslation();

  // Save to history when input changes
  useEffect(() => {
    if (inputJson && inputJson !== history[historyIndex]) {
      const newHistory = [...history.slice(0, historyIndex + 1), inputJson];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [inputJson, history, historyIndex]);

  const handleTranslate = useCallback(async () => {
    if (!isValid || selectedLanguages.length === 0) {
      toast.error('Please provide valid JSON and select at least one language');
      return;
    }

    await translateJson(inputJson, selectedLanguages);
  }, [inputJson, selectedLanguages, isValid, translateJson]);

  const handleFormatJson = useCallback(() => {
    if (prettifiedJson) {
      setInputJson(prettifiedJson);
      toast.success('JSON formatted successfully');
    }
  }, [prettifiedJson]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setInputJson(history[historyIndex - 1]);
      toast.success('Undone');
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setInputJson(history[historyIndex + 1]);
      toast.success('Redone');
    }
  }, [history, historyIndex]);

  const handleFileUpload = useCallback((content: string) => {
    setInputJson(content);
    toast.success('File loaded successfully');
  }, []);

  const handleClearAll = useCallback(() => {
    setInputJson('');
    clearTranslations();
    setHistory([]);
    setHistoryIndex(-1);
    toast.success('All data cleared');
  }, [clearTranslations]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Header />
      
      <main className="container mx-auto px-6 py-8 max-w-7xl relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="space-y-12"
        >
          {/* Hero Section */}
          <motion.div 
            variants={fadeInUp}
            className="text-center space-y-6 relative"
          >
            <div className="relative inline-block">
              <motion.h1 
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
              >
                JSON Translation Studio
              </motion.h1>
              <motion.div
                className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            
            <motion.p 
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Professional JSON localization tool for developers. Translate your app content into 
              <span className="font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"> 20+ languages </span>
              with ease and precision.
            </motion.p>

            {/* Stats */}
            <motion.div 
              className="flex flex-wrap justify-center gap-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              {[
                { label: "Languages", value: "20+", color: "from-blue-500 to-cyan-500" },
                { label: "AI Powered", value: "✨", color: "from-purple-500 to-pink-500" },
                { label: "Real-time", value: "⚡", color: "from-amber-500 to-orange-500" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full border border-slate-200/50 dark:border-slate-700/50"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                    {stat.value}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* File Upload */}
          <motion.div variants={fadeInUp}>
            <FileUpload onFileUpload={handleFileUpload} />
          </motion.div>

          {/* Language Selection */}
          <motion.div variants={fadeInUp}>
            <LanguageSelector
              selectedLanguages={selectedLanguages}
              onLanguageChange={setSelectedLanguages}
            />
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={fadeInUp}>
            <ActionButtons
              onTranslate={handleTranslate}
              onFormat={handleFormatJson}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onClear={handleClearAll}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              canFormat={!!prettifiedJson && prettifiedJson !== inputJson}
              isTranslating={isTranslating}
              hasValidJson={isValid}
              hasLanguagesSelected={selectedLanguages.length > 0}
            />
          </motion.div>

          {/* Translation Progress */}
          <AnimatePresence>
            {isTranslating && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
              >
                <TranslationProgress progress={progress} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Panel */}
          <motion.div variants={fadeInUp}>
            <StatusPanel
              isValid={isValid}
              validationError={validationError}
              translationError={translationError}
              totalTranslations={Object.keys(translations).length}
            />
          </motion.div>

          {/* Main Content Area */}
          <motion.div 
            variants={fadeInUp}
            className="grid grid-cols-1 xl:grid-cols-2 gap-8"
          >
            {/* JSON Editor */}
            <motion.div
              className="space-y-6"
              whileHover={{ scale: 1.005 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  Source JSON
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-600"></div>
              </div>
              
              <div className="relative group">
                <JsonEditor
                  value={inputJson}
                  onChange={setInputJson}
                  isValid={isValid}
                  error={validationError}
                />
                {/* Ambient glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl"></div>
              </div>
            </motion.div>

            {/* Results Panel */}
            <motion.div
              className="space-y-6"
              whileHover={{ scale: 1.005 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  Translations
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-600"></div>
              </div>
              
                             <div className="relative group">
                 <ResultsPanel 
                   translations={translations} 
                   selectedLanguages={selectedLanguages}
                   originalJson={inputJson}
                 />
                 {/* Ambient glow effect */}
                 <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl"></div>
               </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      {/* Scroll to top button */}
      <motion.button
        className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 400, damping: 25 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </div>
  );
}
