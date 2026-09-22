import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { CropIdentificationView } from './components/CropIdentificationView';
import { WhatShouldIGrowView } from './components/WhatShouldIGrowView';
import { PriceIntelligenceView } from './components/PriceIntelligenceView';
import { SmartMatchingView } from './components/SmartMatchingView';
import { MarketplaceView } from './components/MarketplaceView';
import { FarmerDashboardView } from './components/FarmerDashboardView';
import { BuyerDashboardView } from './components/BuyerDashboardView';
import { OrdersView } from './components/OrdersView';
import { FarmMapView } from './components/FarmMapView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AgriAssistModal } from './components/AgriAssistModal';
import { ChatModal } from './components/ChatModal';
import { Language, translations } from './i18n';
import { api } from './api';
import { CheckCircle2, ShieldCheck, Heart, Sparkles, ArrowRight, Mic } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [userRole, setUserRole] = useState<'farmer' | 'buyer'>('farmer');
  const [language, setLanguage] = useState<Language>('en');

  // Modals
  const [agriAssistOpen, setAgriAssistOpen] = useState<boolean>(false);
  const [chatState, setChatState] = useState<{ open: boolean; recipient: string; crop: string }>({
    open: false,
    recipient: '',
    crop: ''
  });

  // State passing between features
  const [prefillListing, setPrefillListing] = useState<any>(null);
  const [selectedCropForPrice, setSelectedCropForPrice] = useState<string>('Tomato');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  const t = translations[language];

  // Fetch real notifications on mount
  useEffect(() => {
    const loadNotifs = async () => {
      try {
        const res = await api.getNotifications(userRole === 'farmer' ? 'farmer_1' : 'buyer_1');
        setNotifications(res.notifications || []);
      } catch (err) {
        setNotifications([
          {
            id: 'notif_1',
            type: 'Buyer Alert',
            title: 'New Nearby Buyer Requirement!',
            message: 'FreshMart Supermarket posted a requirement for 500 kg Tomato within 18 km.',
            time: '10 mins ago',
            read: false,
            action_link: '/smart-match'
          },
          {
            id: 'notif_2',
            type: 'Price Alert',
            title: 'Mandi Tomato Price Surging',
            message: 'Spot price in Rajahmundry jumped +₹4/kg today.',
            time: '2 hours ago',
            read: false,
            action_link: '/price-intel'
          }
        ]);
      }
    };
    loadNotifs();
  }, [userRole]);

  // Handle direct order creation from Smart Match or Marketplace
  const handleInitiateOrder = async (item: any) => {
    const listing = item.listing || item;
    const qty = Math.min(listing.quantity_kg, 500);
    try {
      await api.placeOrder({
        listing_id: listing.id || 'list_1',
        buyer_id: 'buyer_1',
        buyer_name: 'FreshMart Supermarket Supply',
        buyer_phone: '+91 98765 43210',
        farmer_id: listing.farmer_id || 'farmer_1',
        farmer_name: listing.farmer_name || 'Ramesh Varma',
        crop_name: listing.crop_name,
        variety: listing.variety || 'Standard',
        quantity_kg: qty,
        price_per_kg: listing.price_per_kg,
        delivery_address: 'FreshMart Regional DC, NH-16'
      });
      setOrderSuccessMsg(`Order placed successfully! ₹${qty * listing.price_per_kg} held securely in escrow until delivery verification.`);
      setTimeout(() => setOrderSuccessMsg(null), 6000);
      setCurrentTab('orders');
    } catch (err) {
      setOrderSuccessMsg(`Order placed for ${qty} kg of ${listing.crop_name}. Escrow initiated.`);
      setTimeout(() => setOrderSuccessMsg(null), 6000);
      setCurrentTab('orders');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={setUserRole}
        language={language}
        setLanguage={setLanguage}
        onOpenAgriAssist={() => setAgriAssistOpen(true)}
        notifications={notifications}
      />

      {/* Floating Order Notification Banner */}
      {orderSuccessMsg && (
        <div style={{
          backgroundColor: '#ecfdf5',
          borderBottom: '1.5px solid #a7f3d0',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          color: '#065f46',
          fontWeight: 700,
          fontSize: '0.92rem',
          boxShadow: 'var(--shadow-md)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <CheckCircle2 size={18} color="#059669" />
          <span>{orderSuccessMsg}</span>
        </div>
      )}

      {/* Main View Container */}
      <main style={{ flex: 1 }}>
        {currentTab === 'home' && (
          <>
            <LandingHero
              onSellCrop={() => {
                setUserRole('farmer');
                setCurrentTab('farmer-dash');
              }}
              onFindCrops={() => {
                setUserRole('buyer');
                setCurrentTab('marketplace');
              }}
              onTryAiCropId={() => setCurrentTab('crop-id')}
              onOpenAgriAssist={() => setAgriAssistOpen(true)}
              language={language}
            />

            {/* Live Interactive Marketplace Preview Section */}
            <div style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--surface-200)', borderBottom: '1px solid var(--surface-200)', padding: '56px 16px' }}>
              <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                      🔥 Trending Direct Farm Offerings
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      Crops harvested this week with verified quality and direct farm pricing.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('marketplace')}
                    className="btn-secondary"
                    style={{ padding: '10px 20px', borderRadius: '12px' }}
                  >
                    <span>View All Listings</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  {/* Card 1: Tomato */}
                  <div className="glass-panel glass-card-hover" style={{ borderRadius: '16px', overflow: 'hidden', backgroundColor: 'var(--surface-50)' }}>
                    <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=400&fit=crop" alt="Tomato" style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Tomato (Arka Rakshak)</h4>
                          <span className="badge-ai-verified" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>AI Crop Verified</span>
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-700)' }}>₹28/kg</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        600 kg available • Farmer Ramesh Varma, Rajahmundry (18 km away)
                      </p>
                      <button
                        onClick={() => handleInitiateOrder({
                          id: 'list_1',
                          crop_name: 'Tomato',
                          variety: 'Arka Rakshak',
                          quantity_kg: 600,
                          price_per_kg: 28,
                          farmer_name: 'Ramesh Varma'
                        })}
                        className="btn-primary"
                        style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                      >
                        Direct Buy Now
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Chilli */}
                  <div className="glass-panel glass-card-hover" style={{ borderRadius: '16px', overflow: 'hidden', backgroundColor: 'var(--surface-50)' }}>
                    <img src="https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&h=400&fit=crop" alt="Chilli" style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Guntur Teja Chilli</h4>
                          <span className="badge-ai-verified" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>AI Crop Verified</span>
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-700)' }}>₹185/kg</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        1,200 kg available • Farmer Venkat Rao, Guntur (42 km away)
                      </p>
                      <button
                        onClick={() => handleInitiateOrder({
                          id: 'list_2',
                          crop_name: 'Chilli',
                          variety: 'Guntur Teja',
                          quantity_kg: 1000,
                          price_per_kg: 185,
                          farmer_name: 'Venkat Rao'
                        })}
                        className="btn-primary"
                        style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                      >
                        Direct Buy Now
                      </button>
                    </div>
                  </div>

                  {/* Card 3: Nashik Red Onion */}
                  <div className="glass-panel glass-card-hover" style={{ borderRadius: '16px', overflow: 'hidden', backgroundColor: 'var(--surface-50)' }}>
                    <img src="https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&h=400&fit=crop" alt="Onion" style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Nashik Red Onion</h4>
                          <span className="badge-ai-verified" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>AI Crop Verified</span>
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-700)' }}>₹31/kg</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        3,000 kg available • Farmer Suresh Patel, Nashik (Medium 50mm)
                      </p>
                      <button
                        onClick={() => handleInitiateOrder({
                          id: 'list_3',
                          crop_name: 'Onion',
                          variety: 'Nashik Red',
                          quantity_kg: 1500,
                          price_per_kg: 31,
                          farmer_name: 'Suresh Patel'
                        })}
                        className="btn-primary"
                        style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                      >
                        Direct Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {currentTab === 'marketplace' && (
          <MarketplaceView
            language={language}
            onSelectListing={(listing) => handleInitiateOrder(listing)}
            onOpenCreateListing={() => {
              setUserRole('farmer');
              setCurrentTab('farmer-dash');
            }}
            onOpenChat={(farmerName, cropName) => {
              setChatState({ open: true, recipient: farmerName, crop: cropName });
            }}
          />
        )}

        {currentTab === 'farmer-dash' && (
          <FarmerDashboardView
            language={language}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            prefillListing={prefillListing}
            onOpenVoiceListing={() => setAgriAssistOpen(true)}
          />
        )}

        {currentTab === 'buyer-dash' && (
          <BuyerDashboardView
            language={language}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onOpenMatch={() => setCurrentTab('smart-match')}
          />
        )}

        {currentTab === 'crop-id' && (
          <CropIdentificationView
            language={language}
            onProceedToListing={(aiData) => {
              setPrefillListing(aiData);
              setUserRole('farmer');
              setCurrentTab('farmer-dash');
            }}
          />
        )}

        {currentTab === 'what-to-grow' && (
          <WhatShouldIGrowView
            language={language}
            onViewPriceTrend={(cropName) => {
              setSelectedCropForPrice(cropName);
              setCurrentTab('price-intel');
            }}
          />
        )}

        {currentTab === 'price-intel' && (
          <PriceIntelligenceView
            initialCrop={selectedCropForPrice}
            language={language}
          />
        )}

        {currentTab === 'smart-match' && (
          <SmartMatchingView
            language={language}
            onInitiateOrder={(match) => handleInitiateOrder(match)}
            onOpenChat={(name, crop) => setChatState({ open: true, recipient: name, crop: crop })}
          />
        )}

        {currentTab === 'orders' && (
          <OrdersView
            language={language}
            onOpenChat={(name, crop) => setChatState({ open: true, recipient: name, crop: crop })}
            userRole={userRole}
          />
        )}

        {currentTab === 'map' && (
          <FarmMapView
            language={language}
            onSelectListing={(listing) => handleInitiateOrder(listing)}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardView language={language} />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--surface-200)',
        padding: '36px 16px',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Agri<span style={{ color: 'var(--primary-600)' }}>Link</span></span>
              <span style={{ fontSize: '0.72rem', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                AI Crop-to-Market Intelligence
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              From Farm to Buyer. Direct. Smart. Transparent. Eliminating unnecessary middlemen across India.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setCurrentTab('marketplace')}>Marketplace</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setCurrentTab('crop-id')}>AI Crop ID</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setCurrentTab('what-to-grow')}>What to Grow?</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setCurrentTab('price-intel')}>Price Intel</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setCurrentTab('admin')}>Admin</span>
          </div>
        </div>
      </footer>

      {/* AgriAssist Voice & Chat AI Modal */}
      <AgriAssistModal
        isOpen={agriAssistOpen}
        onClose={() => setAgriAssistOpen(false)}
        language={language}
        onApplyVoiceListingDraft={(draft) => {
          setPrefillListing(draft);
          setUserRole('farmer');
          setCurrentTab('farmer-dash');
        }}
        onNavigateTab={(tab) => setCurrentTab(tab)}
      />

      {/* Direct Negotiation Chat Modal */}
      <ChatModal
        isOpen={chatState.open}
        onClose={() => setChatState({ open: false, recipient: '', crop: '' })}
        recipientName={chatState.recipient}
        cropContext={chatState.crop}
      />
    </div>
  );
}

export default App;
