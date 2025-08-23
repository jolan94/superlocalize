'use client';

import { useState, useCallback, useEffect } from 'react';
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

const languageInfo: Record<Language, { name: string; flag: string }> = {
  // Tier 1: Most popular languages
  es: { name: 'Spanish', flag: '🇪🇸' },
  fr: { name: 'French', flag: '🇫🇷' },
  de: { name: 'German', flag: '🇩🇪' },
  it: { name: 'Italian', flag: '🇮🇹' },
  pt: { name: 'Portuguese', flag: '🇵🇹' },
  zh: { name: 'Chinese', flag: '🇨🇳' },
  ja: { name: 'Japanese', flag: '🇯🇵' },
  ko: { name: 'Korean', flag: '🇰🇷' },
  ru: { name: 'Russian', flag: '🇷🇺' },
  ar: { name: 'Arabic', flag: '🇸🇦' },
  hi: { name: 'Hindi', flag: '🇮🇳' },
  
  // Tier 2: Popular languages
  bn: { name: 'Bengali', flag: '🇧🇩' },
  ur: { name: 'Urdu', flag: '🇵🇰' },
  id: { name: 'Indonesian', flag: '🇮🇩' },
  ms: { name: 'Malay', flag: '🇲🇾' },
  ta: { name: 'Tamil', flag: '🇮🇳' },
  te: { name: 'Telugu', flag: '🇮🇳' },
  mr: { name: 'Marathi', flag: '🇮🇳' },
  gu: { name: 'Gujarati', flag: '🇮🇳' },
  pa: { name: 'Punjabi', flag: '🇮🇳' },
  uk: { name: 'Ukrainian', flag: '🇺🇦' },
  ro: { name: 'Romanian', flag: '🇷🇴' },
  el: { name: 'Greek', flag: '🇬🇷' },
  he: { name: 'Hebrew', flag: '🇮🇱' },
  cs: { name: 'Czech', flag: '🇨🇿' },
  hu: { name: 'Hungarian', flag: '🇭🇺' },
  bg: { name: 'Bulgarian', flag: '🇧🇬' },
  hr: { name: 'Croatian', flag: '🇭🇷' },
  sk: { name: 'Slovak', flag: '🇸🇰' },
  sl: { name: 'Slovenian', flag: '🇸🇮' },
  lt: { name: 'Lithuanian', flag: '🇱🇹' },
  lv: { name: 'Latvian', flag: '🇱🇻' },
  et: { name: 'Estonian', flag: '🇪🇪' },
  sw: { name: 'Swahili', flag: '🇰🇪' },
  am: { name: 'Amharic', flag: '🇪🇹' },
  yo: { name: 'Yoruba', flag: '🇳🇬' },
  ig: { name: 'Igbo', flag: '🇳🇬' },
  ha: { name: 'Hausa', flag: '🇳🇬' },
  fa: { name: 'Persian', flag: '🇮🇷' },
  uz: { name: 'Uzbek', flag: '🇺🇿' },
  kk: { name: 'Kazakh', flag: '🇰🇿' },
  az: { name: 'Azerbaijani', flag: '🇦🇿' },
  ky: { name: 'Kyrgyz', flag: '🇰🇬' },
  
  // Tier 3: Additional languages
  nl: { name: 'Dutch', flag: '🇳🇱' },
  sv: { name: 'Swedish', flag: '🇸🇪' },
  da: { name: 'Danish', flag: '🇩🇰' },
  no: { name: 'Norwegian', flag: '🇳🇴' },
  fi: { name: 'Finnish', flag: '🇫🇮' },
  pl: { name: 'Polish', flag: '🇵🇱' },
  tr: { name: 'Turkish', flag: '🇹🇷' },
  th: { name: 'Thai', flag: '🇹🇭' },
  vi: { name: 'Vietnamese', flag: '🇻🇳' },
  ca: { name: 'Catalan', flag: '🇪🇸' },
  eu: { name: 'Basque', flag: '🇪🇸' },
  gl: { name: 'Galician', flag: '🇪🇸' },
  is: { name: 'Icelandic', flag: '🇮🇸' },
  mt: { name: 'Maltese', flag: '🇲🇹' },
  cy: { name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  ga: { name: 'Irish', flag: '🇮🇪' },
  sq: { name: 'Albanian', flag: '🇦🇱' },
  mk: { name: 'Macedonian', flag: '🇲🇰' },
  be: { name: 'Belarusian', flag: '🇧🇾' },
  ka: { name: 'Georgian', flag: '🇬🇪' },
  hy: { name: 'Armenian', flag: '🇦🇲' },
  ne: { name: 'Nepali', flag: '🇳🇵' },
  si: { name: 'Sinhala', flag: '🇱🇰' },
  my: { name: 'Myanmar', flag: '🇲🇲' },
  km: { name: 'Khmer', flag: '🇰🇭' },
  lo: { name: 'Lao', flag: '🇱🇦' },
  mn: { name: 'Mongolian', flag: '🇲🇳' },
  bo: { name: 'Tibetan', flag: '🏔️' },
  dz: { name: 'Dzongkha', flag: '🇧🇹' },
  ml: { name: 'Malayalam', flag: '🇮🇳' },
  kn: { name: 'Kannada', flag: '🇮🇳' },
  or: { name: 'Odia', flag: '🇮🇳' },
};

export function ResultsPanel({ translations, originalJson }: ResultsPanelProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<Language | 'all' | null>(null);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [isDownloading, setIsDownloading] = useState(false);

  // Set active tab when translations are available
  useEffect(() => {
    if (Object.keys(translations).length > 0 && !activeTab) {
      setActiveTab(Object.keys(translations)[0] as Language);
    }
  }, [translations, activeTab]);

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
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              Translation Results
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {availableLanguages.length} {availableLanguages.length === 1 ? 'language' : 'languages'} translated
            </p>
          </div>
        </div>

        <motion.button
          onClick={handleDownloadAll}
          disabled={isDownloading}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5"
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
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-1 p-2 bg-slate-50 dark:bg-slate-700/50">
          {availableLanguages.map((lang) => (
            <motion.button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === lang
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-600 hover:shadow-md'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">{languageInfo[lang].flag}</span>
              <span className="font-semibold">{languageInfo[lang].name}</span>
              {activeTab === lang && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </motion.button>
          ))}
        </div>
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
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-t-xl border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">{languageInfo[activeTab as Language].flag}</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    {languageInfo[activeTab as Language].name} Translation
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Translated content ready for use
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => handleCopy(
                    JSON.stringify(translations[activeTab], null, 2),
                    activeTab
                  )}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copiedStates[activeTab] ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy JSON
                    </>
                  )}
                </motion.button>

                <motion.button
                  onClick={() => handleDownloadSingle(activeTab as Language)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <File className="w-4 h-4" />
                  Download JSON
                </motion.button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="border border-slate-200 dark:border-slate-600 rounded-b-xl overflow-hidden shadow-lg">
              <Editor
                height="450px"
                defaultLanguage="json"
                value={JSON.stringify(translations[activeTab], null, 2)}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 15,
                  lineHeight: 24,
                  fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
                  fontWeight: '400',
                  lineNumbers: 'on',
                  lineNumbersMinChars: 3,
                  roundedSelection: true,
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  wordWrap: 'on',
                  contextmenu: false,
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
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}