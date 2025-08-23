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
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-t-xl border border-slate-200 dark:border-slate-600 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Source JSON
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Edit your JSON content here
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>{lineCount} lines</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>{characterCount} chars</span>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
            isValid 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}>
            {isValid ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <AlertCircle className="w-3 h-3" />
            )}
            <span>{isValid ? 'Valid JSON' : 'Invalid JSON'}</span>
          </div>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="relative border-x border-b border-slate-200 dark:border-slate-600 rounded-b-xl overflow-hidden shadow-lg">
        <Editor
          height="450px"
          defaultLanguage="json"
          value={value}
          onChange={handleEditorChange}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            lineHeight: 24,
            fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
            fontWeight: '400',
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            roundedSelection: true,
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
            hover: { enabled: true },
            contextmenu: true,
            selectOnLineNumbers: true,
            glyphMargin: false,
            folding: true,
            foldingHighlight: true,
            renderLineHighlight: 'gutter',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            cursorWidth: 2,
            padding: { top: 20, bottom: 20 },
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 12,
              horizontalScrollbarSize: 12,
            },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
          }}
          loading={
            <div className="flex items-center justify-center h-[450px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
                  <div className="absolute inset-0 w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Loading JSON Editor</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Preparing your workspace...</p>
                </div>
              </div>
            </div>
          }
        />
        
        {/* Overlay for empty state */}
        {!value && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-gradient-to-br from-slate-50/80 to-slate-100/80 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-sm">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-slate-600 dark:text-slate-300 text-lg font-semibold">
                  {placeholder || 'Ready for your JSON'}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
                  Paste or type your JSON content here to begin translation.
                  <br />The editor supports syntax highlighting and validation.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                <span>Auto-formatting</span>
                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                <span>Real-time validation</span>
                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                <span>Error detection</span>
              </div>
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