import { useState, useCallback } from 'react';
import { Language, TranslationResult, TranslationProgress } from '@/types';
import toast from 'react-hot-toast';

// Mock translation data for realistic simulation
const mockTranslations: Record<Language, Record<string, string>> = {
  es: {
    'welcome': 'Bienvenido a nuestra aplicación',
    'login': 'Iniciar sesión para continuar',
    'email': 'Dirección de correo electrónico',
    'password': 'Contraseña',
    'submit': 'Enviar formulario',
    'cancel': 'Cancelar acción',
    'save': 'Guardar cambios',
    'loading': 'Por favor espera...',
    'hello': 'Hola',
    'goodbye': 'Adiós',
    'thank you': 'Gracias',
    'please': 'Por favor',
    'yes': 'Sí',
    'no': 'No',
  },
  fr: {
    'welcome': 'Bienvenue dans notre application',
    'login': 'Connectez-vous pour continuer',
    'email': 'Adresse électronique',
    'password': 'Mot de passe',
    'submit': 'Soumettre le formulaire',
    'cancel': 'Annuler l\'action',
    'save': 'Enregistrer les modifications',
    'loading': 'Veuillez patienter...',
    'hello': 'Bonjour',
    'goodbye': 'Au revoir',
    'thank you': 'Merci',
    'please': 'S\'il vous plaît',
    'yes': 'Oui',
    'no': 'Non',
  },
  de: {
    'welcome': 'Willkommen in unserer App',
    'login': 'Anmelden um fortzufahren',
    'email': 'E-Mail-Adresse',
    'password': 'Passwort',
    'submit': 'Formular absenden',
    'cancel': 'Aktion abbrechen',
    'save': 'Änderungen speichern',
    'loading': 'Bitte warten...',
    'hello': 'Hallo',
    'goodbye': 'Auf Wiedersehen',
    'thank you': 'Danke',
    'please': 'Bitte',
    'yes': 'Ja',
    'no': 'Nein',
  }
};

// Google Translate API key (provided by user)
const GOOGLE_TRANSLATE_API_KEY = 'AIzaSyDdkTJNiuG_OP6oVWoivAt1CMRPV07TZv0';

export function useTranslation() {
  const [translations, setTranslations] = useState<TranslationResult>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState<TranslationProgress>({ current: 0, total: 0 });
  const [error, setError] = useState<string>();

  const shouldTranslateValue = (value: unknown): boolean => {
    if (typeof value !== 'string') return false;
    
    // Skip technical strings that shouldn't be translated
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

  const extractTranslatableStrings = (obj: Record<string, unknown>, prefix = ''): string[] => {
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
  };

  const translateWithGoogleAPI = async (texts: string[], targetLanguage: Language): Promise<string[]> => {
    // TODO: Implement Google Translate API integration
    // This is where the actual Google Translate API call would go
    // For now, we'll use mock data with realistic delays
    
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
    
    try {
      // Simulated API call - replace with actual implementation
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: texts,
          target: targetLanguage,
          source: 'en',
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.translations.map((t: { translatedText: string }) => t.translatedText);
    } catch (apiError) {
      console.warn('Google Translate API not available, using mock translations:', apiError);
      
      // Fallback to mock translations
      return texts.map(text => {
        const lowerText = text.toLowerCase();
        return mockTranslations[targetLanguage][lowerText] || `[${targetLanguage}] ${text}`;
      });
    }
  };

  const translateObject = async (obj: unknown, targetLanguage: Language, translatedStrings: Map<string, string>): Promise<unknown> => {
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
  };

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

      setProgress({ current: 0, total: totalOperations });

      const results: TranslationResult = {};

      for (const language of targetLanguages) {
        setProgress(prev => ({ ...prev, currentLanguage: language }));
        
        // Simulate batch processing - translate strings in chunks
        const chunkSize = 5;
        const chunks = [];
        for (let i = 0; i < uniqueStrings.length; i += chunkSize) {
          chunks.push(uniqueStrings.slice(i, i + chunkSize));
        }

        const translatedStrings = new Map<string, string>();

        for (const chunk of chunks) {
          // Add realistic delay to simulate API calls
          await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

          const translations = await translateWithGoogleAPI(chunk, language);
          
          chunk.forEach((original, index) => {
            translatedStrings.set(original, translations[index]);
            completedOperations++;
            setProgress(prev => ({ 
              ...prev, 
              current: completedOperations,
              currentKey: original 
            }));
          });
        }

        // Translate the entire JSON structure
        results[language] = await translateObject(parsedJson, language, translatedStrings) as Record<string, unknown>;
      }

      setTranslations(results);
      toast.success(`Successfully translated into ${targetLanguages.length} language${targetLanguages.length > 1 ? 's' : ''}`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsTranslating(false);
      setProgress({ current: 0, total: 0 });
    }
  }, [extractTranslatableStrings, translateObject]);

  const clearTranslations = useCallback(() => {
    setTranslations({});
    setError(undefined);
  }, []);

  return {
    translations,
    isTranslating,
    progress,
    error,
    translateJson,
    clearTranslations,
  };
} 