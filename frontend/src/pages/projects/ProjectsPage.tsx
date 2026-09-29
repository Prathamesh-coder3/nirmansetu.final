import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../../api';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Search } from 'lucide-react';
import { LoadingState, ErrorState, EmptyState, StatusBadge, DemoBanner } from '../../components/ui';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    projectsApi.list()
      .then((res) => {
        if (!isMounted) return;
        if (res.data?.data?.content && res.data.data.content.length > 0) {
          setProjects(res.data.data.content);
          setIsDemo(false);
        } else if (Array.isArray(res.data?.data) && res.data.data.length > 0) {
          setProjects(res.data.data);
          setIsDemo(false);
        } else {
          loadDemoProjects();
        }
      })
      .catch(() => {
        if (!isMounted) return;
        loadDemoProjects();
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    function loadDemoProjects() {
      setIsDemo(true);
      setProjects([
        {
          id: 'proj-01',
          title: 'Pune Metro Line 3 Extension (Hinjawadi - Shivajinagar)',
          agency: 'Pune Metro Rail Corporation / Tata Projects',
          district: 'Pune',
          status: 'IN_PROGRESS',
          workersNeeded: 350,
          workersFilled: 290,
          completion: 82,
          budget: '₹8,313 Cr',
          startDate: '2024-03-15'
        },
        {
          id: 'proj-02',
          title: 'Hindu Hrudaysamrat Balasaheb Thackeray Samruddhi Expressway Maintenance',
          agency: 'Maharashtra State Road Development Corp (MSRDC)',
          district: 'Nashik',
          status: 'IN_PROGRESS',
          workersNeeded: 180,
          workersFilled: 165,
          completion: 91,
          budget: '₹55,000 Cr',
          startDate: '2023-08-01'
        },
        {
          id: 'proj-03',
          title: 'Navi Mumbai International Airport Phase 1 Terminal & Runway',
          agency: 'CIDCO / Adani Airports',
          district: 'Thane',
          status: 'IN_PROGRESS',
          workersNeeded: 520,
          workersFilled: 410,
          completion: 78,
          budget: '₹16,700 Cr',
          startDate: '2023-11-20'
        },
        {
          id: 'proj-04',
          title: 'Chhatrapati Sambhajinagar Smart City Logistics Park (AURIC)',
          agency: 'Maharashtra Industrial Development Corp (MIDC)',
          district: 'Aurangabad',
          status: 'PLANNING',
          workersNeeded: 220,
          workersFilled: 85,
          completion: 38,
          budget: '₹3,200 Cr',
          startDate: '2025-01-10'
        },
      ]);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.district || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.agency || '').toLowerCase().includes(search.toLowerCase());
    const matchesDistrict = districtFilter === 'ALL' || p.district === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  const districts = ['ALL', ...Array.from(new Set(projects.map(p => p.district).filter(Boolean)))];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 40 }}>
      {isDemo && (
        <DemoBanner message={t('common.demoWarning', 'Displaying sample Maharashtra infrastructure projects dataset.')} />
      )}

      {/* Header */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
        alignItems: 'center', gap: 16, marginBottom: 28
      }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>
            {t('nav.projects', 'Infrastructure & Public Works Projects')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            State infrastructure projects linked to NirmaanSetu for verified workforce allocation.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div style={{
        background: 'var(--bg-glass)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: 14, marginBottom: 24,
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 240 }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            className="input"
            style={{ border: 'none', background: 'transparent' }}
            placeholder={t('common.search', 'Filter by project name, contractor, or district...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {districts.length > 2 && (
          <select
            className="input"
            style={{ width: 'auto', minWidth: 140 }}
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
          >
            {districts.map(d => (
              <option key={d} value={d}>
                {d === 'ALL' ? t('common.all', 'All Districts') : d}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Content states */}
      {loading ? (
        <LoadingState message={t('common.loading', 'Loading infrastructure projects...')} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t('common.noData', 'No projects found')}
          message={t('common.tryAdjustingFilters', 'Try adjusting your search query or district filter')}
        />
      ) : (
        /* Projects Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {filtered.map((proj) => {
            const pct = proj.completion || Math.round(((proj.workersFilled || 0) / (proj.workersNeeded || 1)) * 100);
            return (
              <div
                key={proj.id}
                onClick={() => navigate(`/projects/${proj.id}`)}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: 24, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span className="badge badge-secondary">{proj.district || 'Maharashtra'}</span>
                    <StatusBadge status={proj.status || 'IN_PROGRESS'} />
                  </div>

                  <h3 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>
                    {proj.title}
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
                    Agency: {proj.agency}
                  </p>
                </div>

                <div>
                  {/* Workforce Progress */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Workforce Fulfillment</span>
                      <span style={{ fontWeight: 700 }}>
                        {proj.workersFilled} / {proj.workersNeeded} ({pct}%)
                      </span>
                    </div>
                    <div className="progress">
                      <div className="progress-fill" style={{ width: `${Math.min(100, pct)}%` }} />
                    </div>
                  </div>

                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: 12
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>Budget: {proj.budget || 'Sanctioned'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontWeight: 600 }}>
                      <span>View Details</span>
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
