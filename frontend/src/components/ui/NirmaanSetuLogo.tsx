import React from 'react';

export interface NirmaanSetuLogoProps {
  /**
   * Display variant:
   * - 'full': Icon + "NirmaanSetu" brand title + optional subtitle
   * - 'icon': Just the orange rounded square with white 'N'
   * - 'collapsed': Compact version for collapsed sidebar
   * - 'mobile': Optimized for compact mobile headers
   */
  variant?: 'full' | 'icon' | 'collapsed' | 'mobile';
  /**
   * Predefined size preset or custom number in px (refers to icon box dimension)
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  /**
   * Whether to display the text label next to the icon (defaults to true for 'full', false for 'icon')
   */
  showText?: boolean;
  /**
   * Whether to show the subtitle (e.g. "Workforce Intelligence")
   */
  showSubtitle?: boolean;
  /**
   * Custom subtitle text
   */
  subtitle?: string;
  /**
   * Extra CSS class names
   */
  className?: string;
  /**
   * Click handler
   */
  onClick?: () => void;
}

export const NirmaanSetuLogo: React.FC<NirmaanSetuLogoProps> = ({
  variant = 'full',
  size = 'md',
  showText = variant === 'full' || variant === 'mobile',
  showSubtitle = variant === 'full',
  subtitle = 'Workforce Intelligence',
  className = '',
  onClick,
}) => {
  // Resolve dimension in pixels
  let iconPx: number;
  if (typeof size === 'number') {
    iconPx = size;
  } else {
    switch (size) {
      case 'sm':
        iconPx = 28;
        break;
      case 'lg':
        iconPx = 44;
        break;
      case 'xl':
        iconPx = 56;
        break;
      case 'md':
      default:
        iconPx = 36;
        break;
    }
  }

  // Adjust for mobile variant default size if not explicitly set
  if (variant === 'mobile' && size === 'md') {
    iconPx = 30;
  } else if (variant === 'collapsed') {
    showText = false;
    showSubtitle = false;
  }

  const borderRadius = Math.round(iconPx * 0.28);

  const iconElement = (
    <div
      style={{
        width: `${iconPx}px`,
        height: `${iconPx}px`,
        minWidth: `${iconPx}px`,
        minHeight: `${iconPx}px`,
        borderRadius: `${borderRadius}px`,
        background: 'linear-gradient(135deg, #FF7A3D 0%, #FF5722 55%, #E64A19 100%)',
        boxShadow: '0 3px 10px rgba(255, 87, 34, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 64 64"
        width="70%"
        height="70%"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {/* Crisp uppercase white N path */}
        <path
          d="M18 46V18h7l14 20.5V18h7v28h-7L25 25.5V46H18z"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );

  if (variant === 'icon' || !showText) {
    return (
      <div
        className={`nirmaansetu-logo nirmaansetu-logo-icon ${className}`}
        onClick={onClick}
        style={{ display: 'inline-flex', alignItems: 'center', cursor: onClick ? 'pointer' : 'inherit' }}
        title="NirmaanSetu"
      >
        {iconElement}
      </div>
    );
  }

  return (
    <div
      className={`nirmaansetu-logo nirmaansetu-logo-${variant} ${className}`}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: iconPx > 36 ? '12px' : '9px',
        textDecoration: 'none',
        cursor: onClick ? 'pointer' : 'inherit',
        userSelect: 'none',
      }}
    >
      {iconElement}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <span
          style={{
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            fontWeight: 800,
            fontSize: variant === 'mobile' ? '15px' : iconPx > 36 ? '18px' : '16px',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary, #F8FAFC)',
            whiteSpace: 'nowrap',
          }}
        >
          Nirmaan<span style={{ color: '#FF7A3D' }}>Setu</span>
        </span>
        {showSubtitle && variant !== 'mobile' && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 500,
              color: 'var(--text-muted, #94A3B8)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              marginTop: '1px',
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default NirmaanSetuLogo;
