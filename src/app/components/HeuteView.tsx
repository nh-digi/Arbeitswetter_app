import { Edit3, AlertTriangle, AlertCircle, CheckCircle, Thermometer, Droplet, Wind, Sun, Wrench, ClipboardList, User, ChevronDown, X } from 'lucide-react';
import { useState, useRef, useEffect, type RefObject } from 'react';
import DWDWarningBanner from './DWDWarningBanner';
import UndoToast from './UndoToast';
import UVDetailView from './UVDetailView';
import BeurteilungstemperaturDetailView from './BeurteilungstemperaturDetailView';

// ── Constants ──────────────────────────────────────────────────────────────────

const WORKDAY_START  = 6;
const WORKDAY_END    = 18;
const WORKDAY_HOURS  = WORKDAY_END - WORKDAY_START;
const CRITICAL_START = 13;
const CRITICAL_END   = 17;

// ── Helpers ───────────────────────────────────────────────────────────────────

const getRealHour = () => {
  const n = new Date();
  return n.getHours() + n.getMinutes() / 60;
};

const clampWorkday = (h: number) =>
  Math.max(WORKDAY_START, Math.min(WORKDAY_END, h));

const formatHH = (h: number) => {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${hh}:${mm.toString().padStart(2, '0')}`;
};

// ── CSS variable tokens ───────────────────────────────────────────────────────
// All colors reference theme.css variables so the DS owner can update styling in one place.

const T = {
  // Neutrals
  black:    'var(--neutral-black)',
  n950:     'var(--neutral-950)',
  n800:     'var(--neutral-800)',
  n700:     'var(--neutral-700)',
  n600:     'var(--neutral-600)',
  n500:     'var(--neutral-500)',
  n300:     'var(--neutral-300)',
  n100:     'var(--neutral-100)',
  n50:      'var(--neutral-50)',
  white:    'var(--neutral-white)',
  // Brand
  brand:    'var(--brand-primary)',
  // Status
  critical:     'var(--status-critical)',
  criticalTint: 'var(--status-critical-tint)',
  criticalBg:   'var(--status-critical-bg)',
  warning:      'var(--status-warning)',
  warningBg:    'var(--status-warning-bg)',
  success:      'var(--status-success)',
  successBg:    'var(--status-success-bg)',
  successText:  'var(--status-success-text)',
  // Ring arc color (chart-4 from DS)
  ringWarn: 'var(--chart-4)',
} as const;

// ── Beurteilungstemperatur calculation ───────────────────────────────────────
// Simplified calculation: Lufttemperatur + corrections for work/sun/humidity - wind/shade

function getBeurteilungstemperatur(hour: number): number {
  const h = clampWorkday(hour);

  // Base air temperature (varies by hour - peak in afternoon)
  let lufttemp = 22;
  if (h >= 6 && h < 9) lufttemp = 24;
  if (h >= 9 && h < 11) lufttemp = 28;
  if (h >= 11 && h < 13) lufttemp = 31;
  if (h >= 13 && h < 17) lufttemp = 34;
  if (h >= 17 && h < 18) lufttemp = 30;

  // Correction factors (simplified for prototype)
  const arbeitsschwere = 3;    // +3°C for heavy work
  const sonne = 2;              // +2°C for direct sun (less in morning/evening)
  const feuchtigkeit = 1;       // +1°C for high humidity
  const bekleidung = 1;         // +1°C for heavy work clothing
  const wind = -1;              // -1°C for moderate wind

  // Apply corrections based on time of day
  let corrections = arbeitsschwere + bekleidung + feuchtigkeit + wind;
  if (h >= 10 && h < 17) corrections += sonne; // Sun correction during midday

  return Math.round(lufttemp + corrections);
}

// ── Status config (4 states) ──────────────────────────────────────────────────

function getStatus(hour: number) {
  const h = clampWorkday(hour);
  const beurteilungsTemp = getBeurteilungstemperatur(hour);

  if (h >= CRITICAL_START && h < CRITICAL_END) return {
    level: 4, label: 'Kritisch',
    badgeBg: T.criticalBg, badgeDot: T.critical, badgeText: T.critical,
    badgeLabel: `${beurteilungsTemp}°C`,
    beurteilungstemperatur: beurteilungsTemp,
    alertBg: T.black,
    alertIconCircle: T.criticalTint, alertIconColor: T.n600,
    alertTitle: `Warnung für ${CRITICAL_START}:00 bis ${CRITICAL_END}:00 Uhr`,
    alertBody: 'Extreme Hitzebelastung erwartet',
    dotFill: T.critical,
    labelColor: T.critical,
  };
  if ((h >= 11 && h < 13) || (h >= 17 && h < 18)) return {
    level: 3, label: 'Warnung',
    badgeBg: T.warningBg, badgeDot: T.warning, badgeText: T.n950,
    badgeLabel: `${beurteilungsTemp}°C`,
    beurteilungstemperatur: beurteilungsTemp,
    alertBg: T.black,
    alertIconCircle: T.warning, alertIconColor: T.n600,
    alertTitle: `Warnung für ${CRITICAL_START}:00 bis ${CRITICAL_END}:00 Uhr`,
    alertBody: 'Erhöhte UV-Belastung erwartet',
    dotFill: T.critical,
    labelColor: T.critical,
  };
  if (h >= 9 && h < 11) return {
    level: 2, label: 'Erhöht',
    badgeBg: T.warningBg, badgeDot: T.warning, badgeText: T.n950,
    badgeLabel: `${beurteilungsTemp}°C`,
    beurteilungstemperatur: beurteilungsTemp,
    alertBg: T.black,
    alertIconCircle: T.warning, alertIconColor: T.n600,
    alertTitle: `Warnung für ${CRITICAL_START}:00 bis ${CRITICAL_END}:00 Uhr`,
    alertBody: 'Erhöhte UV-Belastung erwartet',
    dotFill: T.warning,
    labelColor: T.warning,
  };
  return {
    level: 1, label: 'Gut',
    badgeBg: T.successBg, badgeDot: T.success, badgeText: T.successText,
    badgeLabel: `${beurteilungsTemp}°C`,
    beurteilungstemperatur: beurteilungsTemp,
    alertBg: T.black,
    alertIconCircle: T.success, alertIconColor: T.n600,
    alertTitle: `Gut planbar für ${WORKDAY_START}:00 bis ${WORKDAY_END}:00 Uhr`,
    alertBody: 'Angenehme Bedingungen erwartet',
    dotFill: T.n100,
    labelColor: T.success,
  };
}

// ── Main component ────────────────────────────────────────────────────────────

type View = 'heute' | 'planung' | 'warnung' | 'einstellungen' | 'styleguide';

export default function HeuteView({ onNavigate }: { onNavigate: (view: View) => void }) {
  const [realtimeHour, setRealtimeHour]   = useState(getRealHour);
  const [scrubbingHour, setScrubbingHour] = useState<number | null>(null);
  const [mobileView, setMobileView]       = useState<'clock' | 'list'>('clock');
  const [dwdWarningVisible, setDwdWarningVisible] = useState(true);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [uvDetailOpen, setUvDetailOpen] = useState(false);
  const [beurtDetailOpen, setBeurtDetailOpen] = useState(false);

  const handleDismissWarning = () => {
    setDwdWarningVisible(false);
    setShowUndoToast(true);
  };

  const handleUndoWarning = () => {
    setDwdWarningVisible(true);
    setShowUndoToast(false);
  };

  const handleFinalizeToast = () => {
    setShowUndoToast(false);
  };

  const clockRefDesktop = useRef<SVGSVGElement>(null);
  const clockRefMobile  = useRef<SVGSVGElement>(null);
  const isDragging      = useRef(false);
  const returnTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Geometry ────────────────────────────────────────────────────────────────
  const SIZE    = 340;
  const C       = 170;
  const R       = 120;
  const SW      = 28;
  const LABEL_R = R - SW / 2 - 14;
  const PILL_R  = R + SW / 2 + 20;

  const hourToAngle = (h: number) => ((clampWorkday(h) - WORKDAY_START) / WORKDAY_HOURS) * 360;

  const polar = (r: number, deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: C + r * Math.cos(rad), y: C + r * Math.sin(rad) };
  };

  const makeArc = (h1: number, h2: number) => {
    const s    = polar(R, hourToAngle(h1));
    const e    = polar(R, hourToAngle(h2));
    const span = hourToAngle(h2) - hourToAngle(h1);
    return `M ${s.x} ${s.y} A ${R} ${R} 0 ${span > 180 ? 1 : 0} 1 ${e.x} ${e.y}`;
  };

  // ── Position → hour via SVG coordinate space (handles CSS scale correctly) ─
  // Takes the specific SVG element so desktop/mobile each transform correctly.
  const calcHour = useRef((_cx: number, _cy: number, _svg: SVGSVGElement): number | null => null);
  calcHour.current = (clientX: number, clientY: number, svg: SVGSVGElement): number | null => {
    const pt  = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const sp  = pt.matrixTransform(ctm.inverse());
    const dx  = sp.x - C;
    const dy  = sp.y - C;
    let deg   = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (deg < 0) deg += 360;
    return clampWorkday(WORKDAY_START + (deg / 360) * WORKDAY_HOURS);
  };

  // ── Real-time tick ─────────────────────────────────────────────────────────
  useEffect(() => {
    const tick = setInterval(() => setRealtimeHour(getRealHour()), 30_000);
    return () => clearInterval(tick);
  }, []);

  // ── Native drag listeners ───────────────────────────────────────────────────
  // Re-runs whenever mobileView changes so listeners bind to the freshly-mounted
  // SVG element (conditional rendering unmounts/remounts the SVG on view toggle).
  function attachDrag(svg: SVGSVGElement) {
    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      svg.setPointerCapture(e.pointerId);
      if (returnTimer.current) clearTimeout(returnTimer.current);
      isDragging.current = true;
      const h = calcHour.current(e.clientX, e.clientY, svg);
      if (h !== null) setScrubbingHour(h);
    };
    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const h = calcHour.current(e.clientX, e.clientY, svg);
      if (h !== null) setScrubbingHour(h);
    };
    const onUp = (e: PointerEvent) => {
      if (!isDragging.current) return;
      svg.releasePointerCapture(e.pointerId);
      isDragging.current = false;
      returnTimer.current = setTimeout(() => setScrubbingHour(null), 1500);
    };
    svg.addEventListener('pointerdown', onDown);
    svg.addEventListener('pointermove', onMove);
    svg.addEventListener('pointerup', onUp);
    svg.addEventListener('pointercancel', onUp);
    return () => {
      svg.removeEventListener('pointerdown', onDown);
      svg.removeEventListener('pointermove', onMove);
      svg.removeEventListener('pointerup', onUp);
      svg.removeEventListener('pointercancel', onUp);
    };
  }

  useEffect(() => {
    const detachDesktop = clockRefDesktop.current ? attachDrag(clockRefDesktop.current) : () => {};
    const detachMobile  = clockRefMobile.current  ? attachDrag(clockRefMobile.current)  : () => {};
    return () => { detachDesktop(); detachMobile(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileView]);

  const currentHour = scrubbingHour !== null ? scrubbingHour : clampWorkday(realtimeHour);
  const status      = getStatus(currentHour);

  // ── Derived positions ──────────────────────────────────────────────────────
  const handleAngle = hourToAngle(currentHour);
  const handlePos   = polar(R, handleAngle);
  const pillPos     = polar(PILL_R, handleAngle);

  // Warn segments: amber (9-13, 17-18) + red (13-17)
  const warnSegments = [
    { h1:  9, h2: 13, color: T.warning  },
    { h1: 13, h2: 17, color: T.ringWarn },
    { h1: 17, h2: 18, color: T.warning  },
  ];

  // ── Inlined SVG clock ──────────────────────────────────────────────────────
  // Returns a new SVG element bound to the given ref so desktop + mobile each
  // get their own DOM node (sharing one ref would wire events to only one).
  const makeClockSVG = (ref: RefObject<SVGSVGElement>) => (
    <svg
      ref={ref}
      width={SIZE} height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      overflow="visible"
      className="select-none touch-none"
      style={{ touchAction: 'none' }}
    >
      {/* Background ring */}
      <circle cx={C} cy={C} r={R} fill="none" stroke={T.n100} strokeWidth={SW} />

      {/* Warning arcs */}
      {warnSegments.map(({ h1, h2, color }) => (
        <path key={h1} d={makeArc(h1, h2)} fill="none"
          stroke={color} strokeWidth={SW} strokeLinecap="round" />
      ))}

      {/* Hour labels — 6..17 only (18 overlaps 6 at 0°) */}
      {Array.from({ length: WORKDAY_HOURS }, (_, i) => {
        const h   = WORKDAY_START + i;
        const pos = polar(LABEL_R, hourToAngle(h));
        return (
          <text key={h} x={pos.x} y={pos.y}
            textAnchor="middle" dominantBaseline="middle"
            fill={T.n500}
            style={{ fontSize: '10px', fontWeight: 500, pointerEvents: 'none', fontFamily: 'var(--font-family)' }}>
            {h}
          </text>
        );
      })}

      {/* Center: time */}
      <text x={C} y={C - 42} textAnchor="middle" dominantBaseline="middle"
        fill={T.n500}
        style={{ fontSize: '12px', fontWeight: 600, pointerEvents: 'none', fontFamily: 'var(--font-family)' }}>
        {formatHH(currentHour)} Uhr
      </text>

      {/* Center: Belastungsstufe */}
      <text x={C} y={C + 12} textAnchor="middle" dominantBaseline="middle"
        fill={T.n950}
        style={{ fontSize: '80px', fontWeight: 600, letterSpacing: '-1px', pointerEvents: 'none', fontFamily: 'var(--font-family)' }}>
        {status.level}
      </text>

      {/* Severity dots */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={C - 12 + i * 12} cy={C + 52} r={4}
          style={{ fill: i < status.level - 1 ? T.critical : T.n100 }} />
      ))}

      {/* Status label */}
      <text x={C} y={C + 68} textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: '11px', fontWeight: 700, pointerEvents: 'none', fontFamily: 'var(--font-family)', fill: T.n950 }}>
        {status.label}
      </text>

      {/* Handle */}
      <circle cx={handlePos.x} cy={handlePos.y} r={24}
        fill={T.white} stroke={T.n800} strokeWidth={2.5}
        style={{ cursor: 'grab', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }} />

      {/* Pill label */}
      <rect x={pillPos.x - 26} y={pillPos.y - 11} width={52} height={22} rx={11} fill={T.n800} />
      <text x={pillPos.x} y={pillPos.y} textAnchor="middle" dominantBaseline="middle"
        fill={T.white}
        style={{ fontSize: '11px', fontWeight: 600, pointerEvents: 'none', fontFamily: 'var(--font-family)' }}>
        {Math.floor(currentHour)} Uhr
      </text>
    </svg>
  );

  // ── Alert Banner ──────────────────────────────────────────────────────────

  const AlertBanner = () => {
    return (
      <div className="flex items-start gap-2.5 lg:gap-4 p-2.5 lg:p-4 rounded-2xl" style={{ backgroundColor: status.alertBg }}>
        <div className="flex items-center justify-center flex-shrink-0 rounded-3xl w-8 h-8 lg:w-12 lg:h-12"
          style={{ backgroundColor: status.alertIconCircle }}>
          {status.level === 1
            ? <CheckCircle className="w-3.5 lg:w-5 h-3.5 lg:h-5" style={{ color: T.black }} strokeWidth={2} />
            : status.level <= 3
              ? <span style={{ fontSize: 14, fontWeight: 700, color: T.black, fontFamily: 'var(--font-family)', lineHeight: 1 }} className="lg:text-lg">!</span>
              : <AlertTriangle className="w-3.5 lg:w-5 h-3.5 lg:h-5" style={{ color: T.black }} strokeWidth={2} />
          }
        </div>
        <div className="flex-1 min-w-0 self-center">
          <p className="leading-snug mb-0.5 lg:mb-1 lg:text-base"
            style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-family)', color: T.white }}>
            {scrubbingHour !== null ? status.alertTitle : `Jetzt, ${formatHH(clampWorkday(realtimeHour))} Uhr`}
          </p>
          <p className="text-[11px] lg:text-sm leading-snug"
            style={{ fontFamily: 'var(--font-family)', color: T.n100 }}>
            {status.alertBody}
          </p>
        </div>
      </div>
    );
  };

  // ── Card Header ───────────────────────────────────────────────────────────

  const CardHeader = ({ compact = false }: { compact?: boolean }) => {
    const today = new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'numeric', year: '2-digit' });
    return (
      <div className={compact ? "space-y-1 w-full" : "space-y-2 w-full"}>
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full"
            style={{ backgroundColor: status.badgeBg }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: status.badgeDot }} />
            <span style={{ fontSize: 14, fontWeight: 500, color: status.badgeText, fontFamily: 'var(--font-family)' }}>
              {status.badgeLabel}
            </span>
          </div>
          <span className={compact ? "text-[10px]" : "text-xs"} style={{ color: T.n500, fontFamily: 'var(--font-family)' }}>
            {today}, {formatHH(realtimeHour)} Uhr
          </span>
        </div>
        <div>
          <h1 style={{ fontSize: compact ? 20 : 32, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.32px', color: T.n950, fontFamily: 'var(--font-family)' }}>
            {(() => {
              const seg = [
                { s: 6, e: 9 }, { s: 9, e: 11 }, { s: 11, e: 13 },
                { s: 13, e: 17 }, { s: 17, e: 18 },
              ].find(b => currentHour >= b.s && currentHour < b.e);
              return seg
                ? `${seg.s}:00 – ${seg.e}:00 Uhr`
                : `${WORKDAY_START}:00 – ${WORKDAY_END}:00 Uhr`;
            })()}
          </h1>
          {(() => {
            const criticalBlocks = timeBlocks.filter(b => b.level >= 4);
            const warningBlocks  = timeBlocks.filter(b => b.level === 3);
            if (!criticalBlocks.length && !warningBlocks.length) return null;
            return (
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {(criticalBlocks.length > 0 || warningBlocks.length > 0) && (
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 flex-shrink-0" style={{ color: T.ringWarn }} strokeWidth={2.5} />
                    <span className="text-[11px]" style={{ color: T.n500, fontFamily: 'var(--font-family)' }}>
                      {criticalBlocks.length > 0 && warningBlocks.length > 0
                        ? 'Mehrere Warnungen für heute'
                        : criticalBlocks.length > 0
                          ? 'Kritische Belastung erwartet'
                          : 'Erhöhte Belastung erwartet'}
                    </span>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    );
  };

  // ── Location context button ───────────────────────────────────────────────

  const LocationButton = () => (
    <button
      onClick={() => onNavigate('einstellungen')}
      className="inline-flex items-center gap-1.5 w-full rounded-2xl transition-all duration-200 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background overflow-hidden lg:min-h-[52px]"
      style={{
        backgroundColor: 'var(--muted)',
        padding: '8px 12px'
      }}
    >
      <Edit3 className="w-3 lg:w-4 h-3 lg:h-4 flex-shrink-0 transition-colors" style={{ color: 'var(--muted-foreground)' }} strokeWidth={1.5} />
      <span className="text-[11px] lg:text-sm transition-colors truncate" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }}>
        München · Schwere Arbeit · Schwere Arbeitskleidung
      </span>
    </button>
  );

  // ── Time-block list ───────────────────────────────────────────────────────

  const timeBlocks = [
    { start: '06:00', end: '09:00', startH: 6,  label: 'Niedrig',  sublabel: 'Geringe Belastung',  level: 1 },
    { start: '09:00', end: '11:00', startH: 9,  label: 'Erhöht',   sublabel: 'Mittlere Belastung', level: 2 },
    { start: '11:00', end: '13:00', startH: 11, label: 'Warnung',   sublabel: 'Hohe Belastung',     level: 3 },
    { start: '13:00', end: '17:00', startH: 13, label: 'Kritisch',  sublabel: 'Nicht arbeiten',     level: 4 },
    { start: '17:00', end: '18:00', startH: 17, label: 'Warnung',   sublabel: 'Hohe Belastung',     level: 3 },
  ];

  const ListBlocks = ({ compact = false }: { compact?: boolean }) => {
    const activeIdx = timeBlocks.findIndex((b, i) =>
      currentHour >= b.startH && currentHour < (timeBlocks[i + 1]?.startH ?? WORKDAY_END)
    );
    return (
      <div className={compact ? 'mb-3 px-1' : 'mb-6 px-1'}>
        {timeBlocks.map((block, i) => {
          const isActive    = i === activeIdx;
          const isCrit      = block.level >= 4;
          const isWarn      = block.level >= 3;
          const blockStatus = getStatus(block.startH);
          return (
            <div key={i} className="flex gap-3 items-stretch">
              <div className="flex flex-col items-center w-5 flex-shrink-0">
                <div className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 mt-3.5"
                  style={{
                    backgroundColor: isActive ? T.n950 : T.white,
                    borderColor: isActive ? T.n950 : T.n100,
                  }} />
                {i < timeBlocks.length - 1 && <div className="w-px flex-1 my-0.5" style={{ backgroundColor: T.n100 }} />}
              </div>
              <button
                onClick={() => { if (returnTimer.current) clearTimeout(returnTimer.current); setScrubbingHour(block.startH); }}
                className="flex-1 flex items-start gap-3 py-2.5 text-left rounded-xl transition-colors hover:bg-muted">
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-xs tabular-nums mb-0.5" style={{ color: T.n500, fontFamily: 'var(--font-family)' }}>
                    {block.start} – {block.end}
                  </p>
                  <p className="text-sm leading-tight"
                    style={{
                      fontWeight: isCrit ? 600 : isWarn ? 500 : 400,
                      color: isCrit ? T.ringWarn : T.n950,
                      fontFamily: 'var(--font-family)',
                    }}>
                    {block.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: T.n500, fontFamily: 'var(--font-family)' }}>{block.sublabel}</p>
                </div>
                <div className="flex items-center justify-center flex-shrink-0 mt-1 rounded-full"
                  style={{ width: 24, height: 24, backgroundColor: isCrit ? T.criticalTint : isWarn ? T.warning : T.success }}>
                  {isCrit
                    ? <AlertTriangle className="w-3 h-3" style={{ color: T.black }} strokeWidth={2.5} />
                    : isWarn
                      ? <span style={{ fontSize: 13, fontWeight: 700, color: T.black, fontFamily: 'var(--font-family)', lineHeight: 1 }}>!</span>
                      : <CheckCircle className="w-3 h-3" style={{ color: T.black }} strokeWidth={2.5} />
                  }
                </div>
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  // ── Actions card (light) ──────────────────────────────────────────────────

  const getActionRows = () => {
    if (status.level >= 4) {
      return [
        { Icon: Wrench,        label: 'Schattenplätze und Kühlung empfohlen' },
        { Icon: ClipboardList, label: 'Pausen alle 30 Min. empfohlen' },
        { Icon: User,          label: 'Leichte Kleidung und Kopfschutz empfohlen' },
      ];
    } else if (status.level >= 3) {
      return [
        { Icon: Wrench,        label: 'Schattenplätze empfohlen' },
        { Icon: ClipboardList, label: 'Verlängerte Pausen empfohlen' },
        { Icon: User,          label: 'Ausreichend Getränke empfohlen' },
      ];
    } else if (status.level >= 2) {
      return [
        { Icon: ClipboardList, label: 'Regelmäßige Pausen empfohlen' },
        { Icon: User,          label: 'Sonnenschutz empfohlen' },
      ];
    } else {
      return [
        { Icon: ClipboardList, label: 'Normale Arbeitsplanung möglich' },
        { Icon: User,          label: 'Sonnenschutz empfohlen' },
      ];
    }
  };

  const actionRows = getActionRows();

  const ActionsCard = () => (
    <div className="rounded-[16px] overflow-hidden" style={{ backgroundColor: T.n50 }}>
      <div className="px-3 lg:px-4 pt-4 lg:pt-6 pb-3 lg:pb-4 flex flex-col gap-1.5 lg:gap-2">
        <p className="pb-1 lg:pb-2 lg:text-base" style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.35, color: T.n950, fontFamily: 'var(--font-family)' }}>
          Handlungsempfehlungen {scrubbingHour !== null ? `für ${Math.floor(currentHour)}:00 – ${Math.floor(currentHour) + 2}:00 Uhr` : 'aktuell'}
        </p>
        {actionRows.map(({ Icon, label }, i) => (
          <div key={label}>
            <div className="flex items-center gap-2.5 lg:gap-3 py-2 lg:py-3 rounded-lg cursor-pointer lg:min-h-[44px]" style={{ minHeight: 40 }}>
              <div className="flex items-center justify-center rounded-lg flex-shrink-0 lg:w-[28px] lg:h-[28px]"
                style={{ width: 24, height: 24, backgroundColor: T.n100 }}>
                <Icon className="w-3 lg:w-3.5 h-3 lg:h-3.5" style={{ color: T.n600 }} strokeWidth={1.5} />
              </div>
              <p className="flex-1 text-xs lg:text-sm" style={{ color: T.n950, fontFamily: 'var(--font-family)' }}>{label}</p>
              <ChevronDown className="w-3.5 lg:w-4 h-3.5 lg:h-4 flex-shrink-0" style={{ color: T.n600 }} strokeWidth={1.5} />
            </div>
            {i < actionRows.length - 1 && (
              <div className="w-full h-px" style={{ backgroundColor: T.n100 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ── Hazard card (dark) ────────────────────────────────────────────────────

  const getHazardRows = () => {
    const h = clampWorkday(currentHour);

    // Calculate temp
    let temp = 22;
    if (h >= 6 && h < 9) temp = 24;
    if (h >= 9 && h < 11) temp = 28;
    if (h >= 11 && h < 13) temp = 31;
    if (h >= 13 && h < 17) temp = 34;
    if (h >= 17 && h < 18) temp = 30;

    // Calculate humidity
    let humidity = 60;
    if (h >= 9 && h < 11) humidity = 50;
    if (h >= 11 && h < 13) humidity = 42;
    if (h >= 13 && h < 17) humidity = 38;
    if (h >= 17 && h < 18) humidity = 45;

    // Calculate UV
    let uvIndex = 3;
    if (h >= 9 && h < 11) uvIndex = 6;
    if (h >= 11 && h < 13) uvIndex = 7;
    if (h >= 13 && h < 17) uvIndex = 8;
    if (h >= 17 && h < 18) uvIndex = 5;

    // Warning thresholds
    const tempWarning = temp >= 32;
    const humidityWarning = humidity <= 40;
    const uvWarning = uvIndex >= 7;

    // Multi-factor warning detection
    const multiFactors = [];
    if (tempWarning) multiFactors.push('Hitze');
    if (uvWarning) multiFactors.push('UV');
    if (humidityWarning) multiFactors.push('Trockenheit');

    if (status.level >= 4) {
      const rows = [
        { Icon: Sun,  label: `Extreme Hitzebelastung bei ${temp}°C erwartet` },
        { Icon: Sun,  label: `Sehr hohe UV-Strahlung (Index ${uvIndex})` },
      ];
      if (multiFactors.length > 1) {
        rows.push({ Icon: AlertTriangle, label: `Mehrfachbelastung: ${multiFactors.join(' + ')}` });
      }
      rows.push({ Icon: User, label: 'Schwere Arbeit in der Sonne nach Möglichkeit vermeiden' });
      return rows;
    } else if (status.level >= 3) {
      const rows = [
        { Icon: Sun,  label: `Erhöhte Hitzebelastung bei ${temp}°C` },
        { Icon: Sun,  label: `Hohe UV-Strahlung (Index ${uvIndex})` },
      ];
      if (multiFactors.length > 1) {
        rows.push({ Icon: AlertTriangle, label: `Mehrfachbelastung: ${multiFactors.join(' + ')}` });
      }
      return rows;
    } else if (status.level >= 2) {
      return [
        { Icon: Sun,  label: `Mäßige Wärme bei ${temp}°C` },
        { Icon: Sun,  label: `Mittlere UV-Strahlung (Index ${uvIndex})` },
      ];
    } else {
      return [
        { Icon: Sun, label: 'Angenehme Arbeitsbedingungen' },
      ];
    }
  };

  const hazardRows = getHazardRows();

  const HazardCard = () => (
    <div className="rounded-[16px] overflow-hidden" style={{ backgroundColor: T.n700 }}>
      <div className="px-3 lg:px-4 pt-4 lg:pt-6 pb-3 lg:pb-4 flex flex-col gap-1.5 lg:gap-2">
        <p className="pb-1 lg:pb-2 lg:text-base" style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.35, color: T.white, fontFamily: 'var(--font-family)' }}>
          Belastungsfaktoren für {Math.floor(currentHour)}:00 – {Math.floor(currentHour) + 2}:00 Uhr
        </p>
        {hazardRows.map(({ Icon, label }, i) => (
          <div key={label}>
            <div className="flex items-center gap-2.5 lg:gap-3 py-2 lg:py-3 rounded-lg cursor-pointer lg:min-h-[44px]" style={{ minHeight: 40 }}>
              <div className="flex items-center justify-center rounded-lg flex-shrink-0 lg:w-[28px] lg:h-[28px]"
                style={{ width: 24, height: 24, backgroundColor: T.n600 }}>
                <Icon className="w-3 lg:w-3.5 h-3 lg:h-3.5" style={{ color: T.white }} strokeWidth={1.5} />
              </div>
              <p className="flex-1 text-xs lg:text-sm" style={{ color: T.white, fontFamily: 'var(--font-family)' }}>{label}</p>
              <ChevronDown className="w-3.5 lg:w-4 h-3.5 lg:h-4 flex-shrink-0" style={{ color: T.n300 }} strokeWidth={1.5} />
            </div>
            {i < hazardRows.length - 1 && (
              <div className="w-full h-px" style={{ backgroundColor: T.n600 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ── Weather section (full-width dark) ────────────────────────────────────

  const getWeatherStats = () => {
    const h = clampWorkday(currentHour);

    // Air temperature varies by hour
    let temp = 22;
    if (h >= 6 && h < 9) temp = 24;
    if (h >= 9 && h < 11) temp = 28;
    if (h >= 11 && h < 13) temp = 31;
    if (h >= 13 && h < 17) temp = 34;
    if (h >= 17 && h < 18) temp = 30;

    // Humidity inversely related to temperature
    let humidity = 60;
    if (h >= 9 && h < 11) humidity = 50;
    if (h >= 11 && h < 13) humidity = 42;
    if (h >= 13 && h < 17) humidity = 38;
    if (h >= 17 && h < 18) humidity = 45;

    // Wind picks up slightly during the day - always show both regular and Böen
    let wind = '3 km/h, Böen: 15 km/h';
    if (h >= 10 && h < 17) wind = '5 km/h, Böen: 25 km/h';
    if (h >= 17) wind = '4 km/h, Böen: 18 km/h';

    // UV index peaks at midday
    let uv = '3 (Mittel)';
    let uvIndex = 3;
    if (h >= 9 && h < 11) { uv = '6 (Hoch)'; uvIndex = 6; }
    if (h >= 11 && h < 13) { uv = '7 (Hoch)'; uvIndex = 7; }
    if (h >= 13 && h < 17) { uv = '8 (Sehr hoch)'; uvIndex = 8; }
    if (h >= 17 && h < 18) { uv = '5 (Mittel)'; uvIndex = 5; }

    // Warning thresholds
    const tempWarning = temp >= 32;
    const humidityWarning = humidity <= 40;
    const uvWarning = uvIndex >= 7;

    return [
      { Icon: Thermometer, label: 'Lufttemperatur',           value: `${temp}°C`, showWarning: tempWarning },
      { Icon: Droplet,     label: 'relative Luftfeuchtigkeit', value: `${humidity}%`, showWarning: humidityWarning },
      { Icon: Wind,        label: 'Wind',                     value: wind, showWarning: false },
      { Icon: Sun,         label: 'UV',                       value: uv, showWarning: uvWarning },
    ];
  };

  const weatherStats = getWeatherStats();

  const WeatherSection = () => (
    <div className="rounded-[16px] p-3 lg:p-4 flex flex-col gap-2.5 lg:gap-3" style={{ backgroundColor: T.n800 }}>
      <p className="lg:text-base" style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.35, color: T.white, fontFamily: 'var(--font-family)' }}>
        Heute um {Math.floor(currentHour)}:00 Uhr
      </p>

      {/* Mobile: flex-wrap layout */}
      <div className="flex lg:hidden flex-wrap gap-2">
        {weatherStats.map(({ Icon, label, value, showWarning }) => (
          <button
            key={label}
            onClick={() => label === 'UV' && setUvDetailOpen(true)}
            className="flex-1 rounded-[10px] flex items-center gap-2 px-2.5 py-2.5 relative text-left hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: T.n950,
              minWidth: 200,
              cursor: label === 'UV' ? 'pointer' : 'default'
            }}
            disabled={label !== 'UV'}
          >
            <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#E2E8F0' }} strokeWidth={1.5} />
            <div className="flex-1">
              <p className="text-[11px] leading-tight mb-0.5" style={{ color: '#E2E8F0', fontFamily: 'var(--font-family)' }}>{label}</p>
              <p className="text-xs" style={{ color: T.white, fontFamily: 'var(--font-family)', fontWeight: 400 }}>{value}</p>
            </div>
            {showWarning && (
              <div className="absolute bottom-1.5 right-1.5 bg-neutral-100/10 rounded p-0.5">
                <AlertTriangle className="w-3.5 h-3.5" style={{ color: T.n300 }} strokeWidth={2} />
              </div>
            )}
          </button>
        ))}
        <button
          onClick={() => setBeurtDetailOpen(true)}
          className="flex-1 rounded-[10px] flex items-center gap-2 px-2.5 py-2.5 relative text-left hover:opacity-90 transition-opacity"
          style={{ backgroundColor: T.brand, minWidth: 260 }}>
          <Wind className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.6)' }} strokeWidth={1.5} />
          <div className="flex-1">
            <p className="text-[11px] leading-tight mb-0.5" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-family)' }}>Beurteilungstemperatur</p>
            <p className="text-2xl" style={{ lineHeight: 1.2, letterSpacing: '-0.14px', color: T.white, fontFamily: 'var(--font-family)', fontWeight: 600 }}>{status.beurteilungstemperatur}°C</p>
          </div>
          {status.beurteilungstemperatur >= 32 && (
            <div className="absolute bottom-1.5 right-1.5 bg-white/10 rounded p-0.5">
              <AlertTriangle className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.7)' }} strokeWidth={2} />
            </div>
          )}
        </button>
      </div>

      {/* Desktop: grid layout with 2x2 on left, big card on right */}
      <div className="hidden lg:flex gap-2">
        {/* Left: 2x2 grid */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          {weatherStats.map(({ Icon, label, value, showWarning }) => (
            <button
              key={label}
              onClick={() => label === 'UV' && setUvDetailOpen(true)}
              className="rounded-[10px] flex items-center gap-3 px-3 py-4 relative text-left"
              style={{
                backgroundColor: T.n950,
                cursor: label === 'UV' ? 'pointer' : 'default'
              }}
              disabled={label !== 'UV'}
            >
              <Icon className="w-6 h-6 flex-shrink-0" style={{ color: '#E2E8F0' }} strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-tight mb-1" style={{ color: '#E2E8F0', fontFamily: 'var(--font-family)' }}>{label}</p>
                <p className="text-base" style={{ color: T.white, fontFamily: 'var(--font-family)', fontWeight: 400 }}>{value}</p>
              </div>
              {showWarning && (
                <div className="absolute bottom-2 right-2 bg-neutral-100/10 rounded p-1">
                  <AlertTriangle className="w-4 h-4" style={{ color: T.n300 }} strokeWidth={2} />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Right: large Beurteilungstemperatur card */}
        <button
          onClick={() => setBeurtDetailOpen(true)}
          className="rounded-[10px] flex items-center gap-3 px-4 py-4 relative text-left hover:opacity-90 transition-opacity"
          style={{ backgroundColor: T.brand, minWidth: 340, maxWidth: 340 }}>
          <Wind className="w-6 h-6 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.6)' }} strokeWidth={1.5} />
          <div className="flex-1">
            <p className="text-xs leading-tight mb-1" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-family)' }}>Beurteilungstemperatur</p>
            <p className="text-[28px]" style={{ lineHeight: 1.2, letterSpacing: '-0.14px', color: T.white, fontFamily: 'var(--font-family)', fontWeight: 600 }}>{status.beurteilungstemperatur}°C</p>
          </div>
          {status.beurteilungstemperatur >= 32 && (
            <div className="absolute bottom-2 right-2 bg-white/10 rounded p-1">
              <AlertTriangle className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.7)' }} strokeWidth={2} />
            </div>
          )}
        </button>
      </div>
    </div>
  );

  // ── Info accordion ────────────────────────────────────────────────────────

  const InfoAccordion = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="rounded-[16px] overflow-hidden" style={{ backgroundColor: T.n700 }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 lg:px-4 py-3 lg:py-4 hover:opacity-90 transition-opacity"
        >
          <p className="text-xs lg:text-sm" style={{ color: T.white, fontFamily: 'var(--font-family)' }}>
            Wichtige Informationen zur Nutzung der Anwendung
          </p>
          <ChevronDown
            className="w-4 h-4 flex-shrink-0 ml-3 transition-transform"
            style={{ color: T.white, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            strokeWidth={1.5}
          />
        </button>
        {isOpen && (
          <div className="px-3 lg:px-4 pb-3 lg:pb-4">
            <div className="h-px mb-3" style={{ backgroundColor: T.n600 }} />
            <p className="text-xs lg:text-sm leading-relaxed" style={{ color: '#E2E8F0', fontFamily: 'var(--font-family)' }}>
              Diese Anwendung dient zur Information über Arbeitsbedingungen bei verschiedenen Wetterlagen.
              Die angezeigten Werte sind Richtwerte und sollten mit den tatsächlichen Bedingungen vor Ort
              abgeglichen werden. Bei kritischen Situationen kontaktieren Sie bitte Ihre Arbeitsschutzbeauftragten.
            </p>
          </div>
        )}
      </div>
    );
  };

  // ── View toggle ───────────────────────────────────────────────────────────

  const ViewToggle = ({ compact = false }: { compact?: boolean }) => (
    <div className="flex items-center rounded-lg p-0.5" style={{ backgroundColor: T.n100 }}>
      {(['clock', 'list'] as const).map(v => (
        <button key={v} onClick={() => setMobileView(v)}
          className="rounded-md transition-all"
          style={{
            padding: compact ? '4px 10px' : '6px 12px',
            fontSize: compact ? 12 : 14,
            fontFamily: 'var(--font-family)',
            backgroundColor: mobileView === v ? T.n50 : 'transparent',
            color: mobileView === v ? T.n950 : T.n500,
            boxShadow: mobileView === v ? '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)' : 'none',
          }}>
          {v === 'clock' ? 'Uhr' : 'Liste'}
        </button>
      ))}
    </div>
  );

  // ── Day summary ───────────────────────────────────────────────────────────

  const DaySummary = () => {
    const criticalBlocks = timeBlocks.filter(b => b.level >= 4);
    const warningBlocks = timeBlocks.filter(b => b.level === 3);

    return (
      null
    );
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: T.black }}>

      {/* ── DWD WARNING BANNER ─────────────────────────────────────────── */}
      {dwdWarningVisible && (
        <DWDWarningBanner
          level="unwetter"
          onNavigate={onNavigate}
          onDismiss={handleDismissWarning}
        />
      )}

      {/* ── DESKTOP ──────────────────────────────────────────────────────── */}
      <div className="hidden lg:block p-8 pt-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-6">

          {/* Clock card */}
          <div className="col-span-7 row-span-2 bg-card rounded-[24px] shadow-lg p-8 flex flex-col gap-3.5">
            <CardHeader />
            <LocationButton />
            <div className="w-full">
              <div className="flex justify-end mb-1"><ViewToggle /></div>
              {mobileView === 'clock' && (
                <div className="flex justify-center py-1">{makeClockSVG(clockRefDesktop)}</div>
              )}
              {mobileView === 'list' && <ListBlocks />}
            </div>
            <DaySummary />
            <p className="text-center text-xs" style={{ color: T.n500, fontFamily: 'var(--font-family)' }}>
              Griff ziehen um andere Zeiten zu prüfen
            </p>
            <AlertBanner />
          </div>

          {/* Right column */}
          <div className="col-span-5 flex flex-col gap-4">
            <ActionsCard />
            <HazardCard />
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-6 flex flex-col gap-3">
          <WeatherSection />
          <InfoAccordion />
        </div>
      </div>

      {/* ── MOBILE ───────────────────────────────────────────────────────── */}
      <div className="lg:hidden">

        {/* Main card */}
        <div className="px-4 pt-3 pb-3 max-w-xl mx-auto">
          <div className="bg-card rounded-[24px] shadow-lg px-4 pt-3 pb-3 flex flex-col gap-2">
            <CardHeader compact />
            <LocationButton />
            <div className="w-full">
              <div className="flex justify-end mb-1"><ViewToggle compact /></div>
              {mobileView === 'clock' && (
                <div className="flex justify-center mb-3">
                  <div style={{ transform: 'scale(0.88)', transformOrigin: 'top center', marginBottom: `${-(SIZE * 0.12)}px` }}>
                    {makeClockSVG(clockRefMobile)}
                  </div>
                </div>
              )}
              {mobileView === 'list' && <ListBlocks compact />}
            </div>
            <DaySummary />
            <div className="flex items-center justify-center gap-1.5 pb-2">
              <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: T.n500 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
              </svg>
              <p className="text-[11px]" style={{ color: T.n500, fontFamily: 'var(--font-family)' }}>
                Griff ziehen um andere Zeiten zu prüfen
              </p>
            </div>
            <AlertBanner />
          </div>
        </div>

        {/* Weather + cards */}
        <div className="px-4 mb-3 max-w-xl mx-auto flex flex-col gap-3">
          <WeatherSection />
          <ActionsCard />
          <HazardCard />
          <InfoAccordion />
        </div>
      </div>

      {/* ── UNDO TOAST ──────────────────────────────────────────────────── */}
      {showUndoToast && (
        <UndoToast
          message="Warnung ausgeblendet"
          onUndo={handleUndoWarning}
          onDismiss={handleFinalizeToast}
        />
      )}

      {/* ── UV DETAIL VIEW ──────────────────────────────────────────────── */}
      {uvDetailOpen && (
        <UVDetailView onClose={() => setUvDetailOpen(false)} />
      )}

      {/* ── BEURTEILUNGSTEMPERATUR DETAIL VIEW ──────────────────────── */}
      {beurtDetailOpen && (
        <BeurteilungstemperaturDetailView onClose={() => setBeurtDetailOpen(false)} />
      )}
    </div>
  );
}
