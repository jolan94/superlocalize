'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Editor } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { 
  Copy, 
  Check, 
  FileText,
  Archive,
  File
} from 'lucide-react';
import { TranslationResult, Language } from '@/types';
import toast from 'react-hot-toast';
import JSZip from 'jszip';

interface ResultsPanelProps {
  translations: TranslationResult;
  selectedLanguages: Language[];
  originalJson: string;
}

const languageInfo = {
  es: { name: 'Spanish', flag: '🇪🇸' },
  fr: { name: 'French', flag: '🇫🇷' },
  de: { name: 'German', flag: '🇩🇪' },
  it: { name: 'Italian', flag: '🇮🇹' },
  pt: { name: 'Portuguese', flag: '🇵🇹' },
  zh: { name: 'Chinese', flag: '🇨🇳' },
  ja: { name: 'Japanese', flag: '🇯🇵' },
  ko: { name: 'Korean', flag: '🇰🇷' },
  nl: { name: 'Dutch', flag: '🇳🇱' },
  ru: { name: 'Russian', flag: '🇷🇺' },
  ar: { name: 'Arabic', flag: '🇸🇦' },
  hi: { name: 'Hindi', flag: '🇮🇳' },
  sv: { name: 'Swedish', flag: '🇸🇪' },
  da: { name: 'Danish', flag: '🇩🇰' },
  no: { name: 'Norwegian', flag: '🇳🇴' },
  fi: { name: 'Finnish', flag: '🇫🇮' },
  pl: { name: 'Polish', flag: '🇵🇱' },
  tr: { name: 'Turkish', flag: '🇹🇷' },
  th: { name: 'Thai', flag: '🇹🇭' },
  vi: { name: 'Vietnamese', flag: '🇻🇳' },
};

export function ResultsPanel({ translations, originalJson }: ResultsPanelProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<Language | 'all' | null>(null);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [isDownloading, setIsDownloading] = useState(false);

  // Set active tab when translations are available
  useState(() => {
    if (Object.keys(translations).length > 0 && !activeTab) {
      setActiveTab(Object.keys(translations)[0] as Language);
    }
  });

  const handleCopy = useCallback(async (content: string, key: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      toast.success('Copied to clipboard');
      
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      console.error('Clipboard error:', error);
      toast.error('Failed to copy to clipboard');
    }
  }, []);

  const downloadFile = useCallback((content: string, filename: string) => {
    try {
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }, []);

  const downloadZipFile = useCallback((blob: Blob, filename: string) => {
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('ZIP download error:', error);
      throw error;
    }
  }, []);

  const handleDownloadSingle = useCallback(async (language: Language) => {
    try {
      const content = JSON.stringify(translations[language], null, 2);
      const filename = `${language}_translation.json`;
      downloadFile(content, filename);
      toast.success(`Downloaded ${languageInfo[language].name} translation`);
    } catch (error) {
      console.error('Single download error:', error);
      toast.error('Failed to download translation');
    }
  }, [translations, downloadFile]);

  const handleDownloadAll = useCallback(async () => {
    try {
      setIsDownloading(true);
      const zip = new JSZip();
      
      // Add original JSON file
      zip.file('original.json', JSON.stringify(JSON.parse(originalJson), null, 2));
      
      // Add each translation file
      const availableLanguages = Object.keys(translations) as Language[];
      for (const language of availableLanguages) {
        const content = JSON.stringify(translations[language], null, 2);
        const filename = `${language}_${languageInfo[language].name.toLowerCase()}.json`;
        zip.file(filename, content);
      }
      
      // Add a summary file
      const summary = {
        project: 'SuperLocalize Translation Export',
        exportDate: new Date().toISOString(),
        originalFile: 'original.json',
        languages: availableLanguages.map(lang => ({
          code: lang,
          name: languageInfo[lang].name,
          filename: `${lang}_${languageInfo[lang].name.toLowerCase()}.json`
        })),
        totalTranslations: availableLanguages.length
      };
      zip.file('README.json', JSON.stringify(summary, null, 2));
      
      // Generate ZIP blob
      const blob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });
      
      // Download ZIP file
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
      const filename = `translations_${timestamp}.zip`;
      downloadZipFile(blob, filename);
      
      toast.success(`Downloaded ${availableLanguages.length + 1} files as ZIP`);
    } catch (error) {
      console.error('Download all error:', error);
      toast.error('Failed to create ZIP file');
    } finally {
      setIsDownloading(false);
    }
  }, [translations, originalJson, downloadZipFile]);

  const availableLanguages = Object.keys(translations) as Language[];
  const hasTranslations = availableLanguages.length > 0;

  if (!hasTranslations) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="h-96 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center"
      >
        <div className="text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400">
            No Translations Yet
          </h3>
          <p className="text-slate-500 dark:text-slate-500 max-w-sm">
            Translate your JSON to see the results here. Each language will appear in a separate tab.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header with Actions */}
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">
            Translation Results
          </h3>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
            {availableLanguages.length} language{availableLanguages.length > 1 ? 's' : ''}
          </span>
        </div>

        <motion.button
          onClick={handleDownloadAll}
          disabled={isDownloading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
          whileHover={!isDownloading ? { scale: 1.02, y: -1 } : {}}
          whileTap={!isDownloading ? { scale: 0.98 } : {}}
        >
          {isDownloading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Archive className="w-4 h-4" />
              </motion.div>
              Creating ZIP...
            </>
          ) : (
            <>
              <Archive className="w-4 h-4" />
              Download All as ZIP
            </>
          )}
        </motion.button>
      </div>

      {/* Language Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        {availableLanguages.map((lang) => (
          <motion.button
            key={lang}
            onClick={() => setActiveTab(lang)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${
              activeTab === lang
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg">{languageInfo[lang].flag}</span>
            {languageInfo[lang].name}
          </motion.button>
        ))}
      </div>

      {/* Translation Content */}
      <AnimatePresence mode="wait">
        {activeTab && activeTab !== 'all' && translations[activeTab] && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Content Header */}
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-t-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-xl">{languageInfo[activeTab as Language].flag}</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {languageInfo[activeTab as Language].name} Translation
                </span>
              </div>

              <div className="flex gap-2">
                <motion.button
                  onClick={() => handleCopy(
                    JSON.stringify(translations[activeTab], null, 2),
                    activeTab
                  )}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded text-sm transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copiedStates[activeTab] ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </motion.button>

                <motion.button
                  onClick={() => handleDownloadSingle(activeTab as Language)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded text-sm transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <File className="w-3 h-3" />
                  Download JSON
                </motion.button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-b-lg overflow-hidden">
              <Editor
                height="400px"
                defaultLanguage="json"
                value={JSON.stringify(translations[activeTab], null, 2)}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollbar: {
                    vertical: 'auto',
                    horizontal: 'auto',
                  },
                  wordWrap: 'on',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 