import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationsApi, requirementsApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import {
  EmptyState, ErrorState, LoadingState, StatusBadge, DemoBanner
} from '../../components/ui';
import {
  Search, MapPin, Briefcase, Filter,
  CheckCircle2, ChevronRight
} from 'lucide-react';

const DEMO_LISTINGS = [
  {
    id: 'req-01',
    title: 'Metro Line 3 Structural Concreting',
    project: 'Pune Metro Rail Corporation',
    district: 'Pune',
    skill: 'Concrete & Masonry',
    skillLevel: 'SKILLED',
    dailyWageOffered: 750,
    openings: 12,
    durationDays: 180,
    score: 95,
    reasons: ['Primary skill match (100%)', '4+ years experience matched', 'Wage within range']
  },
  {
    id: 'req-02',
    title: 'Samruddhi Highway Bridge Retaining Wall',
    project: 'MSRDC Maharashtra',
    district: 'Nashik',
    skill: 'Steel Fixing & Rebar',
    skillLevel: 'EXPERT',
    dailyWageOffered: 820,
    openings: 8,
    durationDays: 120,
    score: 88,
    reasons: ['Experience requirement met', 'Aadhaar verified priority']
  },
  {
    id: 'req-03',
    title: 'Navi Mumbai Airport Drainage Network',
    project: 'CIDCO Infrastructure',
    district: 'Thane',
    skill: 'Pipe Laying & Plumbing',
    skillLevel: 'SEMI_SKILLED',
    dailyWageOffered: 680,
    openings: 25,
    durationDays: 240,
    score: 82,
    reasons: ['High demand sector', 'Site safety certified']
  },
  {
    id: 'req-04',
    title: 'Nagpur Multi-Modal Logistic Hub Flooring',
    project: 'MIHAN SEZ Authority',
    district: 'Nagpur',
    skill: 'Tile & Terrazzo Flooring',
    skillLevel: 'SKILLED',
    dailyWageOffered: 720,
    openings: 15,
    durationDays: 90,
    score: 79,
    reasons: ['Immediate joining bonus', 'Food & accommodation included']
  }
];

