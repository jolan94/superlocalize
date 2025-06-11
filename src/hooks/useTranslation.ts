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
  },
  it: {
    'welcome': 'Benvenuto nella nostra app',
    'login': 'Accedi per continuare',
    'email': 'Indirizzo email',
    'password': 'Password',
    'submit': 'Invia modulo',
    'cancel': 'Annulla azione',
    'save': 'Salva modifiche',
    'loading': 'Attendere prego...',
    'hello': 'Ciao',
    'goodbye': 'Arrivederci',
    'thank you': 'Grazie',
    'please': 'Per favore',
    'yes': 'Sì',
    'no': 'No',
  },
  pt: {
    'welcome': 'Bem-vindo ao nosso aplicativo',
    'login': 'Faça login para continuar',
    'email': 'Endereço de email',
    'password': 'Senha',
    'submit': 'Enviar formulário',
    'cancel': 'Cancelar ação',
    'save': 'Salvar alterações',
    'loading': 'Por favor aguarde...',
    'hello': 'Olá',
    'goodbye': 'Tchau',
    'thank you': 'Obrigado',
    'please': 'Por favor',
    'yes': 'Sim',
    'no': 'Não',
  },
  zh: {
    'welcome': '欢迎使用我们的应用',
    'login': '登录以继续',
    'email': '电子邮件地址',
    'password': '密码',
    'submit': '提交表单',
    'cancel': '取消操作',
    'save': '保存更改',
    'loading': '请稍候...',
    'hello': '你好',
    'goodbye': '再见',
    'thank you': '谢谢',
    'please': '请',
    'yes': '是',
    'no': '否',
  },
  ja: {
    'welcome': 'アプリへようこそ',
    'login': '続行するにはログインしてください',
    'email': 'メールアドレス',
    'password': 'パスワード',
    'submit': 'フォームを送信',
    'cancel': 'アクションをキャンセル',
    'save': '変更を保存',
    'loading': 'お待ちください...',
    'hello': 'こんにちは',
    'goodbye': 'さようなら',
    'thank you': 'ありがとう',
    'please': 'お願いします',
    'yes': 'はい',
    'no': 'いいえ',
  },
  ko: {
    'welcome': '앱에 오신 것을 환영합니다',
    'login': '계속하려면 로그인하세요',
    'email': '이메일 주소',
    'password': '비밀번호',
    'submit': '양식 제출',
    'cancel': '작업 취소',
    'save': '변경사항 저장',
    'loading': '잠시 기다려주세요...',
    'hello': '안녕하세요',
    'goodbye': '안녕히 가세요',
    'thank you': '감사합니다',
    'please': '제발',
    'yes': '예',
    'no': '아니오',
  },
  nl: {
    'welcome': 'Welkom bij onze app',
    'login': 'Log in om door te gaan',
    'email': 'E-mailadres',
    'password': 'Wachtwoord',
    'submit': 'Formulier verzenden',
    'cancel': 'Actie annuleren',
    'save': 'Wijzigingen opslaan',
    'loading': 'Even geduld...',
    'hello': 'Hallo',
    'goodbye': 'Tot ziens',
    'thank you': 'Dank je',
    'please': 'Alsjeblieft',
    'yes': 'Ja',
    'no': 'Nee',
  },
  ru: {
    'welcome': 'Добро пожаловать в наше приложение',
    'login': 'Войдите, чтобы продолжить',
    'email': 'Адрес электронной почты',
    'password': 'Пароль',
    'submit': 'Отправить форму',
    'cancel': 'Отменить действие',
    'save': 'Сохранить изменения',
    'loading': 'Пожалуйста, подождите...',
    'hello': 'Привет',
    'goodbye': 'До свидания',
    'thank you': 'Спасибо',
    'please': 'Пожалуйста',
    'yes': 'Да',
    'no': 'Нет',
  },
  ar: {
    'welcome': 'مرحباً بك في تطبيقنا',
    'login': 'قم بتسجيل الدخول للمتابعة',
    'email': 'عنوان البريد الإلكتروني',
    'password': 'كلمة المرور',
    'submit': 'إرسال النموذج',
    'cancel': 'إلغاء الإجراء',
    'save': 'حفظ التغييرات',
    'loading': 'يرجى الانتظار...',
    'hello': 'مرحباً',
    'goodbye': 'وداعاً',
    'thank you': 'شكراً لك',
    'please': 'من فضلك',
    'yes': 'نعم',
    'no': 'لا',
  },
  hi: {
    'welcome': 'हमारे ऐप में आपका स्वागत है',
    'login': 'जारी रखने के लिए लॉग इन करें',
    'email': 'ईमेल पता',
    'password': 'पासवर्ड',
    'submit': 'फॉर्म जमा करें',
    'cancel': 'कार्रवाई रद्द करें',
    'save': 'परिवर्तन सहेजें',
    'loading': 'कृपया प्रतीक्षा करें...',
    'hello': 'नमस्ते',
    'goodbye': 'अलविदा',
    'thank you': 'धन्यवाद',
    'please': 'कृपया',
    'yes': 'हाँ',
    'no': 'नहीं',
  },
  sv: {
    'welcome': 'Välkommen till vår app',
    'login': 'Logga in för att fortsätta',
    'email': 'E-postadress',
    'password': 'Lösenord',
    'submit': 'Skicka formulär',
    'cancel': 'Avbryt åtgärd',
    'save': 'Spara ändringar',
    'loading': 'Vänta...',
    'hello': 'Hej',
    'goodbye': 'Hej då',
    'thank you': 'Tack',
    'please': 'Snälla',
    'yes': 'Ja',
    'no': 'Nej',
  },
  da: {
    'welcome': 'Velkommen til vores app',
    'login': 'Log ind for at fortsætte',
    'email': 'E-mailadresse',
    'password': 'Adgangskode',
    'submit': 'Send formular',
    'cancel': 'Annuller handling',
    'save': 'Gem ændringer',
    'loading': 'Vent venligst...',
    'hello': 'Hej',
    'goodbye': 'Farvel',
    'thank you': 'Tak',
    'please': 'Venligst',
    'yes': 'Ja',
    'no': 'Nej',
  },
  no: {
    'welcome': 'Velkommen til appen vår',
    'login': 'Logg inn for å fortsette',
    'email': 'E-postadresse',
    'password': 'Passord',
    'submit': 'Send skjema',
    'cancel': 'Avbryt handling',
    'save': 'Lagre endringer',
    'loading': 'Vennligst vent...',
    'hello': 'Hei',
    'goodbye': 'Ha det',
    'thank you': 'Takk',
    'please': 'Takk',
    'yes': 'Ja',
    'no': 'Nei',
  },
  fi: {
    'welcome': 'Tervetuloa sovellukseemme',
    'login': 'Kirjaudu sisään jatkaaksesi',
    'email': 'Sähköpostiosoite',
    'password': 'Salasana',
    'submit': 'Lähetä lomake',
    'cancel': 'Peruuta toiminto',
    'save': 'Tallenna muutokset',
    'loading': 'Odota...',
    'hello': 'Hei',
    'goodbye': 'Näkemiin',
    'thank you': 'Kiitos',
    'please': 'Ole kiltti',
    'yes': 'Kyllä',
    'no': 'Ei',
  },
  pl: {
    'welcome': 'Witaj w naszej aplikacji',
    'login': 'Zaloguj się, aby kontynuować',
    'email': 'Adres e-mail',
    'password': 'Hasło',
    'submit': 'Wyślij formularz',
    'cancel': 'Anuluj akcję',
    'save': 'Zapisz zmiany',
    'loading': 'Proszę czekać...',
    'hello': 'Cześć',
    'goodbye': 'Do widzenia',
    'thank you': 'Dziękuję',
    'please': 'Proszę',
    'yes': 'Tak',
    'no': 'Nie',
  },
  tr: {
    'welcome': 'Uygulamamıza hoş geldiniz',
    'login': 'Devam etmek için giriş yapın',
    'email': 'E-posta adresi',
    'password': 'Şifre',
    'submit': 'Formu gönder',
    'cancel': 'İşlemi iptal et',
    'save': 'Değişiklikleri kaydet',
    'loading': 'Lütfen bekleyin...',
    'hello': 'Merhaba',
    'goodbye': 'Hoşça kal',
    'thank you': 'Teşekkür ederim',
    'please': 'Lütfen',
    'yes': 'Evet',
    'no': 'Hayır',
  },
  th: {
    'welcome': 'ยินดีต้อนรับสู่แอปของเรา',
    'login': 'เข้าสู่ระบบเพื่อดำเนินการต่อ',
    'email': 'ที่อยู่อีเมล',
    'password': 'รหัสผ่าน',
    'submit': 'ส่งแบบฟอร์ม',
    'cancel': 'ยกเลิกการดำเนินการ',
    'save': 'บันทึกการเปลี่ยนแปลง',
    'loading': 'กรุณารอ...',
    'hello': 'สวัสดี',
    'goodbye': 'ลาก่อน',
    'thank you': 'ขอบคุณ',
    'please': 'โปรด',
    'yes': 'ใช่',
    'no': 'ไม่',
  },
  vi: {
    'welcome': 'Chào mừng bạn đến với ứng dụng của chúng tôi',
    'login': 'Đăng nhập để tiếp tục',
    'email': 'Địa chỉ email',
    'password': 'Mật khẩu',
    'submit': 'Gửi biểu mẫu',
    'cancel': 'Hủy hành động',
    'save': 'Lưu thay đổi',
    'loading': 'Vui lòng đợi...',
    'hello': 'Xin chào',
    'goodbye': 'Tạm biệt',
    'thank you': 'Cảm ơn',
    'please': 'Xin vui lòng',
    'yes': 'Có',
    'no': 'Không',
  }
};

// Google Translate API key from environment variables
const GOOGLE_TRANSLATE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;

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
    // Check if API key is available
    if (!GOOGLE_TRANSLATE_API_KEY) {
      console.warn('Google Translate API key not found. Using mock translations instead.');
      console.warn('To use real Google Translate API, add NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY to your .env.local file');
      
      // Fallback to mock translations
      return texts.map(text => {
        const lowerText = text.toLowerCase();
        return mockTranslations[targetLanguage][lowerText] || `[${targetLanguage}] ${text}`;
      });
    }
    
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
    
    try {
      // Actual Google Translate API call
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
      console.warn('Google Translate API call failed, using mock translations:', apiError);
      
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
  }, []);

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