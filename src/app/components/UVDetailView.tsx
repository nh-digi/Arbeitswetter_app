import { Sun, ClipboardList, User, X } from 'lucide-react';
import DetailRowList from './DetailRowList';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts';

interface UVDetailViewProps {
  onClose: () => void;
}

const svgPaths = {
  p177d0d00: "M12 4.9992L4.9992 12L12 19.0008M4.9992 12H19.0008",
};

// UV data for 24 hours - realistic curve peaking at midday
const uvData = [
  { hour: 0, uv: 0, time: '12AM' },
  { hour: 1, uv: 0, time: '1AM' },
  { hour: 2, uv: 0, time: '2AM' },
  { hour: 3, uv: 0, time: '3AM' },
  { hour: 4, uv: 0, time: '4AM' },
  { hour: 5, uv: 0, time: '5AM' },
  { hour: 6, uv: 1, time: '6AM' },
  { hour: 7, uv: 2, time: '7AM' },
  { hour: 8, uv: 4, time: '8AM' },
  { hour: 9, uv: 6, time: '9AM' },
  { hour: 10, uv: 7, time: '10AM' },
  { hour: 11, uv: 8, time: '11AM' },
  { hour: 12, uv: 9, time: '12PM' },
  { hour: 13, uv: 9, time: '1PM' },
  { hour: 14, uv: 8, time: '2PM' },
  { hour: 15, uv: 7, time: '3PM' },
  { hour: 16, uv: 6, time: '4PM' },
  { hour: 17, uv: 4, time: '5PM' },
  { hour: 18, uv: 3, time: '6PM' },
  { hour: 19, uv: 1, time: '7PM' },
  { hour: 20, uv: 0, time: '8PM' },
  { hour: 21, uv: 0, time: '9PM' },
  { hour: 22, uv: 0, time: '10PM' },
  { hour: 23, uv: 0, time: '11PM' },
];

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

