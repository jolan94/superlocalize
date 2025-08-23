import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface TranslationRequest {
  text: string;
  targetLanguage: string;
  context?: string;
  tone?: 'professional' | 'casual' | 'technical';
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

    const { text, targetLanguage, context, tone = 'professional' }: TranslationRequest = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a professional translator specializing in software localization and JSON content translation. 

Context: ${context || 'General application content'}
Tone: ${tone}
Target Language: ${targetLanguage}

Please translate the following text while:
1. Maintaining the original meaning and context
2. Using appropriate ${tone} tone
3. Considering cultural nuances for the target language
4. Preserving any technical terms when appropriate
5. Ensuring the translation fits naturally in a software application

Text to translate: "${text}"

Respond with ONLY the translated text, no explanations or additional content.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text().trim();

    return NextResponse.json({
      translatedText,
      originalText: text,
      targetLanguage,
      tone,
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    
    // More detailed error handling
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Check for specific API errors
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
      { error: 'Translation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}