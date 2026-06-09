import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ComponentType } from 'react';

export type DetailRowItem = {
  Icon: ComponentType<{ className?: string; style?: React.CSSProperties; strokeWidth?: number }>;
  label: string;
  detail: string;
  value?: string;
};

interface DetailRowListProps {
  items: DetailRowItem[];
}

export default function DetailRowList({ items }: DetailRowListProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-1.5 lg:gap-2">
      {items.map(({ Icon, label, detail, value }, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={label}>
            <button
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className="w-full flex items-center gap-2.5 lg:gap-3 py-2 lg:py-3 rounded-lg cursor-pointer lg:min-h-[44px] text-left"
              style={{ minHeight: 40, background: 'none', border: 'none' }}
            >
              <div
                className="flex items-center justify-center rounded-lg flex-shrink-0 lg:w-[28px] lg:h-[28px]"
                style={{ width: 24, height: 24, backgroundColor: 'var(--neutral-100)' }}
              >
                <Icon className="w-3 lg:w-3.5 h-3 lg:h-3.5" style={{ color: 'var(--neutral-500)' }} strokeWidth={1.5} />
              </div>
              <p
                className="flex-1"
                style={{ fontSize: 'var(--type-size-body)', fontWeight: value ? 600 : 400, color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}
              >
                {label}
              </p>
              {value && (
                <p className="mr-2" style={{ fontSize: 'var(--type-size-body)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }}>
                  {value}
                </p>
              )}
              <ChevronDown
                className="w-3.5 lg:w-4 h-3.5 lg:h-4 flex-shrink-0 transition-transform"
                style={{ color: 'var(--neutral-500)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                strokeWidth={1.5}
              />
            </button>
            {isOpen && (
              <p
                className="pb-2"
                style={{ fontSize: 'var(--type-size-body)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)', lineHeight: 1.6, paddingLeft: 36 }}
              >
                {detail}
              </p>
            )}
            {i < items.length - 1 && (
              <div className="w-full h-px" style={{ backgroundColor: 'var(--border)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
