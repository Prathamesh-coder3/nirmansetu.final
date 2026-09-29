import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher, NirmaanSetuLogo } from './ui';
import {
  LayoutDashboard, Building2, GraduationCap,
  BarChart3, LogOut, User, Briefcase, Search,
  FileText, TrendingUp, Map, BookOpen, Menu, X
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  onClick?: () => void;
}

function NavItem({ to, icon: Icon, label, onClick }: NavItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isWorker = user?.role === 'WORKER';
  const isGovt = user?.role === 'GOVERNMENT' || user?.role === 'ADMIN';
  const isAgency = user?.role === 'PROJECT_AGENCY';
  const isTraining = user?.role === 'TRAINING_ORGANIZATION';
  const roleLabel = t(`roles.${user?.role}`, { defaultValue: user?.role ?? '' });

  const handleLogout = () => {
    // Client-side logout: clear auth and navigate without a full reload,
    // so the startup splash never appears again during logout.
    setMobileOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  const closeDrawer = () => setMobileOpen(false);

  const navigationLinks = (onItemClick?: () => void) => (
    <nav className="sidebar-nav">
      {/* Common */}
      <div className="sidebar-section-title">{t('nav.navigation')}</div>
      <NavItem to="/dashboard" icon={LayoutDashboard} label={t('nav.dashboard')} onClick={onItemClick} />
      <NavItem to="/projects" icon={Building2} label={t('nav.projects')} onClick={onItemClick} />
      <NavItem to="/training" icon={GraduationCap} label={t('nav.training')} onClick={onItemClick} />

      {/* Worker-specific */}
      {isWorker && (
        <>
          <div className="sidebar-section-title">{t('nav.myProfile')}</div>
          <NavItem to="/passport" icon={User} label={t('nav.skillPassport')} onClick={onItemClick} />
          <NavItem to="/find-work" icon={Search} label={t('nav.findWork')} onClick={onItemClick} />
          <NavItem to="/my-applications" icon={FileText} label={t('nav.myApplications')} onClick={onItemClick} />
        </>
      )}

      {/* Government-specific */}
      {isGovt && (
        <>
          <div className="sidebar-section-title">{t('nav.intelligence')}</div>
          <NavItem to="/government" icon={BarChart3} label={t('nav.govtDashboard')} onClick={onItemClick} />
          <NavItem to="/skill-gap" icon={TrendingUp} label={t('nav.skillGap')} onClick={onItemClick} />
          <NavItem to="/employment-outcomes" icon={Map} label={t('nav.employmentOutcomes')} onClick={onItemClick} />
        </>
      )}

      {/* Agency-specific */}
      {isAgency && (
        <>
          <div className="sidebar-section-title">{t('nav.agency')}</div>
          <NavItem to="/projects" icon={Briefcase} label={t('nav.myProjects')} onClick={onItemClick} />
        </>
      )}

      {/* Training-specific */}
      {isTraining && (
        <>
          <div className="sidebar-section-title">{t('nav.organization')}</div>
          <NavItem to="/training" icon={BookOpen} label={t('nav.programs')} onClick={onItemClick} />
        </>
      )}
    </nav>
  );

  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <nav className="nav">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 12 }}>
          {/* Brand & Mobile Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Mobile Hamburger toggle */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
              id="mobile-menu-toggle"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <NavLink to="/dashboard" style={{ textDecoration: 'none' }} onClick={closeDrawer}>
              <NirmaanSetuLogo variant="full" size="sm" showSubtitle={false} />
            </NavLink>

            <div
              className="badge badge-primary"
              style={{
                fontSize: 10,
                padding: '2px 8px',
                letterSpacing: '0.04em',
                display: 'none',
              }}
            >
              {t('app.demoMode')}
            </div>
          </div>

          {/* Right side: Language + User + Logout */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <LanguageSwitcher />

              <div className="nav-user-info" style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.fullName}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                  {roleLabel}
                </div>
              </div>

              <div
                className="avatar"
                style={{
                  width: 34,
                  height: 34,
                  fontSize: 14,
                  background: isWorker ? 'var(--gradient-primary)' : isGovt ? 'var(--gradient-secondary)' : 'var(--gradient-accent)',
                }}
              >
                {user.fullName[0]}
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
                id="logout-btn"
                title={t('nav.logout')}
                aria-label={t('nav.logout')}
                style={{ padding: '6px 10px', gap: 6 }}
              >
                <LogOut size={15} />
                <span className="logout-text">{t('nav.logout')}</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`mobile-drawer-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileOpen ? 'open' : ''}`} aria-label="Mobile Navigation">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
          <NirmaanSetuLogo variant="full" size="sm" showSubtitle={false} />
          <button
            onClick={closeDrawer}
            className="btn btn-ghost btn-sm"
            style={{ padding: 6 }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* User preview in mobile drawer */}
        {user && (
          <div style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '12px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="avatar" style={{
                width: 38, height: 38, fontSize: 16,
                background: isWorker ? 'var(--gradient-primary)' : isGovt ? 'var(--gradient-secondary)' : 'var(--gradient-accent)',
              }}>
                {user?.fullName?.[0] ?? 'U'}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.fullName}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  {roleLabel}
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {navigationLinks(closeDrawer)}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm"
            style={{ width: '100%', justifyContent: 'center', gap: 8, color: '#EF4444' }}
          >
            <LogOut size={16} />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="sidebar">
        {/* User card */}
        <div style={{
          background: 'var(--bg-glass)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div className="avatar" style={{
              width: 44, height: 44, fontSize: 18,
              background: isWorker ? 'var(--gradient-primary)' : isGovt ? 'var(--gradient-secondary)' : 'var(--gradient-accent)',
            }}>
              {user?.fullName?.[0] ?? 'U'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.fullName}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{roleLabel}</div>
            </div>
          </div>
          {isWorker && user?.profileComplete !== undefined && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                <span>{t('nav.profile')}</span>
                <span>{user.profileComplete}%</span>
              </div>
              <div className="progress">
                <div className="progress-fill" style={{ width: `${user.profileComplete}%` }} />
              </div>
            </div>
          )}
        </div>

        {navigationLinks()}

        {/* Footer */}
        <div style={{
          marginTop: 'auto',
          paddingTop: 16,
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>NirmaanSetu v1.0</div>
            <div>Govt. of Maharashtra</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
