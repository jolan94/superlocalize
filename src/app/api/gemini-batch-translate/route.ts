import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface BatchTranslationRequest {
  sourceLanguage: string;
  targetLanguages: string[];
  content: Record<string, unknown>;
  context?: string;
  tone?: 'professional' | 'casual' | 'technical';
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

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'Translation service not configured' },
        { status: 500 }
      );
    }

    const { 
      sourceLanguage, 
      targetLanguages, 
      content, 
      context, 
      tone = 'professional' 
    }: BatchTranslationRequest = await request.json();

    if (!sourceLanguage || !targetLanguages || !content || targetLanguages.length === 0) {
      return NextResponse.json(
        { error: 'Source language, target languages, and content are required' },
        { status: 400 }
      );
    }

    // Extract translatable strings from the content
    const translatableStrings = extractTranslatableStrings(content);
    
    if (translatableStrings.length === 0) {
      return NextResponse.json(
        { error: 'No translatable strings found in content' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-lite',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            translations: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  originalText: {
                    type: SchemaType.STRING,
                    description: 'The original text in source language'
                  },
                  translatedText: {
                    type: SchemaType.STRING,
                    description: 'The translated text in target language'
                  }
                },
                required: ['originalText', 'translatedText']
              }
            }
          },
          required: ['translations']
        }
      }
    });

    const results: LanguageTranslationResult[] = [];

    // Process each target language
    for (const targetLanguage of targetLanguages) {
      const prompt = `You are a professional translator specializing in software localization and JSON content translation.

Context: ${context || 'General application content'}
Tone: ${tone}
Source Language: ${sourceLanguage}
Target Language: ${targetLanguage}

Translate the following strings while:
1. Maintaining the original meaning and context
2. Using appropriate ${tone} tone
3. Considering cultural nuances for the target language
4. Preserving any technical terms when appropriate
5. Ensuring translations fit naturally in a software application
6. Maintaining consistent terminology across all strings

Strings to translate:
${translatableStrings.map((str, index) => `${index + 1}. "${str}"`).join('\n')}

Provide translations in the exact same order as the input strings.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const translationData = JSON.parse(response.text());

      // Create translation entries with keys
      const translations: TranslationEntry[] = translatableStrings.map((originalText, index) => ({
        key: `string_${index}`,
        originalText,
        translatedText: translationData.translations[index]?.translatedText || originalText
      }));

      // Create translation map for content reconstruction
      const translationMap = new Map<string, string>();
      translations.forEach(({ originalText, translatedText }) => {
        translationMap.set(originalText, translatedText);
      });

      // Reconstruct the translated content
      const translatedContent = translateObject(content, translationMap) as Record<string, unknown>;

      results.push({
        language: targetLanguage,
        translations,
        translatedContent
      });
    }

    const response: BatchTranslationResponse = {
      sourceLanguage,
      results,
      totalStrings: translatableStrings.length,
      processedAt: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Batch translation error:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      if (error.message.includes('API_KEY')) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('QUOTA_EXCEEDED')) {
        return NextResponse.json(
          { error: 'API quota exceeded' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Batch translation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to extract translatable strings from nested objects
function extractTranslatableStrings(obj: Record<string, unknown>, prefix = ''): string[] {
  const strings: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && shouldTranslateValue(value)) {
      strings.push(value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      strings.push(...extractTranslatableStrings(value as Record<string, unknown>, prefix ? `${prefix}.${key}` : key));
    }
  }
  
  return strings;
}

// Helper function to determine if a string should be translated
function shouldTranslateValue(value: string): boolean {
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
}

// Helper function to reconstruct translated object
function translateObject(
  obj: unknown, 
  translationMap: Map<string, string>
): unknown {
  if (typeof obj === 'string') {
    if (shouldTranslateValue(obj)) {
      return translationMap.get(obj) || obj;
    }
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => translateObject(item, translationMap));
  }
  
  if (obj && typeof obj === 'object') {
    const translated: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      translated[key] = translateObject(value, translationMap);
    }
    return translated;
  }
  
  return obj;
}