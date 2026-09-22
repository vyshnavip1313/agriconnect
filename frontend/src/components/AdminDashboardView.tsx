import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingBag, ShieldCheck, TrendingUp, AlertTriangle, Check, X, Search, Activity } from 'lucide-react';
import { api } from '../api';
import { Language, translations } from '../i18n';

interface AdminDashboardProps {
  language: Language;
}

export const AdminDashboardView: React.FC<AdminDashboardProps> = ({ language }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const t = translations[language];

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminStats();
      setStats(res);
    } catch (err) {
      console.warn("Using offline admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          AgriLink System & Compliance Admin Panel
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Platform metrics, regional demand heatmaps, AI verification moderation, and trust & safety tracking.
        </p>
      </div>

      {stats && (
        <>
          {/* Top KPI Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div className="glass-panel" style={{ padding: '18px', borderRadius: '14px', backgroundColor: '#ffffff' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL USERS</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {stats.summary?.total_users?.toLocaleString()}
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                {stats.summary?.active_farmers} Farmers • {stats.summary?.active_buyers} Buyers
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '18px', borderRadius: '14px', backgroundColor: '#ffffff' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE HARVEST LISTINGS</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {stats.summary?.total_listings?.toLocaleString()}
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Across 12 states</p>
            </div>

            <div className="glass-panel" style={{ padding: '18px', borderRadius: '14px', backgroundColor: '#ffffff' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL ESCROW ORDERS</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {stats.summary?.total_orders?.toLocaleString()}
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 600 }}>Zero middleman deductions</p>
            </div>

            <div className="glass-panel" style={{ padding: '18px', borderRadius: '14px', backgroundColor: '#ffffff' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>CUMULATIVE TURNOVER</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-700)', marginTop: '4px' }}>
                ₹{(stats.summary?.turnover_inr / 10000000).toFixed(2)} Cr
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Direct farmer payout</p>
            </div>
          </div>

          {/* 2 Grid Columns: Most Searched Crops & Regional Demand */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            {/* Most Searched Crops */}
            <div className="glass-panel" style={{ padding: '22px', borderRadius: '16px', backgroundColor: '#ffffff' }}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Search size={18} color="var(--primary-600)" />
                <span>Most Searched & In-Demand Crops</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {stats.most_searched_crops?.map((c: any) => (
                  <div key={c.crop} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--surface-50)', borderRadius: '10px' }}>
                    <div>
                      <strong style={{ fontSize: '0.9rem' }}>{c.crop}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{c.searches?.toLocaleString()} buyer searches this month</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)' }}>{c.growth}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Demand Heatmap */}
            <div className="glass-panel" style={{ padding: '22px', borderRadius: '16px', backgroundColor: '#ffffff' }}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="#f59e0b" />
                <span>Regional Demand Heatmap</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {stats.regional_demand?.map((r: any) => (
                  <div key={r.region} style={{ padding: '12px 14px', backgroundColor: 'var(--surface-50)', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '0.9rem' }}>{r.region}</strong>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-700)' }}>Index: {r.demand_score}/100</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--surface-200)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${r.demand_score}%`, height: '100%', backgroundColor: 'var(--primary-600)', borderRadius: '3px' }} />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      Top Crops: {r.top_crop}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust & Safety Moderation Section */}
          <div className="glass-panel" style={{ padding: '22px', borderRadius: '16px', backgroundColor: '#ffffff' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#3b82f6" />
              <span>Trust, Safety & Moderation Queue</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats.reported_items?.map((item: any) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--surface-200)', backgroundColor: 'var(--surface-50)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{item.type} Report #{item.id}</span>
                    <p style={{ fontSize: '0.88rem', fontWeight: 600, margin: '2px 0' }}>{item.target} • {item.reason}</p>
                    <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>Status: {item.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => alert(`Marked ${item.id} as Resolved`)}
                      style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', border: '1px solid var(--primary-200)', fontWeight: 600 }}
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => alert(`Suspended ${item.target}`)}
                      style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontWeight: 600 }}
                    >
                      Suspend
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
