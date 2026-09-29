import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { workersApi } from '../../api';
import { useTranslation } from 'react-i18next';
import {
  Award, ShieldCheck, CheckCircle2, Star,
  MapPin, Briefcase, FileText, QrCode
} from 'lucide-react';
import { LoadingState, StatusBadge, DemoBanner } from '../../components/ui';

export default function WorkerPassport() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    let isMounted = true;
    workersApi.myProfile()
      .then((res) => {
        if (!isMounted) return;
        if (res.data?.data) {
          setProfile(res.data.data);
          setIsDemo(false);
        } else {
          setIsDemo(true);
        }
      })
      .catch(() => {
        if (isMounted) setIsDemo(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <LoadingState message={t('worker.passport.loading', 'Loading your passport...')} />;
  }

  // Demonstration credential data if worker profile is not yet saved to backend
  const data = profile || {
    fullName: user?.fullName || 'Ramesh Shinde',
    workerCode: 'MH-WRK-2025-001',
    primarySkill: 'Masonry & Concrete Works',
    district: 'Pune',
    state: 'Maharashtra',
    experienceYears: 4.5,
    aadhaarVerified: true,
    verificationStatus: 'VERIFIED',
    availabilityStatus: 'AVAILABLE',
    expectedDailyWage: 650,
    rating: 4.8,
    projectsCompleted: 8,
    profileCompletion: 90,
    skills: [
      { name: 'Reinforced Concrete Casting', level: 'SKILLED', verified: true, months: 36 },
      { name: 'Bricklaying & Plastering', level: 'EXPERT', verified: true, months: 54 },
      { name: 'Site Safety & Scaffolding', level: 'SEMI_SKILLED', verified: true, months: 18 },
    ]
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 40 }}>
      {isDemo && (
        <DemoBanner message={t('common.demoWarning', 'Displaying sample Sovereign Skill Passport credentials.')} />
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
            {t('worker.passport.title', 'Sovereign Skill Passport')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {t('worker.passport.subtitle', 'Government-verified digital credentials recognized across Maharashtra infrastructure projects.')}
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
          <QrCode size={16} />
          <span>{t('worker.passport.printExport', 'Print / Export Passport')}</span>
        </button>
      </div>

      {/* Main Passport Card */}
      <div style={{
        background: 'linear-gradient(135deg, #13132B 0%, #1A1A3F 100%)',
        border: '1px solid rgba(255, 107, 53, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: 32,
        boxShadow: 'var(--shadow-primary)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 28
      }}>
        {/* State emblem watermark / tag */}
        <div style={{
          position: 'absolute', top: 20, right: 24,
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(0, 212, 170, 0.1)', border: '1px solid rgba(0, 212, 170, 0.3)',
          padding: '6px 14px', borderRadius: 20, color: 'var(--secondary)',
          fontSize: 12, fontWeight: 700
        }}>
          <ShieldCheck size={16} />
          <span>{t('worker.passport.govtVerified', 'GOVT VERIFIED CREDENTIAL')}</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'center' }}>
          {/* Avatar */}
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: 'var(--gradient-primary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 40, fontWeight: 800, color: '#fff',
            boxShadow: '0 4px 20px rgba(255,107,53,0.4)',
            border: '3px solid rgba(255,255,255,0.2)'
          }}>
            {data.fullName ? data.fullName[0] : 'W'}
          </div>

          {/* Core Info */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.05em' }}>
              {data.workerCode}
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginTop: 4, marginBottom: 8 }}>
              {data.fullName}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Briefcase size={14} color="var(--primary)" />
                {data.primarySkill}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={14} color="var(--secondary)" />
                {data.district}, {data.state}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                {data.rating || '4.8'} / 5.0 {t('worker.passport.rating', 'Rating')}
              </span>
            </div>
          </div>

          {/* QR badge */}
          <div style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '16px', textAlign: 'center', minWidth: 120
          }}>
            <QrCode size={56} color="var(--text-primary)" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t('worker.passport.scanToVerify', 'Scan to Verify')}</div>
            <div style={{ fontSize: 9, color: 'var(--secondary)', fontWeight: 600 }}>{t('worker.passport.active', 'Active · Aadhaar')}</div>
          </div>
        </div>

        {/* Passport Stats Footer */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 16, marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)'
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('worker.passport.dailyWageTarget', 'Daily Wage Target')}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--secondary)' }}>₹{data.expectedDailyWage || 650} / day</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('worker.passport.experience', 'Experience')}</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{data.experienceYears || 4.5} {t('worker.passport.years', 'Years')}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('worker.passport.completedSites', 'Completed Sites')}</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{data.projectsCompleted || 8} {t('worker.passport.projects', 'Projects')}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('common.status', 'Status')}</div>
            <div style={{ marginTop: 4 }}>
              <StatusBadge status={data.availabilityStatus || 'AVAILABLE'} />
            </div>
          </div>
        </div>
      </div>

      {/* Skills & Certifications Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        <div style={{
          background: 'var(--bg-glass)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: 24
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>{t('worker.passport.verifiedSkills', 'Verified Skill Competencies')}</h3>
            <span style={{ fontSize: 12, color: 'var(--secondary)', fontWeight: 600 }}>{t('worker.passport.nsqfAligned', 'NSQF Aligned')}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(data.skills || []).map((s: any, idx: number) => (
              <div key={idx} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '12px 16px', display: 'flex',
                alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    Level: {t('skillLevel.' + s.level, s.level)} · {s.months || 24} mos on-site
                  </div>
                </div>
                {s.verified && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    color: 'var(--secondary)', fontSize: 12, fontWeight: 600
                  }}>
                    <CheckCircle2 size={16} />
                    <span>{t('worker.passport.verified', 'Verified')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Verification & Compliance */}
        <div style={{
          background: 'var(--bg-glass)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: 24
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
            {t('worker.passport.identityChecks', 'Identity and Security Checks')}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(0, 212, 170, 0.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)'
              }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{t('worker.passport.aadhaarLinkage', 'Aadhaar Linkage')}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t('worker.passport.aadhaarDesc', 'Biometric verification confirmed with UIDAI')}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255, 107, 53, 0.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
              }}>
                <Award size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{t('worker.passport.mssdsAssessment', 'MSSDS Government Assessment')}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t('worker.passport.mssdsDesc', 'Skill test completed at Govt Polytechnic ITI')}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(59, 130, 246, 0.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#3B82F6'
              }}>
                <FileText size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{t('worker.passport.bocwRegistration', 'BOCW Welfare Registration')}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t('worker.passport.bocwDesc', 'Building and Other Construction Workers Board active')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
