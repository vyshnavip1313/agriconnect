import React, { useState } from 'react';
import { Sprout, Mic, Bell, Globe, User, ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';
import { Language, translations } from '../i18n';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: 'farmer' | 'buyer';
  setUserRole: (role: 'farmer' | 'buyer') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenAgriAssist: () => void;
  notifications: any[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  language,
  setLanguage,
  onOpenAgriAssist,
  notifications
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { id: 'marketplace', label: t.navMarketplace },
    { id: userRole === 'farmer' ? 'farmer-dash' : 'buyer-dash', label: userRole === 'farmer' ? t.navFarmerDash : t.navBuyerDash },
    { id: 'crop-id', label: t.navCropId },
    { id: 'what-to-grow', label: t.navWhatToGrow },
    { id: 'price-intel', label: t.navPriceIntel },
    { id: 'smart-match', label: t.navSmartMatch },
    { id: 'orders', label: t.navOrders },
    { id: 'map', label: t.navMap },
    { id: 'admin', label: t.navAdmin }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--surface-200)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #10b981, #047857)',
            borderRadius: '12px',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
          }}>
            <Sprout size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                Agri<span style={{ color: 'var(--primary-600)' }}>Link</span>
              </span>
              <span style={{
                fontSize: '0.68rem',
                backgroundColor: 'var(--primary-100)',
                color: 'var(--primary-800)',
                padding: '2px 7px',
                borderRadius: '6px',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                AI Direct
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
              {language === 'te' ? 'పొలం నుండి కొనుగోలుదారు వరకు' : language === 'hi' ? 'खेत से सीधे खरीदार तक' : 'From Farm to Buyer'}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', gap: '4px', alignItems: 'center' }} className="desktop-nav">
          <style>{`
            @media (min-width: 992px) {
              .desktop-nav { display: flex !important; }
              .mobile-toggle { display: none !important; }
            }
          `}</style>
          {navLinks.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                style={{
                  background: isActive ? 'var(--primary-50)' : 'transparent',
                  color: isActive ? 'var(--primary-700)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: isActive ? '1px solid var(--primary-200)' : '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Role switch, Language, Voice AI, Notifications */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Role Toggle Switcher */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--surface-100)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid var(--surface-200)'
          }}>
            <button
              onClick={() => {
                setUserRole('farmer');
                if (currentTab === 'buyer-dash') setCurrentTab('farmer-dash');
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: userRole === 'farmer' ? 700 : 500,
                backgroundColor: userRole === 'farmer' ? '#ffffff' : 'transparent',
                color: userRole === 'farmer' ? 'var(--primary-700)' : 'var(--text-muted)',
                boxShadow: userRole === 'farmer' ? 'var(--shadow-sm)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              🌱 {language === 'te' ? 'రైతు' : language === 'hi' ? 'किसान' : 'Farmer'}
            </button>
            <button
              onClick={() => {
                setUserRole('buyer');
                if (currentTab === 'farmer-dash') setCurrentTab('buyer-dash');
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: userRole === 'buyer' ? 700 : 500,
                backgroundColor: userRole === 'buyer' ? '#ffffff' : 'transparent',
                color: userRole === 'buyer' ? 'var(--primary-700)' : 'var(--text-muted)',
                boxShadow: userRole === 'buyer' ? 'var(--shadow-sm)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              🛒 {language === 'te' ? 'కొనుగోలుదారు' : language === 'hi' ? 'खरीदार' : 'Buyer'}
            </button>
          </div>

          {/* Multilingual Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--surface-50)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--surface-200)' }}>
            <Globe size={15} color="var(--text-muted)" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '0.82rem',
                fontWeight: 600,
                padding: '2px',
                width: 'auto',
                cursor: 'pointer'
              }}
            >
              <option value="en">English</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>

          {/* Voice-First Trigger Button */}
          <button
            onClick={onOpenAgriAssist}
            title={t.voiceButton}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#fef3c7',
              color: '#b45309',
              border: '1px solid #fde68a',
              borderRadius: '20px',
              padding: '7px 14px',
              fontWeight: 700,
              fontSize: '0.84rem',
              boxShadow: '0 2px 6px rgba(245, 158, 11, 0.2)'
            }}
          >
            <Mic size={16} />
            <span style={{ display: 'none' }} className="voice-text">
              <style>{`@media (min-width: 640px) { .voice-text { display: inline !important; } }`}</style>
              {language === 'te' ? 'వాయిస్ అసిస్టెంట్' : language === 'hi' ? 'बोलिए' : 'AgriVoice'}
            </span>
          </button>

          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface-100)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  backgroundColor: 'var(--danger)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '50px',
                right: 0,
                width: '320px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--surface-200)',
                padding: '12px',
                zIndex: 1000
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid var(--surface-100)' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                    {language === 'te' ? 'తాజా నోటిఫికేషన్లు' : language === 'hi' ? 'ताज़ा सूचनाएं' : 'Real-time Farmer Alerts'}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--primary-600)', fontWeight: 600 }}>{notifications.length} Alerts</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setShowNotifications(false);
                        if (n.action_link) {
                          const tab = n.action_link.replace('/', '');
                          setCurrentTab(tab);
                        }
                      }}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        backgroundColor: n.read ? 'var(--surface-50)' : 'var(--primary-50)',
                        borderLeft: n.type.includes('Price') ? '3px solid #f59e0b' : n.type.includes('Buyer') ? '3px solid #10b981' : '3px solid #3b82f6',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{n.title}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{n.time}</span>
                      </div>
                      <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.3 }}>{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: 'var(--surface-100)',
              color: 'var(--text-primary)'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--surface-200)',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setMobileMenuOpen(false);
              }}
              style={{
                textAlign: 'left',
                padding: '10px 14px',
                borderRadius: '8px',
                fontWeight: currentTab === item.id ? 700 : 500,
                backgroundColor: currentTab === item.id ? 'var(--primary-50)' : 'transparent',
                color: currentTab === item.id ? 'var(--primary-700)' : 'var(--text-primary)'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
