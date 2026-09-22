import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, Filter, Sparkles, Phone, Eye } from 'lucide-react';
import { Language, translations } from '../i18n';

interface FarmMapViewProps {
  language: Language;
  onSelectListing: (listing: any) => void;
}

const PIN_LOCATIONS = [
  {
    id: "p1",
    name: "Ramesh Varma (Farmer)",
    type: "farmer",
    crop: "Tomato (600 kg) & Mango",
    location: "Rajahmundry, East Godavari",
    distance: "18 km",
    lat: 17.0005,
    lng: 81.8040,
    price: "₹28/kg",
    verified: true,
    phone: "+91 98480 12345"
  },
  {
    id: "p2",
    name: "FreshMart Supply Hub (Buyer)",
    type: "buyer",
    crop: "Needs 500 kg Tomato",
    location: "Vijayawada DC",
    distance: "45 km",
    lat: 16.5062,
    lng: 80.6480,
    budget: "Max ₹32/kg",
    verified: true,
    phone: "+91 98765 43210"
  },
  {
    id: "p3",
    name: "Venkat Rao (Farmer)",
    type: "farmer",
    crop: "Guntur Teja Chilli (1,200 kg)",
    location: "Guntur Rural",
    distance: "42 km",
    lat: 16.3067,
    lng: 80.4365,
    price: "₹185/kg",
    verified: true,
    phone: "+91 94401 23456"
  },
  {
    id: "p4",
    name: "Apex Agro Spices (Buyer)",
    type: "buyer",
    crop: "Needs 1,000 kg Chilli",
    location: "Guntur Spice Yard",
    distance: "40 km",
    lat: 16.3200,
    lng: 80.4500,
    budget: "Max ₹195/kg",
    verified: true,
    phone: "+91 99887 76655"
  }
];

