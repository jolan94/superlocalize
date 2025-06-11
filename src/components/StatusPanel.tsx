'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, Info } from 'lucide-react';

interface StatusPanelProps {
  isValid: boolean;
  validationError?: string;
  translationError?: string;
  totalTranslations: number;
}

export function StatusPanel({ 
  isValid, 
  validationError, 
  translationError,
  totalTranslations 
}: StatusPanelProps) {
  const hasError = !!validationError || !!translationError;
  const hasTranslations = totalTranslations > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {/* JSON Validation Status */}
      <motion.div
        className={`p-4 rounded-lg border ${
          isValid
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${
            isValid 
              ? 'bg-green-100 dark:bg-green-900/40' 
              : 'bg-red-100 dark:bg-red-900/40'
          }`}>
            {isValid ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
          </div>
          <div>
            <h3 className={`font-semibold ${
              isValid
                ? 'text-green-800 dark:text-green-300'
                : 'text-red-800 dark:text-red-300'
            }`}>
              JSON Validation
            </h3>
            <p className={`text-sm ${
              isValid
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {isValid ? 'Valid JSON format' : 'Invalid JSON format'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Translation Status */}
      <motion.div
        className={`p-4 rounded-lg border ${
          translationError
            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            : hasTranslations
            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
        }`}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${
            translationError
              ? 'bg-red-100 dark:bg-red-900/40'
              : hasTranslations
              ? 'bg-blue-100 dark:bg-blue-900/40'
              : 'bg-slate-100 dark:bg-slate-700'
          }`}>
            {translationError ? (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            ) : hasTranslations ? (
              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            ) : (
              <Info className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            )}
          </div>
          <div>
            <h3 className={`font-semibold ${
              translationError
                ? 'text-red-800 dark:text-red-300'
                : hasTranslations
                ? 'text-blue-800 dark:text-blue-300'
                : 'text-slate-800 dark:text-slate-300'
            }`}>
              Translation Status
            </h3>
            <p className={`text-sm ${
              translationError
                ? 'text-red-600 dark:text-red-400'
                : hasTranslations
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}>
              {translationError 
                ? 'Translation failed'
                : hasTranslations 
                ? `${totalTranslations} translation${totalTranslations > 1 ? 's' : ''} ready`
                : 'No translations yet'
              }
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 md:col-span-2 lg:col-span-1"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-700">
            <Info className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-300">
              Quick Stats
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {hasTranslations 
                ? `${totalTranslations} language${totalTranslations > 1 ? 's' : ''} available`
                : 'Ready to translate'
              }
            </p>
          </div>
        </div>
      </motion.div>

      {/* Error Details */}
      {hasError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:col-span-2 lg:col-span-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-semibold text-red-800 dark:text-red-300">
                Error Details
              </h4>
              {validationError && (
                <p className="text-sm text-red-700 dark:text-red-400">
                  <strong>Validation:</strong> {validationError}
                </p>
              )}
              {translationError && (
                <p className="text-sm text-red-700 dark:text-red-400">
                  <strong>Translation:</strong> {translationError}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 