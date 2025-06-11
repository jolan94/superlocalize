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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Title and Description */}
          <div className="text-center space-y-4">
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              JSON Translation Studio
            </motion.h1>
            <motion.p 
              className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Professional JSON localization tool for developers. Translate your app content into multiple languages with ease.
            </motion.p>
          </div>

          {/* File Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <FileUpload onFileUpload={handleFileUpload} />
          </motion.div>

          {/* Language Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <LanguageSelector
              selectedLanguages={selectedLanguages}
              onLanguageChange={setSelectedLanguages}
            />
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
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
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TranslationProgress progress={progress} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Panel */}
          <StatusPanel
            isValid={isValid}
            validationError={validationError}
            translationError={translationError}
            totalTranslations={Object.keys(translations).length}
          />

          {/* Main Content Area */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* JSON Editor */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Source JSON
              </h2>
              <JsonEditor
                value={inputJson}
                onChange={setInputJson}
                isValid={isValid}
                error={validationError}
                placeholder="Enter your JSON here..."
              />
            </motion.div>

            {/* Results Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Translations
              </h2>
              <ResultsPanel
                translations={translations}
                selectedLanguages={selectedLanguages}
                originalJson={inputJson}
              />
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
