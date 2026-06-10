import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

type WarningLevel = 'wetter' | 'markant' | 'unwetter' | 'extreme' | 'multiple';
type View = 'heute' | 'planung' | 'warnung' | 'einstellungen' | 'styleguide';

interface DWDWarningBannerProps {
  level: WarningLevel;
  onNavigate: (view: View) => void;
  onDismiss: () => void;
}

const warningConfig = {
  wetter: {
    bg: 'var(--status-warning)',
    border: 'var(--status-warning)',
    title: 'DWD-Wetterwarnung für Ihren Standort',
    description: 'Es liegt eine amtliche Warnung des DWD der Stufe Wetterwarnung vor.',
    textColor: 'var(--foreground)',
    iconColor: 'var(--foreground)',
  },
  markant: {
    bg: 'var(--status-strong)',
    border: 'var(--status-critical)',
    title: 'DWD-Wetterwarnung für Ihren Standort',
    description: 'Es liegt eine amtliche Warnung des DWD der Stufe markante vor.',
    textColor: 'var(--foreground)',
    iconColor: 'var(--foreground)',
  },
  unwetter: {
    bg: 'var(--status-critical-tint)',
    border: 'var(--status-critical)',
    title: 'DWD-Wetterwarnung für Ihren Standort',
    description: 'Es liegt eine amtliche Warnung des DWD der Stufe Unwetterwarnung vor.',
    textColor: 'var(--foreground)',
    iconColor: 'var(--foreground)',
  },
  extreme: {
    bg: 'var(--status-dwd-extreme)',
    border: 'var(--status-critical)',
    title: 'DWD-Wetterwarnung für Ihren Standort',
    description: 'Es liegt eine amtliche Warnung des DWD der Stufe Extreme Unwetterwarnung vor.',
    textColor: 'var(--foreground)',
    iconColor: 'var(--foreground)',
  },
  multiple: {
    bg: '#111118',
    border: '#111118',
    title: 'DWD-Wetterwarnung für Ihren Standort',
    description: 'Es liegen mehrere aktive amtliche Warnungen des DWD vor.',
    textColor: 'var(--text-inverse)',
    iconColor: 'var(--text-inverse)',
  },
};

export default function DWDWarningBanner({ level, onNavigate, onDismiss }: DWDWarningBannerProps) {
  const config = warningConfig[level];

  const dismissBtn = (className: string) => (
    <button
      onClick={onDismiss}
      className={`rounded-lg flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity ${className}`}
      style={{
        backgroundColor: level === 'multiple' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
      }}
      aria-label="Warnung schließen"
    >
      <X
        className="w-4 h-4"
        style={{ color: level === 'multiple' ? 'var(--text-inverse)' : 'var(--foreground)' }}
        strokeWidth={1.5}
      />
    </button>
  );

  return (
    <div
      className="px-3 py-2.5 sm:px-4 sm:py-4"
      style={{ backgroundColor: config.bg, borderBottom: `1px solid ${config.border}` }}
    >
      {/* Mobile layout: single row, compact */}
      <div className="flex gap-2.5 items-start sm:hidden">
        <AlertTriangle
          className="w-4 h-4 flex-shrink-0 mt-0.5"
          style={{ color: config.iconColor }}
          strokeWidth={2}
        />
        <div className="flex-1 flex flex-col gap-0.5 min-w-0">
          <p
            className="leading-[1.3] truncate"
            style={{ fontSize: 'var(--type-size-body-sm)', fontWeight: 700, color: config.textColor, fontFamily: 'var(--font-family)' }}
          >
            {config.title}
          </p>
          <p
            className="leading-[1.3] opacity-90"
            style={{
              fontSize: 'var(--type-size-body-sm)',
              color: config.textColor,
              fontFamily: 'var(--font-family)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {config.description}
          </p>
          <button
            onClick={() => onNavigate('warnung')}
            className="self-start mt-0.5 hover:opacity-70 transition-opacity"
            style={{
              color: config.textColor,
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--type-size-body-sm)',
              fontWeight: 600,
              lineHeight: 1.4,
              textDecoration: 'underline',
              textUnderlineOffset: 2,
              background: 'none',
              border: 'none',
              padding: 0,
            }}
          >
            Details anzeigen
          </button>
        </div>
        {dismissBtn('w-7 h-7')}
      </div>

      {/* Desktop layout: side by side */}
      <div className="hidden sm:flex gap-4 items-start justify-between">
        <div className="flex gap-3 items-start flex-1">
          <AlertTriangle
            className="w-5 h-5 flex-shrink-0"
            style={{ color: config.iconColor }}
            strokeWidth={2}
          />
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <p
              className="leading-[1.3]"
              style={{ fontSize: 'var(--type-size-h4)', fontWeight: 700, color: config.textColor, fontFamily: 'var(--font-family)' }}
            >
              {config.title}
            </p>
            <p
              className="leading-[1.3] opacity-90"
              style={{ fontSize: 'var(--type-size-body-sm)', color: config.textColor, fontFamily: 'var(--font-family)' }}
            >
              {config.description}
            </p>
          </div>
        </div>
        <div className="flex gap-3 items-center flex-shrink-0">
          <button
            onClick={() => onNavigate('warnung')}
            className="px-4 py-2.5 rounded-lg whitespace-nowrap hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: level === 'multiple' ? 'white' : 'black',
              color: level === 'multiple' ? '#111118' : 'white',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--type-size-body-sm)',
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            Details anzeigen
          </button>
          {dismissBtn('w-10 h-10')}
        </div>
      </div>
    </div>
  );
}
