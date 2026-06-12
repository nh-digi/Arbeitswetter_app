import { Edit3, AlertTriangle, AlertCircle, CheckCircle, Thermometer, Droplet, Wind, Sun, Wrench, ClipboardList, User, ChevronDown, ChevronRight, RotateCcw, X, Moon } from 'lucide-react';
import { CloudSun, Sun as PhosphorSun, MapPin, Barbell, TShirt, PencilSimple } from '@phosphor-icons/react';
import { useState, useRef, useEffect, type RefObject } from 'react';
import ActionList from './ActionList';
import DWDWarningBanner from './DWDWarningBanner';
import UndoToast from './UndoToast';
import UVDetailView from './UVDetailView';
import BeurteilungstemperaturDetailView from './BeurteilungstemperaturDetailView';

// ── Constants ──────────────────────────────────────────────────────────────────
// Solar-based heat windows (independent of user work schedule)
const CRITICAL_START = 13;
const CRITICAL_END   = 17;

// ── Helpers ───────────────────────────────────────────────────────────────────

const getRealHour = () => {
  const n = new Date();
  return n.getHours() + n.getMinutes() / 60;
};

// Parse "HH:MM" string → decimal hour number
const parseHour = (s: string): number => {
  const [h, m] = s.split(':').map(Number);
  return h + (isNaN(m) ? 0 : m) / 60;
};

