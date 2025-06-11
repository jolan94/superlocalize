'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Undo2, 
  Redo2, 
  Trash2, 
  Loader2,
  Zap,
  Sparkles,
  Command,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useEffect } from 'react';

interface ActionButtonsProps {
  onTranslate: () => void;
  onFormat: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
  canFormat: boolean;
  isTranslating: boolean;
  hasValidJson: boolean;
  hasLanguagesSelected: boolean;
}

export function ActionButtons({
  onTranslate,
  onFormat,
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo,
  canFormat,
  isTranslating,
  hasValidJson,
  hasLanguagesSelected,
}: ActionButtonsProps) {
  const canTranslate = hasValidJson && hasLanguagesSelected && !isTranslating;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'Enter':
            if (canTranslate) {
              e.preventDefault();
              onTranslate();
            }
            break;
          case 'z':
            if (e.shiftKey && canRedo) {
              e.preventDefault();
              onRedo();
            } else if (canUndo) {
              e.preventDefault();
              onUndo();
            }
            break;
          case 'f':
            if (canFormat) {
              e.preventDefault();
              onFormat();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [canTranslate, canUndo, canRedo, canFormat, onTranslate, onUndo, onRedo, onFormat]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, staggerChildren: 0.1 }}
      className="space-y-6"
    >
      {/* Status Indicator */}
      <motion.div 
        className="flex items-center justify-center gap-3 p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          {hasValidJson ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-500" />
          )}
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            JSON: {hasValidJson ? 'Valid' : 'Invalid'}
          </span>
        </div>
        
        <div className="w-1 h-4 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
        
        <div className="flex items-center gap-2">
          {hasLanguagesSelected ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-500" />
          )}
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Languages: {hasLanguagesSelected ? 'Selected' : 'None'}
          </span>
        </div>
      </motion.div>

      {/* Primary Action */}
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={onTranslate}
          disabled={!canTranslate}
          className={`group relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 overflow-hidden ${
            canTranslate
              ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
          }`}
          whileHover={canTranslate ? { scale: 1.02, y: -2 } : {}}
          whileTap={canTranslate ? { scale: 0.98 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {/* Background Animation */}
          {canTranslate && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          
          {/* Content */}
          <div className="relative flex items-center gap-3">
            {isTranslating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                whileHover={canTranslate ? { rotate: 10, scale: 1.1 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Zap className="w-6 h-6" />
              </motion.div>
            )}
            <span>{isTranslating ? 'Translating...' : 'Translate JSON'}</span>
            {canTranslate && (
              <motion.div
                className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-lg text-xs"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Command className="w-3 h-3" />
                <span>⏎</span>
              </motion.div>
            )}
          </div>

          {/* Sparkle Effect */}
          <AnimatePresence>
            {canTranslate && (
              <motion.div
                className="absolute top-2 right-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Sparkles className="w-4 h-4 text-white/60" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Help Text */}
        <motion.p 
          className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {!hasValidJson && !hasLanguagesSelected 
            ? "Please provide valid JSON and select target languages"
            : !hasValidJson 
            ? "Please provide valid JSON to continue"
            : !hasLanguagesSelected
            ? "Please select at least one target language"
            : "Ready to translate your JSON content"
          }
        </motion.p>
      </motion.div>

      {/* Secondary Actions */}
      <motion.div
        className="flex flex-wrap gap-3 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* Editor Actions Group */}
        <div className="flex items-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-1">
          {/* Format JSON */}
          <motion.button
            onClick={onFormat}
            disabled={!canFormat}
            className={`group relative p-3 rounded-lg transition-all duration-200 ${
              canFormat
                ? 'bg-slate-100/70 dark:bg-slate-700/70 hover:bg-slate-200/70 dark:hover:bg-slate-600/70 text-slate-700 dark:text-slate-300'
                : 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
            }`}
            whileHover={canFormat ? { scale: 1.05, y: -1 } : {}}
            whileTap={canFormat ? { scale: 0.95 } : {}}
            title="Format JSON (⌘F)"
          >
            <Code className="w-5 h-5" />
            {canFormat && (
              <motion.div
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                initial={{ y: -5 }}
                animate={{ y: 0 }}
              >
                Format JSON
              </motion.div>
            )}
          </motion.button>

          {/* Undo */}
          <motion.button
            onClick={onUndo}
            disabled={!canUndo}
            className={`group relative p-3 rounded-lg transition-all duration-200 ${
              canUndo
                ? 'bg-slate-100/70 dark:bg-slate-700/70 hover:bg-slate-200/70 dark:hover:bg-slate-600/70 text-slate-700 dark:text-slate-300'
                : 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
            }`}
            whileHover={canUndo ? { scale: 1.05, y: -1 } : {}}
            whileTap={canUndo ? { scale: 0.95 } : {}}
            title="Undo (⌘Z)"
          >
            <Undo2 className="w-5 h-5" />
            {canUndo && (
              <motion.div
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                initial={{ y: -5 }}
                animate={{ y: 0 }}
              >
                Undo
              </motion.div>
            )}
          </motion.button>

          {/* Redo */}
          <motion.button
            onClick={onRedo}
            disabled={!canRedo}
            className={`group relative p-3 rounded-lg transition-all duration-200 ${
              canRedo
                ? 'bg-slate-100/70 dark:bg-slate-700/70 hover:bg-slate-200/70 dark:hover:bg-slate-600/70 text-slate-700 dark:text-slate-300'
                : 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
            }`}
            whileHover={canRedo ? { scale: 1.05, y: -1 } : {}}
            whileTap={canRedo ? { scale: 0.95 } : {}}
            title="Redo (⌘⇧Z)"
          >
            <Redo2 className="w-5 h-5" />
            {canRedo && (
              <motion.div
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                initial={{ y: -5 }}
                animate={{ y: 0 }}
              >
                Redo
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* Destructive Action */}
        <motion.button
          onClick={onClear}
          className="group relative p-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl border border-red-200/50 dark:border-red-800/50 transition-all duration-200"
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          title="Clear All"
        >
          <Trash2 className="w-5 h-5" />
          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-red-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
            initial={{ y: -5 }}
            animate={{ y: 0 }}
          >
            Clear All
          </motion.div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
} 