import React, { useState, useEffect } from 'react';
import { PlusCircle, TrendingUp, Package, IndianRupee, Bell, AlertTriangle, CheckCircle2, Mic, ArrowRight, X, Sparkles } from 'lucide-react';
import { api } from '../api';
import { Language, translations } from '../i18n';

interface FarmerDashboardProps {
  language: Language;
  onNavigateTab: (tab: string) => void;
  prefillListing?: any;
  onOpenVoiceListing: () => void;
}

export const FarmerDashboardView: React.FC<FarmerDashboardProps> = ({
  language,
  onNavigateTab,
  prefillListing,
  onOpenVoiceListing
}) => {
  const [farmerData, setFarmerData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(!!prefillListing);

  // Form State
  const [newListing, setNewListing] = useState({
    crop_name: prefillListing?.crop_name || "Tomato",
    variety: prefillListing?.possible_varieties?.[0] || "Arka Rakshak",
    quantity_kg: 500,
    price_per_kg: prefillListing?.average_mandi_price || 28.0,
    harvest_date: "2026-10-05",
    location: "Rajahmundry, East Godavari, AP",
    grade: "Grade A",
    farming_type: "Conventional (IPM)",
    ai_crop_verified: true,
    confidence_score: prefillListing?.confidence_percentage || 95.0
  });

  const t = translations[language];

  const fetchFarmer = async () => {
    setLoading(true);
    try {
      const res = await api.getFarmerProfile("farmer_1");
      setFarmerData(res);
    } catch (err) {
      console.warn("Using offline farmer profile:", err);
      setFarmerData({
        farmer: {
          name: "Ramesh Varma",
          location: "Rajahmundry, East Godavari, AP",
          farm_size: "6.5 Acres",
          verification_badge: "Verified Farmer ✓",
          rating: 4.9,
          total_earnings: 428000
        },
        active_listings: [
          { id: "list_1", crop_name: "Tomato", quantity_kg: 600, price_per_kg: 28.0, grade: "Grade A", ai_crop_verified: true }
        ],
        completed_deals: [
          { id: "ORD-1092", crop_name: "Tomato", total_amount: 14000, status: "Accepted" }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmer();
  }, []);

  useEffect(() => {
    if (prefillListing) {
      setNewListing(prev => ({
        ...prev,
        crop_name: prefillListing.crop_name,
        variety: prefillListing.possible_varieties?.[0] || "Standard",
        price_per_kg: prefillListing.average_mandi_price || 28.0,
        ai_crop_verified: true,
        confidence_score: prefillListing.confidence_percentage || 95.0
      }));
      setShowCreateModal(true);
    }
  }, [prefillListing]);

  const handleSaveListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createListing(newListing);
      setShowCreateModal(false);
      fetchFarmer();
      alert("Harvest listing published successfully! Commercial buyers nearby have been notified.");
    } catch (err) {
      alert("Listing created (demo state updated).");
      setShowCreateModal(false);
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 16px' }}>
      {/* Farmer Profile Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', marginBottom: '28px', backgroundColor: '#ffffff', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: 800
          }}>
            👨‍🌾
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Ramesh Varma</h2>
              <span className="badge-verified-farmer">Verified Farmer ✓</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              📍 Rajahmundry, East Godavari, AP • Land: <strong>6.5 Acres</strong> • Rating: <strong>⭐ 4.9 (48 reviews)</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onOpenVoiceListing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#fffbeb',
              color: '#b45309',
              border: '1px solid #fde68a',
              padding: '11px 18px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.9rem'
            }}
          >
            <Mic size={18} />
            <span>Voice List Crop</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-accent"
            style={{ padding: '11px 22px', borderRadius: '12px' }}
          >
            <PlusCircle size={18} />
            <span>List Harvest</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '18px',
        marginBottom: '32px'
      }}>
        {/* Active Listings */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
            <span>ACTIVE LISTINGS</span>
            <Package size={18} color="var(--primary-600)" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', color: 'var(--text-primary)' }}>
            2 Crops
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--primary-600)', fontWeight: 600, marginTop: '4px' }}>
            600 kg Tomato, 1,500 kg Mango
          </p>
        </div>

        {/* Available Qty */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
            <span>TOTAL VOLUME LISTED</span>
            <TrendingUp size={18} color="#3b82f6" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', color: 'var(--text-primary)' }}>
            2,100 kg
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#3b82f6', fontWeight: 600, marginTop: '4px' }}>
            Ready for commercial dispatch
          </p>
        </div>

        {/* Buyer Inquiries */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
            <span>BUYER REQUESTS</span>
            <Bell size={18} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', color: 'var(--text-primary)' }}>
            4 Nearby
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: 600, marginTop: '4px' }}>
            FreshMart looking for 500 kg
          </p>
        </div>

        {/* Total Direct Earnings */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
            <span>DIRECT EARNINGS (YTD)</span>
            <IndianRupee size={18} color="var(--success)" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', color: 'var(--success)' }}>
            ₹4,28,000
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600, marginTop: '4px' }}>
            +22% higher than commission agent
          </p>
        </div>
      </div>

      {/* 2 Columns: Smart Action Banners & Recent Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Column: AI Alerts & Seasonal Advice */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Smart Match High Alert */}
          <div style={{
            backgroundColor: 'var(--primary-50)',
            border: '1.5px solid var(--primary-300)',
            borderRadius: '14px',
            padding: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={18} color="var(--primary-700)" />
              <strong style={{ color: 'var(--primary-900)', fontSize: '0.95rem' }}>AI Matching Opportunity (96% Match)</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--primary-800)', lineHeight: 1.4, marginBottom: '12px' }}>
              FreshMart Supermarkets in Vijayawada (18 km away) is ready to purchase 500 kg of your listed Grade A Tomatoes at ₹28/kg.
            </p>
            <button
              onClick={() => onNavigateTab('smart-match')}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.84rem', borderRadius: '8px' }}
            >
              <span>View & Accept Match</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Seasonal Advisory Card */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', backgroundColor: '#ffffff' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--primary-600)" />
              <span>Seasonal Mandi Intel for East Godavari</span>
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '12px' }}>
              Tomato prices in regional hubs are currently trending upwards at <strong>₹32/kg</strong>. Historical peak realization occurs between May and July.
            </p>
            <button
              onClick={() => onNavigateTab('price-intel')}
              style={{ background: 'none', color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>Inspect Price Trends</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 'What Should I Grow?' Card */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', backgroundColor: '#ffffff' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🌱 <span>What Should I Grow Next Season?</span>
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '12px' }}>
              Input your soil type and water availability to get high-profit recommendations for the upcoming season.
            </p>
            <button
              onClick={() => onNavigateTab('what-to-grow')}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.84rem', borderRadius: '8px' }}
            >
              <span>Get Crop Recommendations</span>
            </button>
          </div>
        </div>

        {/* Right Column: Active Listings & Orders */}
        <div className="glass-panel" style={{ padding: '22px', borderRadius: '16px', backgroundColor: '#ffffff' }}>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
            My Active Crop Listings
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid var(--surface-200)', backgroundColor: 'var(--surface-50)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '1rem' }}>Tomato (Arka Rakshak)</strong>
                  <span className="badge-ai-verified" style={{ fontSize: '0.7rem' }}>AI Crop Verified</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  600 kg available • Harvest: 2026-10-02 • Grade A
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-700)' }}>₹28/kg</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Total: ₹16,800</span>
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid var(--surface-200)', backgroundColor: 'var(--surface-50)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '1rem' }}>Mango (Banganapalli)</strong>
                  <span className="badge-ai-verified" style={{ fontSize: '0.7rem' }}>AI Crop Verified</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  1,500 kg available • Harvest: 2026-05-15 • Organic Orchard
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-700)' }}>₹65/kg</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Total: ₹97,500</span>
              </div>
            </div>
          </div>

          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px' }}>
            Recent Direct Orders
          </h4>

          <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid var(--primary-200)', backgroundColor: 'var(--primary-50)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-800)' }}>ORDER ORD-1092</span>
              <span style={{ backgroundColor: 'var(--primary-600)', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                Accepted
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>500 kg Tomato for FreshMart Supermarkets</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Total Escrow Value: ₹14,000 • Expected dispatch Oct 03</p>
          </div>
        </div>
      </div>

      {/* Create Listing Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '560px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusCircle size={22} color="var(--primary-600)" />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>List Crop for Direct Sale</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {prefillListing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--primary-50)', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', border: '1px solid var(--primary-200)', fontSize: '0.84rem', color: 'var(--primary-800)' }}>
                <Sparkles size={16} />
                <span>Pre-filled with AI Crop Identification insights!</span>
              </div>
            )}

            <form onSubmit={handleSaveListing} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Crop Name</label>
                <input
                  type="text"
                  required
                  value={newListing.crop_name}
                  onChange={(e) => setNewListing({ ...newListing, crop_name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Variety</label>
                  <input
                    type="text"
                    value={newListing.variety}
                    onChange={(e) => setNewListing({ ...newListing, variety: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Grade</label>
                  <select
                    value={newListing.grade}
                    onChange={(e) => setNewListing({ ...newListing, grade: e.target.value })}
                  >
                    <option value="Grade A">Grade A (Premium Retail)</option>
                    <option value="Grade B">Grade B (Processing / Bulk)</option>
                    <option value="Export Grade">Export Grade (Pesticide Residue Free)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Quantity Available (kg)</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={newListing.quantity_kg}
                    onChange={(e) => setNewListing({ ...newListing, quantity_kg: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Asking Price (₹/kg)</label>
                  <input
                    type="number"
                    required
                    step={0.5}
                    value={newListing.price_per_kg}
                    onChange={(e) => setNewListing({ ...newListing, price_per_kg: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Harvest Date</label>
                  <input
                    type="date"
                    value={newListing.harvest_date}
                    onChange={(e) => setNewListing({ ...newListing, harvest_date: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Farming Method</label>
                  <select
                    value={newListing.farming_type}
                    onChange={(e) => setNewListing({ ...newListing, farming_type: e.target.value })}
                  >
                    <option value="Conventional (IPM)">Conventional (IPM)</option>
                    <option value="Certified Organic">Certified Organic</option>
                    <option value="Natural Residue-Free">Natural Residue-Free</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Farm Location</label>
                <input
                  type="text"
                  value={newListing.location}
                  onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                />
              </div>

              {/* Total Calculated Value */}
              <div style={{ backgroundColor: 'var(--surface-50)', padding: '12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated Batch Value:</span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--primary-700)' }}>
                  ₹{(newListing.quantity_kg * newListing.price_per_kg).toLocaleString()}
                </strong>
              </div>

              <button
                type="submit"
                className="btn-accent"
                style={{ padding: '14px', borderRadius: '12px', marginTop: '10px' }}
              >
                Publish Listing to Marketplace
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
