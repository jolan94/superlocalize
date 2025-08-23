import { useState, useCallback } from 'react';
import { Language, TranslationResult, AiTranslationProgress, TranslationTone } from '@/types';
import toast from 'react-hot-toast';

export function useAiTranslation() {
  const [translations, setTranslations] = useState<TranslationResult>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState<AiTranslationProgress>({ current: 0, total: 0 });
  const [error, setError] = useState<string>();
  const [tone, setTone] = useState<TranslationTone>('professional');

  const shouldTranslateValue = (value: unknown): boolean => {
    if (typeof value !== 'string') return false;
    
    const technicalPatterns = [
      /^https?:\/\//, // URLs
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Email addresses
      /^[a-f0-9-]{8,}$/i, // IDs/UUIDs
      /^\d+$/, // Pure numbers
      /^[A-Z_][A-Z0-9_]*$/, // Constants (ALL_CAPS)
      /^[a-z][a-zA-Z0-9]*$/, // camelCase identifiers
      /^\$\{.*\}$/, // Template variables
      /^%[a-zA-Z]+%$/, // Placeholder variables
      /^#[a-fA-F0-9]{3,8}$/, // Hex colors
      /^\d{4}-\d{2}-\d{2}/, // Dates
    ];

    return !technicalPatterns.some(pattern => pattern.test(value.trim()));
  };

  const extractTranslatableStrings = useCallback((obj: Record<string, unknown>, prefix = ''): string[] => {
    const strings: string[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string' && shouldTranslateValue(value)) {
        strings.push(value);
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        strings.push(...extractTranslatableStrings(value as Record<string, unknown>, fullKey));
      }
    }
    
    return strings;
  }, []);

  const translateWithGeminiAPI = useCallback(async (text: string, targetLanguage: Language, context?: string): Promise<string> => {
    try {
      const response = await fetch('/api/gemini-translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage,
          context,
          tone,
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.translatedText;
    } catch (apiError) {
      console.error('Gemini API call failed:', apiError);
      throw apiError;
    }
  }, [tone]);

  const translateObject = useCallback(async (
    obj: unknown, 
    targetLanguage: Language, 
    translatedStrings: Map<string, string>
  ): Promise<unknown> => {
    if (typeof obj === 'string') {
      if (shouldTranslateValue(obj)) {
        return translatedStrings.get(obj) || obj;
      }
      return obj;
    }
    
    if (Array.isArray(obj)) {
      const translated = [];
      for (const item of obj) {
        translated.push(await translateObject(item, targetLanguage, translatedStrings));
      }
      return translated;
    }
    
    if (obj && typeof obj === 'object') {
      const translated: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        translated[key] = await translateObject(value, targetLanguage, translatedStrings);
      }
      return translated;
    }
    
    return obj;
  }, []);

  const translateJson = useCallback(async (jsonString: string, targetLanguages: Language[]) => {
    try {
      setIsTranslating(true);
      setError(undefined);
      setTranslations({});

      const parsedJson = JSON.parse(jsonString);
      const translatableStrings = extractTranslatableStrings(parsedJson);
      const uniqueStrings = [...new Set(translatableStrings)];

      const totalOperations = targetLanguages.length * uniqueStrings.length;
      let completedOperations = 0;

      setProgress({ current: 0, total: totalOperations, tone });

      const results: TranslationResult = {};

      for (const language of targetLanguages) {
        setProgress(prev => ({ ...prev, currentLanguage: language }));
        
        const translatedStrings = new Map<string, string>();

        // Process strings one by one for better accuracy and context
        for (const originalString of uniqueStrings) {
          await new Promise(resolve => setTimeout(resolve, 200)); // Rate limiting

          try {
            const translation = await translateWithGeminiAPI(
              originalString, 
              language, 
              `JSON localization for software application`
            );
            
            translatedStrings.set(originalString, translation);
            completedOperations++;
            setProgress(prev => ({ 
              ...prev, 
              current: completedOperations,
              currentKey: originalString 
            }));
          } catch (error) {
            console.error(`Failed to translate "${originalString}" to ${language}:`, error);
            // Use original string as fallback
            translatedStrings.set(originalString, originalString);
            completedOperations++;
            setProgress(prev => ({ 
              ...prev, 
              current: completedOperations,
              currentKey: originalString 
            }));
          }
        }

        results[language] = await translateObject(parsedJson, language, translatedStrings) as Record<string, unknown>;
      }

      setTranslations(results);
      toast.success(`AI translation completed for ${targetLanguages.length} language${targetLanguages.length > 1 ? 's' : ''}`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI translation failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsTranslating(false);
      setProgress({ current: 0, total: 0 });
    }
  }, [extractTranslatableStrings, translateObject, tone, translateWithGeminiAPI]);

  const clearTranslations = useCallback(() => {
    setTranslations({});
    setError(undefined);
  }, []);

  return {
    translations,
    isTranslating,
    progress,
    error,
    tone,
    setTone,
    translateJson,
    clearTranslations,
  };
}