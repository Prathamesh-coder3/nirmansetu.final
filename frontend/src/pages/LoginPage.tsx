import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Lock, User, Eye, EyeOff, AlertCircle, ChevronRight } from 'lucide-react';
import { LanguageSwitcher, NirmaanSetuLogo } from '../components/ui';

const DEMO_ACCOUNTS = [
  { labelKey: 'roles.GOVERNMENT', defaultLabel: 'Government Officer', username: 'govt.pune', role: 'Government', color: 'var(--secondary)' },
  { labelKey: 'roles.PROJECT_AGENCY', defaultLabel: 'Project Agency', username: 'agency.mhada', role: 'Agency', color: 'var(--info)' },
  { labelKey: 'roles.TRAINING_ORGANIZATION', defaultLabel: 'Training Organization', username: 'training.itipune', role: 'Training', color: 'var(--accent-light)' },
  { labelKey: 'roles.WORKER', defaultLabel: 'Worker - Pune', username: 'ramesh.kumar', role: 'Worker', color: 'var(--primary)' },
  { labelKey: 'roles.ADMIN', defaultLabel: 'Admin', username: 'admin', role: 'Admin', color: 'var(--accent-light)' },
];
const DEMO_PASSWORD = 'NirmaanSetu@2024';

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(usernameOrEmail, password);
      const user = JSON.parse(localStorage.getItem('nirmaansetu_user') || '{}');
      const role = user.role;
      if (role === 'WORKER') navigate('/worker');
      else if (role === 'GOVERNMENT' || role === 'ADMIN') navigate('/government');
      else if (role === 'PROJECT_AGENCY') navigate('/projects');
      else if (role === 'TRAINING_ORGANIZATION') navigate('/training');
      else navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || t('auth.invalidCredentials', 'Invalid username or password. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (username: string) => {
    setUsernameOrEmail(username);
    setPassword(DEMO_PASSWORD);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gradient-hero)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Language Switcher in top-right */}
      <div style={{ position: 'absolute', top: 20, right: 24, zIndex: 10 }}>
        <LanguageSwitcher />
      </div>

      {/* Background effects */}
      <div className="hero-grid" />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 60% at 30% 50%, rgba(255,107,53,0.12) 0%, transparent 60%)',
      }} />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ display: 'inline-flex', textDecoration: 'none' }}>
            <NirmaanSetuLogo variant="full" size="lg" subtitle={t('app.tagline')} />
          </Link>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 36 }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{t('auth.signIn')}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              {t('auth.accessAccount')}
            </p>
          </div>

          {/* Demo Accounts */}
          <div style={{
            background: 'rgba(255,107,53,0.06)',
            border: '1px solid rgba(255,107,53,0.15)',
            borderRadius: 'var(--radius)',
            padding: 16,
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              {t('auth.demoAccounts')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.username}
                  onClick={() => fillDemoAccount(acc.username)}
                  id={`demo-${acc.username}`}
                  type="button"
                  style={{
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: acc.color }}>{t(acc.labelKey, acc.defaultLabel)}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{acc.username}</div>
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
              {t('auth.demoPasswordHint')} <strong style={{ color: 'var(--text-secondary)' }}>NirmaanSetu@2024</strong>
            </div>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 20 }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} id="login-form">
            <div className="form-group">
              <label className="form-label">{t('auth.username')}</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }} />
                <input
                  id="login-username"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 40 }}
                  placeholder={t('auth.username')}
                  value={usernameOrEmail}
                  onChange={e => setUsernameOrEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('auth.password', 'Password')}</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: 40, paddingRight: 44 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 8 }}
              disabled={loading}
            >
              {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : null}
              {loading ? t('auth.loggingIn', 'Signing In...') : t('auth.signIn', 'Sign In')}
              {!loading && <ChevronRight size={18} />}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
            {t('auth.noAccount', 'New to the platform?')}{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>{t('auth.registerHere', 'Register here')}</Link>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--text-muted)' }}>
          {t('app.govt', 'Government of Maharashtra')} · {t('app.dept', 'Department of Skills, Employment, Entrepreneurship & Innovation')}
        </div>
      </div>
    </div>
  );
}
