import { useEffect } from 'react';
import { NirmaanSetuLogo } from './ui';

interface Props {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: Props) {
  useEffect(() => {
    // Exactly one startup splash. It is mounted once by StartupGate and
    // removed only after its display duration and auth bootstrap are ready.
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash" id="splash-screen" aria-label="NirmaanSetu loading">
      <div style={{ marginBottom: 20 }}>
        <NirmaanSetuLogo variant="icon" size={68} />
      </div>
      <div>
        <div className="splash-title">NirmaanSetu</div>
        <div className="splash-subtitle">Workforce Intelligence Platform</div>
      </div>
      <div className="splash-bar">
        <div className="splash-progress" />
      </div>
      <div style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: 12, letterSpacing: '0.05em' }}>
        Government of Maharashtra
      </div>
    </div>
  );
}
