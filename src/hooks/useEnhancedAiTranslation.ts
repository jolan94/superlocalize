import { useState, useCallback } from 'react';
import { Language, TranslationResult, AiTranslationProgress, TranslationTone } from '@/types';
import toast from 'react-hot-toast';

interface BatchTranslationRequest {
  sourceLanguage: string;
  targetLanguages: string[];
  content: Record<string, unknown>;
  context?: string;
  tone?: TranslationTone;
}

interface TranslationEntry {
  key: string;
  originalText: string;
  translatedText: string;
}

interface LanguageTranslationResult {
  language: string;
  translations: TranslationEntry[];
  translatedContent: Record<string, unknown>;
}

interface BatchTranslationResponse {
  sourceLanguage: string;
  results: LanguageTranslationResult[];
  totalStrings: number;
  processedAt: string;
}

export function useEnhancedAiTranslation() {
  const [translations, setTranslations] = useState<TranslationResult>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState<AiTranslationProgress>({ current: 0, total: 0 });
  const [error, setError] = useState<string>();
  const [tone, setTone] = useState<TranslationTone>('professional');

  const translateJsonBatch = useCallback(async (
    jsonString: string, 
    targetLanguages: Language[],
    sourceLanguage: string = 'en'
  ) => {
    try {
      setIsTranslating(true);
      setError(undefined);
      setTranslations({});

      const parsedJson = JSON.parse(jsonString);
      
      // Set initial progress
      setProgress({ 
        current: 0, 
        total: targetLanguages.length, 
        tone,
        currentLanguage: 'Preparing batch translation...' 
      });

      const batchRequest: BatchTranslationRequest = {
        sourceLanguage,
        targetLanguages,
        content: parsedJson,
        context: 'JSON localization for software application',
        tone
      };

      setProgress(prev => ({ 
        ...prev, 
        currentLanguage: 'Processing with AI...' 
      }));

      const response = await fetch('/api/gemini-batch-translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Translation API error: ${response.statusText}`);
      }

      const batchResult: BatchTranslationResponse = await response.json();
      
      // Convert batch results to the expected TranslationResult format
      const results: TranslationResult = {};
      
      batchResult.results.forEach((languageResult, index) => {
        results[languageResult.language] = languageResult.translatedContent;
        
        // Update progress for each completed language
        setProgress(prev => ({ 
          ...prev, 
          current: index + 1,
          currentLanguage: languageResult.language 
        }));
      });

      setTranslations(results);
      
      toast.success(
        `Enhanced AI translation completed for ${targetLanguages.length} language${targetLanguages.length > 1 ? 's' : ''} with ${batchResult.totalStrings} strings processed`
      );
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Enhanced AI translation failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsTranslating(false);
      setProgress({ current: 0, total: 0 });
    }
  }, [tone]);

  const translateJsonStream = useCallback(async (
    jsonString: string, 
    targetLanguages: Language[],
    sourceLanguage: string = 'en'
  ) => {
    try {
      setIsTranslating(true);
      setError(undefined);
      setTranslations({});

      const parsedJson = JSON.parse(jsonString);
      const results: TranslationResult = {};
      
      setProgress({ 
        current: 0, 
        total: targetLanguages.length, 
        tone 
      });

      // Process languages one by one for streaming effect
      for (let i = 0; i < targetLanguages.length; i++) {
        const language = targetLanguages[i];
        
        setProgress(prev => ({ 
          ...prev, 
          current: i,
          currentLanguage: language 
        }));

        const batchRequest: BatchTranslationRequest = {
          sourceLanguage,
          targetLanguages: [language], // Single language for streaming
          content: parsedJson,
          context: 'JSON localization for software application',
          tone
        };

        const response = await fetch('/api/gemini-batch-translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(batchRequest),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Failed to translate to ${language}:`, errorData.error);
          // Continue with other languages instead of failing completely
          continue;
        }

        const batchResult: BatchTranslationResponse = await response.json();
        
        if (batchResult.results.length > 0) {
          results[language] = batchResult.results[0].translatedContent;
          
          // Update translations in real-time for streaming effect
          setTranslations({ ...results });
        }
        
        setProgress(prev => ({ 
          ...prev, 
          current: i + 1 
        }));
      }

      toast.success(
        `Streaming AI translation completed for ${Object.keys(results).length} language${Object.keys(results).length > 1 ? 's' : ''}`
      );
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Streaming AI translation failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsTranslating(false);
      setProgress({ current: 0, total: 0 });
    }
  }, [tone]);

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
    translateJsonBatch,
    translateJsonStream,
    clearTranslations,
  };
}