const formatHH = (h: number) => {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${hh}:${mm.toString().padStart(2, '0')}`;
};

const WEEKDAYS = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'];
const MONTHS   = ['Jan.', 'Feb.', 'Mär.', 'Apr.', 'Mai', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];
const formatGermanDate = (d: Date) =>
  `${WEEKDAYS[d.getDay()]}, ${d.getDate()}. ${MONTHS[d.getMonth()]}`;

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
  n400:     'var(--neutral-400)',
  n300:     'var(--neutral-300)',
  n200:     'var(--neutral-200)',
  mutedFg:  'var(--muted-foreground)',
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
  strong:       'var(--status-strong)',
  strongBg:     'var(--status-strong-bg)',
  success:      'var(--status-success)',
  successBg:    'var(--status-success-bg)',
  successText:  'var(--status-success-text)',
  iconOk:       'var(--status-icon-ok)',     // muted sage green for Gering icon circle
  // Ring arc color (chart-4 from DS)
  ringWarn: 'var(--chart-4)',
} as const;

// ── Beurteilungstemperatur calculation ───────────────────────────────────────
// Simplified calculation: Lufttemperatur + corrections for work/sun/humidity - wind/shade

function getBeurteilungstemperatur(hour: number, wStart: number, wEnd: number): number {
  const isOvernight = wEnd <= wStart;
  const normH = hour % 24;
  const isWorkHour = isOvernight
    ? (normH >= wStart || normH < wEnd)
    : (hour >= wStart && hour < wEnd);

  // Outside work hours: return ambient air temperature only (no work corrections)
  if (!isWorkHour) {
    if (isOvernight) {
      // Off hours are daytime for overnight workers — use daytime ambient profile
      const dh = normH;
      if (dh >= 13 && dh < 17) return 37;
      if (dh >= 11 && dh < 13) return 34;
      if (dh >= 9  && dh < 11) return 31;
      if (dh >= 8  && dh < 9)  return 27;
      if (dh >= 17 && dh < 18) return 33;
      return Math.round(dh >= 6 ? 22 + (dh - 6) * 1.2 : 22);
    }
    if (hour < wStart) {
      const morning = hour >= 6 ? 22 + (hour - 6) * 1.2 : 22;
      return Math.round(morning);
    }
    const evening = Math.max(28, 37 - (hour - wEnd) * 2);
    return Math.round(evening);
  }

  // Night shift work hours — temperatures are low, no heat stress
  if (isOvernight) return 22;

  const h = hour;

  // Base air temperature — realistic Hitzetag in Germany (DWD-style profile)
  let lufttemp = 25;
  if (h >= 8 && h < 9)  lufttemp = 27;
  if (h >= 9 && h < 11) lufttemp = 31;
  if (h >= 11 && h < 13) lufttemp = 34;
  if (h >= 13 && h < 17) lufttemp = 37;
  if (h >= 17 && h < 18) lufttemp = 33;

  // Correction factors (simplified for prototype)
  const arbeitsschwere = 3;    // +3°C for heavy work
  const sonne = 2;              // +2°C for direct sun exposure
  const feuchtigkeit = 0;       // +0°C — low humidity on a hot day reduces this penalty
  const bekleidung = 1;         // +1°C for work clothing
  const wind = -1;              // -1°C for light wind

  // Apply corrections based on time of day
  let corrections = arbeitsschwere + bekleidung + feuchtigkeit + wind;
  if (h >= 10 && h < 17) corrections += sonne; // Sun correction during midday

  return Math.round(lufttemp + corrections);
}

// ── Status config (4 states) ──────────────────────────────────────────────────

function getStatus(hour: number, wStart: number, wEnd: number) {
  const isOvernight = wEnd <= wStart;
  const normH = hour % 24;
  const isWorkHour = isOvernight
    ? (normH >= wStart || normH < wEnd)
    : (hour >= wStart && hour < wEnd);
  const beurteilungsTemp = getBeurteilungstemperatur(hour, wStart, wEnd);

  // Outside work hours: classify by ambient air temperature
  if (!isWorkHour) {
    let level: number;
    if (beurteilungsTemp >= 33) level = 4;
    else if (beurteilungsTemp >= 29) level = 3;
    else if (beurteilungsTemp >= 25) level = 2;
    else level = 1;

    if (level === 4) return {
      level: 4, label: 'Kritisch',
      badgeBg: T.criticalBg, badgeDot: T.critical, badgeText: T.critical, ringColor: T.critical,
      badgeLabel: `${beurteilungsTemp}°C`,
      beurteilungstemperatur: beurteilungsTemp,
      alertBg: T.black,
      alertIconCircle: T.criticalTint, alertIconColor: T.n600,
      alertTitle: 'Extreme Hitze außerhalb der Arbeitszeit',
      alertBody: 'Extreme Hitze- und UV-Belastung erwartet',
      dotFill: T.critical, labelColor: T.critical, outsideWork: true,
    };
    if (level === 3) return {
      level: 3, label: 'Stark',
      badgeBg: T.strongBg, badgeDot: T.strong, badgeText: T.n950, ringColor: T.strong,
      badgeLabel: `${beurteilungsTemp}°C`,
      beurteilungstemperatur: beurteilungsTemp,
      alertBg: T.black,
      alertIconCircle: T.strong, alertIconColor: T.n600,
      alertTitle: 'Hohe Hitzebelastung außerhalb der Arbeitszeit',
      alertBody: 'Erhöhte Hitze- und UV-Belastung erwartet',
      dotFill: T.strong, labelColor: T.critical, outsideWork: true,
    };
    if (level === 2) return {
      level: 2, label: 'Mäßig',
      badgeBg: T.warningBg, badgeDot: T.warning, badgeText: T.n950, ringColor: T.warning,
      badgeLabel: `${beurteilungsTemp}°C`,
      beurteilungstemperatur: beurteilungsTemp,
      alertBg: T.black,
      alertIconCircle: T.warning, alertIconColor: T.n600,
      alertTitle: 'Mittlere Hitzebelastung außerhalb der Arbeitszeit',
      alertBody: 'Erhöhte Hitze- und UV-Belastung erwartet',
      dotFill: T.warning, labelColor: T.warning, outsideWork: true,
    };
    return {
      level: 1, label: 'Gering',
      badgeBg: T.successBg, badgeDot: T.success, badgeText: T.successText, ringColor: T.n100,
      badgeLabel: `${beurteilungsTemp}°C`,
      beurteilungstemperatur: beurteilungsTemp,
      alertBg: T.black,
      alertIconCircle: T.success, alertIconColor: T.n600,
      alertTitle: 'Angenehme Bedingungen',
      alertBody: 'Keine erhöhte Hitzebelastung erwartet',
      dotFill: T.n100, labelColor: T.success, outsideWork: true,
    };
  }

  const h = hour;

  if (h >= CRITICAL_START && h < CRITICAL_END) return {
    level: 4, label: 'Kritisch',
    badgeBg: T.criticalBg, badgeDot: T.critical, badgeText: T.critical, ringColor: T.critical,
    badgeLabel: `${beurteilungsTemp}°C`,
    beurteilungstemperatur: beurteilungsTemp,
    alertBg: T.black,
    alertIconCircle: T.criticalTint, alertIconColor: T.n600,
    alertTitle: `Warnung für ${CRITICAL_START}:00 bis ${CRITICAL_END}:00`,
    alertBody: 'Extreme Hitze- und UV-Belastung erwartet',
    dotFill: T.critical,
    labelColor: T.critical,
  };
  if ((h >= 11 && h < 13) || (h >= 17 && h < 18)) return {
    level: 3, label: 'Stark',
    badgeBg: T.strongBg, badgeDot: T.strong, badgeText: T.n950, ringColor: T.strong,
    badgeLabel: `${beurteilungsTemp}°C`,
    beurteilungstemperatur: beurteilungsTemp,
    alertBg: T.black,
    alertIconCircle: T.strong, alertIconColor: T.n600,
    alertTitle: `Warnung für 11:00–13:00 und 17:00–18:00`,
    alertBody: 'Erhöhte Hitze- und UV-Belastung erwartet',
    labelColor: T.critical,
  };
  if (h >= 9 && h < 11) return {
    level: 2, label: 'Mäßig',
    badgeBg: T.warningBg, badgeDot: T.warning, badgeText: T.n950, ringColor: T.warning,
    badgeLabel: `${beurteilungsTemp}°C`,
    beurteilungstemperatur: beurteilungsTemp,
    alertBg: T.black,
    alertIconCircle: T.warning, alertIconColor: T.n600,
    alertTitle: `Warnung für 09:00–11:00`,
    alertBody: 'Erhöhte Hitze- und UV-Belastung erwartet',
    dotFill: T.warning,
    labelColor: T.warning,
  };
  return {
    level: 1, label: 'Gering',
badgeBg: T.successBg, badgeDot: T.success, badgeText: T.successText, ringColor: T.n100,
    badgeLabel: `${beurteilungsTemp}°C`,
    beurteilungstemperatur: beurteilungsTemp,
    alertBg: T.black,
    alertIconCircle: T.success, alertIconColor: T.n600,
    alertTitle: `Heute gut planbar`,
    alertBody: 'Angenehme Bedingungen erwartet',
    dotFill: T.n100,
    labelColor: T.success,
  };
}

// ── Status description helper ──────────────────────────────────────────────────
function getStatusDescription(label: string): string {
  if (label === 'Kritisch') return 'Sehr hohe Belastung';
  if (label === 'Stark')    return 'Hohe Belastung';
  if (label === 'Mäßig')   return 'Mittlere Belastung';
  return 'Niedrige Belastung';
}

// ── Day peak helper ─────────────────────────────────────────────────────────────
// Samples every workday hour and returns the hour with the highest stress level.
function getDayPeakHour(wStart: number, wEnd: number): number {
  const isOvernight = wEnd <= wStart;
  const endH = isOvernight ? wEnd + 24 : wEnd;
  let peakLevel = 0;
  let peakHour  = wStart;
  for (let h = Math.floor(wStart); h < endH; h++) {
    const lvl = getStatus(h + 0.5, wStart, wEnd).level;
    if (lvl > peakLevel) { peakLevel = lvl; peakHour = h; }
  }
  return peakHour;
}

// ── Main component ────────────────────────────────────────────────────────────

type View = 'heute' | 'planung' | 'warnung' | 'einstellungen' | 'styleguide';

export default function HeuteView({ onNavigate, activeLocation, workStart, workEnd, schwere, bekleidung, onOpenSettings, onShowStartseite, onShowOnboarding }: {
  onNavigate: (view: View) => void;
  activeLocation?: string | null;
  workStart?: string;
  workEnd?: string;
  schwere?: string;
  bekleidung?: string;
  onOpenSettings?: () => void;
  onShowStartseite?: () => void;
  onShowOnboarding?: () => void;
}) {
  const [realtimeHour, setRealtimeHour]   = useState(getRealHour);
  const [scrubbingHour, setScrubbingHour] = useState<number | null>(() => {
    // Auto-anchor to shift start when the user opens the app before their shift.
    // The view serves the context that matters, not just the clock on the wall.
    const ws  = parseHour(workStart ?? '09:00');
    const we  = parseHour(workEnd   ?? '18:00');
    const now = getRealHour();
    const isOvernightInit = we <= ws;
    const isPreShiftInit  = isOvernightInit
      ? (now >= we && now < ws)   // daytime gap between end and start
      : now < ws;
    return isPreShiftInit ? ws : null;
  });
  const [mobileView, setMobileView]       = useState<'clock' | 'list'>('clock');
  const [dwdWarningVisible, setDwdWarningVisible] = useState(false);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [trayOpen, setTrayOpen]           = useState(false);
  const [uvDetailOpen, setUvDetailOpen] = useState(false);
  const [beurtDetailOpen, setBeurtDetailOpen] = useState(false);
  const [listExpandedIdx, setListExpandedIdx] = useState<number | null>(null);
  const [listOpenActionIdx, setListOpenActionIdx] = useState<number | null>(null);

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

  // Press 'b' to toggle the DWD banner (dev/demo shortcut)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement &&
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.key === 'b' || e.key === 'B') setDwdWarningVisible(v => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const clockRefDesktop = useRef<SVGSVGElement>(null);
  const clockRefMobile  = useRef<SVGSVGElement>(null);
  const isDragging      = useRef(false);
  const returnTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionsCardRef  = useRef<HTMLDivElement>(null);
  const trayRef         = useRef<HTMLDivElement>(null);

  // When the mobile tray opens, scroll it into view so the list is visible.
  useEffect(() => {
    if (trayOpen) {
      setTimeout(() => {
        trayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [trayOpen]);

  // Smooth-scroll the recommendations card into view on mobile after a list selection,
  // so the cause (tapped row) and effect (updated card) are visible together.
  const scrollActionsIntoView = () => {
    if (typeof window === 'undefined' || window.innerWidth >= 1024) return;
    requestAnimationFrame(() => {
      actionsCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  // ── Geometry ────────────────────────────────────────────────────────────────
  // Parse user work-hour settings → decimal hour numbers
  const wStart = parseHour(workStart ?? '09:00');
  const wEnd   = parseHour(workEnd   ?? '18:00');
  const wStartH = Math.round(wStart); // integer hour for clock dot/label snapping
  const wEndH   = Math.round(wEnd);

  const SIZE    = 340;
  const C       = 170;
  const R       = 120;
  const SW      = 28;
  const LABEL_R = R - SW / 2 - 14;
  const PILL_R  = R + SW / 2 + 38;

  // Viewport-aware sizing — read once at render time (CSR-only app)
  // Fill the full card inner width (viewport − outer px-4 × 2 − card px-4 × 2 = 64px),
  // capped at SIZE (340) so the SVG never renders smaller than its design geometry.
  const VIEWPORT_W      = typeof window !== 'undefined' ? window.innerWidth  : 390;
  const VIEWPORT_H      = typeof window !== 'undefined' ? window.innerHeight : 844;
  const isTinyScreen    = VIEWPORT_H < 700; // iPhone SE (667px) and shorter phones
  const mobileClockSize = Math.max(240, Math.min(VIEWPORT_W - 64, SIZE));

  // True clock-face mapping: (h % 12) * 30°  →  8→240°, 12→0°(top), 15→90°(right), 18→180°(bottom)
  const hourToAngle = (h: number) => (h % 12) * 30;

  const polar = (r: number, deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: C + r * Math.cos(rad), y: C + r * Math.sin(rad) };
  };

  const makeArc = (h1: number, h2: number) => {
    const s    = polar(R, hourToAngle(h1));
    const e    = polar(R, hourToAngle(h2));
    // Use modular arithmetic so clockwise span is always positive
    const span = ((hourToAngle(h2) - hourToAngle(h1)) + 360) % 360;
    return `M ${s.x} ${s.y} A ${R} ${R} 0 ${span > 180 ? 1 : 0} 1 ${e.x} ${e.y}`;
  };

  // ── Position → hour via SVG coordinate space ───────────────────────────────
  const calcHour = useRef((_cx: number, _cy: number, _svg: SVGSVGElement): number | null => null);
  calcHour.current = (clientX: number, clientY: number, svg: SVGSVGElement): number | null => {
    const rect   = svg.getBoundingClientRect();
    const vb     = svg.viewBox.baseVal;
    const scaleX = vb.width  / rect.width;
    const scaleY = vb.height / rect.height;
    const svgX   = (clientX - rect.left) * scaleX;
    const svgY   = (clientY - rect.top)  * scaleY;
    const dx     = svgX - C;
    const dy     = svgY - C;
    let deg      = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (deg < 0) deg += 360;
    // Generic mapping: measure clockwise offset from the shift-start angle,
    // then add to wStartH. Works for any shift including overnight.
    const startAngle = (wStartH % 12) * 30;
    const offset     = ((deg - startAngle) + 360) % 360;
    return wStartH + offset / 30;
  };

  // ── Real-time tick ─────────────────────────────────────────────────────────
  useEffect(() => {
    const tick = setInterval(() => setRealtimeHour(getRealHour()), 30_000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') setRealtimeHour(getRealHour());
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(tick);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  // ── Ref to track current handle SVG position for hit-testing in native listeners ──
  const handlePosRef = useRef({ x: 0, y: 0 });

  // ── Native drag listeners ──────────────────────────────────────────────────
  function attachDrag(svg: SVGSVGElement) {
    const onDown = (e: PointerEvent) => {
      // Only start drag when touch is near the draggable handle (allows scroll elsewhere)
      const rect   = svg.getBoundingClientRect();
      const vb     = svg.viewBox.baseVal;
      const scaleX = vb.width  / rect.width;
      const scaleY = vb.height / rect.height;
      const svgX   = (e.clientX - rect.left) * scaleX;
      const svgY   = (e.clientY - rect.top)  * scaleY;
      const { x: hx, y: hy } = handlePosRef.current;
      const dist = Math.hypot(svgX - hx, svgY - hy);
      const hitRadius = e.pointerType === 'touch' ? 70 : 50;
      if (dist > hitRadius) return; // Not near handle – let browser scroll
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

  // Reset handle position whenever the shift changes (e.g. switching from Nacht → Früh in onboarding).
  useEffect(() => {
    const isOvernightNew  = wEnd <= wStart;
    const isPreShiftNew   = isOvernightNew
      ? (realtimeHour >= wEnd && realtimeHour < wStart)
      : realtimeHour < wStart;
    setScrubbingHour(isPreShiftNew ? wStart : null);
  // workStart / workEnd prop strings are the stable dependency; wStart/wEnd are derived floats
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workStart, workEnd]);

  const dayPeakHour     = getDayPeakHour(wStart, wEnd);
  const dayPeakStatus   = getStatus(dayPeakHour, wStart, wEnd);
  const isOvernightShift = wEnd <= wStart;
  const isOutsideWork   = isOvernightShift
    ? !(realtimeHour >= wStart || realtimeHour < wEnd)
    : (realtimeHour < wStart || realtimeHour >= wEnd);
  // Before shift starts today: the user is a planner previewing upcoming conditions.
  const isPreShift = isOvernightShift
    ? (realtimeHour >= wEnd && realtimeHour < wStart)
    : realtimeHour < wStart;
  // Show actual real-time position even outside work hours; scrubbing always takes priority.
  const currentHour   = scrubbingHour !== null ? scrubbingHour : realtimeHour;
  const status        = getStatus(currentHour, wStart, wEnd);

  // ── Derived handle position ────────────────────────────────────────────────
  // When outside work hours (past Feierabend, not scrubbing), keep the handle
  // within the grey arc so it agrees visually with the status text level.
  // The 12h clock would otherwise wrap 18:xx → the 6:xx AM morning position
  // (on the green arc), creating a contradiction with an outside-work status.
  const handleAngle = (() => {
    if (scrubbingHour === null && realtimeHour >= wEnd) {
      const greyStartAngle = hourToAngle(wEndH);             // angle at Feierabend
      const greyEndAngle   = hourToAngle(wStartH);           // angle at Start (= 12h later)
      const greySpan       = ((greyEndAngle - greyStartAngle) + 360) % 360 || 360;
      const greyHours      = isOvernightShift ? (wStartH - wEndH) : (wStartH + 12 - wEndH);   // hours in grey arc
      const progress       = Math.min((realtimeHour - wEnd) / greyHours, 0.98);
      return greyStartAngle + progress * greySpan;
    }
    return hourToAngle(currentHour);
  })();
  const handlePos = polar(R, handleAngle);
  handlePosRef.current = handlePos; // keep ref in sync for native drag hit-test

  // Warn segments: dynamically derived for all visible clock hours (9–20),
  // including off-hours evening based on ambient temperature.
  const warnSegments = (() => {
    const segs: { h1: number; h2: number; color: string }[] = [];
    for (let h = wStartH; h < wStartH + 12; h++) {
      const color = getStatus(h + 0.5, wStart, wEnd).ringColor;
      if (!color) continue;
      const last = segs[segs.length - 1];
      if (last && last.color === color && last.h2 === h) {
        last.h2 = h + 1;
      } else {
        segs.push({ h1: h, h2: h + 1, color });
      }
    }
    return segs;
  })();

  // ── Inlined SVG clock ──────────────────────────────────────────────────────
  // Scales fluidly: caller wraps in a container with width + aspect-ratio.
  // viewBox stays at 340×340 so all internal coordinates are stable.
  const makeClockSVG = (ref: RefObject<SVGSVGElement | null>) => (
    <svg
      ref={ref}
      width="100%" height="100%"
      viewBox={`0 19 ${SIZE} ${SIZE}`}
      className="select-none overflow-visible"
      style={{ display: 'block', touchAction: 'none' }}
    >
      {/* Full 360° background ring */}
      <circle cx={C} cy={C} r={R} fill="none" stroke={T.n100} strokeWidth={SW} />

      {/* Stress-zone arcs (work-hour profile) */}
      {warnSegments.map(({ h1, h2, color }) => (
        <path key={h1} d={makeArc(h1, h2)} fill="none"
          stroke={color} strokeWidth={SW} strokeLinecap="round" />
      ))}

      {/* Clockwise direction arrowhead — sits on the arc just past "Start" */}
      {(() => {
        const arrowDeg = hourToAngle(wStartH) + 14;
        const arrowRad = ((arrowDeg - 90) * Math.PI) / 180;
        const ax  = C + R * Math.cos(arrowRad);
        const ay  = C + R * Math.sin(arrowRad);
        const tx  = -Math.sin(arrowRad);  // clockwise tangent x
        const ty  =  Math.cos(arrowRad);  // clockwise tangent y
        const lx  = -ty;                  // left-perpendicular x
        const ly  =  tx;                  // left-perpendicular y
        const half = 8, W = 6, indent = 3;
        // 5-point concave arrowhead: tip → right wing → tail notch → left wing
        const tip   = `${ax + tx * half},${ay + ty * half}`;
        const rWing = `${ax - tx * half + lx * W},${ay - ty * half + ly * W}`;
        const tail  = `${ax + tx * (indent - half)},${ay + ty * (indent - half)}`;
        const lWing = `${ax - tx * half - lx * W},${ay - ty * half - ly * W}`;
        return (
          <polygon
            points={`${tip} ${rWing} ${tail} ${lWing}`}
            fill={T.n800}
            opacity={0.55}
            style={{ pointerEvents: 'none' }}
          />
        );
      })()}

      {/* All 12 clock positions (9→8 in 12h format) */}
      {Array.from({ length: 12 }, (_, i) => wStartH + i).map(h => {
        const angle   = hourToAngle(h);
        const display = h % 24;  // 24h format — unambiguous for all shifts

        if (h === wStartH) {
          const dotPos    = polar(R, angle);
          const numPos    = polar(LABEL_R, angle);
          const pillDist  = R + SW / 2 + 28;
          const pillC     = polar(pillDist, angle);
          const lineStart = polar(R + SW / 2 + 2, angle);
          const pillW = 94, pillH = 20;
          return (
            <g key={h} style={{ pointerEvents: 'none' }}>
              <line x1={lineStart.x} y1={lineStart.y} x2={pillC.x} y2={pillC.y}
                stroke={T.n300} strokeWidth={1.5} />
              <circle cx={dotPos.x} cy={dotPos.y} r={5} fill={T.n800} />
              <text x={numPos.x} y={numPos.y} textAnchor="middle" dominantBaseline="middle"
                fill={T.n800}
                style={{ fontSize: '10px', fontWeight: 600, fontFamily: 'var(--font-family)' }}>
                {display}
              </text>
              <rect x={pillC.x - pillW / 2} y={pillC.y - pillH / 2}
                width={pillW} height={pillH} rx={pillH / 2}
                fill={T.n800} />
              <text x={pillC.x} y={pillC.y} textAnchor="middle" dominantBaseline="middle"
                fill={T.white}
                style={{ fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-family)' }}>
                Arbeitsbeginn
              </text>
            </g>
          );
        }

        if (h % 24 === wEndH) {
          const dotPos    = polar(R, angle);
          const numPos    = polar(LABEL_R, angle);
          const pillDist  = R + SW / 2 + 28;
          const pillC     = polar(pillDist, angle);
          const lineStart = polar(R + SW / 2 + 2, angle);
          const pillW = 82, pillH = 20;
          return (
            <g key={h} style={{ pointerEvents: 'none' }}>
              <line x1={lineStart.x} y1={lineStart.y} x2={pillC.x} y2={pillC.y}
                stroke={T.n300} strokeWidth={1.5} />
              <circle cx={dotPos.x} cy={dotPos.y} r={5} fill={T.n800} />
              <text x={numPos.x} y={numPos.y} textAnchor="middle" dominantBaseline="middle"
                fill={T.n800}
                style={{ fontSize: '10px', fontWeight: 600, fontFamily: 'var(--font-family)' }}>
                {display}
              </text>
              <rect x={pillC.x - pillW / 2} y={pillC.y - pillH / 2}
                width={pillW} height={pillH} rx={pillH / 2}
                fill={T.n800} />
              <text x={pillC.x} y={pillC.y} textAnchor="middle" dominantBaseline="middle"
                fill={T.white}
                style={{ fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-family)' }}>
                Feierabend
              </text>
            </g>
          );
        }

        const pos = polar(LABEL_R, angle);
        return (
          <text key={h} x={pos.x} y={pos.y}
            textAnchor="middle" dominantBaseline="middle"
            fill={T.n500}
            style={{ fontSize: '12px', fontWeight: 400, pointerEvents: 'none', fontFamily: 'var(--font-family)' }}>
            {display}
          </text>
        );
      })}

      {/* Center: time — HH:MM, 32 px semi-bold */}
      <text x={C} y={C - 23} textAnchor="middle" dominantBaseline="middle"
        fill={T.n950}
        style={{ fontSize: '32px', fontWeight: 600, pointerEvents: 'none', fontFamily: 'var(--font-family)', fontVariantNumeric: 'tabular-nums' }}>
        {formatHH(currentHour % 24)}
      </text>

      {/* Center: status label — 18 px semi-bold, always dark */}
      <text x={C} y={C + 6} textAnchor="middle" dominantBaseline="middle"
        fill={T.n950}
        style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.3px', pointerEvents: 'none', fontFamily: 'var(--font-family)' }}>
        {status.label}
      </text>

      {/* Center: description — 14 px regular — shows factors when available */}
      <text x={C} y={C + 28} textAnchor="middle" dominantBaseline="middle"
        fill={T.mutedFg}
        style={{ fontSize: '14px', fontWeight: 400, pointerEvents: 'none', fontFamily: 'var(--font-family)' }}>
        {(() => {
          const factors = getFactors();
          if (factors.length === 0) return getStatusDescription(status.label);
          const text = factors.map(f => FACTOR_LABEL_MAP[f]).join(', ');
          return text.length > 14 ? text.substring(0, 13) + '…' : text;
        })()}
      </text>

      {/* Drag handle — plain white circle, no icon */}
      <circle cx={handlePos.x} cy={handlePos.y} r={14}
        fill={T.white} stroke={T.n800} strokeWidth={2.5}
        style={{ cursor: 'grab', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))', touchAction: 'none' }}
      />
    </svg>
  );

  // ── Alert Banner ──────────────────────────────────────────────────────────

  const AlertBanner = ({ mobile = false }: { mobile?: boolean }) => {
    const items = getActionItems();
    const icon = status.level <= 1
      ? <CheckCircle className="w-3.5 lg:w-5 h-3.5 lg:h-5" style={{ color: T.black }} strokeWidth={2} />
      : status.level === 2
        ? <span style={{ fontSize: 14, fontWeight: 700, color: T.black, fontFamily: 'var(--font-family)', lineHeight: 1 }} className="lg:text-lg">i</span>
        : status.level === 3
          ? <AlertCircle className="w-3.5 lg:w-5 h-3.5 lg:h-5" style={{ color: T.black }} strokeWidth={2} />
          : <AlertTriangle className="w-3.5 lg:w-5 h-3.5 lg:h-5" style={{ color: T.black }} strokeWidth={2} />;
    return (
      <div
        className={`overflow-hidden${mobile ? '' : ' rounded-2xl flex items-center gap-2.5 lg:gap-4 p-2.5 lg:p-4'}`}
        style={{ backgroundColor: status.alertBg, minHeight: mobile ? undefined : '60px' }}
      >
        {/* Status row */}
        <div className={`flex items-center gap-2.5${mobile ? ' px-3 pt-3 pb-2.5' : ''}`}>
          <div className="flex items-center justify-center flex-shrink-0 rounded-3xl w-8 h-8 lg:w-12 lg:h-12"
            style={{ backgroundColor: status.alertIconCircle }}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="leading-snug mb-0.5 lg:mb-1"
              style={{ fontSize: mobile ? 16 : 'var(--type-size-body)', lineHeight: mobile ? 1.35 : 'var(--type-body-lh)', fontWeight: 600, fontFamily: 'var(--font-family)', color: T.white }}>
              {isPreShift && scrubbingHour !== null && Math.abs(scrubbingHour - wStart) < 0.25
                ? `Schichtbeginn, ${formatHH(wStart)} Uhr`
                : scrubbingHour !== null
                  ? status.alertTitle
                  : `Jetzt, ${formatHH(realtimeHour)} Uhr`}
            </p>
            <p className="leading-snug"
              style={{ fontSize: mobile ? 15 : 'var(--type-size-body)', lineHeight: mobile ? 1.4 : 'var(--type-body-lh)', fontFamily: 'var(--font-family)', color: T.n100 }}>
              {status.alertBody}
            </p>
          </div>
        </div>

        {/* Mobile: accordion row embedded inside banner */}
        {mobile && status.level >= 2 && (
          <>
            <div style={{ height: 1, margin: '0 12px', backgroundColor: 'rgba(255,255,255,0.12)' }} />
            <button
              onClick={() => setTrayOpen(o => !o)}
              className="flex items-center justify-between w-full px-3 py-2.5 transition-opacity active:opacity-60"
            >
              <span style={{ fontSize: 15, fontWeight: 400, color: T.n100, fontFamily: 'var(--font-family)' }}>
                Empfehlungen · {status.label}
              </span>
              <div className="flex items-center gap-1.5">
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 22, height: 22, borderRadius: '50%',
                  backgroundColor:
                    status.level >= 4 ? T.criticalTint
                    : status.level >= 3 ? T.strong
                    : status.level >= 2 ? T.warning
                    : T.success,
                  fontSize: 12, fontWeight: 700,
                  color: status.level === 1 ? T.white : T.black,
                  fontFamily: 'var(--font-family)',
                  flexShrink: 0,
                }}>
                  {items.length}
                </span>
                <ChevronDown
                  size={14}
                  strokeWidth={2}
                  style={{ color: T.n300, flexShrink: 0, transition: 'transform 0.2s', transform: trayOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </div>
            </button>
            {trayOpen && (
              <div ref={trayRef} className="pb-3 animate-slide-up">
                <ActionsCard dark />
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // ── Card Header ───────────────────────────────────────────────────────────

  const CardHeader = ({ compact = false, tiny = false }: { compact?: boolean; tiny?: boolean }) => {
    // Header always reflects the whole day (peak), never the scrubbed hour.
    const dayLabel = dayPeakStatus.level >= 4
      ? 'Heute Kritische Belastung'
      : dayPeakStatus.level >= 3
        ? 'Heute Starke Belastung'
        : dayPeakStatus.level >= 2
          ? 'Heute Mäßige Belastung'
          : 'Heute Geringe Belastung';

    return (
      <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: tiny ? 2 : compact ? 5 : 7 }}>

        {/* Row 0: weather icon + date · time (left) · ViewToggle on right when compact */}
        {(() => {
          const now = new Date();
          const h = now.getHours() + now.getMinutes() / 60;
          const WeatherIcon = h >= 9 && h < 17 ? PhosphorSun : CloudSun;
          return (
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5">
                <WeatherIcon size={compact ? 13 : 14} weight="regular" color={T.mutedFg} />
                <span style={{ fontSize: 13, color: T.mutedFg, fontFamily: 'var(--font-family)', letterSpacing: '0.01em' }}>
                  {`${formatGermanDate(now)} · ${formatHH(h)} Uhr`}
                </span>
              </div>
              <ViewToggle compact={compact} />
            </div>
          );
        })()}

        {/* Row 1: day-level headline */}
        <div className="flex items-center gap-2">
          {compact ? (
            <h1 style={{
              fontSize: tiny ? 16 : 18,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.3px',
              color: T.n950,
              fontFamily: 'var(--font-family)',
              margin: 0,
            }}>
              {dayLabel}
            </h1>
          ) : (
            <h1 style={{
              fontSize: 20,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.3px',
              color: T.n950,
              fontFamily: 'var(--font-family)',
              margin: 0,
              whiteSpace: 'nowrap',
            }}>
              {dayLabel}
            </h1>
          )}
        </div>

        {/* Row 2: peak temp badge + Außer Dienst badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ backgroundColor: dayPeakStatus.badgeBg }}>
            <span style={{ fontSize: compact ? 13 : 14, fontWeight: 700, color: dayPeakStatus.badgeText, fontFamily: 'var(--font-family)' }}>
              {dayPeakStatus.beurteilungstemperatur}°C max.
            </span>
          </div>
          {isOutsideWork && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0"
              style={{ backgroundColor: 'var(--brand-tint)' }}>
              <Moon
                style={{ color: T.brand, flexShrink: 0 }}
                className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'}
                strokeWidth={1.75}
              />
              <span style={{ fontSize: compact ? 12 : 13, fontWeight: 600, color: T.brand, fontFamily: 'var(--font-family)' }}>
                Feierabend
              </span>
            </div>
          )}
        </div>

        {/* Row 3: settings — pill button matching Planung LocationButton */}
        <button
          onClick={() => onOpenSettings ? onOpenSettings() : onNavigate('einstellungen')}
          className="inline-flex items-center transition-opacity hover:opacity-80 cursor-pointer
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
          style={{ padding: 0, background: 'none', border: 'none', alignSelf: 'center' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'stretch', border: '1px solid var(--border-soft)', borderRadius: 999, overflow: 'hidden', color: 'var(--muted-foreground)', fontSize: 'var(--type-size-body-sm)', fontFamily: 'var(--font-family)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', whiteSpace: 'nowrap' }}>
              <MapPin size={16} weight="regular" />
              {activeLocation ?? 'Kein Standort'}
            </span>
            {schwere && (<>
              <span style={{ width: 1, background: 'var(--border-soft)', alignSelf: 'stretch' }} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', whiteSpace: 'nowrap' }}>
                <Barbell size={16} weight="regular" />
                {schwere}
              </span>
            </>)}
            {bekleidung && (<>
              <span style={{ width: 1, background: 'var(--border-soft)', alignSelf: 'stretch' }} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', whiteSpace: 'nowrap' }}>
                <TShirt size={16} weight="regular" />
                {bekleidung}
              </span>
            </>)}
            <span style={{ width: 1, background: 'var(--border-soft)', alignSelf: 'stretch' }} />
            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 9px' }}>
              <PencilSimple size={16} weight="regular" />
            </span>
          </div>
        </button>
      </div>
    );
  };

  // ── Location context button ───────────────────────────────────────────────

  const LocationButton = () => (
    <button
      onClick={() => onOpenSettings ? onOpenSettings() : onNavigate('einstellungen')}
      className="inline-flex items-center gap-1.5 w-full rounded-2xl transition-all duration-200 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background overflow-hidden lg:min-h-[52px]"
      style={{
        backgroundColor: 'var(--muted)',
        padding: '8px 12px'
      }}
    >
      <Edit3 className="w-3 lg:w-4 h-3 lg:h-4 flex-shrink-0 transition-colors" style={{ color: 'var(--muted-foreground)' }} strokeWidth={1.5} />
      <span className="truncate" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
        {activeLocation ?? 'Kein Standort'}{schwere ? ` · ${schwere}` : ''}{bekleidung ? ` · ${bekleidung}` : ''}
      </span>
    </button>
  );

  // ── Time-block list ───────────────────────────────────────────────────────

  // Dynamic timeBlocks — derived from actual work hours so overnight shifts work correctly.
  // Post-midnight hours in overnight shifts are stored as h+24 (e.g. 1am = 25) so that
  // numeric comparisons remain monotonically increasing within the shift window.
  const timeBlocks = (() => {
    const fmtH   = (h: number) => `${String(h % 24).padStart(2, '0')}:00`;
    const lvlLbl = (l: number) => l >= 4 ? 'Kritisch' : l >= 3 ? 'Stark' : l >= 2 ? 'Mäßig' : 'Gering';
    const lvlSub = (l: number) => l >= 4 ? 'Sehr hohe Belastung' : l >= 3 ? 'Hohe Belastung' : l >= 2 ? 'Mittlere Belastung' : 'Geringe Belastung';
    const hours: number[] = [];
    if (isOvernightShift) {
      for (let h = wStartH; h < 24; h++) hours.push(h);
      for (let h = 0; h < wEndH; h++) hours.push(h + 24); // post-midnight as h+24
    } else {
      for (let h = wStartH; h < wEndH; h++) hours.push(h);
    }
    const blocks: { start: string; end: string; startH: number; label: string; sublabel: string; level: number }[] = [];
    if (!hours.length) return blocks;
    let segH   = hours[0];
    let segLvl = getStatus(segH + 0.5, wStart, wEnd).level;
    for (let i = 1; i <= hours.length; i++) {
      const isLast  = i === hours.length;
      const endH    = isLast ? (isOvernightShift ? wEndH + 24 : wEndH) : hours[i];
      const nextLvl = isLast ? -1 : getStatus(hours[i] + 0.5, wStart, wEnd).level;
      if (nextLvl !== segLvl || isLast) {
        blocks.push({ start: fmtH(segH), end: fmtH(endH), startH: segH, label: lvlLbl(segLvl), sublabel: lvlSub(segLvl), level: segLvl });
        segH   = isLast ? endH : hours[i];
        segLvl = nextLvl;
      }
    }
    return blocks;
  })();

  // Normalize a clock hour into shift-relative space for block boundary comparisons.
  // Post-midnight hours are represented as h+24 so comparisons stay monotonic.
  const normForBlocks = (h: number): number =>
    isOvernightShift && h < wStart ? h + 24 : h;

  // Block index that matches realtime (the "Jetzt" row) — independent of selection.
  const nowIdx = isOutsideWork
    ? -1
    : timeBlocks.findIndex((b, i) => {
        const nh    = normForBlocks(realtimeHour);
        const nextH = timeBlocks[i + 1]?.startH ?? (isOvernightShift ? wEndH + 24 : wEndH);
        return nh >= b.startH && nh < nextH;
      });

  // Block index that matches the currently selected hour (drives the recommendations).
  const activeBlockIdx = timeBlocks.findIndex((b, i) => {
    const nh    = normForBlocks(currentHour);
    const nextH = timeBlocks[i + 1]?.startH ?? (isOvernightShift ? wEndH + 24 : wEndH);
    return nh >= b.startH && nh < nextH;
  });
  const activeBlock = activeBlockIdx >= 0 ? timeBlocks[activeBlockIdx] : null;

  const ListBlocks = ({ compact = false }: { compact?: boolean }) => {
    return (
      <div className={compact ? 'mb-3' : 'mb-6'}>
        {timeBlocks.map((block, i) => {
          const origIdx    = timeBlocks.indexOf(block);
          const isActive   = origIdx === activeBlockIdx;
          const isNow      = origIdx === nowIdx;
          const isSingle   = timeBlocks.length === 1;
          const isExpanded = compact && (listExpandedIdx === origIdx || isSingle);

          const getActionsForLevel = (level: number) => {
            if (level >= 4) return ACTIONS_L4;
            if (level >= 3) return ACTIONS_L3;
            if (level >= 2) return ACTIONS_L2;
            return ACTIONS_L1;
          };

          return (
            <div key={origIdx}>
              <button
                onClick={() => {
                  if (returnTimer.current) clearTimeout(returnTimer.current);
                  setScrubbingHour(block.startH);
                  if (compact) {
                    if (listExpandedIdx === origIdx) {
                      setListExpandedIdx(null);
                    } else {
                      setListExpandedIdx(origIdx);
                      setListOpenActionIdx(null);
                    }
                  } else {
                    scrollActionsIntoView();
                  }
                }}
                aria-pressed={isActive}
                aria-expanded={compact ? isExpanded : undefined}
                className="w-full flex items-center gap-3 px-2 py-2.5 min-h-[48px] text-left rounded-xl transition-colors hover:bg-muted"
                style={{
                  backgroundColor: isActive ? 'var(--muted)' : 'transparent',
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="tabular-nums" style={{ fontSize: 'var(--type-size-body)', fontWeight: 500, color: T.n800, fontFamily: 'var(--font-family)' }}>
                      {block.start} – {block.end}
                    </p>
                    {isNow && (
                      <span className="inline-flex items-center px-1.5 py-px rounded-full"
                        style={{ backgroundColor: T.n100, color: T.n800, fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-family)', lineHeight: 1.4 }}>
                        Jetzt
                      </span>
                    )}
                  </div>
                  {block.level >= 2 && (
                    <p className="leading-tight"
                      style={{
                        fontSize: 'var(--type-size-body)',
                        fontWeight: isActive ? 600 : block.level >= 3 ? 600 : 500,
                        color: T.n950,
                        fontFamily: 'var(--font-family)',
                      }}>
                      {block.label}
                    </p>
                  )}
                  {block.level >= 2 && (
                    <p className="mt-0.5" style={{ fontSize: 'var(--type-size-body-sm)', color: T.n500, fontFamily: 'var(--font-family)' }}>{block.sublabel}</p>
                  )}
                </div>

                <div className="flex items-center justify-center flex-shrink-0 rounded-full"
                  style={{ width: 28, height: 28, backgroundColor:
                    block.level >= 4 ? T.criticalTint
                    : block.level >= 3 ? T.strong
                    : block.level >= 2 ? T.warning
                    : T.iconOk }}>
                  {block.level >= 4
                    ? <AlertTriangle className="w-3.5 h-3.5" style={{ color: T.black }} strokeWidth={2.5} />
                    : block.level >= 3
                      ? <AlertCircle className="w-3.5 h-3.5" style={{ color: T.black }} strokeWidth={2.5} />
                      : block.level >= 2
                        ? <span style={{ fontSize: 13, fontWeight: 700, color: T.black, fontFamily: 'var(--font-family)', lineHeight: 1 }}>i</span>
                        : <CheckCircle className="w-3.5 h-3.5" style={{ color: T.black }} strokeWidth={2.5} />
                  }
                </div>

                {compact && !isSingle && (
                  <ChevronDown
                    className="flex-shrink-0 transition-transform"
                    style={{ color: isActive ? T.n600 : T.n300, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    strokeWidth={1.5}
                    size={16}
                  />
                )}
                {!compact && !isSingle && (
                  <ChevronRight
                    className="flex-shrink-0"
                    style={{ color: isActive ? T.n600 : T.n300 }}
                    strokeWidth={1.5}
                    size={16}
                  />
                )}
              </button>

              {isExpanded && (
                <div className="mx-1 mb-2 rounded-xl overflow-hidden" style={{ backgroundColor: T.n50 }}>
                  <div className="px-3 pt-2 pb-1">
                    {getActionsForLevel(block.level).map((item, j) => {
                      const Icon = CATEGORY_ICON[item.cat];
                      const isActionOpen = listOpenActionIdx === j;
                      return (
                        <div key={j} className={j > 0 ? 'border-t' : ''} style={{ borderColor: T.n100 }}>
                          {isSingle ? (
                            <div className="flex items-center gap-2.5 py-2 min-h-[44px]">
                              <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                                style={{ width: 24, height: 24, backgroundColor: T.n100 }}>
                                <Icon className="w-3 h-3" style={{ color: T.n600 }} strokeWidth={1.5} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm leading-snug" style={{ color: T.n950, fontFamily: 'var(--font-family)', fontWeight: 400 }}>{item.short}</p>
                                <p className="text-sm leading-relaxed mt-0.5" style={{ color: T.n600, fontFamily: 'var(--font-family)' }}>{item.long}</p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setListOpenActionIdx(isActionOpen ? null : j);
                                }}
                                className="w-full flex items-center gap-2.5 py-2 text-left min-h-[44px] transition-opacity hover:opacity-75"
                              >
                                <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                                  style={{ width: 24, height: 24, backgroundColor: T.n100 }}>
                                  <Icon className="w-3 h-3" style={{ color: T.n600 }} strokeWidth={1.5} />
                                </div>
                                <p className="flex-1 text-sm leading-snug" style={{ color: T.n950, fontFamily: 'var(--font-family)', fontWeight: 400 }}>{item.short}</p>
                                <ChevronDown
                                  className="w-3.5 h-3.5 flex-shrink-0 transition-transform"
                                  style={{ color: T.n400, transform: isActionOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                  strokeWidth={1.5}
                                />
                              </button>
                              {isActionOpen && (
                                <p className="text-sm leading-relaxed pb-2" style={{ color: T.n600, fontFamily: 'var(--font-family)' }}>
                                  {item.long}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ── Actions data ──────────────────────────────────────────────────────────
  // Order within each level: technisch → organisatorisch → personenbezogen
  const CATEGORY_ICON = { technisch: Wrench, organisatorisch: ClipboardList, personenbezogen: User } as const;

  const ACTIONS_L2 = [
    { cat: 'technisch'       as const, short: 'Sonnenschutz aufstellen',           long: 'Aufstellen von Sonnensegeln, Überdachungen oder provisorischen Abschirmwänden direkt über dem Arbeitsplatz.' },
    { cat: 'technisch'       as const, short: 'Lüftung / Ventilatoren nutzen',     long: 'Einsatz von Ventilatoren zur Durchlüftung, um die Schweißverdunstung zu unterstützen.' },
    { cat: 'organisatorisch' as const, short: 'Getränke bereitstellen',            long: 'Kostenfreie Bereitstellung von geeignetem Mineralwasser oder abgekühlten Tees in ausreichender Menge.' },
    { cat: 'organisatorisch' as const, short: 'Arbeitstempo flexibilisieren',      long: 'Erlaubnis und Ermöglichung einer selbstständigen, verantwortungsvollen Anpassung von Arbeitsschwere und Arbeitstempo.' },
    { cat: 'personenbezogen' as const, short: 'Viel trinken',                      long: 'Regelmäßig kleine Mengen trinken – als Orientierung gilt etwa ein Glas (100–150 ml) alle 15 bis 30 Minuten.' },
    { cat: 'personenbezogen' as const, short: 'Luftige Kleidung & Kopfbedeckung', long: 'Tragen von atmungsaktiver, heller Kleidung und Kopfbedeckung. Vorgeschriebene Schutzkleidung muss getragen werden, aber die Isolation darunter sollte reduziert werden.' },
  ];

  const ACTIONS_L3 = [
    { cat: 'technisch'       as const, short: 'Kühlung verstärken',                long: 'Aktivierung von Wasserservern, Luftduschen oder mobilen Kühlgeräten im betroffenen Arbeitsbereich.' },
    { cat: 'technisch'       as const, short: 'Sonnenschutz intensivieren',        long: 'Zwingende Intensivierung und lückenlose Umsetzung aller Verschattungsmaßnahmen aus Stufe 2.' },
    { cat: 'organisatorisch' as const, short: 'Schwere Arbeit in kühlere Stunden', long: 'Verlegung schwerer körperlicher Arbeiten in die kühleren Morgen- oder Abendstunden (z. B. durch Gleitzeit oder Schichtverlegung).' },
    { cat: 'organisatorisch' as const, short: 'Entwärmungspausen einführen',       long: 'Einplanung zusätzlicher Tätigkeitsunterbrechungen und passiver Entwärmungsphasen. Viele kurze Pausen sind effektiver als wenige lange.' },
    { cat: 'personenbezogen' as const, short: 'Pausen im Schatten verbringen',     long: 'Ruhepausen dürfen nicht am aufgeheizten Arbeitsplatz verbracht werden, sondern in schattigen oder extra gekühlten Bereichen.' },
    { cat: 'personenbezogen' as const, short: 'Kollegen aktiv im Blick behalten',  long: 'Gegenseitige Beobachtung der Beschäftigten auf erste Anzeichen von Hitzeerkrankungen (Schwindel, Erschöpfung, Sonnenstich).' },
  ];

  const ACTIONS_L4 = [
    { cat: 'technisch'       as const, short: 'Heiße Oberflächen abschirmen',               long: 'Vermeidung zusätzlicher Lasten durch Kühlung heißer Maschinenoberflächen oder Ableitung heißer Luft.' },
    { cat: 'technisch'       as const, short: 'In Fahrzeugen: klimatisierte Kabinen nutzen', long: 'Nutzung von klimatisierten Fahrzeugkabinen, Kranführerkabinen oder geschlossenen Steuerständen.' },
    { cat: 'organisatorisch' as const, short: "Arbeit als 'Hitzearbeit' behandeln",          long: 'Die Arbeit muss als Hitzearbeit betrachtet werden. Die Expositionszeit der Mitarbeiter wird strikt zeitlich begrenzt.' },
    { cat: 'organisatorisch' as const, short: 'Rotationspläne einführen',                   long: 'Prüfung einer Aussetzung oder Anpassung von Leistungslohn- und Akkordsystemen, um Überanstrengung zu verhindern. Organisation von Arbeitsplatzrotation.' },
    { cat: 'personenbezogen' as const, short: 'Kühlende Kleidung / PSA nutzen',             long: 'Einsatz von aktiv kühlenden Maßnahmen wie Kühlwesten oder Belüftungssystemen mit gekühlter Luft bei geschlossenen Schutzanzügen.' },
    { cat: 'personenbezogen' as const, short: 'Bei Notfällen: Erste Hilfe leisten',         long: 'Sofortige Umsetzung von Erste-Hilfe-Maßnahmen bei Hitzeerkrankungen (Lagerung im Schatten, feuchte Tücher, Rettungsdienst alarmieren).' },
    { cat: 'personenbezogen' as const, short: 'Schwere Arbeit in der Sonne nach Möglichkeit vermeiden', long: 'Bei kritischer Hitzebelastung sollte schwere körperliche Arbeit in direkter Sonneneinstrahlung nach Möglichkeit vermieden oder auf kühlere Tageszeiten (früher Morgen, später Abend) verlagert werden.' },
  ];

  const ACTIONS_L1 = [
    { cat: 'organisatorisch' as const, short: 'Normale Arbeitsplanung möglich',    long: 'Keine besonderen Schutzmaßnahmen erforderlich. Reguläre Pausen und Sonnenschutz werden empfohlen.' },
  ];

  const ACTIONS_L0 = [
    { cat: 'organisatorisch' as const, short: 'Außerhalb der Arbeitszeit', long: 'Die Arbeitszeit hat noch nicht begonnen oder ist bereits beendet. Für die aktuelle Uhrzeit sind keine Schutzmaßnahmen erforderlich. Sie können die Zeitleiste ziehen, um Empfehlungen für bestimmte Arbeitsstunden zu sehen.' },
  ];

  const getActionItems = () => {
    if (status.level === 0) return ACTIONS_L0;
    if (status.level >= 4) return ACTIONS_L4;
    if (status.level >= 3) return ACTIONS_L3;
    if (status.level >= 2) return ACTIONS_L2;
    return ACTIONS_L1;
  };

  // ── Factor pills ──────────────────────────────────────────────────────────

  const FACTOR_ICON_MAP = { hitze: Thermometer, uv: Sun, trockenheit: Droplet } as const;
  const FACTOR_LABEL_MAP = { hitze: 'Hitze', uv: 'UV', trockenheit: 'Trockenheit' } as const;
  type FactorKind = 'hitze' | 'uv' | 'trockenheit';

  const getFactors = (): FactorKind[] => {
    if (status.level >= 4) return ['hitze', 'uv'];
    if (status.level >= 2) return ['hitze', 'uv'];
    return [];
  };

  const FactorChip = ({ kind }: { kind: FactorKind }) => {
    const Icon = FACTOR_ICON_MAP[kind];
    const bg = status.level >= 4 ? T.criticalTint : status.level >= 3 ? T.strong : T.warning;
    return (
      <span
        className="inline-flex items-center gap-0.5 lg:gap-1 font-semibold px-1.5 lg:px-2 py-0.5 rounded-full flex-shrink-0"
        style={{ fontSize: 'var(--type-size-caption)', backgroundColor: bg, color: T.black }}
      >
        <Icon className="w-2.5 lg:w-3 h-2.5 lg:h-3" strokeWidth={2} />
        {FACTOR_LABEL_MAP[kind]}
      </span>
    );
  };

  // ── Actions card (light) ──────────────────────────────────────────────────

  const ActionsCard = ({ dark = false }: { dark?: boolean }) => {
    const items = getActionItems();
    const rangeLabel = activeBlock
      ? `${activeBlock.start} – ${activeBlock.end}`
      : `${formatHH(wStart)} – ${formatHH(wEnd)}`;
    return (
      <div ref={actionsCardRef} className={dark ? 'scroll-mt-4' : 'rounded-[16px] overflow-hidden scroll-mt-4'} style={dark ? undefined : { backgroundColor: T.n50 }}>
        <div className={dark ? 'px-3 pt-2 pb-2' : 'px-3 lg:px-4 pt-4 lg:pt-6 pb-2 lg:pb-4'}>
          {/* Period chip + Beurteilungstemperatur */}
          <div className="flex items-center justify-between mb-2">
            <div className="inline-flex items-center px-2.5 py-1 rounded-full"
              style={{ backgroundColor: dark ? 'rgba(255,255,255,0.1)' : T.n100 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: dark ? T.n100 : T.n800, fontFamily: 'var(--font-family)' }}>
                {rangeLabel} · {status.label}
              </span>
            </div>
            <div className="inline-flex items-center px-2.5 py-1 rounded-full"
              style={{ backgroundColor: dark ? 'rgba(255,255,255,0.1)' : T.n100 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: dark ? T.n100 : T.brand, fontFamily: 'var(--font-family)' }}>
                {status.beurteilungstemperatur}°C
              </span>
            </div>
          </div>
          {/* Factor pills — above headline */}
          {!dark && getFactors().length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {getFactors().map((f) => (
                <FactorChip key={f} kind={f} />
              ))}
            </div>
          )}
          {/* Headline — hidden in dark/mobile tray (redundant with banner) */}
          {!dark && (
            <p className="pb-2 lg:pb-3 lg:text-lg" style={{ fontWeight: 600, fontSize: 16, lineHeight: 1.35, color: T.n950, fontFamily: 'var(--font-family)' }}>
              Handlungsempfehlungen für diesen Zeitraum
            </p>
          )}
          <ActionList items={items} dark={dark} />
        </div>
      </div>
    );
  };

  // ── Hazard card (dark) ────────────────────────────────────────────────────

  const getHazardRows = () => {
    if (status.level === 0) return [{ Icon: Sun, label: 'Keine Hitzebelastung außerhalb der Arbeitszeit' }];
    const h = currentHour;

    // Calculate temp — realistic Hitzetag profile
    let temp = 25;
    if (h >= 8 && h < 9)  temp = 27;
    if (h >= 9 && h < 11) temp = 31;
    if (h >= 11 && h < 13) temp = 34;
    if (h >= 13 && h < 17) temp = 37;
    if (h >= 17 && h < 18) temp = 33;

    // Calculate humidity — drops sharply as temp rises
    let humidity = 45;
    if (h >= 9 && h < 11) humidity = 32;
    if (h >= 11 && h < 13) humidity = 24;
    if (h >= 13 && h < 17) humidity = 20;
    if (h >= 17 && h < 18) humidity = 28;

    // Calculate UV — DWD index, peaks at noon/early afternoon in summer
    let uvIndex = 2;
    if (h >= 9 && h < 11) uvIndex = 7;
    if (h >= 11 && h < 13) uvIndex = 9;
    if (h >= 13 && h < 17) uvIndex = 10;
    if (h >= 17 && h < 18) uvIndex = 6;

    // Warning thresholds
    const tempWarning = temp >= 32;
    const humidityWarning = humidity <= 25;
    const uvWarning = uvIndex >= 8;

    // Multi-factor warning detection
    const multiFactors = [];
    if (tempWarning) multiFactors.push('Hitze');
    if (uvWarning) multiFactors.push('UV');
    if (humidityWarning) multiFactors.push('Trockenheit');

    if (status.level >= 4) {
      const rows = [
        { Icon: Sun,  label: `Extreme Hitzebelastung (${temp}°C)` },
        { Icon: Sun,  label: `Sehr hohe UV-Strahlung (Index ${uvIndex})` },
      ];
      if (multiFactors.length > 1) {
        rows.push({ Icon: AlertTriangle, label: `Kombinationsbelastung: Hitze + UV` });
      }
      return rows;
    } else if (status.level >= 3) {
      const rows = [
        { Icon: Sun,  label: `Erhöhte Hitzebelastung (${temp}°C)` },
        { Icon: Sun,  label: `Hohe UV-Strahlung (Index ${uvIndex})` },
      ];
      if (multiFactors.length > 1) {
        rows.push({ Icon: AlertTriangle, label: `Kombinationsbelastung: Hitze + UV` });
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

  const HazardCard = () => {
    const rangeLabel = activeBlock ? `${activeBlock.start} – ${activeBlock.end}` : null;
    return (
    <div className="md:rounded-[16px] overflow-hidden" style={{ backgroundColor: T.n700 }}>
      <div className="px-3 lg:px-4 pt-4 lg:pt-6 pb-3 lg:pb-4 flex flex-col gap-1.5 lg:gap-2">
        {rangeLabel && (
          <div className="inline-flex self-start items-center px-2.5 py-1 rounded-full mb-1"
            style={{ backgroundColor: T.n600 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.white, fontFamily: 'var(--font-family)' }}>
              {rangeLabel} · {status.label}
            </span>
          </div>
        )}
        <p className="pb-1 lg:pb-2 lg:text-lg" style={{ fontWeight: 600, fontSize: 16, lineHeight: 1.35, color: T.white, fontFamily: 'var(--font-family)' }}>
          Belastungsfaktoren in diesem Zeitraum
        </p>
        {hazardRows.map(({ Icon, label }, i) => (
          <div key={label}>
            <div className="flex items-center gap-2.5 lg:gap-3 py-2 lg:py-3 rounded-lg cursor-pointer lg:min-h-[44px]" style={{ minHeight: 40 }}>
              <div className="flex items-center justify-center rounded-lg flex-shrink-0 lg:w-[28px] lg:h-[28px]"
                style={{ width: 24, height: 24, backgroundColor: T.n600 }}>
                <Icon className="w-3 lg:w-3.5 h-3 lg:h-3.5" style={{ color: T.white }} strokeWidth={1.5} />
              </div>
              <p className="flex-1" style={{ fontSize: 'var(--type-size-body)', color: T.white, fontFamily: 'var(--font-family)', fontWeight: 400 }}>{label}</p>
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
  };

  // ── Weather section (full-width dark) ────────────────────────────────────

  const getWeatherStats = () => {
    const h = currentHour;

    // Air temperature — realistic Hitzetag in Germany
    let temp = 25;
    if (h >= 8 && h < 9)  temp = 27;
    if (h >= 9 && h < 11) temp = 31;
    if (h >= 11 && h < 13) temp = 34;
    if (h >= 13 && h < 17) temp = 37;
    if (h >= 17 && h < 18) temp = 33;

    // Humidity drops sharply as the day heats up
    let humidity = 45;
    if (h >= 9 && h < 11) humidity = 32;
    if (h >= 11 && h < 13) humidity = 24;
    if (h >= 13 && h < 17) humidity = 20;
    if (h >= 17 && h < 18) humidity = 28;

    // Wind — light breeze typical of high-pressure Hitzetag
    let wind = '5 km/h, Böen: 12 km/h';
    if (h >= 10 && h < 17) wind = '10 km/h, Böen: 22 km/h';
    if (h >= 17) wind = '8 km/h, Böen: 18 km/h';

    // UV index — DWD classification, very high in peak summer
    let uv = '2 (Niedrig)';
    let uvIndex = 2;
    if (h >= 9 && h < 11) { uv = '7 (Hoch)'; uvIndex = 7; }
    if (h >= 11 && h < 13) { uv = '9 (Sehr hoch)'; uvIndex = 9; }
    if (h >= 13 && h < 17) { uv = '10 (Sehr hoch)'; uvIndex = 10; }
    if (h >= 17 && h < 18) { uv = '6 (Hoch)'; uvIndex = 6; }

    // Warning thresholds
    const tempWarning = temp >= 32;
    const humidityWarning = humidity <= 25;
    const uvWarning = uvIndex >= 8;

    return [
      { Icon: Thermometer, label: 'Lufttemperatur',           value: `${temp}°C`, showWarning: tempWarning },
      { Icon: Droplet,     label: 'relative Luftfeuchtigkeit', value: `${humidity}%`, showWarning: humidityWarning },
      { Icon: Wind,        label: 'Wind',                     value: wind, showWarning: false },
      { Icon: Sun,         label: 'UV Index',                 value: uv, showWarning: uvWarning },
    ];
  };

  const weatherStats = getWeatherStats();

  const WeatherSection = () => (
    <div className="md:rounded-[16px] p-3 lg:p-4 flex flex-col gap-2.5 lg:gap-3" style={{ backgroundColor: T.n800 }}>
      <p className="lg:text-base" style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.35, color: T.white, fontFamily: 'var(--font-family)' }}>
        Heute um {Math.floor(currentHour % 24)}:00 Uhr
      </p>

      {/* Mobile: flex-wrap layout */}
      <div className="flex lg:hidden flex-wrap gap-2">
        {weatherStats.map(({ Icon, label, value, showWarning }) => (
          <button
            key={label}
            onClick={() => label === 'UV Index' && setUvDetailOpen(true)}
            className="flex-1 rounded-[10px] flex items-center gap-2 px-2.5 py-2.5 relative text-left hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: T.n950,
              minWidth: 200,
              cursor: label === 'UV Index' ? 'pointer' : 'default'
            }}
            disabled={label !== 'UV Index'}
          >
            <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#E2E8F0' }} strokeWidth={1.5} />
            <div className="flex-1">
              <p className="leading-tight mb-0.5" style={{ fontSize: 'var(--type-size-body-sm)', color: '#E2E8F0', fontFamily: 'var(--font-family)' }}>{label}</p>
              <p style={{ fontSize: 'var(--type-size-body-sm)', color: T.white, fontFamily: 'var(--font-family)', fontWeight: 400 }}>{value}</p>
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
            <p className="leading-tight mb-0.5" style={{ fontSize: 'var(--type-size-body-sm)', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-family)' }}>Beurteilungstemperatur</p>
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
              onClick={() => label === 'UV Index' && setUvDetailOpen(true)}
              className="rounded-[10px] flex items-center gap-3 px-3 py-4 relative text-left"
              style={{
                backgroundColor: T.n950,
                cursor: label === 'UV Index' ? 'pointer' : 'default'
              }}
              disabled={label !== 'UV Index'}
            >
              <Icon className="w-6 h-6 flex-shrink-0" style={{ color: '#E2E8F0' }} strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <p className="leading-tight mb-1" style={{ fontSize: 'var(--type-size-body-sm)', color: '#E2E8F0', fontFamily: 'var(--font-family)' }}>{label}</p>
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
            <p className="leading-tight mb-1" style={{ fontSize: 'var(--type-size-body-sm)', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-family)' }}>Beurteilungstemperatur</p>
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
      <div className="md:rounded-[16px] overflow-hidden" style={{ backgroundColor: T.n700 }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 lg:px-4 py-3 lg:py-4 hover:opacity-90 transition-opacity"
        >
          <p className="text-sm lg:text-base" style={{ color: T.white, fontFamily: 'var(--font-family)' }}>
            Wichtige Informationen zur Nutzung der Anwendung und den angezeigten Hinweisen
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
            <p className="text-sm lg:text-base leading-relaxed" style={{ color: '#E2E8F0', fontFamily: 'var(--font-family)' }}>
              Diese Anwendung dient zur Information über Arbeitsbedingungen bei verschiedenen Wetterlagen.
              Die angezeigten Werte sind Richtwerte und sollten mit den tatsächlichen Bedingungen vor Ort
              abgeglichen werden. Bei kritischen Situationen kontaktieren Sie bitte Ihre Arbeitsschutzbeauftragten.
            </p>
            <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${T.n600}` }}>
                <button
                  onClick={() => setDwdWarningVisible(v => !v)}
                  title="DWD Banner anzeigen"
                  className="flex items-center justify-center rounded-full transition-opacity hover:opacity-70 active:opacity-50"
                  style={{ width: 32, height: 32, backgroundColor: T.n600, flexShrink: 0 }}
                >
                  <AlertTriangle className="w-4 h-4" style={{ color: T.warning }} strokeWidth={2} />
                </button>
                {onShowStartseite && (
                  <button
                    onClick={onShowStartseite}
                    title="Alternativansicht öffnen"
                    className="flex items-center justify-center rounded-full transition-opacity hover:opacity-70 active:opacity-50"
                    style={{ width: 32, height: 32, backgroundColor: T.n600, flexShrink: 0 }}
                  >
                    <Sun className="w-4 h-4" style={{ color: T.n200 }} strokeWidth={1.5} />
                  </button>
                )}
                {onShowOnboarding && (
                  <button
                    onClick={onShowOnboarding}
                    title="Onboarding starten"
                    className="flex items-center justify-center rounded-full transition-opacity hover:opacity-70 active:opacity-50"
                    style={{ width: 32, height: 32, backgroundColor: T.n600, flexShrink: 0 }}
                  >
                    <User className="w-4 h-4" style={{ color: T.n200 }} strokeWidth={1.5} />
                  </button>
                )}
              </div>
          </div>
        )}
      </div>
    );
  };

  // ── View toggle ───────────────────────────────────────────────────────────

  const ViewToggle = ({ compact = false }: { compact?: boolean }) => (
    <div className="flex items-center rounded-lg p-0.5" style={{ backgroundColor: T.n100 }}>
      {(['clock', 'list'] as const).map(v => (
        <button key={v} onClick={() => {
          setMobileView(v);
          // When switching to the list, auto-expand the block that matches the
          // currently selected clock position so the list visibly reacts to
          // any clock interaction the user performed before switching.
          if (v === 'list' && activeBlockIdx >= 0) setListExpandedIdx(activeBlockIdx);
        }}
          className="rounded-md transition-all"
          style={{
            padding: compact ? '6px 12px' : '6px 12px',
            fontSize: compact ? 13 : 14,
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
    <div className="pb-20" style={{ backgroundColor: T.black }}>

      {/* ── DWD WARNING BANNER ─────────────────────────────────────────── */}
      {dwdWarningVisible && (
        <DWDWarningBanner
          level="unwetter"
          onNavigate={onNavigate}
          onDismiss={handleDismissWarning}
        />
      )}

      {/* ── DESKTOP ──────────────────────────────────────────────────────── */}
      <div className="hidden lg:block p-6 pt-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-6">

          {/* Clock card */}
          <div className="col-span-7 self-start bg-card rounded-[24px] shadow-lg p-6 flex flex-col gap-3">
            <CardHeader />
            <div className="w-full">
              {mobileView === 'clock' && (
                <div className="flex justify-center">
                  <div style={{ width: '100%', maxWidth: '440px', aspectRatio: '1 / 1' }}>
                    {makeClockSVG(clockRefDesktop)}
                  </div>
                </div>
              )}
              {mobileView === 'list' && <ListBlocks />}
            </div>
            <DaySummary />
            {mobileView === 'clock' && <AlertBanner />}
          </div>

          {/* Right column */}
          <div className="col-span-5 self-start flex flex-col gap-4">
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
        <div className="pb-3 md:px-4 md:max-w-xl md:mx-auto">
          <div className="bg-card md:rounded-[24px] md:shadow-lg px-4 pt-3 pb-3 min-[390px]:pt-4 min-[390px]:pb-4 flex flex-col gap-2 overflow-hidden" style={{ border: '1px solid #3a3a4a' }}>
            <CardHeader compact tiny={isTinyScreen} />
            <div className="w-full">
              {mobileView === 'clock' && (
                <div style={{ width: '100%', maxWidth: `${mobileClockSize}px`, aspectRatio: '1 / 1', margin: '0 auto' }}>
                  {makeClockSVG(clockRefMobile)}
                </div>
              )}
              {mobileView === 'list' && <ListBlocks compact />}
            </div>
            <DaySummary />
            {mobileView === 'clock' && (
              <div className="-mx-4 -mb-3 min-[390px]:-mb-4">
                <AlertBanner mobile />
              </div>
            )}
          </div>
        </div>

        {/* Weather + cards */}
        <div className="mb-3 md:px-4 md:max-w-xl md:mx-auto flex flex-col gap-3">
          <HazardCard />
          <WeatherSection />
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
