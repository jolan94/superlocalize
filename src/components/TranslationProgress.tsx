'use client';

import { motion } from 'framer-motion';
import { TranslationProgress as ProgressType } from '@/types';
import { Loader2, Clock, Zap } from 'lucide-react';

interface TranslationProgressProps {
  progress: ProgressType;
}

export function TranslationProgress({ progress }: TranslationProgressProps) {
  const percentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Translation in Progress
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Please wait while we process your JSON content
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            Progress
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {progress.current} / {progress.total} ({Math.round(percentage)}%)
          </span>
        </div>

        <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          
          {/* Shimmer Effect */}
          <motion.div
            className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: [-80, 320],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      {/* Current Status */}
      {(progress.currentLanguage || progress.currentKey) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 space-y-2"
        >
          {progress.currentLanguage && (
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-slate-600 dark:text-slate-400">
                Translating to:
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                {progress.currentLanguage}
              </span>
            </div>
          )}
          
          {progress.currentKey && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-slate-600 dark:text-slate-400">
                Processing:
              </span>
              <span className="font-mono text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-800 dark:text-slate-200 truncate max-w-40">
                &quot;{progress.currentKey}&quot;
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* Animation Dots */}
      <div className="flex items-center gap-1 mt-4 justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-blue-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
} 