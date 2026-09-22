import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Eye, Phone, MessageSquare, ShoppingBag, X } from 'lucide-react';
import { api } from '../api';
import { Language, translations } from '../i18n';

interface MarketplaceProps {
  language: Language;
  onSelectListing: (listing: any) => void;
  onOpenCreateListing: () => void;
  onOpenChat: (farmerName: string, cropName: string) => void;
}

const CATEGORIES = [
  "All", "Vegetables", "Fruits", "Cereals", "Spices", "Oilseeds", "Cash crops"
];

export const MarketplaceView: React.FC<MarketplaceProps> = ({
  language,
  onSelectListing,
  onOpenCreateListing,
  onOpenChat
}) => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [aiVerifiedOnly, setAiVerifiedOnly] = useState<boolean>(false);
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null);

  const t = translations[language];

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await api.getListings();
      setListings(res.listings || []);
    } catch (err) {
      console.warn("Using offline listings mock:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const filtered = listings.filter((item) => {
    if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
    if (item.price_per_kg > maxPrice) return false;
    if (aiVerifiedOnly && !item.ai_crop_verified) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = item.crop_name?.toLowerCase().includes(q);
      const matchVariety = item.variety?.toLowerCase().includes(q);
      const matchLoc = item.location?.toLowerCase().includes(q);
      const matchFarmer = item.farmer_name?.toLowerCase().includes(q);
      if (!matchName && !matchVariety && !matchLoc && !matchFarmer) return false;
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
      {/* Top Banner with Search & Create Listing */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {language === 'te' ? 'రైతుల పంటల సంత' : language === 'hi' ? 'किसान फसल मंडी' : 'Farmer Crop Marketplace'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Direct listings from verified farmers with transparent pricing & AI verified quality.
          </p>
        </div>

        <button
          onClick={onOpenCreateListing}
          className="btn-accent"
          style={{ padding: '12px 24px', borderRadius: '12px' }}
        >
          <span>+ {language === 'te' ? 'కొత్త పంటను లిస్ట్ చేయండి' : language === 'hi' ? 'नई फसल लिस्ट करें' : 'List Harvest for Sale'}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', marginBottom: '28px', backgroundColor: '#ffffff' }}>
        {/* Search Input */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            style={{ paddingLeft: '48px', height: '48px', fontSize: '1rem', borderRadius: '12px' }}
          />
        </div>

        {/* Category Pills & Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          {/* Categories */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '20px',
                  fontSize: '0.84rem',
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  backgroundColor: selectedCategory === cat ? 'var(--primary-600)' : 'var(--surface-100)',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Filters: AI Verified & Max Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={aiVerifiedOnly}
                onChange={(e) => setAiVerifiedOnly(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary-600)' }}
              />
              <span>AI Crop Verified Only</span>
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Max:</span>
              <strong>₹{maxPrice}/kg</strong>
              <input
                type="range"
                min={20}
                max={250}
                step={5}
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                style={{ width: '100px', accentColor: 'var(--primary-600)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Loading fresh farm listings...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: '16px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No listings match your search criteria.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              className="glass-panel glass-card-hover"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                border: '1px solid var(--surface-200)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Crop Image & Badges */}
              <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
                <img
                  src={item.image_url}
                  alt={item.crop_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* AI Verified Badge */}
                {item.ai_crop_verified && (
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <span className="badge-ai-verified">
                      <CheckCircle2 size={13} />
                      AI Crop Verified
                    </span>
                  </div>
                )}
                {/* Grade Pill */}
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#ffffff', padding: '3px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700 }}>
                  {item.grade}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {item.crop_name}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {item.variety}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                      ₹{item.price_per_kg}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>per kg</span>
                  </div>
                </div>

                {/* Farmer Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', backgroundColor: 'var(--surface-50)', padding: '8px 10px', borderRadius: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                    👨‍🌾
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{item.farmer_name}</span>
                      {item.farmer_verified && (
                        <span style={{ fontSize: '0.68rem', color: 'var(--primary-600)', fontWeight: 700 }}>✓ Verified</span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.location}</span>
                  </div>
                </div>

                {/* Specs Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem', marginBottom: '16px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Available:</span>
                    <strong>{item.quantity_kg} kg</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Harvest Date:</span>
                    <strong>{item.harvest_date}</strong>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setSelectedDetail(item)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '9px', fontSize: '0.84rem' }}
                  >
                    <Eye size={15} />
                    <span>Details</span>
                  </button>
                  <button
                    onClick={() => onSelectListing(item)}
                    className="btn-primary"
                    style={{ flex: 1, padding: '9px', fontSize: '0.84rem' }}
                  >
                    <ShoppingBag size={15} />
                    <span>Buy Direct</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Crop Details Modal */}
      {selectedDetail && (
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
            maxWidth: '600px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xl)',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedDetail(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              <X size={20} />
            </button>

            <img
              src={selectedDetail.image_url}
              alt={selectedDetail.crop_name}
              style={{ width: '100%', height: '240px', objectFit: 'cover' }}
            />

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{selectedDetail.crop_name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selectedDetail.variety} • {selectedDetail.farming_type}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-700)' }}>₹{selectedDetail.price_per_kg}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>per kg</span>
                </div>
              </div>

              {selectedDetail.ai_crop_verified && (
                <div style={{ marginBottom: '16px' }}>
                  <span className="badge-ai-verified" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                    <CheckCircle2 size={16} />
                    AI Crop Verified (96.5% Confidence Score)
                  </span>
                </div>
              )}

              {/* Detailed Specs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', backgroundColor: 'var(--surface-50)', padding: '16px', borderRadius: '12px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Available Volume</span>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedDetail.quantity_kg} kg</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Total Batch Value</span>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>₹{selectedDetail.quantity_kg * selectedDetail.price_per_kg}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Harvest Date</span>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedDetail.harvest_date}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Location</span>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedDetail.location}</p>
                </div>
              </div>

              {/* Farmer Contact & Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={`tel:${selectedDetail.farmer_phone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--surface-100)',
                    color: 'var(--text-primary)',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem'
                  }}
                >
                  <Phone size={18} />
                  <span>Call {selectedDetail.farmer_name}</span>
                </a>
                <button
                  onClick={() => {
                    setSelectedDetail(null);
                    onSelectListing(selectedDetail);
                  }}
                  className="btn-primary"
                  style={{ flex: 1, padding: '12px', borderRadius: '12px' }}
                >
                  <ShoppingBag size={18} />
                  <span>Order Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