export const FarmMapView: React.FC<FarmMapViewProps> = ({
  language,
  onSelectListing
}) => {
  const [selectedRadius, setSelectedRadius] = useState<number>(50);
  const [selectedPin, setSelectedPin] = useState<any>(PIN_LOCATIONS[0]);
  const [mapType, setMapType] = useState<'all' | 'farmers' | 'buyers'>('all');

  const t = translations[language];

  const filteredPins = PIN_LOCATIONS.filter(p => {
    if (mapType === 'farmers' && p.type !== 'farmer') return false;
    if (mapType === 'buyers' && p.type !== 'buyer') return false;
    return true;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 16px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', backgroundColor: 'var(--primary-50)', padding: '4px 14px', borderRadius: '20px' }}>
          <Navigation size={18} />
          <span>Regional Geospatial Discovery</span>
        </div>
        <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
          {language === 'te' ? 'ప్రాంతీయ రైతులు & కొనుగోలుదారుల మ్యాప్' : language === 'hi' ? 'क्षेत्रीय किसान व खरीदार नक्शा' : 'Regional Farm & Buyer Geospatial Map'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
          Locate verified farms and nearby commercial procurement centers within your logistics radius to minimize transport expenses.
        </p>
      </div>

      {/* Control Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '16px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', backgroundColor: '#ffffff' }}>
        {/* Radius Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Logistics Radius:</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[10, 25, 50, 100].map((km) => (
              <button
                key={km}
                onClick={() => setSelectedRadius(km)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: selectedRadius === km ? 700 : 500,
                  backgroundColor: selectedRadius === km ? 'var(--primary-600)' : 'var(--surface-100)',
                  color: selectedRadius === km ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none'
                }}
              >
                Within {km} km
              </button>
            ))}
          </div>
        </div>

        {/* Pin type toggle */}
        <div style={{ display: 'flex', backgroundColor: 'var(--surface-100)', borderRadius: '10px', padding: '3px' }}>
          <button
            onClick={() => setMapType('all')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: mapType === 'all' ? 700 : 500,
              backgroundColor: mapType === 'all' ? '#ffffff' : 'transparent',
              color: mapType === 'all' ? 'var(--primary-700)' : 'var(--text-muted)'
            }}
          >
            All Pins
          </button>
          <button
            onClick={() => setMapType('farmers')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: mapType === 'farmers' ? 700 : 500,
              backgroundColor: mapType === 'farmers' ? '#ffffff' : 'transparent',
              color: mapType === 'farmers' ? 'var(--primary-700)' : 'var(--text-muted)'
            }}
          >
            🌱 Farmers ({PIN_LOCATIONS.filter(p => p.type === 'farmer').length})
          </button>
          <button
            onClick={() => setMapType('buyers')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: mapType === 'buyers' ? 700 : 500,
              backgroundColor: mapType === 'buyers' ? '#ffffff' : 'transparent',
              color: mapType === 'buyers' ? 'var(--primary-700)' : 'var(--text-muted)'
            }}
          >
            🏢 Buyers ({PIN_LOCATIONS.filter(p => p.type === 'buyer').length})
          </button>
        </div>
      </div>

      {/* Map Layout: Visual interactive map representation with pins + detail card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Map Canvas / Visualizer */}
        <div className="glass-panel" style={{
          position: 'relative',
          height: '480px',
          borderRadius: '18px',
          overflow: 'hidden',
          backgroundColor: '#e2e8f0',
          border: '1.5px solid var(--surface-300)',
          gridColumn: 'span 2'
        }}>
          <style>{`
            @media (max-width: 900px) {
              div[style*="gridColumn: span 2"] { grid-column: span 1 !important; }
            }
          `}</style>

          {/* Map Topographical Background Grid */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#94a3b8 1px, #f8fafc 1px)',
            backgroundSize: '36px 36px',
            opacity: 0.65
          }} />

          {/* Map Regions overlay with river/route representation */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {/* Simulated Godavari/Krishna River path */}
            <path
              d="M 50 120 Q 250 80 400 220 T 750 350"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="14"
              opacity="0.6"
            />
            {/* NH-16 Highway Corridor */}
            <path
              d="M 80 40 Q 300 180 500 280 T 800 420"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="4"
              strokeDasharray="8 6"
            />
            {/* Radius Circle for active location */}
            <circle
              cx="380"
              cy="220"
              r={selectedRadius * 2.2}
              fill="rgba(16, 185, 129, 0.08)"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          </svg>

          {/* Interactive Pins */}
          {filteredPins.map((pin, i) => {
            // Simulated positions on map
            const posX = 200 + (i % 2) * 260 + (i * 40);
            const posY = 140 + (i * 70);
            const isSelected = selectedPin?.id === pin.id;

            return (
              <div
                key={pin.id}
                onClick={() => setSelectedPin(pin)}
                style={{
                  position: 'absolute',
                  left: `${posX}px`,
                  top: `${posY}px`,
                  cursor: 'pointer',
                  transform: 'translate(-50%, -100%)',
                  zIndex: isSelected ? 30 : 10,
                  transition: 'transform 0.2s ease'
                }}
              >
                <div style={{
                  backgroundColor: pin.type === 'farmer' ? '#059669' : '#0284c7',
                  color: '#ffffff',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  boxShadow: isSelected ? '0 0 20px rgba(0,0,0,0.35)' : 'var(--shadow-md)',
                  border: isSelected ? '2.5px solid #ffffff' : '1.5px solid rgba(255,255,255,0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap'
                }}>
                  <span>{pin.type === 'farmer' ? '👨‍🌾' : '🏢'}</span>
                  <span>{pin.name}</span>
                </div>
                {/* Pointer tip */}
                <div style={{
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: `8px solid ${pin.type === 'farmer' ? '#059669' : '#0284c7'}`,
                  margin: '0 auto'
                }} />
              </div>
            );
          })}

          {/* Map Legend */}
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.78rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#059669' }} />
              <span>Verified Farmers</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0284c7' }} />
              <span>Commercial Buyers</span>
            </div>
          </div>
        </div>

        {/* Selected Pin Details Card */}
        {selectedPin && (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', backgroundColor: '#ffffff', height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: selectedPin.type === 'farmer' ? 'var(--primary-100)' : '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem'
              }}>
                {selectedPin.type === 'farmer' ? '👨‍🌾' : '🏢'}
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedPin.name}</h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📍 {selectedPin.location} ({selectedPin.distance})</span>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--surface-50)', padding: '14px', borderRadius: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                {selectedPin.type === 'farmer' ? 'ACTIVE HARVEST OFFERING:' : 'BUYER REQUIREMENT:'}
              </span>
              <p style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {selectedPin.crop}
              </p>
              <p style={{ fontSize: '0.88rem', fontWeight: 700, color: selectedPin.type === 'farmer' ? 'var(--primary-700)' : '#0284c7', marginTop: '4px' }}>
                {selectedPin.price || selectedPin.budget}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={`tel:${selectedPin.phone}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--surface-100)',
                  color: 'var(--text-primary)',
                  padding: '11px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                <Phone size={16} />
                <span>Call Directly</span>
              </a>
              <button
                onClick={() => onSelectListing({ crop_name: "Tomato", price_per_kg: 28, quantity_kg: 600, farmer_name: selectedPin.name })}
                className="btn-primary"
                style={{ padding: '11px', borderRadius: '10px', fontSize: '0.9rem' }}
              >
                <span>View Full Listing</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
