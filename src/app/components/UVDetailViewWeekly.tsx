import { Sun, ClipboardList, User, X } from 'lucide-react';
import DetailRowList from './DetailRowList';
import { BarChart, Bar, XAxis, YAxis, Cell, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import type { Day } from './PlanungView';

interface UVDetailViewWeeklyProps {
  onClose: () => void;
  days: Day[];
  selectedDayIndex?: number;
}

const backArrow = 'M12 4.9992L4.9992 12L12 19.0008M4.9992 12H19.0008';

function parseUV(s: string): number {
  return parseInt(s) || 0;
}

function getUVLevel(uv: number): { label: string; solidColor: string } {
  if (uv <= 2)  return { label: 'Niedrig',   solidColor: 'var(--status-icon-ok)' };
  if (uv <= 5)  return { label: 'Mäßig',     solidColor: 'var(--status-warning)' };
  if (uv <= 7)  return { label: 'Hoch',      solidColor: 'var(--status-strong)' };
  if (uv <= 10) return { label: 'Sehr hoch', solidColor: 'var(--status-critical-tint)' };
  return               { label: 'Extrem',    solidColor: 'var(--status-critical)' };
}

const uvSunRecommendations = [
  {
    Icon: ClipboardList,
    label: 'Sonnencreme LSF 50+ empfohlen',
    detail: 'Es empfiehlt sich, vor dem Aufenthalt im Freien aufzutragen und alle 2 Stunden sowie nach dem Schwitzen zu erneuern.',
  },
  {
    Icon: User,
    label: 'Schutzkleidung und Kopfbedeckung empfohlen',
    detail: 'Hut mit breiter Krempe, langärmlige Kleidung und Sonnenbrille können Haut und Augen wirksam schützen.',
  },
  {
    Icon: Sun,
    label: 'Mittagssonne möglichst meiden (11–15 Uhr)',
    detail: 'In diesem Zeitfenster ist die UV-Strahlung am intensivsten. Schattige Bereiche werden empfohlen.',
  },
  {
    Icon: ClipboardList,
    label: 'Regelmäßige Pausen im Schatten empfohlen',
    detail: 'Bei UV-Index 7 und höher empfiehlt es sich, alle 45–60 Minuten Schatten aufzusuchen und ausreichend zu trinken.',
  },
];

export default function UVDetailViewWeekly({ onClose, days, selectedDayIndex = 0 }: UVDetailViewWeeklyProps) {
  const chartData = days.map(d => ({
    name: d.shortDate,
    date: d.date,
    uv: parseUV(d.conditions.uv),
  }));

  const peakUV = Math.max(...chartData.map(d => d.uv));
  const peakLevel = getUVLevel(peakUV);

  return (
    <div className="fixed inset-0 z-50">
      {/* Desktop backdrop */}
      <div
        className="hidden lg:block absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — full-screen on mobile, right drawer on desktop */}
      <div className="absolute inset-0 bg-white overflow-y-auto lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[560px] lg:shadow-2xl">

        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-2 px-4 py-3">
            <button onClick={onClose} className="w-6 h-6" aria-label="Zurück">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                <path d={backArrow} stroke="#111827" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </button>
            <p style={{ fontWeight: 600, fontSize: 16, lineHeight: 1.35, color: '#111827', fontFamily: 'var(--font-family)' }}>
              UV-Index – Wochenübersicht
            </p>
          </div>
        </div>

        {/* Desktop Header */}
        <div
          className="hidden lg:flex items-center justify-between px-6 py-4 sticky top-0 z-10 bg-white border-b"
          style={{ borderColor: '#E5E7EB' }}
        >
          <p style={{ fontWeight: 600, fontSize: 16, color: '#111827', fontFamily: 'var(--font-family)' }}>
            UV-Index – Wochenübersicht
          </p>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/[0.06] transition-colors"
            aria-label="Schließen"
          >
            <X className="w-4 h-4" style={{ color: '#6B7280' }} strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="bg-white px-4 lg:px-6 pt-4 pb-10">

          {/* Peak highlight */}
          <div className="mb-6 lg:mb-8">
            <div className="flex items-baseline gap-3 lg:gap-4">
              <p
                style={{ fontSize: 72, fontWeight: 700, lineHeight: 1, color: '#111827', fontFamily: 'var(--font-family)' }}
                className="lg:text-[80px]"
              >
                {peakUV}
              </p>
              <div>
                <p
                  style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2, color: '#111827', fontFamily: 'var(--font-family)' }}
                  className="lg:text-[44px]"
                >
                  {peakLevel.label}
                </p>
                <p style={{ fontSize: 12, lineHeight: 1.3, color: '#6B7280', fontFamily: 'var(--font-family)' }}>
                  Höchstwert diese Woche · Deutscher Wetterdienst UVI
                </p>
              </div>
            </div>
          </div>

          {/* Week bar chart */}
          <div className="mb-8 lg:mb-10">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} margin={{ top: 16, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="0" stroke="#E5E7EB" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#6B7280', fontFamily: 'var(--font-family)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis domain={[0, 11]} hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      const lvl = getUVLevel(d.uv);
                      return (
                        <div className="bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 shadow-lg">
                          <p style={{ fontSize: 11, color: '#6B7280', fontFamily: 'var(--font-family)', marginBottom: 2 }}>{d.date}</p>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', fontFamily: 'var(--font-family)' }}>
                            UV-Index: {d.uv} · {lvl.label}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="uv" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => {
                    const lvl = getUVLevel(entry.uv);
                    return (
                      <Cell
                        key={index}
                        fill={lvl.solidColor}
                        opacity={index === selectedDayIndex ? 1 : 0.55}
                        stroke={index === selectedDayIndex ? '#111827' : 'none'}
                        strokeWidth={index === selectedDayIndex ? 1.5 : 0}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="h-px bg-[#E5E7EB] my-6 lg:my-8" />

          {/* Day list */}
          <div className="mb-6 lg:mb-8">
            <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.35, color: '#111827', fontFamily: 'var(--font-family)', marginBottom: 12 }}>
              Tagesübersicht
            </p>
            <div className="rounded-[16px] overflow-hidden border" style={{ borderColor: '#E5E7EB' }}>
              {days.map((day, i) => {
                const uv = parseUV(day.conditions.uv);
                const lvl = getUVLevel(uv);
                const isSelected = i === selectedDayIndex;
                return (
                  <div
                    key={i}
                    className="flex items-center px-4 py-3"
                    style={{
                      backgroundColor: isSelected ? '#F3F4F6' : i % 2 === 0 ? 'white' : 'var(--neutral-50)',
                      borderBottom: i < days.length - 1 ? '1px solid #E5E7EB' : 'none',
                    }}
                  >
                    <p
                      className="flex-1 text-sm"
                      style={{ fontWeight: isSelected ? 700 : 500, color: '#111827', fontFamily: 'var(--font-family)' }}
                    >
                      {day.date}
                    </p>
                    <p className="text-sm mr-3" style={{ fontWeight: 600, color: '#111827', fontFamily: 'var(--font-family)' }}>{uv}</p>
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                      style={{ backgroundColor: lvl.solidColor, color: '#000' }}
                    >
                      {lvl.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-[#E5E7EB] my-6 lg:my-8" />

          {/* Sun recommendations */}
          <div className="rounded-[16px] overflow-hidden" style={{ backgroundColor: 'var(--neutral-50)' }}>
            <div className="px-3 lg:px-4 pt-4 lg:pt-6 pb-3 lg:pb-4 flex flex-col gap-1.5 lg:gap-2">
              <p className="pb-1 lg:pb-2 lg:text-base" style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.35, color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}>
                Sonnenschutz-Empfehlungen bei hohem UV-Index
              </p>
              <DetailRowList items={uvSunRecommendations} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
