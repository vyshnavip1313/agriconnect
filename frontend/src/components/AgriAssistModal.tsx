import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Send, Volume2, X, Sparkles, Bot, User, ArrowRight, Check } from 'lucide-react';
import { api } from '../api';
import { Language, translations } from '../i18n';

// --- Language detection helpers ---
type DetectedLang = 'te' | 'hi' | 'ta' | 'kn' | 'mr' | 'en';

function detectTextLanguage(text: string): DetectedLang {
  // Telugu: 0C00–0C7F
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
  // Hindi/Marathi (Devanagari): 0900–097F  — distinguish by vocabulary later
  if (/[\u0900-\u097F]/.test(text)) {
    // Marathi common words
    if (/माझ्याकड|मराठी|विकायच/.test(text)) return 'mr';
    return 'hi';
  }
  // Tamil: 0B80–0BFF
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  // Kannada: 0C80–0CFF
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn';
  return 'en';
}

const LANG_BCP47: Record<DetectedLang, string> = {
  te: 'te-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  mr: 'mr-IN',
  en: 'en-IN',
};

const LANG_LABEL: Record<DetectedLang, string> = {
  te: 'తెలుగు',
  hi: 'हिन्दी',
  ta: 'தமிழ்',
  kn: 'ಕನ್ನಡ',
  mr: 'मराठी',
  en: 'English',
};

// Find the best matching voice for a BCP-47 language tag
function findVoice(bcp47: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  // Exact match first (e.g. te-IN)
  let voice = voices.find(v => v.lang === bcp47) || null;
  if (voice) return voice;
  // Prefix match (e.g. te)
  const prefix = bcp47.split('-')[0];
  voice = voices.find(v => v.lang.startsWith(prefix)) || null;
  return voice;
}

interface AgriAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onApplyVoiceListingDraft: (draft: any) => void;
  onNavigateTab: (tab: string) => void;
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
  action_link?: string;
  action_label?: string;
  isDraft?: boolean;
  draftData?: any;
}

