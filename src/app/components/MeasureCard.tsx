import { Wrench, Users, User } from 'lucide-react';

interface MeasureCardProps {
  category: 'Technisch' | 'Organisatorisch' | 'Personenbezogen';
  title: string;
  priority: 'high' | 'medium' | 'low';
}

const categoryColors = {
  Technisch: {
    bg: 'bg-[#E1F5FE]',
    text: 'text-[#01579B]',
    border: 'border-[#01579B]/30',
    icon: Wrench,
  },
  Organisatorisch: {
    bg: 'bg-[#F3E5F5]',
    text: 'text-[#4A148C]',
    border: 'border-[#4A148C]/30',
    icon: Users,
  },
  Personenbezogen: {
    bg: 'bg-[#E8F5E9]',
    text: 'text-[#1B5E20]',
    border: 'border-[#1B5E20]/30',
    icon: User,
  },
};

const priorityConfig = {
  high: {
    bg: 'bg-[#C62828]',
    text: 'text-[#C62828]',
    label: 'Hohe Priorität',
  },
  medium: {
    bg: 'bg-[#E65100]',
    text: 'text-[#E65100]',
    label: 'Mittlere Priorität',
  },
  low: {
    bg: 'bg-[#2E7D32]',
    text: 'text-[#2E7D32]',
    label: 'Niedrige Priorität',
  },
};

export default function MeasureCard({ category, title, priority }: MeasureCardProps) {
  const colors = categoryColors[category];
  const priorityStyle = priorityConfig[priority];
  const Icon = colors.icon;

  return (
    <div className="bg-white rounded-xl p-4 border border-border flex items-center gap-3 min-h-[56px]">
      <div className={`w-9 h-9 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-4.5 h-4.5 ${colors.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="mb-0 truncate">{title}</p>
      </div>
      <div className={`w-2 h-2 rounded-full ${priorityStyle.bg} flex-shrink-0`} aria-label={priorityStyle.label}></div>
    </div>
  );
}
