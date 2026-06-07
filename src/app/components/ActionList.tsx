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
  variant?: 'default' | 'critical';
}

export default function ActionList({ items, variant = 'default' }: ActionListProps) {
  const single = items.length === 1;
  const [openIdx, setOpenIdx] = useState<number | null>(single ? 0 : null);

  return (
    <div>
      {items.map((item, i) => {
        const Icon = CATEGORY_ICON[item.cat];
        const isOpen = openIdx === i;
        return (
          <div key={i} className={i > 0 ? 'border-t border-[var(--neutral-100)]' : ''}>
            <button
              onClick={() => !single && setOpenIdx(isOpen ? null : i)}
              className="w-full flex items-center gap-2.5 md:gap-3 py-2 md:py-2.5 text-left min-h-[44px] transition-opacity hover:opacity-75"
            >
              <div
                className="flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ width: 28, height: 28, backgroundColor: 'var(--neutral-100)' }}
              >
                <Icon className="w-4 h-4 text-[var(--neutral-600)]" strokeWidth={1.5} />
              </div>
              <p className="flex-1 text-sm md:text-base leading-snug font-normal text-[var(--neutral-950)]">
                {item.short}
              </p>
              {!single && (
                <ChevronDown
                  className="w-4 h-4 flex-shrink-0 transition-transform text-[var(--neutral-500)]"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  strokeWidth={1.5}
                />
              )}
            </button>
            {isOpen && (
              <p className="text-sm md:text-base leading-relaxed pb-2 md:pb-3 text-[var(--neutral-600)]">
                {item.long}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
