import React, { useState } from 'react';
import { X, Send, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  cropContext: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  cropContext
}) => {
  const [messages, setMessages] = useState<any[]>([
    {
      sender: 'them',
      text: `Hello! Regarding the ${cropContext} harvest listing: what is your final dispatch date and crate packing standard?`,
      time: '14:20'
    },
    {
      sender: 'me',
      text: `Namaskaram! We have plastic ventilated 25 kg crates ready. Grade A produce with zero post-harvest bruise. Can dispatch in 48 hours.`,
      time: '14:22'
    },
    {
      sender: 'them',
      text: `Perfect! We can accept the price at the listed rate through AgriLink direct escrow.`,
      time: '14:25'
    }
  ]);

  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        sender: 'me',
        text: input.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'them',
          text: `Agreed! I am confirming the delivery slot with our procurement transport team. Thank you!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2500,
      padding: '16px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '500px',
        width: '100%',
        height: '560px',
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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{recipientName}</h3>
              <span className="badge-verified-farmer" style={{ fontSize: '0.65rem' }}>Verified ✓</span>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Direct Chat • Topic: <strong>{cropContext}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backgroundColor: 'var(--surface-50)'
        }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === 'me' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                backgroundColor: m.sender === 'me' ? 'var(--primary-600)' : '#ffffff',
                color: m.sender === 'me' ? '#ffffff' : 'var(--text-primary)',
                padding: '10px 14px',
                borderRadius: '14px',
                boxShadow: 'var(--shadow-sm)',
                fontSize: '0.88rem'
              }}
            >
              <p style={{ margin: 0 }}>{m.text}</p>
              <span style={{ fontSize: '0.65rem', opacity: 0.8, display: 'block', textAlign: 'right', marginTop: '4px' }}>
                {m.time}
              </span>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--surface-200)',
          display: 'flex',
          gap: '8px',
          backgroundColor: '#ffffff'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message or negotiate terms..."
            style={{ flex: 1, borderRadius: '10px' }}
          />
          <button
            onClick={handleSend}
            className="btn-primary"
            style={{ padding: '0 16px', borderRadius: '10px' }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
