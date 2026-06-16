import { useState } from 'react';
import { ChevronDown, Wrench, ClipboardList, User } from 'lucide-react';

export const CATEGORY_ICON = {
  technisch: Wrench,
  organisatorisch: ClipboardList,
  personenbezogen: User,
} as const;

export type ActionItem = {
  cat: keyof typeof CATEGORY_ICON;
  short: string;
  long: string;
};

interface ActionListProps {
  items: ActionItem[];
  dark?: boolean;
  variant?: 'default' | 'critical';
}

export default function ActionList({ items, dark = false, variant = 'default' }: ActionListProps) {
  const single = items.length === 1;
  const [openIdx, setOpenIdx] = useState<number | null>(single ? 0 : null);

  const iconBg      = dark ? 'var(--neutral-700)' : 'var(--neutral-100)';
  const iconColor   = dark ? 'var(--neutral-300)' : 'var(--neutral-600)';
  const shortColor  = dark ? 'var(--neutral-100)' : 'var(--neutral-950)';
  const longColor   = dark ? 'var(--neutral-300)' : 'var(--neutral-600)';
  const borderColor = dark ? 'var(--neutral-700)' : 'var(--neutral-100)';
  const chevronColor = dark ? 'var(--neutral-500)' : 'var(--neutral-500)';

  return (
    <div>
      {items.map((item, i) => {
        const Icon = CATEGORY_ICON[item.cat];
        const isOpen = openIdx === i;
        return (
          <div key={i} className={i > 0 ? 'border-t' : ''} style={{ borderColor }}>
            <button
              onClick={() => !single && setOpenIdx(isOpen ? null : i)}
              className="w-full flex items-center gap-2.5 md:gap-3 py-2 md:py-2.5 text-left min-h-[44px] transition-opacity hover:opacity-75"
            >
              <div
                className="flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ width: 40, height: 40, backgroundColor: iconBg }}
              >
                <Icon className="w-5 h-5" style={{ color: iconColor }} strokeWidth={1.5} />
              </div>
              <p
                className="flex-1 leading-snug"
                style={{ fontSize: 'var(--type-size-body)', fontWeight: 400, color: shortColor, fontFamily: 'var(--font-family)' }}
              >
                {item.short}
              </p>
              {!single && (
                <ChevronDown
                  className="w-4 h-4 flex-shrink-0 transition-transform"
                  style={{ color: chevronColor, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  strokeWidth={1.5}
                />
              )}
            </button>
            {isOpen && (
              <p
                className="leading-relaxed pb-2 md:pb-3"
                style={{ fontSize: 'var(--type-size-body)', color: longColor, fontFamily: 'var(--font-family)' }}
              >
                {item.long}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
