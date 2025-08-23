'use client';

import { motion } from 'framer-motion';
import type { AiTranslationProgress } from '@/types';
import { Brain, Sparkles } from 'lucide-react';

interface AiTranslationProgressProps {
  progress: AiTranslationProgress;
}

export function AiTranslationProgress({ progress }: AiTranslationProgressProps) {
  const percentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-800/50"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
          </motion.div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            AI Translation in Progress
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {progress.tone && (
              <span className="capitalize">{progress.tone}</span>
            )} tone • {progress.currentLanguage && (
              <span className="font-medium">{progress.currentLanguage}</span>
            )}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            {progress.current} of {progress.total} translations
          </span>
          <span className="text-purple-600 dark:text-purple-400 font-semibold">
            {percentage.toFixed(0)}%
          </span>
        </div>
        
        <div className="relative">
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
            </motion.div>
          </div>
        </div>

        {progress.currentKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg"
          >
            Translating: &quot;{progress.currentKey.length > 50 ? progress.currentKey.slice(0, 50) + '...' : progress.currentKey}&quot;
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}