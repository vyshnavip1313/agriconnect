import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, CheckCircle2, ShieldCheck, ArrowRight, Phone, MessageSquare, ShoppingCart, Filter, Award } from 'lucide-react';
import { api } from '../api';
import { Language, translations } from '../i18n';

interface SmartMatchingProps {
  language: Language;
  onInitiateOrder: (match: any) => void;
  onOpenChat: (farmerName: string, cropName: string) => void;
}

export const SmartMatchingView: React.FC<SmartMatchingProps> = ({
  language,
  onInitiateOrder,
  onOpenChat
}) => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDistance, setSelectedDistance] = useState<number>(100);
  const [cropFilter, setCropFilter] = useState<string>("All");

  const t = translations[language];

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await api.getSmartMatches();
      setMatches(res.matches || []);
    } catch (err) {
      console.warn("Using offline smart match fallback:", err);
      setMatches([
        {
          requirement: {
            id: "req_1",
            buyer_id: "buyer_1",
            buyer_name: "FreshMart Supermarket Supply",
            buyer_contact: "Anita Sharma (+91 98765 43210)",
            buyer_location: "Rajahmundry / Vijayawada",
            crop_name: "Tomato",
            quantity_kg: 500,
            max_price_per_kg: 32.0,
            required_by: "2026-10-05",
            required_grade: "Grade A"
          },
          listing: {
            id: "list_1",
            farmer_id: "farmer_1",
            farmer_name: "Ramesh Varma",
            farmer_phone: "+91 98480 12345",
            farmer_verified: true,
            crop_name: "Tomato",
            variety: "Arka Rakshak (Firm)",
            quantity_kg: 600,
            price_per_kg: 28.0,
            distance_km: 18,
            grade: "Grade A",
            location: "Rajahmundry, East Godavari, AP",
            ai_crop_verified: true,
            image_url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=400&fit=crop"
          },
          match_analysis: {
            match_percentage: 96,
            eligible: true,
            explanation: "Crop and quantity match, farmer is only 18 km away in Rajahmundry, and expected price of ₹28/kg is under buyer target ₹32/kg.",
            key_factors: [
              "Crop variety matches required retail specifications.",
              "Asking price ₹28/kg delivers ₹4/kg savings for buyer.",
              "Farmer is very close (18 km away), minimal freight transit.",
              "Listing is AI Crop Verified."
            ]
          }
        },
        {
          requirement: {
            id: "req_2",
            buyer_id: "buyer_2",
            buyer_name: "Apex Agro Spices & Exports",
            buyer_contact: "Kishore Naidu (+91 99887 76655)",
            buyer_location: "Guntur Spice Park",
            crop_name: "Chilli",
            quantity_kg: 1000,
            max_price_per_kg: 195.0,
            required_by: "2026-10-10",
            required_grade: "Grade A"
          },
          listing: {
            id: "list_2",
            farmer_id: "farmer_2",
            farmer_name: "Venkat Rao",
            farmer_phone: "+91 94401 23456",
            farmer_verified: true,
            crop_name: "Chilli",
            variety: "Guntur Teja (Export grade)",
            quantity_kg: 1200,
            price_per_kg: 185.0,
            distance_km: 42,
            grade: "Grade A",
            location: "Guntur, Andhra Pradesh",
            ai_crop_verified: true,
            image_url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&h=400&fit=crop"
          },
          match_analysis: {
            match_percentage: 94,
            eligible: true,
            explanation: "Guntur Teja variety matches export grade specs, 1200 kg fulfills buyer bulk order, located within 42 km.",
            key_factors: [
              "High color and pungency value meets exporter standards.",
              "Competitive price at ₹185/kg (Budget: ₹195/kg).",
              "Verified farmer with 4.8 star rating."
            ]
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const filteredMatches = matches.filter(m => {
    const dist = m.listing.distance_km || 20;
    if (dist > selectedDistance) return false;
    if (cropFilter !== "All" && m.listing.crop_name !== cropFilter) return false;
    return true;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', backgroundColor: 'var(--primary-50)', padding: '4px 14px', borderRadius: '20px' }}>
          <Sparkles size={18} />
          <span>Direct Matchmaking Engine</span>
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {language === 'te' ? 'స్మార్ట్ AI మ్యాచింగ్ వ్యవస్థ' : language === 'hi' ? 'स्मार्ट AI मिलान प्रणाली' : 'Smart Farmer-Buyer AI Matching'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', fontSize: '1.05rem' }}>
          Eliminating middlemen: Our algorithmic engine pairs active farmer harvests with commercial buyer requirements based on distance, quantity, price fit, and quality grade.
        </p>
      </div>

      {/* Filter bar */}
      <div className="glass-panel" style={{ padding: '16px 24px', borderRadius: '16px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
        {/* Distance Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={16} color="var(--primary-600)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Distance Radius:</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[10, 25, 50, 100].map((km) => (
              <button
                key={km}
                onClick={() => setSelectedDistance(km)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: selectedDistance === km ? 700 : 500,
                  backgroundColor: selectedDistance === km ? 'var(--primary-600)' : 'var(--surface-100)',
                  color: selectedDistance === km ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none'
                }}
              >
                Within {km} km
              </button>
            ))}
          </div>
        </div>

        {/* Crop filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Crop:</span>
          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            style={{ width: 'auto', padding: '6px 12px' }}
          >
            <option value="All">All Crops</option>
            <option value="Tomato">Tomato</option>
            <option value="Chilli">Chilli</option>
            <option value="Onion">Onion</option>
            <option value="Rice">Rice</option>
          </select>
        </div>
      </div>

      {/* Matches List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Sparkles size={40} color="var(--primary-500)" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 16px auto' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Matching harvests against active commercial buyers...</p>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: '16px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>No matches found within the selected distance filter.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredMatches.map((item, index) => {
            const { listing, requirement, match_analysis } = item;
            return (
              <div
                key={index}
                className="glass-panel glass-card-hover"
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  border: match_analysis.match_percentage >= 90 ? '2px solid var(--primary-400)' : '1px solid var(--surface-200)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                {/* Top bar with match score badge */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge-ai-match">
                      <Sparkles size={16} />
                      AI Match: {match_analysis.match_percentage}%
                    </span>
                    {listing.ai_crop_verified && (
                      <span className="badge-ai-verified">
                        <CheckCircle2 size={13} />
                        AI Crop Verified
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    <MapPin size={15} color="var(--primary-600)" />
                    <span>{listing.distance_km} km between Farm and Buyer Warehouse</span>
                  </div>
                </div>

                {/* Main 2-column card comparing Buyer Request & Farmer Harvest */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '16px' }}>
                  {/* Left: Farmer Side */}
                  <div style={{ backgroundColor: 'var(--primary-50)', padding: '16px', borderRadius: '12px', border: '1px solid var(--primary-200)' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-800)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      🌱 PRODUCING FARMER LISTING
                    </span>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>
                      {listing.crop_name} ({listing.variety})
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--primary-900)', fontWeight: 600, marginBottom: '8px' }}>
                      By {listing.farmer_name} • <span className="badge-verified-farmer" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>Verified Farmer ✓</span>
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderTop: '1px solid rgba(16, 185, 129, 0.2)', paddingTop: '6px' }}>
                      <span>Available: <strong>{listing.quantity_kg} kg</strong></span>
                      <span>Asking: <strong style={{ color: 'var(--primary-800)' }}>₹{listing.price_per_kg} / kg</strong></span>
                    </div>
                  </div>

                  {/* Right: Buyer Side */}
                  <div style={{ backgroundColor: '#fffbeb', padding: '16px', borderRadius: '12px', border: '1px solid #fde68a' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      🛒 BUYER REQUIREMENT
                    </span>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>
                      {requirement.crop_name} ({requirement.required_grade})
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#92400e', fontWeight: 600, marginBottom: '8px' }}>
                      For {requirement.buyer_name} ({requirement.buyer_contact})
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderTop: '1px solid #fef3c7', paddingTop: '6px' }}>
                      <span>Required: <strong>{requirement.quantity_kg} kg</strong></span>
                      <span>Target: <strong style={{ color: '#b45309' }}>Max ₹{requirement.max_price_per_kg} / kg</strong></span>
                    </div>
                  </div>
                </div>

                {/* AI Explanation Pill */}
                <div style={{ backgroundColor: 'var(--surface-50)', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', border: '1px solid var(--surface-200)' }}>
                  <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    💡 <strong>AI Match Intelligence:</strong> "{match_analysis.explanation}"
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {match_analysis.key_factors?.map((factor: string, i: number) => (
                      <span key={i} style={{ fontSize: '0.75rem', backgroundColor: '#ffffff', color: 'var(--text-secondary)', padding: '3px 8px', borderRadius: '6px', border: '1px solid var(--surface-200)' }}>
                        ✓ {factor}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => onOpenChat(listing.farmer_name, listing.crop_name)}
                    className="btn-secondary"
                    style={{ padding: '9px 16px', fontSize: '0.88rem' }}
                  >
                    <MessageSquare size={16} />
                    <span>Direct Chat / Negotiate</span>
                  </button>
                  <a
                    href={`tel:${listing.farmer_phone}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'var(--surface-100)',
                      color: 'var(--text-primary)',
                      padding: '9px 16px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '0.88rem',
                      fontWeight: 600
                    }}
                  >
                    <Phone size={15} />
                    <span>Call Farmer</span>
                  </a>
                  <button
                    onClick={() => onInitiateOrder(item)}
                    className="btn-primary"
                    style={{ padding: '9px 18px', fontSize: '0.88rem' }}
                  >
                    <ShoppingCart size={16} />
                    <span>Place Direct Order (₹{listing.price_per_kg * Math.min(listing.quantity_kg, requirement.quantity_kg)})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
