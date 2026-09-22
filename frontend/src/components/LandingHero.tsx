import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, TrendingUp, Cpu, Users, ChevronRight, Mic, CheckCircle2, Play } from 'lucide-react';
import { Language, translations } from '../i18n';

interface LandingHeroProps {
  onSellCrop: () => void;
  onFindCrops: () => void;
  onTryAiCropId: () => void;
  onOpenAgriAssist: () => void;
  language: Language;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onSellCrop,
  onFindCrops,
  onTryAiCropId,
  onOpenAgriAssist,
  language
}) => {
  const t = translations[language];

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '900px',
        height: '500px',
        background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.15) 0%, rgba(245, 158, 11, 0.08) 50%, rgba(255, 255, 255, 0) 80%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '48px 16px 64px 16px', position: 'relative', zIndex: 1 }}>
        {/* Top Innovation Pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--primary-50)',
            border: '1px solid var(--primary-200)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            color: 'var(--primary-800)',
            fontSize: '0.86rem',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.12)'
          }}>
            <Sparkles size={16} color="var(--primary-600)" />
            <span>Eliminating Middlemen with Real-time AI Crop Intelligence</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 36px auto' }}>
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            lineHeight: 1.15,
            marginBottom: '18px',
            background: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #d97706 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {t.heroTitle}
          </h1>
          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '780px',
            margin: '0 auto'
          }}>
            {t.heroSubtitle}
          </p>

          {/* Primary Action Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '32px'
          }}>
            <button
              onClick={onSellCrop}
              className="btn-accent"
              style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '14px' }}
            >
              🌱 {t.sellMyCrop}
              <ArrowRight size={20} />
            </button>
            <button
              onClick={onFindCrops}
              className="btn-primary"
              style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '14px' }}
            >
              🔍 {t.findCrops}
            </button>
            <button
              onClick={onOpenAgriAssist}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#ffffff',
                color: '#b45309',
                border: '1.5px solid #fde68a',
                padding: '14px 22px',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Mic size={18} />
              {language === 'te' ? 'వాయిస్ లిస్టింగ్ ట్రై చేయండి' : language === 'hi' ? 'बोलकर लिस्ट बनाएं' : 'Try Voice Listing'}
            </button>
          </div>
        </div>

        {/* Visual Workflow: Farmer -> AI -> Crop Intel -> Smart Matching -> Buyer */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '28px 24px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--surface-200)',
          marginTop: '40px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {t.workflowTitle}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {t.workflowSubtitle}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '16px',
            position: 'relative',
            alignItems: 'stretch'
          }}>
            {/* Step 1: Farmer */}
            <div style={{
              backgroundColor: 'var(--surface-50)',
              borderRadius: '14px',
              padding: '20px 16px',
              border: '1px solid var(--surface-200)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-100)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
                fontWeight: 800,
                fontSize: '1.2rem'
              }}>
                👨‍🌾
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>{t.stepFarmer}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Farmer snaps photo or speaks harvest quantity in regional language.
              </p>
            </div>

            {/* Step 2: AI Crop ID */}
            <div style={{
              backgroundColor: '#eff6ff',
              borderRadius: '14px',
              padding: '20px 16px',
              border: '1px solid #bfdbfe',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}>
                <Cpu size={24} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '6px' }}>{t.stepAiId}</h4>
              <p style={{ fontSize: '0.8rem', color: '#3b82f6' }}>
                Vision model identifies crop, variety, and grants "AI Crop Verified" badge.
              </p>
            </div>

            {/* Step 3: Season & Price Intel */}
            <div style={{
              backgroundColor: '#fffbeb',
              borderRadius: '14px',
              padding: '20px 16px',
              border: '1px solid #fef3c7',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#fde68a',
                color: '#b45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}>
                <TrendingUp size={24} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#92400e', marginBottom: '6px' }}>{t.stepIntel}</h4>
              <p style={{ fontSize: '0.8rem', color: '#b45309' }}>
                Historical mandi charts & "Know Your Price" prevent distress selling.
              </p>
            </div>

            {/* Step 4: Smart Matching */}
            <div style={{
              backgroundColor: 'var(--primary-50)',
              borderRadius: '14px',
              padding: '20px 16px',
              border: '1px solid var(--primary-200)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-200)',
                color: 'var(--primary-800)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}>
                <Sparkles size={24} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '6px' }}>{t.stepMatch}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--primary-700)' }}>
                Multi-factor algorithm pairs nearby buyers with 90%+ compatibility.
              </p>
            </div>

            {/* Step 5: Direct Buyer Deal */}
            <div style={{
              backgroundColor: 'var(--surface-50)',
              borderRadius: '14px',
              padding: '20px 16px',
              border: '1px solid var(--surface-200)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#fed7aa',
                color: '#c2410c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
                fontSize: '1.2rem'
              }}>
                🏢
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>{t.stepBuyer}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Direct chat, automated escrow order, zero commission deducted.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Highlights Band */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginTop: '36px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            backgroundColor: '#ffffff',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid var(--surface-200)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <CheckCircle2 size={28} color="var(--primary-600)" />
            <div>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Zero Middleman Commission</h5>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Farmers retain up to 25% higher profit margin.</p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            backgroundColor: '#ffffff',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid var(--surface-200)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Cpu size={28} color="#3b82f6" />
            <div>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Computer Vision Crop ID</h5>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Auto-detects crop & grade from a simple photo.</p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            backgroundColor: '#ffffff',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid var(--surface-200)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <ShieldCheck size={28} color="#f59e0b" />
            <div>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Verified Commercial Buyers</h5>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Food processors, supermarket chains & exporters.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