export default function UVDetailView({ onClose }: UVDetailViewProps) {
  return (
    <div className="fixed inset-0 z-50">
      {/* Desktop backdrop */}
      <div
        className="modal-backdrop hidden lg:block absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — full-screen on mobile, right drawer on desktop */}
      <div className="modal-panel absolute inset-0 bg-white overflow-y-auto lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[560px] lg:shadow-2xl">

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center gap-2 px-4 py-3">
          <button onClick={onClose} className="w-6 h-6" aria-label="Zurück">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
              <path d={svgPaths.p177d0d00} stroke="#111827" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </button>
          <p style={{ fontWeight: 600, fontSize: 16, lineHeight: 1.35, color: '#111827', fontFamily: 'var(--font-family)' }}>
            UV-Index
          </p>
        </div>
      </div>

      {/* Desktop Header */}
      <div
        className="hidden lg:flex items-center justify-between px-6 py-4 sticky top-0 z-10 bg-white border-b"
        style={{ borderColor: '#E5E7EB' }}
      >
        <p style={{ fontWeight: 600, fontSize: 16, color: '#111827', fontFamily: 'var(--font-family)' }}>
          UV-Index
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
        {/* Large Number Display */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-baseline gap-3 lg:gap-4">
            <p style={{ fontSize: 72, fontWeight: 700, lineHeight: 1, color: '#111827', fontFamily: 'var(--font-family)' }} className="lg:text-[80px]">
              9
            </p>
            <div>
              <p style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.14px', color: '#111827', fontFamily: 'var(--font-family)' }} className="lg:text-[44px] lg:tracking-[-0.22px]">
                Sehr hoch
              </p>
              <p style={{ fontSize: 12, lineHeight: 1.3, color: '#6B7280', fontFamily: 'var(--font-family)' }}>
                Deutscher Wetterdienst UVI
              </p>
            </div>
          </div>
        </div>

        {/* UV Chart */}
        <div className="mb-8 lg:mb-12">
          {/* Mobile Chart */}
          <div className="lg:hidden flex items-start">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between pr-2 w-[52px]" style={{ height: 200, fontSize: 12, lineHeight: 1.3, color: '#3F3F3F', fontFamily: 'var(--font-family)', textAlign: 'right' }}>
              <p key="mobile-extrem">Extrem</p>
              <p key="mobile-sehr-hoch">Sehr hoch</p>
              <p key="mobile-hoch">Hoch</p>
              <p key="mobile-massig">Mäßig</p>
              <p key="mobile-niedrig">Niedrig</p>
            </div>

            {/* Chart Area */}
            <div className="flex-1" style={{ height: 200, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={uvData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="uvGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF7300" stopOpacity={0.8} />
                      <stop offset="29.33%" stopColor="#FF9E00" stopOpacity={0.7} />
                      <stop offset="46.63%" stopColor="#FFD933" stopOpacity={0.6} />
                      <stop offset="62%" stopColor="#CCBF00" stopOpacity={0.5} />
                      <stop offset="80%" stopColor="#33C71A" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#1AA626" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="0" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="hour" hide />
                  <YAxis domain={[0, 11]} hide />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 shadow-lg">
                            <p style={{ fontSize: 12, color: '#6B7280', fontFamily: 'var(--font-family)', marginBottom: 2 }}>
                              {payload[0].payload.time}
                            </p>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', fontFamily: 'var(--font-family)' }}>
                              UV-Index: {payload[0].value}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    x={13}
                    stroke="#2563EB"
                    strokeWidth={2}
                    label={{
                      content: (props) => {
                        const { viewBox } = props;
                        if (!viewBox || typeof viewBox.x !== 'number') return null;
                        return (
                          <g>
                            <circle cx={viewBox.x} cy={10} r={5} fill="#FFFFFF" stroke="#2563EB" strokeWidth={2} />
                            <rect x={viewBox.x - 20} y={18} width={40} height={16} rx={3} fill="#000000" stroke="#BFDBFE" strokeWidth={1} />
                            <text x={viewBox.x} y={29} textAnchor="middle" fill="#FFFFFF" fontSize={11} fontWeight={600} fontFamily="var(--font-family)">
                              Jetzt
                            </text>
                          </g>
                        );
                      }
                    }}
                  />
                  <Area type="monotone" dataKey="uv" stroke="#111827" strokeWidth={1.5} fill="url(#uvGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Desktop Chart */}
          <div className="hidden lg:flex items-start">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between pr-3 w-20" style={{ height: 280, fontSize: 12, lineHeight: 1.3, color: '#3F3F3F', fontFamily: 'var(--font-family)', textAlign: 'right' }}>
              <p key="desktop-extrem">Extrem</p>
              <p key="desktop-sehr-hoch">Sehr hoch</p>
              <p key="desktop-hoch">Hoch</p>
              <p key="desktop-massig">Mäßig</p>
              <p key="desktop-niedrig">Niedrig</p>
            </div>

            {/* Chart Area */}
            <div className="flex-1" style={{ height: 280, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={uvData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="uvGradientDesktop" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF7300" stopOpacity={0.8} />
                      <stop offset="29.33%" stopColor="#FF9E00" stopOpacity={0.7} />
                      <stop offset="46.63%" stopColor="#FFD933" stopOpacity={0.6} />
                      <stop offset="62%" stopColor="#CCBF00" stopOpacity={0.5} />
                      <stop offset="80%" stopColor="#33C71A" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#1AA626" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="0" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="hour" hide />
                  <YAxis domain={[0, 11]} hide />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 shadow-lg">
                            <p style={{ fontSize: 12, color: '#6B7280', fontFamily: 'var(--font-family)', marginBottom: 2 }}>
                              {payload[0].payload.time}
                            </p>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', fontFamily: 'var(--font-family)' }}>
                              UV-Index: {payload[0].value}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    x={13}
                    stroke="#2563EB"
                    strokeWidth={2}
                    label={{
                      content: (props) => {
                        const { viewBox } = props;
                        if (!viewBox || typeof viewBox.x !== 'number') return null;
                        return (
                          <g>
                            <circle cx={viewBox.x} cy={10} r={5} fill="#FFFFFF" stroke="#2563EB" strokeWidth={2} />
                            <rect x={viewBox.x - 20} y={18} width={40} height={16} rx={3} fill="#000000" stroke="#BFDBFE" strokeWidth={1} />
                            <text x={viewBox.x} y={29} textAnchor="middle" fill="#FFFFFF" fontSize={11} fontWeight={600} fontFamily="var(--font-family)">
                              Jetzt
                            </text>
                          </g>
                        );
                      }
                    }}
                  />
                  <Area type="monotone" dataKey="uv" stroke="#111827" strokeWidth={1.5} fill="url(#uvGradientDesktop)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between mt-2 pl-[52px] lg:pl-20" style={{ fontSize: 12, fontFamily: 'var(--font-family)' }}>
            <p style={{ color: '#6B7280', fontWeight: 500 }}>12AM</p>
            <p style={{ color: '#6B7280', fontWeight: 500 }}>6AM</p>
            <p style={{ color: '#111827', fontWeight: 700 }} className="lg:text-[13px]">12PM</p>
            <p style={{ color: '#6B7280', fontWeight: 500 }}>6PM</p>
          </div>
        </div>

        <div className="h-px bg-[#E5E7EB] my-8" />

        {/* Current Info */}
        <div className="mb-8">
          <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.35, color: '#222', fontFamily: 'var(--font-family)', marginBottom: 6 }}>
            Jetzt, 13:06 Uhr
          </p>
          <p className="max-w-prose" style={{ fontSize: 14, lineHeight: 1.6, color: '#3F3F3F', fontFamily: 'var(--font-family)', marginBottom: 6 }}>
            Sonnenschutz wird dringend empfohlen. UV-Werte von Mäßig oder höher werden von 10:00 bis 18:00 Uhr erreicht.
          </p>
          <p style={{ fontSize: 12, lineHeight: 1.3, color: '#3F3F3F', fontFamily: 'var(--font-family)' }}>
            Quelle: <a href="https://www.dwd.de" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>DWD</a>
          </p>
        </div>

        <div className="h-px bg-[#E5E7EB] my-8" />

        {/* Sun Exposure Recommendations */}
        <div className="rounded-[16px] overflow-hidden" style={{ backgroundColor: 'var(--neutral-50)' }}>
          <div className="px-3 lg:px-4 pt-4 lg:pt-6 pb-3 lg:pb-4 flex flex-col gap-1.5 lg:gap-2">
            <p className="pb-1 lg:pb-2" style={{ fontWeight: 600, fontSize: 'var(--type-size-body)', lineHeight: 1.35, color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}>
              Sonnenschutz-Empfehlungen bei hohem UV-Index
            </p>
            <DetailRowList items={uvSunRecommendations} />
          </div>
        </div>

        <div className="h-px bg-[#E5E7EB] my-8" />

        {/* Day Comparison */}
        <div className="mb-8">
          <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.35, color: '#222', fontFamily: 'var(--font-family)', marginBottom: 6 }}>
            Tagesvergleich
          </p>
          <p className="max-w-prose" style={{ fontSize: 14, lineHeight: 1.6, color: '#3F3F3F', fontFamily: 'var(--font-family)', marginBottom: 16 }}>
            Der UV-Index-Höchstwert heute ist ähnlich wie gestern.
          </p>

          {/* Comparison Cards */}
          <div className="space-y-3">
            {/* Today */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(to right, #4ADE80, #F59E0B)', opacity: 0.12 }}>
                <div className="w-5 h-5 rounded-full" style={{ background: 'linear-gradient(to right, #4ADE80, #F59E0B)' }} />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', fontFamily: 'var(--font-family)' }}>Heute</p>
                <p style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', fontFamily: 'var(--font-family)' }}>UV-Index</p>
              </div>
              <div className="bg-[rgba(245,158,11,0.12)] border border-[rgba(245,158,11,0.2)] rounded-full px-3 py-1.5 flex items-center gap-1">
                <p style={{ fontSize: 12, fontWeight: 600, color: '#222', fontFamily: 'var(--font-family)' }}>UV</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#222', fontFamily: 'var(--font-family)' }}>9</p>
              </div>
            </div>

            {/* Yesterday */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(to right, #4ADE80, #F59E0B)', opacity: 0.12 }}>
                <div className="w-5 h-5 rounded-full" style={{ background: 'linear-gradient(to right, #4ADE80, #F59E0B)' }} />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', fontFamily: 'var(--font-family)' }}>Gestern</p>
                <p style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', fontFamily: 'var(--font-family)' }}>UV-Index</p>
              </div>
              <div className="bg-[rgba(245,158,11,0.12)] border border-[rgba(245,158,11,0.2)] rounded-full px-3 py-1.5 flex items-center gap-1">
                <p style={{ fontSize: 12, fontWeight: 600, color: '#222', fontFamily: 'var(--font-family)' }}>UV</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#222', fontFamily: 'var(--font-family)' }}>8</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-[#E5E7EB] my-8" />

        {/* About UV Index */}
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.35, color: '#222', fontFamily: 'var(--font-family)', marginBottom: 8 }}>
            Über den UV-Index
          </p>
          <p className="max-w-prose" style={{ fontSize: 14, lineHeight: 1.6, color: '#3F3F3F', fontFamily: 'var(--font-family)' }}>
            Der UV-Index (UVI) der Weltgesundheitsorganisation misst ultraviolette Strahlung. Je höher der UVI, desto größer ist das Schadenspotenzial und desto schneller können Schäden entstehen. Der UVI hilft Ihnen zu entscheiden, wie und wann Sie das Aufhalten im Freien einschränken sollten. Die WHO empfiehlt bei Werten ab 3 (Mäßig) Schatten, Sonnencreme, Hüte und Schutzkleidung zu verwenden.
          </p>
        </div>

      </div>
      </div>
    </div>
  );
}
