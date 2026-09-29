import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { authApi } from '../api';
import { Lock, User, Eye, EyeOff, AlertCircle, Mail, Phone } from 'lucide-react';
import { LanguageSwitcher, NirmaanSetuLogo } from '../components/ui';

const ROLE_OPTIONS = [
  { value: 'WORKER', labelKey: 'roles.WORKER' },
  { value: 'PROJECT_AGENCY', labelKey: 'roles.PROJECT_AGENCY' },
  { value: 'TRAINING_ORGANIZATION', labelKey: 'roles.TRAINING_ORGANIZATION' },
];

export default function RegisterPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'WORKER',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const setField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setServerError('');
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.username.trim()) newErrors.username = t('auth.usernameRequired');
    if (!form.fullName.trim()) newErrors.fullName = t('auth.fullNameRequired');
    if (!form.password) newErrors.password = t('auth.passwordRequired');
    else if (form.password.length < 8) newErrors.password = t('auth.passwordTooShort');
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = t('auth.passwordsDoNotMatch');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');
    try {
      await authApi.register({
        username: form.username.trim().toLowerCase(),
        fullName: form.fullName.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        password: form.password,
        role: form.role,
      });
      // Auto-login after registration
      await login(form.username.trim().toLowerCase(), form.password);
      showToast(t('auth.registerSuccess'), 'success');

      const role = form.role;
      if (role === 'WORKER') navigate('/passport');
      else if (role === 'PROJECT_AGENCY') navigate('/projects');
      else if (role === 'TRAINING_ORGANIZATION') navigate('/training');
      else navigate('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.error || t('errors.unknownError', 'Registration failed. Please check details.');
      setServerError(msg);
    } finally {
      setLoading(false);
    }
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
        background: 'radial-gradient(ellipse 60% 60% at 70% 50%, rgba(124,58,237,0.1) 0%, transparent 60%)',
      }} />

      <div style={{ width: '100%', maxWidth: 520, position: 'relative', zIndex: 1, paddingTop: 20 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', textDecoration: 'none' }}>
            <NirmaanSetuLogo variant="full" size="lg" subtitle={t('app.govt')} />
          </Link>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 32,
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{t('auth.signUp')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 24 }}>
            {t('auth.accessAccount')}
          </p>

          {serverError && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 8, padding: '12px 14px', marginBottom: 20,
              fontSize: 14, color: '#EF4444'
            }}>
              <AlertCircle size={16} />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleRegister} noValidate>
            {/* Role selector */}
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">{t('common.role')}</label>
              <select
                className="input"
                value={form.role}
                onChange={(e) => setField('role', e.target.value)}
                id="register-role"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {t(opt.labelKey)}
                  </option>
                ))}
              </select>
            </div>

            {/* Full Name */}
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label" htmlFor="register-fullname">{t('auth.fullName')}</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="register-fullname"
                  type="text"
                  className={`input ${errors.fullName ? 'input-error' : ''}`}
                  style={{ paddingLeft: 42 }}
                  placeholder="Ramesh Kumar"
                  value={form.fullName}
                  onChange={(e) => setField('fullName', e.target.value)}
                  autoComplete="name"
                />
              </div>
              {errors.fullName && <div className="form-error">{errors.fullName}</div>}
            </div>

            {/* Username */}
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label" htmlFor="register-username">{t('auth.usernameField')}</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="register-username"
                  type="text"
                  className={`input ${errors.username ? 'input-error' : ''}`}
                  style={{ paddingLeft: 42 }}
                  placeholder="ramesh.kumar"
                  value={form.username}
                  onChange={(e) => setField('username', e.target.value)}
                  autoComplete="username"
                />
              </div>
              {errors.username && <div className="form-error">{errors.username}</div>}
            </div>

            {/* Email */}
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label" htmlFor="register-email">
                {t('auth.email')} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{t('common.optional')}</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="register-email"
                  type="email"
                  className="input"
                  style={{ paddingLeft: 42 }}
                  placeholder="ramesh@example.com"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label" htmlFor="register-phone">
                {t('auth.phone')} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{t('common.optional')}</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="register-phone"
                  type="tel"
                  className="input"
                  style={{ paddingLeft: 42 }}
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label" htmlFor="register-password">{t('auth.password')}</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`input ${errors.password ? 'input-error' : ''}`}
                  style={{ paddingLeft: 42, paddingRight: 44 }}
                  placeholder={t('auth.password')}
                  value={form.password}
                  onChange={(e) => setField('password', e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            {/* Confirm Password */}
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label" htmlFor="register-confirm">{t('auth.confirmPassword')}</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="register-confirm"
                  type={showPassword ? 'text' : 'password'}
                  className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                  style={{ paddingLeft: 42 }}
                  placeholder={t('auth.confirmPassword')}
                  value={form.confirmPassword}
                  onChange={(e) => setField('confirmPassword', e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '13px' }}
              disabled={loading}
              id="register-submit-btn"
            >
              {loading && <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />}
              {loading ? t('auth.registering') : t('auth.signUp')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
            {t('auth.haveAccount')}{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              {t('auth.loginHere')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
