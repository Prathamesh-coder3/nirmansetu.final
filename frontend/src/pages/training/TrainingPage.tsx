import { useState, useEffect } from 'react';
import { trainingApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { LoadingState, ErrorState, EmptyState, DemoBanner } from '../../components/ui';
import {
  Award, CheckCircle2, MapPin, ArrowRight, Clock, GraduationCap
} from 'lucide-react';

const DEMO_PROGRAMS = [
  {
    id: 'tr-01',
    title: 'Advanced Reinforced Concrete & Formwork Technology',
    provider: 'L&T Construction Skills Training Institute (CSTI)',
    location: 'Panvel, Navi Mumbai',
    duration: '8 Weeks · Full Time',
    nsqfLevel: 'NSQF Level 4',
    stipend: '₹4,500 / month + Food & Lodging',
    capacity: 35,
    enrolled: 28,
    placementRate: '94%',
    description: 'Hands-on practical training on modern pre-fab formwork, rebar cutting/bending automation, and mass concrete pouring inspection.'
  },
  {
    id: 'tr-02',
    title: 'Industrial Electrical & Substation Installation',
    provider: 'Govt. Industrial Training Institute (ITI)',
    location: 'Aundh, Pune',
    duration: '12 Weeks',
    nsqfLevel: 'NSQF Level 5',
    stipend: 'Govt MSSDS Stipend Eligible',
    capacity: 40,
    enrolled: 34,
    placementRate: '88%',
    description: 'High-voltage line safety, circuit breaker installation, transformer earthing, and industrial cabling certification.'
  },
  {
    id: 'tr-03',
    title: 'Scaffolding & Fall Prevention Specialist',
    provider: 'Tata STRIVE Skill Development Center',
    location: 'Ambad, Nashik',
    duration: '4 Weeks',
    nsqfLevel: 'NSQF Level 3',
    stipend: '₹3,000 / month',
    capacity: 30,
    enrolled: 22,
    placementRate: '91%',
    description: 'OSHA & IS-compliant cup-lock and tubular scaffolding assembly, load calculation, and working at heights certification.'
  },
  {
    id: 'tr-04',
    title: 'Heavy Earthmoving Machinery Operator (Excavator/JCB)',
    provider: 'MSSDS Regional Training Hub',
    location: 'Butibori, Nagpur',
    duration: '6 Weeks',
    nsqfLevel: 'NSQF Level 4',
    stipend: '₹5,000 / month',
    capacity: 25,
    enrolled: 25,
    placementRate: '96%',
    description: 'Hydraulic systems operation, trenching techniques, simulator practice, and road construction grade compliance.'
  }
];

export default function TrainingPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // Enrollment state: tracks which programs are enrolled (from server + optimistic)
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [enrolling, setEnrolling] = useState<string | null>(null);

  const loadPrograms = () => {
    setLoading(true);
    setLoadError(null);
    trainingApi.programs()
      .then((res) => {
        const data = res.data?.data || [];
        if (data.length > 0) {
          setPrograms(data);
          setIsDemo(false);
        } else {
          setPrograms(DEMO_PROGRAMS);
          setIsDemo(true);
        }
      })
      .catch(() => {
        setPrograms(DEMO_PROGRAMS);
        setIsDemo(true);
      })
      .finally(() => setLoading(false));

    // Also load existing enrollments to show correct state
    trainingApi.myEnrollments()
      .then((res) => {
        const data = res.data?.data || [];
        const ids = new Set<string>(data.map((e: any) => e.programId || e.id));
        setEnrolledIds(ids);
      })
      .catch(() => {
        // Not a critical failure - enrollment state starts empty
      });
  };

  useEffect(() => { loadPrograms(); }, []);

  const handleEnroll = async (programId: string, capacity: number, enrolled: number) => {
    // Prevent enrollment if program is full
    if (capacity > 0 && enrolled >= capacity) {
      showToast(t('training.enrollFull'), 'warning');
      return;
    }

    setEnrolling(programId);
    try {
      await trainingApi.enroll(programId);
      setEnrolledIds((prev) => new Set([...prev, programId]));
      showToast(t('training.enrollSuccess'), 'success');
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error || '';

      if (status === 409 || msg.toLowerCase().includes('already enrolled')) {
        setEnrolledIds((prev) => new Set([...prev, programId]));
        showToast(t('training.enrollSuccess'), 'info');
      } else if (status === 400 && msg.toLowerCase().includes('full')) {
        showToast(t('training.enrollFull'), 'warning');
      } else {
        showToast(t('training.enrollError'), 'error');
      }
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
        alignItems: 'center', gap: 16, marginBottom: 28
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>{t('training.title')}</h1>
            {isDemo && <DemoBanner />}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {t('training.subtitle')}
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingState text={t('training.loading')} />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={loadPrograms} />
      ) : programs.length === 0 ? (
        <EmptyState
          title={t('training.empty')}
          description={t('training.emptyDesc')}
          icon={<GraduationCap size={40} />}
        />
      ) : (
        /* Program Cards Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {programs.map((prog) => {
            const isEnrolled = enrolledIds.has(prog.id);
            const isFull = prog.capacity > 0 && (prog.enrolled ?? 0) >= prog.capacity;
            return (
              <div
                key={prog.id}
                style={{
                  background: 'var(--bg-glass)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: 24, display: 'flex',
                  flexDirection: 'column', justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span className="badge badge-primary">{prog.nsqfLevel || prog.level || 'NSQF'}</span>
                    {prog.placementRate && (
                      <span style={{ fontSize: 12, color: 'var(--secondary)', fontWeight: 700 }}>
                        {prog.placementRate} {t('training.placementRecord')}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>
                    {prog.title || prog.name}
                  </h3>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Award size={15} color="var(--primary)" />
                    <span>{prog.provider || prog.organizationName}</span>
                  </div>

                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 18 }}>
                    {prog.description}
                  </p>

                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12,
                    color: 'var(--text-secondary)', padding: '12px 14px',
                    background: 'rgba(255,255,255,0.02)', borderRadius: 8, marginBottom: 18
                  }}>
                    {(prog.location || prog.district) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={13} color="var(--secondary)" />
                        {prog.location || prog.district}
                      </div>
                    )}
                    {(prog.duration || prog.durationWeeks) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} color="var(--primary)" />
                        {prog.duration || `${prog.durationWeeks} Weeks`}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {(prog.capacity > 0) && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {t('training.seats')}: {prog.enrolled ?? 0} / {prog.capacity} {t('training.filled')}
                      </div>
                      {prog.stipend && (
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--secondary)' }}>
                          {prog.stipend}
                        </div>
                      )}
                    </div>
                  )}

                  {isEnrolled ? (
                    <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} disabled>
                      <CheckCircle2 size={16} />
                      <span>{t('training.enrolled')}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnroll(prog.id, prog.capacity ?? 0, prog.enrolled ?? 0)}
                      disabled={enrolling === prog.id || isFull}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', opacity: isFull ? 0.6 : 1 }}
                      id={`enroll-btn-${prog.id}`}
                    >
                      {enrolling === prog.id ? (
                        <>
                          <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                          <span>{t('training.enrolling')}</span>
                        </>
                      ) : isFull ? (
                        <span>{t('training.enrollFull')}</span>
                      ) : (
                        <>
                          <span>{t('training.enrollNow')}</span>
                          <ArrowRight size={14} />
                        </>
                      )}
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
