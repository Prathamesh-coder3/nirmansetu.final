import { useTranslation } from 'react-i18next';
import { AlertCircle, RefreshCw, Wifi } from 'lucide-react';
export { NirmaanSetuLogo } from './NirmaanSetuLogo';
export { LanguageSwitcher } from './LanguageSwitcher';

interface EmptyStateProps {
  title: string;
  description?: string;
  message?: string;
  action?: { label: string; onClick: () => void };
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, message, action, icon }: EmptyStateProps) {
  const desc = description || message;
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      background: 'var(--bg-glass)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
    }}>
      {icon && (
        <div style={{ marginBottom: 16, color: 'var(--text-muted)', opacity: 0.6 }}>
          {icon}
        </div>
      )}
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
        {title}
      </div>
      {desc && (
        <div style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 360, lineHeight: 1.5 }}>
          {desc}
        </div>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="btn btn-primary btn-sm"
          style={{ marginTop: 20 }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  isNetworkError?: boolean;
}

export function ErrorState({ title, message, onRetry, isNetworkError }: ErrorStateProps) {
  const { t } = useTranslation();
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      background: 'rgba(239,68,68,0.06)',
      border: '1px solid rgba(239,68,68,0.2)',
      borderRadius: 'var(--radius)',
    }}>
      <div style={{ color: '#EF4444', marginBottom: 12 }}>
        {isNetworkError ? <Wifi size={32} /> : <AlertCircle size={32} />}
      </div>
      {title && (
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>
          {title}
        </div>
      )}
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 360, lineHeight: 1.5 }}>
        {message}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-ghost btn-sm"
          style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <RefreshCw size={14} />
          <span>{t('common.retry')}</span>
        </button>
      )}
    </div>
  );
}

interface LoadingStateProps {
  text?: string;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ text, message, size = 'md' }: LoadingStateProps) {
  const { t } = useTranslation();
  const label = message || text;
  const spinnerSize = size === 'sm' ? 20 : size === 'lg' ? 48 : 32;
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      gap: 16,
    }}>
      <div
        className="spinner"
        style={{ width: spinnerSize, height: spinnerSize }}
        aria-label={label || t('common.loading')}
      />
      {label && (
        <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{label}</div>
      )}
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const STATUS_VARIANTS: Record<string, string> = {
  APPLIED: 'badge-primary',
  UNDER_REVIEW: 'badge-warning',
  SHORTLISTED: 'badge-success',
  SELECTED: 'badge-success',
  DEPLOYED: 'badge-secondary',
  COMPLETED: 'badge-secondary',
  REJECTED: 'badge-error',
  WITHDRAWN: 'badge-warning',
  ACTIVE: 'badge-success',
  IN_PROGRESS: 'badge-secondary',
  PLANNING: 'badge-warning',
  PROPOSED: 'badge-primary',
  AVAILABLE: 'badge-success',
  UNAVAILABLE: 'badge-warning',
  IN_TRAINING: 'badge-primary',
  VERIFIED: 'badge-success',
  UNVERIFIED: 'badge-warning',
  PENDING: 'badge-warning',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const { t } = useTranslation();
  const variantClass = STATUS_VARIANTS[status] || 'badge-primary';
  const label = t(`status.${status}`, { defaultValue: status });
  return (
    <span
      className={`badge ${variantClass}`}
      style={size === 'sm' ? { fontSize: 10, padding: '2px 7px' } : undefined}
      aria-label={label}
    >
      {label}
    </span>
  );
}

interface SkillLevelBadgeProps {
  level: string;
}

const SKILL_LEVEL_COLORS: Record<string, string> = {
  BEGINNER: 'var(--text-muted)',
  SEMI_SKILLED: 'var(--info)',
  SKILLED: 'var(--primary)',
  EXPERT: 'var(--secondary)',
  MASTER: '#A855F7',
};

export function SkillLevelBadge({ level }: SkillLevelBadgeProps) {
  const { t } = useTranslation();
  const color = SKILL_LEVEL_COLORS[level] || 'var(--text-muted)';
  const label = t(`skillLevel.${level}`, { defaultValue: level });
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, color,
      background: `${color}18`,
      border: `1px solid ${color}30`,
      borderRadius: 4,
      padding: '2px 8px',
    }}>
      {label}
    </span>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open, title, message, confirmLabel, cancelLabel,
  variant = 'default', onConfirm, onCancel, loading
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 24,
      }}
      onClick={onCancel}
      role="dialog"
      aria-modal
      aria-labelledby="dialog-title"
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 28,
          maxWidth: 420,
          width: '100%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="dialog-title" style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
          {title}
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 24 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            className="btn btn-ghost btn-sm"
            disabled={loading}
          >
            {cancelLabel || t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className={`btn btn-sm ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            disabled={loading}
          >
            {loading && <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />}
            {confirmLabel || t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}

interface DemoBannerProps {
  message?: string;
}

export function DemoBanner({ message }: DemoBannerProps) {
  const { t } = useTranslation();
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '3px 10px',
      borderRadius: 6,
      background: 'rgba(245,158,11,0.1)',
      border: '1px solid rgba(245,158,11,0.25)',
      fontSize: 11,
      color: '#F59E0B',
      fontWeight: 700,
      letterSpacing: '0.04em',
    }}>
      ⚠ {message || t('common.demoData')}
    </div>
  );
}
