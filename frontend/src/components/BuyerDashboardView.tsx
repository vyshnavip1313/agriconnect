import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, ShieldCheck, MapPin, Package, CheckCircle2, ShoppingCart, ArrowRight, X, Sparkles, Building2 } from 'lucide-react';
import { api } from '../api';
import { Language, translations } from '../i18n';

interface BuyerDashboardProps {
  language: Language;
  onNavigateTab: (tab: string) => void;
  onOpenMatch: () => void;
}

export const BuyerDashboardView: React.FC<BuyerDashboardProps> = ({
  language,
  onNavigateTab,
  onOpenMatch
}) => {
  const [requirements, setRequirements] = useState<any[]>([]);
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // New Requirement Form
  const [newReq, setNewReq] = useState({
    crop_name: "Tomato",
    quantity_kg: 500,
    max_price_per_kg: 32.0,
    required_by: "2026-10-15",
    required_grade: "Grade A",
    buyer_location: "Vijayawada / Rajahmundry, AP",
    max_distance_km: 50,
    preferred_farming: "Conventional / IPM",
    notes: "Firm table tomatoes for supermarket retail."
  });

  const t = translations[language];

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const res = await api.getRequirements();
      setRequirements(res.requirements || []);
    } catch (err) {
      console.warn("Using offline buyer requirements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  const handleCreateRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createRequirement({
        buyer_id: "buyer_1",
        buyer_name: "FreshMart Supermarket Supply",
        buyer_contact: "+91 98765 43210",
        ...newReq
      });
      setShowPostModal(false);
      fetchRequirements();
      alert("Crop requirement posted! Farmers within your delivery radius will be notified.");
    } catch (err) {
      setShowPostModal(false);
      fetchRequirements();
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 16px' }}>
      {/* Buyer Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', marginBottom: '28px', backgroundColor: '#ffffff', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem'
          }}>
            🏢
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>FreshMart Supermarket Supply</h2>
              <span className="badge-verified-farmer" style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)' }}>
                Verified Buyer ✓
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Procurement Category: <strong>Retail Chain</strong> • Monthly Volume: <strong>15,000 kg</strong> • Rating: <strong>⭐ 4.9</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="btn-accent"
          style={{ padding: '12px 24px', borderRadius: '12px' }}
        >
          <PlusCircle size={18} />
          <span>Post "I Need This Crop"</span>
        </button>
      </div>

      {/* Quick Match Alert Banner */}
      <div style={{
        backgroundColor: 'var(--primary-50)',
        border: '1.5px solid var(--primary-300)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '28px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-200)',
            color: 'var(--primary-800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-900)' }}>
              96% AI Match Discovered Nearby!
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--primary-800)' }}>
              Farmer Ramesh Varma in Rajahmundry (18 km away) has listed 600 kg Grade A Tomatoes matching your requirement at ₹28/kg.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenMatch}
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '0.9rem', borderRadius: '10px' }}
        >
          <span>Review Match & Order</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Main Grid: Active Requirements & Matching Farmers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Active Requirements List */}
        <div className="glass-panel" style={{ padding: '22px', borderRadius: '16px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>My Active Crop Requirements</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-600)', fontWeight: 700 }}>{requirements.length} Active</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {requirements.map((req) => (
              <div
                key={req.id}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--surface-200)',
                  backgroundColor: 'var(--surface-50)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {req.crop_name} ({req.required_grade})
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Required by: {req.required_by}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#b45309' }}>Max ₹{req.max_price_per_kg}/kg</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Target Price</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '10px', color: 'var(--text-secondary)' }}>
                  <span>Volume Needed: <strong>{req.quantity_kg} kg</strong></span>
                  <span>Radius: <strong>Within {req.max_distance_km} km</strong></span>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  "{req.notes}"
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--surface-200)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700 }}>
                    ✓ {req.responses_count || 2} Nearby Farmers Responded
                  </span>
                  <button
                    onClick={onOpenMatch}
                    style={{ background: 'none', color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>View Matches</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Suppliers / Nearby Farmers */}
        <div className="glass-panel" style={{ padding: '22px', borderRadius: '16px', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>
            Recommended Nearby Farmers
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--primary-200)', backgroundColor: 'var(--primary-50)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ fontSize: '0.95rem' }}>Ramesh Varma</strong>
                  <span className="badge-verified-farmer" style={{ fontSize: '0.65rem' }}>Verified ✓</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  📍 Rajahmundry (18 km) • 600 kg Tomato • ₹28/kg
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('marketplace')}
                className="btn-primary"
                style={{ padding: '8px 14px', fontSize: '0.8rem', borderRadius: '8px' }}
              >
                View Crop
              </button>
            </div>

            <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--surface-200)', backgroundColor: 'var(--surface-50)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ fontSize: '0.95rem' }}>Venkat Rao</strong>
                  <span className="badge-verified-farmer" style={{ fontSize: '0.65rem' }}>Verified ✓</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  📍 Guntur (42 km) • 1,200 kg Guntur Teja Chilli • ₹185/kg
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('marketplace')}
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.8rem', borderRadius: '8px' }}
              >
                View Crop
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Post Requirement Modal */}
      {showPostModal && (
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
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Post "I Need This Crop"</h3>
              <button onClick={() => setShowPostModal(false)} style={{ background: 'none', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRequirement} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Crop Name</label>
                <input
                  type="text"
                  required
                  value={newReq.crop_name}
                  onChange={(e) => setNewReq({ ...newReq, crop_name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Quantity Needed (kg)</label>
                  <input
                    type="number"
                    required
                    min={50}
                    value={newReq.quantity_kg}
                    onChange={(e) => setNewReq({ ...newReq, quantity_kg: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Max Target Price (₹/kg)</label>
                  <input
                    type="number"
                    required
                    step={0.5}
                    value={newReq.max_price_per_kg}
                    onChange={(e) => setNewReq({ ...newReq, max_price_per_kg: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Required By Date</label>
                  <input
                    type="date"
                    required
                    value={newReq.required_by}
                    onChange={(e) => setNewReq({ ...newReq, required_by: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Quality Grade</label>
                  <select
                    value={newReq.required_grade}
                    onChange={(e) => setNewReq({ ...newReq, required_grade: e.target.value })}
                  >
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                    <option value="Export Grade">Export Grade</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Delivery Destination / Warehouse</label>
                <input
                  type="text"
                  value={newReq.buyer_location}
                  onChange={(e) => setNewReq({ ...newReq, buyer_location: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Specific Requirements / Quality Notes</label>
                <textarea
                  rows={3}
                  value={newReq.notes}
                  onChange={(e) => setNewReq({ ...newReq, notes: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn-accent"
                style={{ padding: '14px', borderRadius: '12px', marginTop: '10px' }}
              >
                Broadcast Requirement to Nearby Farmers
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