export const AgriAssistModal: React.FC<AgriAssistModalProps> = ({
  isOpen,
  onClose,
  language,
  onApplyVoiceListingDraft,
  onNavigateTab
}) => {
  // voiceLang: the language used for mic input AND TTS output
  // Defaults to the app language, but user can override via the picker.
  const [voiceLang, setVoiceLang] = useState<DetectedLang>(
    (language as DetectedLang) || 'en'
  );

  const initialGreeting = () => {
    switch (voiceLang) {
      case 'te': return "నమస్కారం! నేను AgriAssist AI. పంట ధరలు, కొనుగోలుదారులు లేదా పంట లిస్టింగ్ గురించి మాట్లాడండి.";
      case 'hi': return "नमस्ते! मैं AgriAssist AI हूँ। मंडी भाव, फसल सलाह या 'मेरे पास 200 किलो टमाटर हैं' बोलें।";
      case 'ta': return "வணக்கம்! நான் AgriAssist AI. பயிர் விலை, வாங்குபவர்கள் அல்லது பட்டியல் பற்றி கேளுங்கள்.";
      case 'kn': return "ನಮಸ್ಕಾರ! ನಾನು AgriAssist AI. ಬೆಳೆ ಬೆಲೆ, ಖರೀದಿದಾರರು ಅಥವಾ ಪಟ್ಟಿ ಬಗ್ಗೆ ಕೇಳಿ.";
      case 'mr': return "नमस्कार! मी AgriAssist AI आहे. पीक भाव, खरेदीदार किंवा यादीसाठी विचारा.";
      default:   return "Namaste! I am AgriAssist. Ask me about crop prices, nearby buyers, or say: 'I have 200 kg of tomatoes to sell'.";
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: initialGreeting() }
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const t = translations[language];

  // ── TTS: speak text in correct language ─────────────────────────────────
  // Strategy:
  //  1. Detect language of reply text (Telugu / Hindi / English etc.)
  //  2. Try to use browser's native SpeechSynthesis with matching voice
  //  3. If NO native voice found (common for Telugu on Windows),
  //     fall back to Google Translate TTS audio — works for all languages
  const speakText = useCallback((text: string) => {
    // Strip markdown bold markers before speaking
    const clean = text.replace(/\*\*/g, '').trim();
    if (!clean) return;

    const detectedLang = detectTextLanguage(clean);
    const bcp47 = LANG_BCP47[detectedLang];

    // ── Try native browser TTS first ──────────────────────────────────────
    const tryNativeTTS = (): boolean => {
      if (!('speechSynthesis' in window)) return false;
      const voices = window.speechSynthesis.getVoices();
      const voice = findVoice(bcp47);
      if (!voice) return false; // no native voice for this language

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
      return true;
    };

    // ── Google Translate TTS fallback ─────────────────────────────────────
    // Works for Telugu (te), Hindi (hi), Tamil (ta), Kannada (kn), etc.
    // Splits long text into ≤200-char chunks (GT limit) and plays them sequentially.
    const playGoogleTTS = (textChunks: string[], idx = 0) => {
      if (idx >= textChunks.length) return;
      const chunk = encodeURIComponent(textChunks[idx]);
      // Use Google Translate TTS (free, no API key needed for short requests)
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${chunk}&tl=${detectedLang}&client=tw-ob`;
      const audio = new Audio(url);
      audio.onended = () => playGoogleTTS(textChunks, idx + 1);
      audio.onerror = () => {
        // If Google TTS fails (network/CORS), silently skip — text is still shown
        console.warn('Google TTS unavailable, text shown in chat.');
      };
      audio.play().catch(() => {
        console.warn('Audio playback blocked. User interaction may be required.');
      });
    };

    // Split text into ≤200 char pieces at sentence boundaries
    const splitText = (t: string, maxLen = 190): string[] => {
      const chunks: string[] = [];
      let remaining = t;
      while (remaining.length > maxLen) {
        // Try to break at last period/comma/space before maxLen
        let breakAt = remaining.lastIndexOf('.', maxLen);
        if (breakAt < 80) breakAt = remaining.lastIndexOf(' ', maxLen);
        if (breakAt < 1) breakAt = maxLen;
        chunks.push(remaining.slice(0, breakAt + 1).trim());
        remaining = remaining.slice(breakAt + 1).trim();
      }
      if (remaining.length > 0) chunks.push(remaining);
      return chunks;
    };

    // First attempt: native voices (available immediately or after load)
    const voices = window.speechSynthesis?.getVoices() ?? [];
    if (voices.length > 0) {
      if (tryNativeTTS()) return;
      // No native voice — use Google TTS
      playGoogleTTS(splitText(clean));
    } else if ('speechSynthesis' in window) {
      // Voices not loaded yet — wait then retry
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        if (!tryNativeTTS()) {
          playGoogleTTS(splitText(clean));
        }
      };
    } else {
      // No speechSynthesis at all — go straight to Google TTS
      playGoogleTTS(splitText(clean));
    }
  }, []);


  // ── Speech Recognition: use voiceLang for mic locale ────────────────────
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = LANG_BCP47[voiceLang];

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputQuery(transcript);
      handleSend(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend   = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, [voiceLang]); // re-init recognition when user picks a different language

  const toggleListening = () => {
    if (!recognitionRef.current) {
      // Demo fallback when browser has no Speech API
      const samples: Record<DetectedLang, string> = {
        te: "నా దగ్గర 200 కేజీల టమాటాలు అమ్మకానికి ఉన్నాయి",
        hi: "मेरे पास 200 किलो टमाटर बेचने के लिए हैं",
        ta: "என்னிடம் 200 கிலோ தக்காளி விற்கவிருக்கிறது",
        kn: "ನನ್ನ ಬಳಿ 200 ಕೆಜಿ ಟೊಮ್ಯಾಟೊ ಮಾರಾಟಕ್ಕಿದೆ",
        mr: "माझ्याकडे 200 किलो टमाटे विकायचे आहेत",
        en: "I have 200 kilos of tomatoes to sell",
      };
      const sample = samples[voiceLang];
      setInputQuery(sample);
      handleSend(sample);
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q) return;

    // Add user message
    const newMessages: Message[] = [...messages, { sender: 'user', text: q }];
    setMessages(newMessages);
    setInputQuery("");

    // Auto-detect language of typed/spoken input, update voiceLang
    const inputLang = detectTextLanguage(q);
    if (inputLang !== 'en') setVoiceLang(inputLang);

    // Check if voice listing intent (multilingual keywords)
    const isListingIntent =
      q.toLowerCase().includes("sell") ||
      q.toLowerCase().includes("have") ||
      q.toLowerCase().includes("kilos") ||
      q.toLowerCase().includes("kg") ||
      q.includes("అమ్మకానికి") ||
      q.includes("కేజీ") ||
      q.includes("बेचने") ||
      q.includes("किलो") ||
      q.includes("விற்க") ||
      q.includes("மாரல்") ||
      q.includes("ಮಾರಾಟ") ||
      q.includes("विकायच");

    if (isListingIntent) {
      try {
        const draftRes = await api.parseVoice(q);
        const botReply = draftRes.message;
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: botReply,
            isDraft: true,
            draftData: {
              crop_name: draftRes.crop_name,
              quantity_kg: draftRes.quantity,
              price_per_kg: draftRes.suggested_price
            }
          }
        ]);
        speakText(botReply);
        return;
      } catch (err) {
        console.warn("Error parsing voice intent:", err);
      }
    }

    // Normal FAQ / NLP chat
    try {
      const chatRes = await api.chatWithAgriAssist(q, language);
      setMessages([
        ...newMessages,
        {
          sender: 'bot',
          text: chatRes.reply,
          action_link: chatRes.action_link,
          action_label: chatRes.action_label
        }
      ]);
      speakText(chatRes.reply);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          sender: 'bot',
          text: "I can assist you with crop suggestions, current mandi prices, and direct buyer connections. Try asking: 'What crop should I grow?' or 'Who is buying tomatoes near me?'"
        }
      ]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '16px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '560px',
        width: '100%',
        height: '620px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-xl)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--surface-200)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--primary-50)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-600)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                AgriAssist AI
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                Multilingual Voice & Farming Assistant
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Language Selector */}
            <select
              value={voiceLang}
              onChange={e => setVoiceLang(e.target.value as DetectedLang)}
              title="Select voice language"
              style={{
                fontSize: '0.75rem',
                padding: '4px 8px',
                borderRadius: '8px',
                border: '1px solid var(--primary-200)',
                backgroundColor: '#ffffff',
                color: 'var(--primary-800)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {(Object.keys(LANG_LABEL) as DetectedLang[]).map(code => (
                <option key={code} value={code}>{LANG_LABEL[code]}</option>
              ))}
            </select>
            <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Message Log */}
        <div style={{
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          backgroundColor: 'var(--surface-50)'
        }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '10px',
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              {m.sender === 'bot' && (
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-200)',
                  color: 'var(--primary-800)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Sparkles size={16} />
                </div>
              )}

              <div style={{
                backgroundColor: m.sender === 'user' ? 'var(--primary-600)' : '#ffffff',
                color: m.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                padding: '12px 16px',
                borderRadius: '14px',
                boxShadow: 'var(--shadow-sm)',
                border: m.sender === 'bot' ? '1px solid var(--surface-200)' : 'none',
                fontSize: '0.9rem',
                lineHeight: 1.45
              }}>
                <p style={{ margin: 0 }}>{m.text}</p>

                {/* Listing Draft confirmation button */}
                {m.isDraft && m.draftData && (
                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--surface-200)' }}>
                    <div style={{ backgroundColor: 'var(--primary-50)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '8px' }}>
                      🌱 Crop: <strong>{m.draftData.crop_name}</strong> • Qty: <strong>{m.draftData.quantity_kg} kg</strong> • Est. Price: <strong>₹{m.draftData.price_per_kg}/kg</strong>
                    </div>
                    <button
                      onClick={() => {
                        onApplyVoiceListingDraft(m.draftData);
                        onClose();
                      }}
                      className="btn-accent"
                      style={{ padding: '8px 14px', fontSize: '0.82rem', width: '100%' }}
                    >
                      <Check size={14} />
                      <span>Confirm & Open Listing Form</span>
                    </button>
                  </div>
                )}

                {/* Direct Action Link */}
                {m.action_link && (
                  <button
                    onClick={() => {
                      const tab = m.action_link?.replace('/', '');
                      if (tab) onNavigateTab(tab);
                      onClose();
                    }}
                    style={{
                      marginTop: '10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--primary-700)',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      background: 'none',
                      padding: 0
                    }}
                  >
                    <span>{m.action_label}</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Voice Demo Pills */}
        <div style={{ padding: '8px 16px', backgroundColor: '#ffffff', borderTop: '1px solid var(--surface-100)', display: 'flex', gap: '6px', overflowX: 'auto' }}>
          <button
            onClick={() => handleSend("What crop should I grow this season?")}
            style={{ padding: '4px 10px', borderRadius: '14px', fontSize: '0.75rem', backgroundColor: 'var(--surface-100)', color: 'var(--text-secondary)', border: 'none', whiteSpace: 'nowrap' }}
          >
            What crop should I grow?
          </button>
          <button
            onClick={() => handleSend("I have 200 kilos of tomatoes to sell")}
            style={{ padding: '4px 10px', borderRadius: '14px', fontSize: '0.75rem', backgroundColor: '#fef3c7', color: '#b45309', border: 'none', whiteSpace: 'nowrap', fontWeight: 600 }}
          >
            "I have 200 kg tomatoes to sell"
          </button>
          <button
            onClick={() => handleSend("Who is buying tomatoes near me?")}
            style={{ padding: '4px 10px', borderRadius: '14px', fontSize: '0.75rem', backgroundColor: 'var(--surface-100)', color: 'var(--text-secondary)', border: 'none', whiteSpace: 'nowrap' }}
          >
            Who is buying near me?
          </button>
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '14px 18px',
          borderTop: '1px solid var(--surface-200)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#ffffff'
        }}>
          {/* Voice Microphone Button */}
          <button
            onClick={toggleListening}
            title={isListening ? "Listening... click to stop" : "Speak to AgriAssist"}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: isListening ? '#dc2626' : 'var(--primary-50)',
              color: isListening ? '#ffffff' : 'var(--primary-700)',
              border: isListening ? '2px solid #ef4444' : '1px solid var(--primary-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: isListening ? 'pulse 1.2s infinite' : 'none',
              flexShrink: 0
            }}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? (voiceLang === 'te' ? 'వింటున్నాను...' : voiceLang === 'hi' ? 'सुन रहा हूँ...' : voiceLang === 'ta' ? 'கேட்கிறேன்...' : voiceLang === 'kn' ? 'ಕೇಳುತ್ತಿದ್ದೇನೆ...' : voiceLang === 'mr' ? 'ऐकतो आहे...' : 'Listening...') : (voiceLang === 'te' ? 'తెలుగులో అడగండి...' : voiceLang === 'hi' ? 'हिन्दी में पूछें...' : voiceLang === 'ta' ? 'தமிழில் கேளுங்கள்...' : voiceLang === 'kn' ? 'ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ...' : voiceLang === 'mr' ? 'मराठीत विचारा...' : 'Ask in English, Telugu, Hindi...')}
            style={{ flex: 1, height: '46px', borderRadius: '12px' }}
          />

          <button
            onClick={() => handleSend()}
            className="btn-primary"
            style={{ width: '46px', height: '46px', borderRadius: '12px', padding: 0 }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
