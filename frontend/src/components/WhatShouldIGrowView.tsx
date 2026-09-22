import React, { useState, useEffect } from 'react';
import { Sprout, Sparkles, Droplets, Compass, BarChart2, ShieldAlert, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../api';
import { Language, translations } from '../i18n';

interface WhatShouldIGrowProps {
  language: Language;
  onViewPriceTrend: (cropName: string) => void;
}

export const WhatShouldIGrowView: React.FC<WhatShouldIGrowProps> = ({
  language,
  onViewPriceTrend
}) => {
  const t = translations[language];

  const [formData, setFormData] = useState({
    location: "Rajahmundry, East Godavari, AP",
    land_size_acres: 5.0,
    soil_type: "Alluvial / Loamy",
    available_water: "Canal & Borewell",
    current_season: "Rabi (Winter)",
    previous_crop: "Rice",
    investment_level: "Medium"
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getRecommendations(formData);
      setRecommendations(res.recommendations || []);
    } catch (err) {
      setError("AI Engine fallback: Generating offline smart recommendations.");
      // Simulated offline fallback
      setRecommendations([
        {
          crop_name: "Tomato",
          category: "Vegetables",
          match_score: 95.5,
          suitability_reasons: [
            "Alluvial soil provides optimal nutrient drainage for high tomato yields.",
            "Canal & borewell irrigation satisfies regular watering cycles.",
            "Excellent rotation choice following Rice crop."
          ],
          growing_season: "Suitable (Rabi peak)",
          expected_duration: "60–80 days",
          estimated_water_requirement: "Moderate (Drip recommended)",
          expected_demand: "High",
          historical_price_range: "₹18 – ₹45/kg",
          approximate_profitability: "Very High",
          risk_level: "Medium (Perishable)",
          suggested_buyer_categories: ["Retail Chains", "Wholesale Mandis", "Sauce Processors"],
          average_price: 32.0,
          price_unit: "₹/kg"
        },
        {
          crop_name: "Chilli",
          category: "Spices",
          match_score: 92.0,
          suitability_reasons: [
            "Regional climate supports high capsaicin pungency.",
            "Export demand is surging across Guntur mandis."
          ],
          growing_season: "Late Kharif & Rabi",
          expected_duration: "90–120 days",
          estimated_water_requirement: "Moderate",
          expected_demand: "Extremely High",
          historical_price_range: "₹140 – ₹240/kg",
          approximate_profitability: "Exceptional",
          risk_level: "Medium",
          suggested_buyer_categories: ["Spice Exporters", "Masala Processors"],
          average_price: 185.0,
          price_unit: "₹/kg"
        },
        {
          crop_name: "Maize",
          category: "Cereals",
          match_score: 88.5,
          suitability_reasons: [
            "Low maintenance and high local poultry feed mill demand.",
            "Minimal pest risk following paddy season."
          ],
          growing_season: "Rabi & Kharif",
          expected_duration: "85–105 days",
          estimated_water_requirement: "Moderate",
          expected_demand: "Very High",
          historical_price_range: "₹19 – ₹29/kg",
          approximate_profitability: "High & Safe",
          risk_level: "Low",
          suggested_buyer_categories: ["Feed Mills", "Starch Refineries"],
          average_price: 24.5,
          price_unit: "₹/kg"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#b45309', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', backgroundColor: '#fef3c7', padding: '4px 14px', borderRadius: '20px' }}>
          <Sparkles size={18} />
          <span>Intelligent Agronomic Advisory</span>
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {language === 'te' ? 'ఏ పంట వేయాలి? (What Should I Grow?)' : language === 'hi' ? 'कौन सी फसल उगाएं? (What Should I Grow?)' : 'What Should I Grow Next Season?'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', fontSize: '1.05rem' }}>
          {t.recommendationSubtitle}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'start' }}>
        {/* Farm Parameters Form */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={20} color="var(--primary-600)" />
            <span>Farm & Environmental Inputs</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Location */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Farm Location / District
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Rajahmundry, East Godavari, AP"
              />
            </div>

            {/* Land Size */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Land Size (Acres)
                </label>
                <input
                  type="number"
                  min={0.5}
                  step={0.5}
                  value={formData.land_size_acres}
                  onChange={(e) => setFormData({ ...formData, land_size_acres: parseFloat(e.target.value) || 1 })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Current Season
                </label>
                <select
                  value={formData.current_season}
                  onChange={(e) => setFormData({ ...formData, current_season: e.target.value })}
                >
                  <option value="Rabi (Winter)">Rabi (Winter / Nov-Mar)</option>
                  <option value="Kharif (Monsoon)">Kharif (Monsoon / Jun-Oct)</option>
                  <option value="Zaid (Summer)">Zaid (Summer / Mar-Jun)</option>
                </select>
              </div>
            </div>

            {/* Soil Type */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Soil Type
              </label>
              <select
                value={formData.soil_type}
                onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
              >
                <option value="Alluvial / Loamy">Alluvial / Fertile River Loam</option>
                <option value="Black Cotton Soil">Black Cotton Soil (Heavy clay)</option>
                <option value="Red Loam">Red Loam Soil</option>
                <option value="Sandy Loam">Sandy Loam / Porous</option>
              </select>
            </div>

            {/* Water availability */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Available Water Source
              </label>
              <select
                value={formData.available_water}
                onChange={(e) => setFormData({ ...formData, available_water: e.target.value })}
              >
                <option value="Canal & Borewell">Canal & Borewell (Continuous)</option>
                <option value="Drip Irrigation">Drip Irrigation / Borewell</option>
                <option value="Rainfed Only">Rainfed / Dependent on Monsoon</option>
                <option value="Tank / Tube well">Village Tank / Tube well</option>
              </select>
            </div>

            {/* Previous Crop & Investment */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Previous Crop
                </label>
                <select
                  value={formData.previous_crop}
                  onChange={(e) => setFormData({ ...formData, previous_crop: e.target.value })}
                >
                  <option value="Rice">Rice (Paddy)</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Chilli">Chilli</option>
                  <option value="Fallow / None">None (Fallow)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Budget / Investment
                </label>
                <select
                  value={formData.investment_level}
                  onChange={(e) => setFormData({ ...formData, investment_level: e.target.value })}
                >
                  <option value="Low">Low (Safe MSP)</option>
                  <option value="Medium">Medium (Balanced)</option>
                  <option value="High">High (Commercial Yield)</option>
                </select>
              </div>
            </div>

            <button
              onClick={fetchRecommendations}
              disabled={loading}
              className="btn-primary"
              style={{ marginTop: '10px', padding: '14px', borderRadius: '12px' }}
            >
              <Sparkles size={18} />
              <span>{loading ? 'Evaluating Agronomic Model...' : 'Generate AI Crop Recommendations'}</span>
            </button>
          </div>
        </div>

        {/* Recommendations Output List */}
        <div>
          {/* Important AI Disclaimer Callout */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            backgroundColor: '#fffbeb',
            border: '1px solid #fef3c7',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            color: '#92400e',
            fontSize: '0.84rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>AI-Assisted Estimation Notice:</strong> Predictions are based on historical soil trends, mandi demand, and meteorological patterns. Actual yields depend on local farm practices and weather. We do not guarantee fixed profits.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recommendations.map((rec, index) => (
              <div
                key={rec.crop_name}
                className="glass-panel glass-card-hover"
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  border: index === 0 ? '2px solid var(--primary-500)' : '1px solid var(--surface-200)'
                }}
              >
                {/* Top Badge & Score */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      backgroundColor: index === 0 ? 'var(--primary-600)' : 'var(--surface-200)',
                      color: index === 0 ? '#ffffff' : 'var(--text-secondary)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontWeight: 800,
                      fontSize: '0.78rem'
                    }}>
                      #{index + 1}
                    </span>
                    <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {rec.crop_name}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({rec.category})</span>
                  </div>

                  <div style={{
                    backgroundColor: 'var(--primary-50)',
                    color: 'var(--primary-700)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    border: '1px solid var(--primary-200)'
                  }}>
                    {rec.match_score}% Match
                  </div>
                </div>

                {/* Suitability Reasons */}
                <div style={{ marginBottom: '14px', backgroundColor: 'var(--surface-50)', padding: '10px 14px', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    AGRONOMIC MATCH REASONS:
                  </span>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {rec.suitability_reasons?.map((reason: string, i: number) => (
                      <li key={i} style={{ marginBottom: '2px' }}>{reason}</li>
                    ))}
                  </ul>
                </div>

                {/* Parameters Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '14px', fontSize: '0.8rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Harvest Window</span>
                    <strong>{rec.expected_duration}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Water Need</span>
                    <strong>{rec.estimated_water_requirement}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Buyer Demand</span>
                    <strong style={{ color: 'var(--primary-600)' }}>{rec.expected_demand}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Avg Mandi Price</span>
                    <strong>₹{rec.average_price} {rec.price_unit}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Profit Potential</span>
                    <strong style={{ color: 'var(--success)' }}>{rec.approximate_profitability}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Risk Factor</span>
                    <strong style={{ color: rec.risk_level.includes('Low') ? 'var(--success)' : rec.risk_level.includes('Medium') ? '#d97706' : 'var(--danger)' }}>
                      {rec.risk_level}
                    </strong>
                  </div>
                </div>

                {/* Suggested Buyers */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--surface-100)', paddingTop: '12px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Target Buyers: <strong>{rec.suggested_buyer_categories?.join(', ')}</strong>
                  </div>
                  <button
                    onClick={() => onViewPriceTrend(rec.crop_name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--primary-600)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      background: 'none'
                    }}
                  >
                    <span>Price Trends</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
