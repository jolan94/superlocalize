'use client';

import { motion } from 'framer-motion';
import { Editor } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { AlertCircle, CheckCircle2, Code2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  isValid: boolean;
  error?: string;
  placeholder?: string;
}

export function JsonEditor({ value, onChange, isValid, error, placeholder }: JsonEditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditorChange = useCallback((value: string | undefined) => {
    onChange(value || '');
  }, [onChange]);

  const lineCount = value.split('\n').length;
  const characterCount = value.length;

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3"
    >
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-t-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            JSON Editor
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>{lineCount} lines</span>
          <span>{characterCount} characters</span>
          <div className={`flex items-center gap-1 ${isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isValid ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <AlertCircle className="w-3 h-3" />
            )}
            <span>{isValid ? 'Valid' : 'Invalid'}</span>
          </div>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="relative border border-slate-200 dark:border-slate-700 rounded-b-lg overflow-hidden">
        <Editor
          height="400px"
          defaultLanguage="json"
          value={value}
          onChange={handleEditorChange}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            suggest: {
              showKeywords: false,
              showSnippets: false,
              showFunctions: false,
            },
            quickSuggestions: false,
            parameterHints: { enabled: false },
            hover: { enabled: false },
            contextmenu: true,
            selectOnLineNumbers: true,
            glyphMargin: false,
            folding: true,
            renderLineHighlight: 'line',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            padding: { top: 16, bottom: 16 },
          }}
          loading={
            <div className="flex items-center justify-center h-96 bg-slate-50 dark:bg-slate-800">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Loading editor...</span>
              </div>
            </div>
          }
        />
        
        {/* Overlay for empty state */}
        {!value && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-slate-50/50 dark:bg-slate-800/50">
            <div className="text-center space-y-2">
              <Code2 className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto" />
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
                {placeholder || 'Enter your JSON here...'}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-sm">
                Paste or type JSON content to get started
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                JSON Validation Error
              </p>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                {error}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 