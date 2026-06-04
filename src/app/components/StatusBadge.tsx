import { Circle, AlertCircle, AlertTriangle, XCircle } from 'lucide-react';

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