export default function FindWork() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState<string | null>(null);

  const loadListings = () => {
    setLoading(true);
    setLoadError(null);
    requirementsApi.list()
      .then((res) => {
        const data = res.data?.data || [];
        if (data.length > 0) {
          setListings(data);
          setIsDemo(false);
        } else {
          setListings(DEMO_LISTINGS);
          setIsDemo(true);
        }
      })
      .catch(() => {
        // On API failure show demo data (read-only listings are safe to show)
        setListings(DEMO_LISTINGS);
        setIsDemo(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadListings(); }, []);

  // CRITICAL FIX: Only mark as applied when API call SUCCEEDS
  const handleApply = async (requirementId: string) => {
    setSubmitting(requirementId);
    try {
      await applicationsApi.apply(requirementId);
      // Only reached on HTTP 2xx — mark applied
      setAppliedIds((prev) => [...prev, requirementId]);
      showToast(t('worker.findWork.applySuccess'), 'success');
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error || err?.message || '';

      if (status === 409 || msg.toLowerCase().includes('already applied')) {
        // Already applied — update local state to reflect server truth
        setAppliedIds((prev) => [...prev, requirementId]);
        showToast(t('worker.findWork.alreadyApplied'), 'warning');
      } else if (status === 404 && msg.toLowerCase().includes('profile')) {
        showToast(t('worker.findWork.noProfile'), 'warning');
        navigate('/passport');
      } else if (status === 401 || status === 403) {
        showToast(t('errors.sessionExpired'), 'error');
      } else {
        // API failure - do NOT mark as applied
        showToast(t('worker.findWork.applyError'), 'error');
      }
    } finally {
      setSubmitting(null);
    }
  };

  const filtered = listings.filter((item) => {
    const title = item.title || item.skillCategoryId || '';
    const skill = item.skill || item.skillCategoryId || '';
    const district = item.district || '';
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase()) ||
                          skill.toLowerCase().includes(search.toLowerCase());
    const matchesDist = selectedDistrict === 'All' || district === selectedDistrict;
    return matchesSearch && matchesDist;
  });

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 40 }}>
      {/* Title */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>{t('worker.findWork.title')}</h1>
          {isDemo && <DemoBanner />}
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
          {t('worker.findWork.subtitle')}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: 'var(--bg-glass)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: 16, marginBottom: 24,
        display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center'
      }}>
        <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input"
            style={{ paddingLeft: 38 }}
            placeholder={t('worker.findWork.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t('worker.findWork.searchPlaceholder')}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            className="input"
            style={{ width: 'auto', minWidth: 140 }}
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            aria-label={t('common.district')}
          >
            <option value="All">{t('worker.findWork.allDistricts')}</option>
            <option value="Pune">Pune</option>
            <option value="Nashik">Nashik</option>
            <option value="Thane">Thane</option>
            <option value="Nagpur">Nagpur</option>
            <option value="Mumbai Suburban">Mumbai Suburban</option>
          </select>
        </div>
      </div>

      {/* States */}
      {loading ? (
        <LoadingState text={t('worker.findWork.loading')} />
      ) : loadError ? (
        <ErrorState
          message={loadError}
          onRetry={loadListings}
          isNetworkError
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t('worker.findWork.empty')}
          description={t('worker.findWork.emptyDesc')}
          action={{ label: t('common.clearFilters'), onClick: () => { setSearch(''); setSelectedDistrict('All'); } }}
        />
      ) : (
        /* Job cards list */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map((job) => {
            const isApplied = appliedIds.includes(job.id);
            const wage = job.dailyWageOffered || job.wage || 0;
            const duration = job.durationDays ? `${job.durationDays} ${t('common.days')}` : job.duration || '';
            const skill = job.skill || job.skillCategoryId || 'General';
            const reasons = job.reasons || [];
            return (
              <div
                key={job.id}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: 24,
                  display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
                  alignItems: 'center', gap: 20, transition: 'all 0.2s ease'
                }}
              >
                <div style={{ flex: 1, minWidth: 280 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span className="badge badge-primary">{skill}</span>
                    {job.skillLevel && <StatusBadge status={job.skillLevel} />}
                    {duration && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{duration}</span>}
                  </div>

                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{job.title}</h3>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                    {job.project && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Briefcase size={14} color="var(--primary)" />
                        {job.project}
                      </span>
                    )}
                    {job.district && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={14} color="var(--secondary)" />
                        {job.district}
                      </span>
                    )}
                    {wage > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: 'var(--text-primary)' }}>
                        ₹{wage}{t('worker.findWork.perDay')}
                      </span>
                    )}
                    {job.openings && (
                      <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>
                        {job.openings} {t('worker.findWork.openings')}
                      </span>
                    )}
                  </div>

                  {/* Match reasons pills */}
                  {reasons.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                      {reasons.map((r: string, i: number) => (
                        <span key={i} style={{ fontSize: 11, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '2px 8px', borderRadius: 4 }}>
                          ✓ {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Score & Apply Action */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  {job.score && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: job.score >= 90 ? 'var(--secondary)' : 'var(--primary)' }}>
                        {job.score}%
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {t('worker.findWork.matchScore')}
                      </div>
                    </div>
                  )}

                  {isApplied ? (
                    <button className="btn btn-secondary btn-sm" disabled style={{ opacity: 0.9 }}>
                      <CheckCircle2 size={16} />
                      <span>{t('worker.findWork.applied')}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={submitting === job.id}
                      className="btn btn-primary btn-sm"
                      id={`apply-btn-${job.id}`}
                    >
                      <span>{submitting === job.id ? t('worker.findWork.submitting') : t('worker.findWork.applyNow')}</span>
                      {submitting !== job.id && <ChevronRight size={14} />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
