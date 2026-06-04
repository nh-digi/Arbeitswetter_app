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
    bg: '#f8d74a',
    border: '#f8d74a',
    title: 'DWD-Wetterwarnung für Ihren Standort',
    description: 'Es liegt eine amtliche Warnung des DWD der Stufe Wetterwarnung vor.',
    textColor: '#111827',
    iconColor: '#111827',
  },
  markant: {
    bg: '#febb6a',
    border: '#e8193c',
    title: 'DWD-Wetterwarnung für Ihren Standort',
    description: 'Es liegt eine amtliche Warnung des DWD der Stufe markante vor.',
    textColor: '#111827',
    iconColor: '#111827',
  },
  unwetter: {
    bg: '#ff878a',
    border: '#e8193c',
    title: 'DWD-Wetterwarnung für Ihren Standort',
    description: 'Es liegt eine amtliche Warnung des DWD der Stufe Unwetterwarnung vor.',
    textColor: '#111827',
    iconColor: '#111827',
  },
  extreme: {
    bg: '#fb88ff',
    border: '#e8193c',
    title: 'DWD-Wetterwarnung für Ihren Standort',
    description: 'Es liegt eine amtliche Warnung des DWD der Stufe Extreme Unwetterwarnung vor.',
    textColor: '#111827',
    iconColor: '#111827',
  },
  multiple: {
    bg: '#111118',
    border: '#111118',
    title: 'DWD-Wetterwarnung für Ihren Standort',
    description: 'Es liegen mehrere aktive amtliche Warnungen des DWD vor.',
    textColor: 'white',
    iconColor: 'white',
  },
};

export default function DWDWarningBanner({ level, onNavigate, onDismiss }: DWDWarningBannerProps) {
  const config = warningConfig[level];

  return (
    <div
      className="p-4 flex flex-wrap gap-y-8 items-start justify-between"
      style={{ backgroundColor: config.bg, borderBottom: `1px solid ${config.border}` }}
    >
      {/* Left: Warning content */}
      <div className="flex gap-3 items-start flex-1 min-w-[200px]">
        <AlertTriangle
          className="w-5 h-5 flex-shrink-0"
          style={{ color: config.iconColor }}
          strokeWidth={2}
        />
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <p
            className="leading-[1.3]"
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: config.textColor,
              fontFamily: 'var(--font-family)',
            }}
          >
            {config.title}
          </p>
          <p
            className="leading-[1.3] opacity-90"
            style={{
              fontSize: 14,
              color: config.textColor,
              fontFamily: 'var(--font-family)',
            }}
          >
            {config.description}
          </p>
        </div>
      </div>

      {/* Right: Button group */}
      <div className="flex gap-4 items-start flex-1 min-w-[200px] justify-end">
        <button
          onClick={() => onNavigate('warnung')}
          className="px-3.5 py-2.5 rounded-lg w-[140px] hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: level === 'multiple' ? 'white' : 'black',
            color: level === 'multiple' ? '#111118' : 'white',
            fontFamily: 'var(--font-family)',
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.6,
          }}
        >
          Details anzeigen
        </button>
        <button
          onClick={onDismiss}
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
          style={{
            backgroundColor: level === 'multiple' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          }}
          aria-label="Warnung schließen"
        >
          <X
            className="w-5 h-5"
            style={{ color: level === 'multiple' ? 'white' : '#222' }}
            strokeWidth={1.5}
          />
        </button>
      </div>
    </div>
  );
}
