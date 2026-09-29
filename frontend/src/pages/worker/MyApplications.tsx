import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationsApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import {
  EmptyState, ErrorState, LoadingState, StatusBadge,
  ConfirmDialog
} from '../../components/ui';
import { Clock, Briefcase, MapPin, FileText } from 'lucide-react';

export default function MyApplications() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [withdrawId, setWithdrawId] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState(false);

  const loadApplications = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    applicationsApi.myApplications()
      .then((res) => {
        const data = res.data?.data || [];
        setApps(data);
      })
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 404) {
          // Worker profile not found - empty state
          setApps([]);
        } else {
          setLoadError(t('worker.applications.error'));
        }
      })
      .finally(() => setLoading(false));
  }, [t]);

  useEffect(() => { loadApplications(); }, [loadApplications]);

  const handleWithdraw = async () => {
    if (!withdrawId) return;
    setWithdrawing(true);
    try {
      await applicationsApi.withdraw(withdrawId);
      showToast(t('worker.applications.withdrawSuccess'), 'success');
      // Refresh the list from server
      setApps((prev) => prev.map((a) =>
        a.id === withdrawId ? { ...a, status: 'WITHDRAWN' } : a
      ));
    } catch (err: any) {
      const msg = err?.response?.data?.error || t('worker.applications.withdrawError');
      showToast(msg, 'error');
    } finally {
      setWithdrawing(false);
      setWithdrawId(null);
    }
  };

  const canWithdraw = (status: string) =>
    !['DEPLOYED', 'COMPLETED', 'WITHDRAWN'].includes(status);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 40 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>{t('worker.applications.title')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
          {t('worker.applications.subtitle')}
        </p>
      </div>

      {loading ? (
        <LoadingState text={t('worker.applications.loading')} />
      ) : loadError ? (
        <ErrorState
          message={loadError}
          onRetry={loadApplications}
        />
      ) : apps.length === 0 ? (
        <EmptyState
          title={t('worker.applications.noApplications')}
          description={t('worker.applications.noApplicationsDesc')}
          icon={<FileText size={40} />}
          action={{
            label: t('worker.applications.findWork'),
            onClick: () => navigate('/find-work'),
          }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {apps.map((app) => (
            <div
              key={app.id}
              style={{
                background: 'var(--bg-glass)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: 24
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700 }}>
                      {app.projectTitle || `Project ${app.projectId?.slice(0, 8) || ''}`}
                    </h3>
                    <StatusBadge status={app.status} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    {app.agency && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Briefcase size={12} />
                        {t('worker.applications.agency')}: {app.agency}
                      </span>
                    )}
                    {app.projectDistrict && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={12} />
                        {app.projectDistrict}
                      </span>
                    )}
                    <span>
                      {t('worker.applications.appliedOn')} {formatDate(app.appliedAt)}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {app.matchScore !== undefined && (
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--secondary)' }}>
                        {Math.round(Number(app.matchScore))}%
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {t('worker.applications.match')}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: 13,
                color: 'var(--text-secondary)', padding: '12px 16px',
                background: 'rgba(255,255,255,0.02)', borderRadius: 8, marginTop: 4
              }}>
                {(app.primarySkill || app.skillCategoryId) && (
                  <div>
                    <strong>{t('worker.applications.role')}:</strong>{' '}
                    {app.primarySkill || app.skillCategoryId}
                  </div>
                )}
                {app.workerDistrict && (
                  <div>
                    <strong>{t('worker.applications.location')}:</strong>{' '}
                    {app.workerDistrict}
                  </div>
                )}
                {app.dailyWageOffered && (
                  <div>
                    <strong>{t('worker.applications.wage')}:</strong>{' '}
                    ₹{app.dailyWageOffered}{t('worker.findWork.perDay')}
                  </div>
                )}
              </div>

              {app.notes && (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={14} color="var(--primary)" />
                  <span>{t('worker.applications.statusNote')}: {app.notes}</span>
                </div>
              )}

              {app.rejectionReason && app.status === 'REJECTED' && (
                <div style={{
                  fontSize: 12, color: '#EF4444', marginTop: 10,
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 6, padding: '8px 12px'
                }}>
                  Rejection Reason: {app.rejectionReason}
                </div>
              )}

              {/* Withdraw button */}
              {canWithdraw(app.status) && (
                <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setWithdrawId(app.id)}
                    style={{ color: '#EF4444', fontSize: 12 }}
                  >
                    {t('worker.applications.withdraw')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Withdraw Confirm Dialog */}
      <ConfirmDialog
        open={withdrawId !== null}
        title={t('worker.applications.withdraw')}
        message={t('worker.applications.withdrawConfirm')}
        confirmLabel={t('worker.applications.withdraw')}
        variant="danger"
        loading={withdrawing}
        onConfirm={handleWithdraw}
        onCancel={() => setWithdrawId(null)}
      />
    </div>
  );
}
