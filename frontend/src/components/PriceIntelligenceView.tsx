import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, MapPin, Calendar, HelpCircle, ShieldCheck, DollarSign, Activity } from 'lucide-react';
import { api } from '../api';
import { Language, translations } from '../i18n';

interface PriceIntelligenceProps {
  initialCrop?: string;
  language: Language;
}

const CROPS_LIST = [
  "Tomato", "Chilli", "Onion", "Rice", "Mango", "Potato", "Maize", "Groundnut", "Cotton", "Wheat"
];

const MANDI_LOCATIONS = [
  "Rajahmundry Mandi (East Godavari)",
  "Guntur Mirchi Yard",
  "Nashik Lasalgaon Market",
  "Karnal Grain Mandi",
  "National Benchmark Average"
];

export const PriceIntelligenceView: React.FC<PriceIntelligenceProps> = ({
  initialCrop = "Tomato",
  language
}) => {
  const [selectedCrop, setSelectedCrop] = useState<string>(initialCrop);
  const [selectedLocation, setSelectedLocation] = useState<string>(MANDI_LOCATIONS[0]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("12 Months");
  const [priceData, setPriceData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Know Your Price interactive calculator inputs
  const [myAskingPrice, setMyAskingPrice] = useState<number>(30.0);

  const t = translations[language];

  const fetchPriceData = async (crop: string, location: string, period: string) => {
    setLoading(true);
    try {
      const data = await api.getPriceTrends(crop, location, period);
      setPriceData(data);
      if (data.current_price) {
        setMyAskingPrice(data.current_price);
      }
    } catch (err) {
      console.warn("Using offline price trend mock:", err);
      setPriceData({
        crop_name: crop,
        selected_location: location,
        time_period: period,
        current_price: 32.0,
        previous_price: 29.5,
        price_change_amount: 2.5,
        price_change_percent: 8.5,
        trend_direction: "UP",
        price_unit: "₹/kg",
        monthly_trend: [
          { month: "Jan", price: 28, demand: 82 },
          { month: "Feb", price: 24, demand: 78 },
          { month: "Mar", price: 22, demand: 75 },
          { month: "Apr", price: 30, demand: 85 },
          { month: "May", price: 38, demand: 92 },
          { month: "Jun", price: 44, demand: 98 },
          { month: "Jul", price: 42, demand: 95 },
          { month: "Aug", price: 35, demand: 88 },
          { month: "Sep", price: 32, demand: 86 },
          { month: "Oct", price: 36, demand: 90 },
          { month: "Nov", price: 26, demand: 80 },
          { month: "Dec", price: 25, demand: 79 }
        ],
        highest_price_months: "May – July",
        lowest_price_months: "February – March",
        current_demand_index: "High",
        regional_prices: {
          "Andhra Pradesh / Telangana": 32.5,
          "Maharashtra (Nashik/Pune)": 31.0,
          "Karnataka (Kolar)": 33.5,
          "National Mandi Benchmark": 32.0
        },
        know_your_price_guidance: "Prices for this crop have historically varied during this period. Consider checking multiple buyers before accepting an offer."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceData(selectedCrop, selectedLocation, selectedPeriod);
  }, [selectedCrop, selectedLocation, selectedPeriod]);

  // Max value in trend for SVG scaling
  const maxPrice = priceData?.monthly_trend
    ? Math.max(...priceData.monthly_trend.map((m: any) => m.price), 10) * 1.15
    : 50;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', backgroundColor: 'var(--primary-50)', padding: '4px 14px', borderRadius: '20px' }}>
          <TrendingUp size={18} />
          <span>Real-Time Mandi Spot & Historical Trends</span>
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {language === 'te' ? 'కాలానుగుణ ధరల సమాచారం & విశ్లేషణ' : language === 'hi' ? 'मौसमी भाव विश्लेषण व रुझान' : 'Seasonal Price & Demand Intelligence'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', fontSize: '1rem' }}>
          Compare historical price variations, identify peak harvest realization months, and set competitive prices with "Know Your Price".
        </p>
      </div>

      {/* Filter Row: Crop, Location, Period */}
      <div className="glass-panel" style={{ padding: '18px 24px', borderRadius: '16px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
        {/* Crop Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Crop:</label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            style={{ fontWeight: 700, color: 'var(--primary-800)', borderColor: 'var(--primary-300)' }}
          >
            {CROPS_LIST.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Location Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '260px' }}>
          <MapPin size={16} color="var(--primary-600)" />
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Market Hub:</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {MANDI_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Time Period */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={16} color="var(--text-muted)" />
          <div style={{ display: 'flex', backgroundColor: 'var(--surface-100)', borderRadius: '8px', padding: '2px' }}>
            {["3 Months", "6 Months", "12 Months"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: selectedPeriod === period ? 700 : 500,
                  backgroundColor: selectedPeriod === period ? '#ffffff' : 'transparent',
                  color: selectedPeriod === period ? 'var(--primary-700)' : 'var(--text-muted)',
                  boxShadow: selectedPeriod === period ? 'var(--shadow-sm)' : 'none'
                }}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {priceData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Left: Main Chart Card */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#ffffff', gridColumn: 'span 2' }}>
            <style>{`
              @media (max-width: 900px) {
                div[style*="gridColumn: span 2"] { grid-column: span 1 !important; }
              }
            `}</style>

            {/* Price Snapshot Stats */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--surface-100)', paddingBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>CURRENT AVERAGE MANDI SPOT</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <h3 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{priceData.current_price}
                  </h3>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{priceData.price_unit}</span>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    color: priceData.trend_direction === 'UP' ? 'var(--success)' : 'var(--danger)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    backgroundColor: priceData.trend_direction === 'UP' ? 'var(--primary-50)' : '#fef2f2',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>
                    {priceData.trend_direction === 'UP' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    <span>{priceData.price_change_percent}% ({priceData.price_change_amount > 0 ? `+₹${priceData.price_change_amount}` : `-₹${Math.abs(priceData.price_change_amount)}`})</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>HIGHEST PEAK MONTHS</span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--primary-700)' }}>{priceData.highest_price_months}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>LOWEST SUPPLY TROUGH</span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>{priceData.lowest_price_months}</strong>
                </div>
              </div>
            </div>

            {/* Custom SVG Interactive Line & Bar Chart */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  12-Month Price Curve (₹/kg) & Buyer Demand Index
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hover on points to inspect values</span>
              </div>

              <div style={{ width: '100%', height: '260px', position: 'relative' }}>
                <svg viewBox="0 0 700 240" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  {/* Grid Lines */}
                  <line x1="40" y1="40" x2="680" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                  <line x1="40" y1="100" x2="680" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                  <line x1="40" y1="160" x2="680" y2="160" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                  <line x1="40" y1="200" x2="680" y2="200" stroke="#e2e8f0" strokeWidth="1.5" />

                  {/* Monthly points calculation */}
                  {priceData.monthly_trend?.map((item: any, idx: number) => {
                    const x = 50 + idx * ((680 - 50) / 11);
                    const y = 200 - (item.price / maxPrice) * 160;
                    const nextItem = priceData.monthly_trend[idx + 1];
                    const nextX = nextItem ? 50 + (idx + 1) * ((680 - 50) / 11) : null;
                    const nextY = nextItem ? 200 - (nextItem.price / maxPrice) * 160 : null;

                    return (
                      <g key={item.month}>
                        {/* Connecting Line Segment */}
                        {nextX !== null && nextY !== null && (
                          <line
                            x1={x}
                            y1={y}
                            x2={nextX}
                            y2={nextY}
                            stroke="#10b981"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        )}

                        {/* Demand bar in light amber behind */}
                        <rect
                          x={x - 8}
                          y={200 - (item.demand / 100) * 120}
                          width="16"
                          height={(item.demand / 100) * 120}
                          fill="rgba(245, 158, 11, 0.12)"
                          rx="3"
                        />

                        {/* Circular Data Point */}
                        <circle
                          cx={x}
                          cy={y}
                          r="5"
                          fill="#ffffff"
                          stroke="#059669"
                          strokeWidth="2.5"
                        />

                        {/* Price Value Tag */}
                        <text
                          x={x}
                          y={y - 10}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="700"
                          fill="#0f172a"
                        >
                          ₹{item.price}
                        </text>

                        {/* Month Label */}
                        <text
                          x={x}
                          y="220"
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="600"
                          fill="#64748b"
                        >
                          {item.month}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Explanatory Note Callout */}
            <div style={{
              backgroundColor: 'var(--surface-50)',
              borderRadius: '10px',
              padding: '12px 16px',
              border: '1px solid var(--surface-200)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }}>
              <HelpCircle size={18} color="var(--primary-600)" style={{ flexShrink: 0 }} />
              <span>{priceData.know_your_price_guidance}</span>
            </div>
          </div>

          {/* Right Column: "Know Your Price" & Regional Comparison */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* "Know Your Price" Transparency Tool */}
            <div className="glass-panel" style={{ padding: '22px', borderRadius: '16px', backgroundColor: '#ffffff', border: '1.5px solid #fef3c7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <DollarSign size={20} color="#b45309" />
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#92400e' }}>
                  Know Your Price Calculator
                </h4>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                AI-assisted price fairness algorithm. Compare your expected price against current regional demand before publishing.
              </p>

              {/* Price comparison breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Regional Mandi Spot:</span>
                  <strong>₹{priceData.current_price} / kg</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Historical Peak in Peak Months:</span>
                  <strong style={{ color: 'var(--primary-700)' }}>
                    ₹{Math.max(...priceData.monthly_trend.map((m: any) => m.price))} / kg
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Buyer Demand Factor:</span>
                  <span style={{ color: 'var(--success)', fontWeight: 700 }}>High (+10% direct premium)</span>
                </div>

                <div style={{ borderTop: '1px dashed var(--surface-200)', paddingTop: '10px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Your Expected Asking Price (₹/kg):
                  </label>
                  <input
                    type="number"
                    value={myAskingPrice}
                    onChange={(e) => setMyAskingPrice(parseFloat(e.target.value) || 0)}
                    style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-800)' }}
                  />
                </div>
              </div>

              {/* AI Insight Box */}
              <div style={{
                backgroundColor: myAskingPrice <= priceData.current_price * 1.15 ? 'var(--primary-50)' : '#fffbeb',
                border: myAskingPrice <= priceData.current_price * 1.15 ? '1px solid var(--primary-200)' : '1px solid #fde68a',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '0.82rem',
                color: myAskingPrice <= priceData.current_price * 1.15 ? 'var(--primary-800)' : '#92400e'
              }}>
                {myAskingPrice <= priceData.current_price * 1.15 ? (
                  <span>
                    ✓ <strong>Highly Competitive:</strong> Your asking price of ₹{myAskingPrice}/kg is well positioned to attract verified retail buyers within 24-48 hours.
                  </span>
                ) : (
                  <span>
                    ⚠️ <strong>Premium Asking Price:</strong> Your price is ₹{(myAskingPrice - priceData.current_price).toFixed(1)}/kg above local mandi averages. Target Grade A organic or export buyers for faster closure.
                  </span>
                )}
              </div>
            </div>

            {/* Regional Mandi Comparison Table */}
            <div className="glass-panel" style={{ padding: '22px', borderRadius: '16px', backgroundColor: '#ffffff' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="var(--primary-600)" />
                <span>Regional Mandi Benchmark</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(priceData.regional_prices || {}).map(([region, price]: [string, any]) => (
                  <div key={region} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', backgroundColor: 'var(--surface-50)', borderRadius: '8px', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{region}</span>
                    <strong style={{ color: 'var(--text-primary)' }}>₹{price} / kg</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
