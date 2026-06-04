import React from 'react';
import { Circle, AlertCircle, AlertTriangle, XCircle, CheckCircle, Info } from 'lucide-react';

type StatusLevel = 'normal' | 'vorsorge' | 'pflicht' | 'kritisch';

interface StatusBadgeProps {
  level: StatusLevel;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const statusConfig = {
  normal: {
    bg: 'bg-[#E8F5E9]',
    text: 'text-[#2E7D32]',
    border: 'border-[#2E7D32]/30',
    icon: Circle,
  },
  vorsorge: {
    bg: 'bg-[#FFF3E0]',
    text: 'text-[#E65100]',
    border: 'border-[#E65100]/30',
    icon: AlertCircle,
  },
  pflicht: {
    bg: 'bg-[#FFE0B2]',
    text: 'text-[#E65100]',
    border: 'border-[#E65100]/40',
    icon: AlertTriangle,
  },
  kritisch: {
    bg: 'bg-[#FFCDD2]',
    text: 'text-[#C62828]',
    border: 'border-[#C62828]/40',
    icon: XCircle,
  },
};

export default function StatusBadge({ level, label, size = 'md', showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[level];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-4 h-4',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{label}</span>
    </div>
  );
}

// ── StatusIconCircle ──────────────────────────────────────────────────────────
// Reusable icon-in-circle for ok / warnung / kritisch status states.

type StatusIconType = 'ok' | 'maessig' | 'warnung' | 'kritisch';

const STATUS_ICON_CFG: Record<StatusIconType, { bg: string; Icon: React.ElementType }> = {
  ok:       { bg: 'var(--status-icon-ok)',       Icon: CheckCircle   },
  maessig:  { bg: 'var(--status-caution)',       Icon: Info          },
  warnung:  { bg: 'var(--status-icon-warning)',  Icon: AlertTriangle },
  kritisch: { bg: 'var(--status-icon-critical)', Icon: AlertTriangle },
};

export function StatusIconCircle({
  status,
  className = 'w-8 h-8',
  iconClassName = 'w-4 h-4',
}: {
  status: StatusIconType;
  /** Tailwind classes for the circle container size, e.g. "w-10 h-10" */
  className?: string;
  /** Tailwind classes for the icon size, e.g. "w-5 h-5" */
  iconClassName?: string;
}) {
  const { bg, Icon } = STATUS_ICON_CFG[status];
  return (
    <div
      className={`${className} rounded-full flex items-center justify-center flex-shrink-0`}
      style={{ backgroundColor: bg }}
    >
      <Icon className={`${iconClassName} text-black`} strokeWidth={2} />
    </div>
  );
}
