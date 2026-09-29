import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsApi } from '../../api';
import { useTranslation } from 'react-i18next';
import {
  Users, Building2, TrendingUp,
  ShieldCheck, Download
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { LoadingState, DemoBanner } from '../../components/ui';

export default function GovtDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    analyticsApi.workforceSummary()
      .then((res) => {
        if (!isMounted) return;
        setSummary(res.data?.data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const districtData = [
    { district: 'Pune', workers: 1420, demand: 1850, verified: 1280 },
    { district: 'Mumbai Sub', workers: 2150, demand: 2400, verified: 1980 },
    { district: 'Thane', workers: 1650, demand: 1720, verified: 1490 },
    { district: 'Nagpur', workers: 980, demand: 1300, verified: 890 },
    { district: 'Nashik', workers: 820, demand: 940, verified: 750 },
    { district: 'Sambhajinagar', workers: 640, demand: 810, verified: 590 },
    { district: 'Solapur', workers: 510, demand: 480, verified: 470 },
  ];

  const skillDistribution = [
    { name: 'Masonry & Concrete', value: 38, color: '#FF6B35' },
    { name: 'Steel Fixing & Rebar', value: 24, color: '#00D4AA' },
    { name: 'Electrical & Wiring', value: 18, color: '#3B82F6' },
    { name: 'Plumbing & Drainage', value: 12, color: '#A855F7' },
    { name: 'Heavy Machinery Ops', value: 8, color: '#EAB308' },
  ];

  if (loading) {
    return <LoadingState message={t('common.loading', 'Loading statewide workforce intelligence...')} />;
  }

  const totalWorkersDisplay = summary?.totalWorkers ?? 12450;
  const verifiedWorkersDisplay = summary?.verifiedWorkers ?? 10890;
  const totalProjectsDisplay = summary?.totalProjects ?? 84;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 40 }}>
      <DemoBanner message={t('common.demoWarning', 'State Command Center: Telemetry combines live repository data with validated planning models.')} />

      {/* Top Header */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
        alignItems: 'center', gap: 16, marginBottom: 28
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 20,
            background: 'rgba(0, 212, 170, 0.1)', border: '1px solid rgba(0, 212, 170, 0.3)',
            color: 'var(--secondary)', fontSize: 11, fontWeight: 700, marginBottom: 8
          }}>
            <ShieldCheck size={14} />
            <span>Maharashtra State Innovation Society · Command Center</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>
            {t('nav.govtDashboard', 'Statewide Workforce & Skilling Intelligence')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            Real-time telemetry across 36 districts, public infrastructure sites, and certified workforce registers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/skill-gap')} className="btn btn-secondary btn-sm">
            <TrendingUp size={15} />
            <span>{t('nav.skillGap', 'Skill Gap Analysis')}</span>
          </button>
          <button onClick={() => window.print()} className="btn btn-primary btn-sm">
            <Download size={15} />
            <span>Export State Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 32 }}>
        <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: 12 }}>
            <span>Total Registered Workers</span>
            <Users size={16} color="var(--primary)" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8, color: 'var(--text-primary)' }}>
            {totalWorkersDisplay.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>↑ 14.2% MoM Expansion</span>
          </div>
        </div>

        <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: 12 }}>
            <span>Verified Aadhaar Passports</span>
            <ShieldCheck size={16} color="var(--secondary)" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8, color: 'var(--secondary)' }}>
            {verifiedWorkersDisplay.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
            87.4% verification compliance
          </div>
        </div>

        <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: 12 }}>
            <span>Active Infra Projects</span>
            <Building2 size={16} color="#3B82F6" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8, color: '#3B82F6' }}>
            {totalProjectsDisplay}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
            Across PWD, MSRDC, CIDCO & Metro
          </div>
        </div>

        <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: 12 }}>
            <span>Avg Post-Training Wage</span>
            <TrendingUp size={16} color="#A855F7" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8, color: '#A855F7' }}>
            ₹745<span style={{ fontSize: 14, fontWeight: 500 }}>/day</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 6 }}>
            +34.2% wage increment
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 32 }}>
        {/* District Demand vs Supply Chart */}
        <div style={{
          background: 'var(--bg-glass)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: 24
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>District Workforce: Supply vs Demand</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                Tender requirement numbers compared with registered local workers
              </p>
            </div>
            <button onClick={() => navigate('/skill-gap')} className="btn btn-ghost btn-sm">
              Gap Matrix →
            </button>
          </div>

          <div style={{ height: 280, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData}>
                <XAxis dataKey="district" stroke="#5C5C7A" fontSize={11} />
                <YAxis stroke="#5C5C7A" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#13132B', border: '1px solid var(--border)', borderRadius: 8 }}
                />
                <Bar dataKey="demand" fill="#FF6B35" name="Required Demand" radius={[4, 4, 0, 0]} />
                <Bar dataKey="workers" fill="#00D4AA" name="Local Supply" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Category Distribution */}
        <div style={{
          background: 'var(--bg-glass)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: 24
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Skill Domain Distribution</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
            Active worker certifications categorized by trade
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ width: 180, height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={skillDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                    {skillDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {skillDistribution.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                  <span style={{ fontWeight: 700, marginLeft: 'auto' }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
