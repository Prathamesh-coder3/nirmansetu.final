import WorkerDashboard from './worker/WorkerDashboard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Building2, GraduationCap, BarChart3,
  TrendingUp, Award, ArrowRight, ShieldCheck, Briefcase
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Workers get a dedicated dashboard at the common Dashboard route too.
  if (user?.role === 'WORKER') {
    return <WorkerDashboard />;
  }

  return (
    <div style={{ padding: '24px 0', maxWidth: 1200, margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'var(--gradient-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '28px 32px', marginBottom: 28,
        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 20,
            background: 'rgba(0, 212, 170, 0.1)', border: '1px solid rgba(0, 212, 170, 0.3)',
            color: 'var(--secondary)', fontSize: 11, fontWeight: 700, marginBottom: 12
          }}>
            <ShieldCheck size={14} />
            <span>NirmaanSetu Connected · Maharashtra State Portal</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
            {t('dashboard.welcomeBack', 'Welcome back')}, {user?.fullName || t('roles.' + (user?.role || 'GOVERNMENT'), 'Colleague')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            System operational across 36 districts. All matching engines and outcome telemetry running normally.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {(user?.role === 'GOVERNMENT' || user?.role === 'ADMIN') && (
            <button onClick={() => navigate('/government')} className="btn btn-primary">
              <BarChart3 size={16} />
              <span>{t('nav.govtDashboard', 'State Intelligence')}</span>
            </button>
          )}
          {(user?.role === 'PROJECT_AGENCY' || user?.role === 'ADMIN') && (
            <button onClick={() => navigate('/projects')} className="btn btn-primary">
              <Briefcase size={16} />
              <span>{t('nav.projects', 'Manage Projects')}</span>
            </button>
          )}
          {(user?.role === 'TRAINING_ORGANIZATION' || user?.role === 'ADMIN') && (
            <button onClick={() => navigate('/training')} className="btn btn-primary">
              <GraduationCap size={16} />
              <span>{t('nav.training', 'Training Programs')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 32 }}>
        <div
          onClick={() => navigate('/government')}
          style={{
            background: 'var(--bg-glass)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: 24, cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(0, 212, 170, 0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)'
            }}>
              <BarChart3 size={20} />
            </div>
            <ArrowRight size={16} color="var(--text-muted)" />
          </div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{t('nav.govtDashboard', 'Statewide Dashboard')}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Real-time workforce deployment metrics and district analytics.
          </div>
        </div>

        <div
          onClick={() => navigate('/skill-gap')}
          style={{
            background: 'var(--bg-glass)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: 24, cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(255, 107, 53, 0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
            }}>
              <TrendingUp size={20} />
            </div>
            <ArrowRight size={16} color="var(--text-muted)" />
          </div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{t('nav.skillGap', 'Skill Gap Analysis')}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Compare demand vs certified supply and forecast shortages.
          </div>
        </div>

        <div
          onClick={() => navigate('/employment-outcomes')}
          style={{
            background: 'var(--bg-glass)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: 24, cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3B82F6')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(59, 130, 246, 0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#3B82F6'
            }}>
              <Award size={20} />
            </div>
            <ArrowRight size={16} color="var(--text-muted)" />
          </div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{t('nav.employmentOutcomes', 'Employment Outcomes')}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Track wage increments, retention at 90 days, and program ROI.
          </div>
        </div>

        <div
          onClick={() => navigate('/projects')}
          style={{
            background: 'var(--bg-glass)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: 24, cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#A855F7')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(168, 85, 247, 0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#A855F7'
            }}>
              <Building2 size={20} />
            </div>
            <ArrowRight size={16} color="var(--text-muted)" />
          </div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{t('nav.projects', 'Infrastructure Projects')}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Review active sites, requirements, and match qualified labor.
          </div>
        </div>
      </div>
    </div>
  );
}
