export type Language = 'es' | 'fr' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'ko' | 'nl' | 'ru' | 'ar' | 'hi' | 'sv' | 'da' | 'no' | 'fi' | 'pl' | 'tr' | 'th' | 'vi';

export interface LanguageInfo {
  code: Language;
  name: string;
  flag: string;
}

export interface TranslationResult {
  [language: string]: Record<string, unknown>;
}

export interface TranslationProgress {
  current: number;
  total: number;
  currentKey?: string;
  currentLanguage?: string;
}

export interface JsonValidationResult {
  isValid: boolean;
  error?: string;
  prettifiedJson?: string;
}

export interface TranslationState {
  translations: TranslationResult;
  isTranslating: boolean;
  progress: TranslationProgress;
  error?: string;
}

export interface MockTranslation {
  text: string;
  confidence: number;
}

export interface GoogleTranslateResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
} 