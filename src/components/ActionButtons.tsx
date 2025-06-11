'use client';

import { motion } from 'framer-motion';
import { 
  Code, 
  Undo2, 
  Redo2, 
  Trash2, 
  Loader2,
  Zap
} from 'lucide-react';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap gap-3 justify-center"
    >
      {/* Primary Translate Button */}
      <motion.button
        onClick={onTranslate}
        disabled={!canTranslate}
        className={`relative px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
          canTranslate
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
            : 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed'
        }`}
        whileHover={canTranslate ? { scale: 1.05 } : {}}
        whileTap={canTranslate ? { scale: 0.95 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className="flex items-center gap-2">
          {isTranslating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Zap className="w-5 h-5" />
          )}
          {isTranslating ? 'Translating...' : 'Translate JSON'}
        </div>
        
        {canTranslate && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
          />
        )}
      </motion.button>

      {/* Secondary Action Buttons */}
      <div className="flex gap-2">
        {/* Format JSON */}
        <motion.button
          onClick={onFormat}
          disabled={!canFormat}
          className={`p-3 rounded-lg transition-all duration-200 ${
            canFormat
              ? 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
          whileHover={canFormat ? { scale: 1.05 } : {}}
          whileTap={canFormat ? { scale: 0.95 } : {}}
          title="Format JSON"
        >
          <Code className="w-5 h-5" />
        </motion.button>

        {/* Undo */}
        <motion.button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-3 rounded-lg transition-all duration-200 ${
            canUndo
              ? 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
          whileHover={canUndo ? { scale: 1.05 } : {}}
          whileTap={canUndo ? { scale: 0.95 } : {}}
          title="Undo"
        >
          <Undo2 className="w-5 h-5" />
        </motion.button>

        {/* Redo */}
        <motion.button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-3 rounded-lg transition-all duration-200 ${
            canRedo
              ? 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
          whileHover={canRedo ? { scale: 1.05 } : {}}
          whileTap={canRedo ? { scale: 0.95 } : {}}
          title="Redo"
        >
          <Redo2 className="w-5 h-5" />
        </motion.button>

        {/* Clear All */}
        <motion.button
          onClick={onClear}
          className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Clear All"
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
} 