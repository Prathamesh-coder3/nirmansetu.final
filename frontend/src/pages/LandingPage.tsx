import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck, ArrowRight, TrendingUp, Users, Building2,
  GraduationCap, Award, Compass, BarChart3, CheckCircle2, ChevronRight
} from 'lucide-react';
import { LanguageSwitcher, NirmaanSetuLogo } from '../components/ui';

export default function LandingPage() {
  const { isAuthenticated, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRoleQuickStart = async (role: 'WORKER' | 'GOVERNMENT' | 'PROJECT_AGENCY' | 'TRAINING_ORGANIZATION') => {
    await loginAsDemo(role);
    if (role === 'WORKER') navigate('/passport');
    else if (role === 'GOVERNMENT') navigate('/government');
    else if (role === 'PROJECT_AGENCY') navigate('/projects');
    else navigate('/training');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Top Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(13, 13, 26, 0.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)', padding: '14px 0'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <NirmaanSetuLogo variant="full" size="md" subtitle={t('app.govt')} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <LanguageSwitcher />

            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-sm">
                <span>{t('nav.dashboard')}</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <div style={{ display: 'flex', gap: 10 }}>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  {t('auth.signIn')}
                </Link>
                <button
                  onClick={() => handleRoleQuickStart('GOVERNMENT')}
                  className="btn btn-primary btn-sm"
                  id="landing-quick-demo-btn"
                >
                  <span>{t('app.demoMode')}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: '70px 0 50px',
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,107,53,0.18), transparent)'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 920, margin: '0 auto' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 30,
            background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-primary)',
            fontSize: 12, fontWeight: 600, color: 'var(--primary-light)', marginBottom: 24
          }}>
            <ShieldCheck size={15} color="var(--primary)" />
            <span>{t('landing.badge')}</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 800,
            lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 20
          }}>
            {t('landing.heroTitle1')}{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FF8557 0%, #FF6B35 50%, #00D4AA 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              {t('landing.heroTitle2')}
            </span>
          </h1>

          <p style={{
            fontSize: 17, color: 'var(--text-secondary)', maxWidth: 720,
            margin: '0 auto 36px', lineHeight: 1.6
          }}>
            {t('landing.heroSubtitle')}
          </p>

          {/* Quick Access Role Badges */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: 12, maxWidth: 880, margin: '0 auto 40px', textAlign: 'left'
          }}>
            {[
              { role: 'WORKER' as const, title: t('roles.WORKER'), desc: t('landing.roleWorkerDesc'), icon: Users, color: '#FF6B35' },
              { role: 'GOVERNMENT' as const, title: t('roles.GOVERNMENT'), desc: t('landing.roleGovtDesc'), icon: BarChart3, color: '#00D4AA' },
              { role: 'PROJECT_AGENCY' as const, title: t('roles.PROJECT_AGENCY'), desc: t('landing.roleAgencyDesc'), icon: Building2, color: '#3B82F6' },
              { role: 'TRAINING_ORGANIZATION' as const, title: t('roles.TRAINING_ORGANIZATION'), desc: t('landing.roleTrainingDesc'), icon: GraduationCap, color: '#A855F7' },
            ].map((item) => (
              <button
                key={item.role}
                onClick={() => handleRoleQuickStart(item.role)}
                style={{
                  background: 'var(--bg-glass)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: '16px',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease',
                  display: 'flex', flexDirection: 'column', gap: 6
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = item.color;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: `${item.color}20`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: item.color
                  }}>
                    <item.icon size={18} />
                  </div>
                  <ChevronRight size={14} color="var(--text-muted)" />
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginTop: 4 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {item.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section style={{
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        background: 'rgba(255, 255, 255, 0.02)', padding: '36px 0'
      }}>
        <div className="container" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24, textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)' }}>36</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{t('landing.statDistricts')}</div>
          </div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--secondary)' }}>87.4%</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{t('landing.statPlacement')}</div>
          </div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#3B82F6' }}>+34.2%</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{t('landing.statWageGain')}</div>
          </div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#A855F7' }}>100%</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{t('landing.statMatching')}</div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 12 }}>
              {t('landing.pillarsTitle')} <span style={{ color: 'var(--primary)' }}>#26135</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 640, margin: '0 auto', fontSize: 15 }}>
              {t('landing.pillarsSubtitle')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              {
                icon: Award,
                title: t('landing.pillar1Title'),
                desc: t('landing.pillar1Desc'),
                tag: t('landing.pillar1Tag')
              },
              {
                icon: Compass,
                title: t('landing.pillar2Title'),
                desc: t('landing.pillar2Desc'),
                tag: t('landing.pillar2Tag')
              },
              {
                icon: TrendingUp,
                title: t('landing.pillar3Title'),
                desc: t('landing.pillar3Desc'),
                tag: t('landing.pillar3Tag')
              },
              {
                icon: CheckCircle2,
                title: t('landing.pillar4Title'),
                desc: t('landing.pillar4Desc'),
                tag: t('landing.pillar4Tag')
              }
            ].map((pillar, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-glass)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', padding: 24,
                  display: 'flex', flexDirection: 'column', gap: 12,
                  transition: 'border-color 0.2s ease'
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(255, 107, 53, 0.1)', border: '1px solid var(--border-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
                }}>
                  <pillar.icon size={20} />
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                  color: 'var(--secondary)', textTransform: 'uppercase'
                }}>
                  {pillar.tag}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700 }}>{pillar.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '32px 0',
        background: 'rgba(10, 10, 20, 0.9)', color: 'var(--text-muted)', fontSize: 12
      }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>NirmaanSetu</strong> — {t('app.govt')}
            <div style={{ marginTop: 4 }}>{t('app.dept')}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
