import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsApi, matchingApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, CheckCircle2, Compass
} from 'lucide-react';
import { LoadingState, StatusBadge, DemoBanner } from '../../components/ui';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [selectedReq, setSelectedReq] = useState<string>('req-1');
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    projectsApi.get(id || '')
      .then((res) => {
        if (!isMounted) return;
        if (res.data?.data) {
          setProject(res.data.data);
          setIsDemo(false);
        } else {
          loadFallbackProject();
        }
      })
      .catch(() => {
        if (!isMounted) return;
        loadFallbackProject();
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    function loadFallbackProject() {
      setIsDemo(true);
      setProject({
        id: id || 'proj-01',
        title: 'Pune Metro Line 3 Extension (Hinjawadi - Shivajinagar)',
        agency: 'Pune Metro Rail Corporation / Tata Projects',
        district: 'Pune',
        status: 'IN_PROGRESS',
        workersNeeded: 350,
        workersFilled: 290,
        budget: '₹8,313 Cr',
        description: 'Key rapid transit project connecting the IT corridor of Hinjawadi with the civil core of Pune. Active concrete, rebar, electrical and tunneling workforce deployed.',
        requirements: [
          { id: 'req-1', skill: 'Reinforced Concrete Casting', level: 'SKILLED', needed: 45, filled: 38, wage: '₹750 / day' },
          { id: 'req-2', skill: 'Steel Fixing & Rebar Bending', level: 'EXPERT', needed: 30, filled: 22, wage: '₹820 / day' },
          { id: 'req-3', skill: 'Site Rigging & Crane Assistance', level: 'SEMI_SKILLED', needed: 20, filled: 16, wage: '₹680 / day' },
        ]
      });
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!selectedReq) return;

    let isMounted = true;
    matchingApi.findMatches(selectedReq)
      .then((res) => {
        if (!isMounted) return;
        if (res.data?.data?.candidates && res.data.data.candidates.length > 0) {
          setCandidates(res.data.data.candidates);
        } else {
          loadDemoCandidates();
        }
      })
      .catch(() => {
        if (!isMounted) return;
        loadDemoCandidates();
      });

    function loadDemoCandidates() {
      setCandidates([
        {
          workerId: 'w-1',
          workerName: 'Ramesh Shinde',
          workerCode: 'MH-WRK-2025-001',
          primarySkill: 'Masonry & Concrete Works',
          district: 'Pune',
          overallScore: 94.5,
          skillScore: 95.0,
          experienceScore: 100.0,
          verificationScore: 100.0,
          availabilityScore: 100.0,
          ratingScore: 96.0,
          wageScore: 100.0,
          matchReasons: [
            '✓ Primary skill matches requirement perfectly',
            '✓ 4.5 years site experience exceeds threshold',
            '✓ Aadhaar biometric verified by MSSDS',
            '✓ Immediately available in Pune district',
            '✓ Wage expectation (₹650) within offered budget (₹750)'
          ]
        },
        {
          workerId: 'w-2',
          workerName: 'Santosh Jadhav',
          workerCode: 'MH-WRK-2025-084',
          primarySkill: 'Reinforced Concrete Casting',
          district: 'Pune',
          overallScore: 88.0,
          skillScore: 90.0,
          experienceScore: 85.0,
          verificationScore: 100.0,
          availabilityScore: 100.0,
          ratingScore: 90.0,
          wageScore: 95.0,
          matchReasons: [
            '✓ Exact skill certification held',
            '✓ 3 years experience at Metro depot site',
            '✓ Verified by BOCW Board'
          ]
        },
        {
          workerId: 'w-3',
          workerName: 'Anil Thorat',
          workerCode: 'MH-WRK-2025-112',
          primarySkill: 'Concrete Finishing & Curing',
          district: 'Nashik',
          overallScore: 78.5,
          skillScore: 80.0,
          experienceScore: 75.0,
          verificationScore: 100.0,
          availabilityScore: 80.0,
          ratingScore: 85.0,
          wageScore: 90.0,
          matchReasons: [
            '✓ Strong related skill competencies',
            '~ Neighboring district (Nashik) willing to relocate'
          ]
        }
      ]);
    }

    return () => {
      isMounted = false;
    };
  }, [selectedReq]);

  const handleShortlist = (workerName: string) => {
    toast.success(t('projects.shortlistSuccess', `Shortlisted ${workerName} for on-site onboarding.`));
  };

  if (loading) {
    return <LoadingState message={t('projects.loadingDetails', 'Loading project details...')} />;
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 40 }}>
      {isDemo && (
        <DemoBanner message={t('common.demoWarning', 'Displaying sample infrastructure project specification and matching dataset.')} />
      )}

      {/* Back button */}
      <button onClick={() => navigate('/projects')} className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
        <ArrowLeft size={16} />
        <span>{t('projects.backToProjects', 'Back to Projects')}</span>
      </button>

      {/* Project Header Banner */}
      <div style={{
        background: 'var(--bg-glass)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 28, marginBottom: 28
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className="badge badge-secondary">{project?.district || 'Maharashtra'}</span>
              <StatusBadge status={project?.status || 'IN_PROGRESS'} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
              {project?.title || t('projects.projectDetails', 'Project Details')}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              Executing Agency: <strong>{project?.agency}</strong> · Budget: {project?.budget}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--secondary)' }}>
              {project?.workersFilled} / {project?.workersNeeded}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('projects.workforceDeployed', 'Workforce Deployed')}</div>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 16, lineHeight: 1.6 }}>
          {project?.description}
        </p>
      </div>

      {/* Requirements Section */}
      <div style={{
        background: 'var(--bg-glass)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: 24, marginBottom: 28
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
          {t('projects.activeRequirements', 'Active Workforce Requirements')}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
          {t('projects.selectRequirement', 'Select a role to trigger rule-based compatibility matching against registered workers.')}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {(project?.requirements || []).map((req: any) => (
            <div
              key={req.id}
              onClick={() => setSelectedReq(req.id)}
              style={{
                background: selectedReq === req.id ? 'rgba(255, 107, 53, 0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${selectedReq === req.id ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)', padding: 16, cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span className="badge badge-secondary">{req.level}</span>
                <span style={{ fontWeight: 700, color: 'var(--secondary)', fontSize: 13 }}>{req.wage}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{req.skill}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                <span>Positions Filled:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{req.filled} / {req.needed}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compatibility Matching Results */}
      <div style={{
        background: 'var(--bg-glass)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: 24
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Compass size={20} color="var(--primary)" />
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>
                {t('projects.compatibilityMatches', 'Rule-Based Compatibility Match Results')}
              </h3>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Skills (35%) · Experience (15%) · Verification (15%) · Availability (15%) · Rating (10%) · Wage (10%)
            </p>
          </div>
          <span className="badge badge-success">{candidates.length} Candidates Ranked</span>
        </div>

        {/* Candidate list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {candidates.map((c, i) => (
            <div
              key={c.workerId || i}
              style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: 20
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'var(--gradient-primary)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff'
                  }}>
                    {c.workerName ? c.workerName[0] : 'W'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>{c.workerName}</span>
                      <span className="badge badge-secondary">{c.workerCode}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {c.primarySkill} · {c.district}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: c.overallScore >= 90 ? 'var(--secondary)' : 'var(--primary)' }}>
                    {c.overallScore}%
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overall Score</div>
                </div>
              </div>

              {/* Sub-score Breakdown */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: 10, background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: 8, marginBottom: 14
              }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Skill (35%)</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{c.skillScore}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Exp (15%)</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{c.experienceScore}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Verification (15%)</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{c.verificationScore}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Availability (15%)</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{c.availabilityScore}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Wage Align (10%)</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{c.wageScore}%</div>
                </div>
              </div>

              {/* Match explanation reasons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
                {c.matchReasons?.map((reason: string, rIdx: number) => (
                  <div key={rIdx} style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {reason}
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  onClick={() => handleShortlist(c.workerName)}
                  className="btn btn-primary btn-sm"
                >
                  <CheckCircle2 size={15} />
                  <span>{t('projects.shortlistForDeployment', 'Shortlist for Deployment')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
