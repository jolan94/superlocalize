export type Language = 
  // Tier 1: Most popular languages (shown by default)
  | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'ko' | 'ru' | 'ar' | 'hi'
  // Tier 2: Popular languages (expandable section)
  | 'bn' | 'ur' | 'id' | 'ms' | 'ta' | 'te' | 'mr' | 'gu' | 'pa' | 'uk' | 'ro'
  | 'el' | 'he' | 'cs' | 'hu' | 'bg' | 'hr' | 'sk' | 'sl' | 'lt' | 'lv' | 'et'
  | 'sw' | 'am' | 'yo' | 'ig' | 'ha' | 'fa' | 'uz' | 'kk' | 'az' | 'ky'
  // Tier 3: Additional languages (expandable section)
  | 'nl' | 'sv' | 'da' | 'no' | 'fi' | 'pl' | 'tr' | 'th' | 'vi' | 'ca' | 'eu'
  | 'gl' | 'is' | 'mt' | 'cy' | 'ga' | 'sq' | 'mk' | 'lv' | 'be' | 'ka' | 'hy'
  | 'ne' | 'si' | 'my' | 'km' | 'lo' | 'mn' | 'bo' | 'dz' | 'ml' | 'kn' | 'or';

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