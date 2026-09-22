import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, X, Sparkles, Bot, User, ArrowRight, Check } from 'lucide-react';
import { api } from '../api';
import { Language, translations } from '../i18n';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: language === 'te'
        ? "నమస్కారం! నేను అగ్రిఅసిస్ట్ (AgriAssist) AI. పంట ధరలు, సమీపంలోని కొనుగోలుదారులు, లేదా పంట లిస్టింగ్ గురించి నాతో మాట్లాడండి."
        : language === 'hi'
        ? "नमस्ते! मैं एग्रीअसिस्ट (AgriAssist) AI हूँ। आप मुझसे मंडी भाव, फसल सलाह या बोलकर लिस्ट बनाने के लिए पूछ सकते हैं।"
        : "Namaste! I am AgriAssist, your AI farm and market companion. You can speak or type to check mandi prices, crop advice, or say: 'I have 200 kilos of tomatoes to sell'."
    }
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  // Speech Recognition setup
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        handleSend(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      // Simulate voice input demo for testing
      const sampleVoice = language === 'te'
        ? "నా దగ్గర 200 కేజీల టమాటాలు అమ్మకానికి ఉన్నాయి"
        : language === 'hi'
        ? "मेरे पास 200 किलो टमाटर बेचने के लिए हैं"
        : "I have 200 kilos of tomatoes to sell";
      setInputQuery(sampleVoice);
      handleSend(sampleVoice);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q) return;

    // Add user message
    const newMessages: Message[] = [...messages, { sender: 'user', text: q }];
    setMessages(newMessages);
    setInputQuery("");

    // Check if voice listing intent
    const isListingIntent = q.toLowerCase().includes("sell") ||
      q.toLowerCase().includes("have") ||
      q.toLowerCase().includes("kilos") ||
      q.toLowerCase().includes("kg") ||
      q.includes("అమ్మకానికి") ||
      q.includes("కేజీ") ||
      q.includes("बेचने") ||
      q.includes("किलो");

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
      speakText(chatRes.reply.replace(/\*\*/g, ''));
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

          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
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
            placeholder={isListening ? t.voiceListening : "Ask in English, Telugu, or Hindi..."}
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
