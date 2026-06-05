/**
 * EXPERIMENT: StartseiteView
 * ─────────────────────────────────────────────────────────────────────────────
 * Activation : press "A" anywhere outside an input field to toggle.
 * Purpose    : evaluate whether combining Heute + Planung into one scroll
 *              reduces time-to-understanding and navigation steps.
 * Rollback   : delete this file + revert the 6-line diff in App.tsx.
 *              Zero other files are modified.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import { CloudSun, Sun as PhosphorSun } from '@phosphor-icons/react';
import {
  AlertTriangle, AlertCircle, CheckCircle,
  Thermometer, Droplet, Wind, Sun,
  ChevronDown, ChevronRight,
  Wrench, ClipboardList, User,
} from 'lucide-react';
import PageHeader from './PageHeader';
import DWDWarningBanner from './DWDWarningBanner';
import UndoToast from './UndoToast';
import { CATEGORY_ICON, type ActionItem } from './ActionList';
import { StatusIconCircle } from './StatusBadge';
import UVDetailView from './UVDetailView';
import BeurteilungstemperaturDetailView from './BeurteilungstemperaturDetailView';

// ── CSS token map — mirrors HeuteView T object exactly ───────────────────────
const T = {
  black:        'var(--neutral-black)',
  n950:         'var(--neutral-950)',
  n800:         'var(--neutral-800)',
  n700:         'var(--neutral-700)',
  n600:         'var(--neutral-600)',
  n500:         'var(--neutral-500)',
  n400:         'var(--neutral-400)',
  n300:         'var(--neutral-300)',
  n100:         'var(--neutral-100)',
  n50:          'var(--neutral-50)',
  white:        'var(--neutral-white)',
  brand:        'var(--brand-primary)',
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
  iconOk:       'var(--status-icon-ok)',
  iconWarning:  'var(--status-icon-warning)',
} as const;

// ── Helpers — self-contained copies from HeuteView (no cross-import) ─────────
const WORKDAY_START  = 6;
const WORKDAY_END    = 18;
const CRITICAL_START = 13;
const CRITICAL_END   = 17;

const getRealHour = () => {
  const n = new Date();
  return n.getHours() + n.getMinutes() / 60;
};

const clampWorkday = (h: number) =>
  Math.max(WORKDAY_START, Math.min(WORKDAY_END, h));

const WEEKDAYS = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'];
const MONTHS   = ['Jan.', 'Feb.', 'Mär.', 'Apr.', 'Mai', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];
const formatGermanDate = (d: Date) =>
  `${WEEKDAYS[d.getDay()]}, ${d.getDate()}. ${MONTHS[d.getMonth()]}`;

function getBeurteilungstemperatur(hour: number): number {
  const h = clampWorkday(hour);
  let lufttemp = 22;
  if (h >= 6  && h < 9)  lufttemp = 24;
  if (h >= 9  && h < 11) lufttemp = 28;
  if (h >= 11 && h < 13) lufttemp = 31;
  if (h >= 13 && h < 17) lufttemp = 34;
  if (h >= 17 && h < 18) lufttemp = 30;
  let corrections = 3 + 1 + 1 - 1; // arbeitsschwere + bekleidung + feuchtigkeit - wind
  if (h >= 10 && h < 17) corrections += 2; // sonne
  return Math.round(lufttemp + corrections);
}

function getStatus(hour: number) {
  const h  = clampWorkday(hour);
  const bt = getBeurteilungstemperatur(hour);
  if (h >= CRITICAL_START && h < CRITICAL_END) return {
    level: 4, label: 'Kritisch',
    badgeBg: T.criticalBg, badgeText: T.critical,
    beurteilungstemperatur: bt,
    statusLine: 'Kritische Hitzebelastung, UV',
    alertBody: 'Extreme Hitze- und UV-Belastung erwartet',
  };
  if ((h >= 11 && h < 13) || (h >= 17 && h < 18)) return {
    level: 3, label: 'Stark',
    badgeBg: T.strongBg, badgeText: T.n950,
    beurteilungstemperatur: bt,
    statusLine: 'Erhöhte Belastung',
    alertBody: 'Erhöhte Hitze- und UV-Belastung erwartet',
  };
  if (h >= 9 && h < 11) return {
    level: 2, label: 'Mäßig',
    badgeBg: T.warningBg, badgeText: T.n950,
    beurteilungstemperatur: bt,
    statusLine: 'Mäßige Belastung',
    alertBody: 'Mäßige Hitze- und UV-Belastung erwartet',
  };
  return {
    level: 1, label: 'Gering',
    badgeBg: T.successBg, badgeText: T.successText,
    beurteilungstemperatur: bt,
    statusLine: 'Keine Warnungen',
    alertBody: 'Angenehme Arbeitsbedingungen',
  };
}

function getWeatherNow(hour: number) {
  const h = clampWorkday(hour);
  let temp = 22;
  if (h >= 6  && h < 9)  temp = 24;
  if (h >= 9  && h < 11) temp = 28;
  if (h >= 11 && h < 13) temp = 31;
  if (h >= 13 && h < 17) temp = 34;
  if (h >= 17 && h < 18) temp = 30;

  let humidity = 60;
  if (h >= 9  && h < 11) humidity = 50;
  if (h >= 11 && h < 13) humidity = 42;
  if (h >= 13 && h < 17) humidity = 38;
  if (h >= 17 && h < 18) humidity = 45;

  let wind = '3 km/h, Böen: 15 km/h';
  if (h >= 10 && h < 17) wind = '5 km/h, Böen: 25 km/h';
  if (h >= 17)            wind = '4 km/h, Böen: 18 km/h';

  let uv = '3 (Mittel)'; let uvIndex = 3;
  if (h >= 9  && h < 11) { uv = '6 (Hoch)';      uvIndex = 6; }
  if (h >= 11 && h < 13) { uv = '7 (Hoch)';      uvIndex = 7; }
  if (h >= 13 && h < 17) { uv = '8 (Sehr hoch)'; uvIndex = 8; }
  if (h >= 17 && h < 18) { uv = '5 (Mittel)';    uvIndex = 5; }

  return {
    luft: `${temp}°C`,
    feuchtigkeit: `${humidity}%`,
    wind,
    uv,
    uvWarning:   uvIndex >= 7,
    tempWarning: temp >= 32,
  };
}

// ── Today's planning blocks ───────────────────────────────────────────────────
// Source: PlanungView DAYS[1] (most critical prototype day).
// Self-contained copy — no import from PlanungView, zero coupling.
type BlockStatus = 'ok' | 'eingeschraenkt' | 'kritisch';

interface TodayBlock {
  timeLabel: string;
  status: BlockStatus;
  actions: ActionItem[];
}

const TODAY_BLOCKS: TodayBlock[] = [
  {
    timeLabel: 'Bis 10:00 Uhr',
    status: 'ok',
    actions: [
      { cat: 'organisatorisch', short: 'Außenarbeiten möglichst auf das Nötigste beschränken', long: 'Leichtere Tätigkeiten empfohlen. Die kühle Morgenzeit nutzen, um schwere Arbeiten abzuschließen, die am Nachmittag nicht mehr möglich sind.' },
      { cat: 'organisatorisch', short: 'Leichtere Tätigkeiten empfohlen', long: 'Vorbereitende Arbeiten und leichte Tätigkeiten in den Morgen legen. Material und Werkzeug für den Einsatz nach 17 Uhr vorbereiten.' },
    ],
  },
  {
    timeLabel: '10:00 – 17:00',
    status: 'kritisch',
    actions: [
      { cat: 'technisch',       short: 'Klimatisierte Kabinen nutzen',             long: 'Nutzung von klimatisierten Fahrzeugkabinen, Kranführerkabinen oder geschlossenen Steuerständen.' },
      { cat: 'technisch',       short: 'Heiße Oberflächen abschirmen',             long: 'Vermeidung zusätzlicher Lasten durch Kühlung heißer Maschinenoberflächen oder Ableitung heißer Luft.' },
      { cat: 'organisatorisch', short: "Arbeit als 'Hitzearbeit' behandeln",       long: 'Die Arbeit muss als Hitzearbeit betrachtet werden. Die Expositionszeit der Mitarbeiter wird strikt zeitlich begrenzt.' },
      { cat: 'organisatorisch', short: 'Rotationspläne einführen',                 long: 'Prüfung einer Aussetzung oder Anpassung von Leistungslohn- und Akkordsystemen, um Überanstrengung zu verhindern. Organisation von Arbeitsplatzrotation.' },
      { cat: 'personenbezogen', short: 'Kühlwesten nutzen',                        long: 'Einsatz von aktiv kühlenden Maßnahmen wie Kühlwesten oder Belüftungssystemen mit gekühlter Luft bei geschlossenen Schutzanzügen.' },
      { cat: 'personenbezogen', short: 'Erste-Hilfe-Bereitschaft',                 long: 'Sofortige Umsetzung von Erste-Hilfe-Maßnahmen bei Hitzeerkrankungen (Lagerung im Schatten, feuchte Tücher, Rettungsdienst alarmieren).' },
    ],
  },
  {
    timeLabel: 'Ab 17:00',
    status: 'ok',
    actions: [
      { cat: 'organisatorisch', short: 'Leichte Außenarbeiten wieder möglich', long: 'Abkühlung durch nachlassende Sonneneinstrahlung. Reguläre Pausen weiterhin empfohlen.' },
      { cat: 'organisatorisch', short: 'Regelmäßige Pausen empfohlen',         long: 'Auch nach dem kritischen Zeitraum: ausreichend Flüssigkeit zu sich nehmen und Pausen im Schatten verbringen.' },
    ],
  },
];

// ── Week preview — compact day list for Wochenvorschau section ────────────────
// Source: PlanungView DAYS array (simplified copy, no import).
type DayStatus = 'gut' | 'eingeschraenkt' | 'umplanung';

interface WeekDay {
  label: string;
  status: DayStatus;
  temp: { min: number; max: number };
  actions: string[];
}

const WEEK_DAYS: WeekDay[] = [
  { label: 'Heute',       status: 'umplanung',      temp: { min: 18, max: 36 }, actions: ['Außenarbeiten möglichst vermeiden', 'Verlängerte Pausen einhalten', 'Ausreichend Trinkwasser', 'Schattenplätze nutzen'] },
  { label: 'Di, 6. Mai',  status: 'eingeschraenkt', temp: { min: 22, max: 34 }, actions: ['Schwere Arbeiten bis 12 Uhr abschließen', 'Leichte Tätigkeiten am Nachmittag', 'Regelmäßige Pausen empfohlen'] },
  { label: 'Mi, 7. Mai',  status: 'umplanung',      temp: { min: 24, max: 36 }, actions: ['Außenarbeiten möglichst vermeiden', 'Schattenplätze nutzen', 'Verlängerte Pausen einhalten', 'Ausreichend Trinkwasser'] },
  { label: 'Fr, 9. Mai',  status: 'gut',            temp: { min: 20, max: 28 }, actions: ['Normale Außenarbeiten möglich', 'Regelmäßige Pausen empfohlen'] },
  { label: 'Sa, 10. Mai', status: 'gut',            temp: { min: 18, max: 26 }, actions: ['Normale Außenarbeiten möglich', 'Ausreichend Trinkwasser empfohlen'] },
];

const DAY_STATUS_LABEL: Record<DayStatus, string> = {
  gut:            'Keine Warnungen',
  eingeschraenkt: 'Eingeschränkt: UV',
  umplanung:      'Kritisch: UV und Hitze',
};

// ── Block UI helpers ──────────────────────────────────────────────────────────
const BLOCK_STATUS_LABEL: Record<BlockStatus, string> = {
  ok:             'KEINE WARNUNGEN',
  eingeschraenkt: 'EINGESCHRÄNKT: UV',
  kritisch:       'KRITISCH: UV UND HITZE',
};

// Pastel variants — used for status label text on dark card backgrounds.
// Full-saturation success/critical have insufficient contrast on --neutral-800.
const BLOCK_STATUS_COLOR: Record<BlockStatus, string> = {
  ok:             T.iconOk,
  eingeschraenkt: T.iconWarning,
  kritisch:       T.criticalTint,
};

const BLOCK_ICON_BG: Record<BlockStatus, string> = {
  ok:             T.iconOk,
  eingeschraenkt: T.warning,
  kritisch:       T.criticalTint,
};

const BLOCK_ICON_COLOR: Record<BlockStatus, string> = {
  ok:             T.black,
  eingeschraenkt: T.black,
  kritisch:       T.black,
};

// ── Types ─────────────────────────────────────────────────────────────────────
type View = 'heute' | 'planung' | 'warnung' | 'einstellungen' | 'startseite';

// ── DarkActionItems ───────────────────────────────────────────────────────────
// Dark-themed inline accordion matching HeuteView's HazardCard style.
// Replaces ActionList (which is hardcoded light) inside dark time-block cards.
function DarkActionItems({ items }: { items: ActionItem[] }) {
  const single = items.length === 1;
  const [openIdx, setOpenIdx] = useState<number | null>(single ? 0 : null);
  return (
    <div>
      {items.map((item, i) => {
        const Icon = CATEGORY_ICON[item.cat];
        const isOpen = openIdx === i;
        return (
          <div key={i} className={i > 0 ? 'border-t' : ''} style={{ borderColor: T.n700 }}>
            <button
              onClick={() => !single && setOpenIdx(isOpen ? null : i)}
              className="w-full flex items-center gap-2.5 md:gap-3 py-2 md:py-2.5 text-left min-h-[44px] transition-opacity hover:opacity-75"
            >
              <div
                className="flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ width: 28, height: 28, backgroundColor: T.n700 }}
              >
                <Icon className="w-4 h-4" style={{ color: T.n300 }} strokeWidth={1.5} />
              </div>
              <p className="flex-1 text-[13px] md:text-sm leading-snug" style={{ color: T.n100, fontFamily: 'var(--font-family)' }}>
                {item.short}
              </p>
              {!single && (
                <ChevronDown
                  className="w-4 h-4 flex-shrink-0 transition-transform"
                  style={{ color: T.n500, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  strokeWidth={1.5}
                />
              )}
            </button>
            {isOpen && (
              <p className="text-xs md:text-sm leading-relaxed pb-2 md:pb-3" style={{ color: T.n300, fontFamily: 'var(--font-family)' }}>
                {item.long}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function StartseiteView({
  onNavigate,
  activeLocation,
  schwere,
  bekleidung,
  onOpenSettings,
}: {
  onNavigate: (view: View) => void;
  activeLocation?: string | null;
  workStart?: string;
  workEnd?: string;
  schwere?: string;
  bekleidung?: string;
  onOpenSettings?: () => void;
}) {
  const [realtimeHour, setRealtimeHour] = useState(getRealHour);
  const [dwdWarningVisible, setDwdWarningVisible] = useState(true);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [uvDetailOpen, setUvDetailOpen] = useState(false);
  const [beurtDetailOpen, setBeurtDetailOpen] = useState(false);
  // Auto-expand the critical block (index 1) on load so recommendations are
  // immediately visible — this is the core UX hypothesis of this experiment.
  const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(() => new Set([1]));
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  useEffect(() => {
    const tick = setInterval(() => setRealtimeHour(getRealHour()), 30_000);
    return () => clearInterval(tick);
  }, []);

  const isOutsideWork = realtimeHour < WORKDAY_START || realtimeHour >= WORKDAY_END;
  // Outside work hours: show the critical peak so the day-ahead risk is clear.
  const currentHour = isOutsideWork ? 14 : clampWorkday(realtimeHour);
  const status  = getStatus(currentHour);
  const weather = getWeatherNow(currentHour);

  const toggleBlock = (i: number) =>
    setExpandedBlocks(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: T.black }}>

      {/* ── DWD WARNING BANNER ──────────────────────────────────────────── */}
      {dwdWarningVisible && (
        <DWDWarningBanner
          level="unwetter"
          onNavigate={onNavigate}
          onDismiss={() => {
            setDwdWarningVisible(false);
            setShowUndoToast(true);
          }}
        />
      )}

      {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
      <PageHeader
        title="Startseite"
        variant="dark"
        showLocationButton
        onNavigate={onNavigate}
        onOpenSettings={onOpenSettings}
        activeLocation={activeLocation}
        schwere={schwere}
        bekleidung={bekleidung}
      />

      <div className="px-4 md:px-8 space-y-4 md:space-y-5 max-w-5xl mx-auto">

        {/* ── RISK HERO CARD ─────────────────────────────────────────────── */}
        {/* UX hypothesis: surfacing Beurteilungstemperatur + status above   */}
        {/* the fold reduces time-to-understanding vs. the current clock UI. */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6">

          {/* Top row: date (left) + chips (right) */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <p
              className="text-[11px] md:text-xs"
              style={{ color: T.n500, fontFamily: 'var(--font-family)' }}
            >
              {formatGermanDate(new Date())}
            </p>

            {/* Status + factor chips */}
            <div className="flex flex-wrap justify-end gap-1.5">
              <span
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: status.badgeBg,
                  color: status.badgeText,
                  border: `1px solid ${status.badgeText}33`,
                }}
              >
                {status.level >= 4
                  ? <AlertTriangle className="w-2.5 h-2.5 flex-shrink-0" strokeWidth={2} />
                  : status.level >= 2
                    ? <AlertCircle  className="w-2.5 h-2.5 flex-shrink-0" strokeWidth={2} />
                    : <CheckCircle  className="w-2.5 h-2.5 flex-shrink-0" strokeWidth={2} />
                }
                {status.label}
              </span>

              {status.level >= 2 && (() => {
                const chipBg = status.level >= 4 ? T.criticalTint : T.strong;
                const factors: { Icon: typeof Thermometer; label: string }[] = [
                  { Icon: Thermometer, label: 'Hitze' },
                  { Icon: Sun,         label: 'UV' },
                  ...(status.level >= 4 ? [{ Icon: Droplet, label: 'Trockenheit' }] : []),
                ];
                return factors.map(({ Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: chipBg, color: T.black }}
                  >
                    <Icon className="w-2.5 h-2.5 flex-shrink-0" strokeWidth={2} />
                    {label}
                  </span>
                ));
              })()}
            </div>
          </div>

          {/* Temperature */}
          <div className="mb-4">
            <button
              onClick={() => setBeurtDetailOpen(true)}
              className="inline-flex items-start gap-2 transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] rounded-sm"
            >
              {(() => {
                const h = new Date().getHours() + new Date().getMinutes() / 60;
                const WeatherIcon = h >= 9 && h < 17 ? PhosphorSun : CloudSun;
                return (
                  <WeatherIcon
                    weight="regular"
                    style={{ width: 'clamp(32px, 8vw, 48px)', height: 'clamp(32px, 8vw, 48px)', color: T.n400, marginTop: 4, flexShrink: 0 }}
                  />
                );
              })()}
              <p
                style={{
                  fontSize: 'clamp(52px, 14vw, 72px)',
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: '-2px',
                  color: T.n950,
                  fontFamily: 'var(--font-family)',
                }}
              >
                {status.beurteilungstemperatur}°
              </p>
              {status.beurteilungstemperatur >= 32 && (
                <AlertTriangle
                  className="mt-1 flex-shrink-0"
                  style={{ width: 'clamp(14px, 3vw, 20px)', height: 'clamp(14px, 3vw, 20px)', color: T.n300 }}
                  strokeWidth={1.5}
                />
              )}
            </button>
            <p
              className="text-xs md:text-sm mt-1"
              style={{ color: T.n500, fontFamily: 'var(--font-family)' }}
            >
              Beurteilungstemperatur
            </p>
          </div>

          {/* Conditions grid — 2×2 on mobile, 4-col on md+ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
            <div className="rounded-lg p-2.5" style={{ backgroundColor: T.n50 }}>
              <div className="flex items-center gap-1 mb-1">
                <Thermometer className="w-3 h-3 flex-shrink-0" style={{ color: T.n400 }} strokeWidth={1.5} />
                <p className="text-[10px]" style={{ color: T.n500, fontFamily: 'var(--font-family)' }}>Luft</p>
                {weather.tempWarning && (
                  <AlertTriangle className="w-2.5 h-2.5 ml-auto flex-shrink-0" style={{ color: T.n400 }} strokeWidth={2} />
                )}
              </div>
              <p className="text-sm font-semibold" style={{ color: T.n950, fontFamily: 'var(--font-family)' }}>
                {weather.luft}
              </p>
            </div>

            <div className="rounded-lg p-2.5" style={{ backgroundColor: T.n50 }}>
              <div className="flex items-center gap-1 mb-1">
                <Droplet className="w-3 h-3 flex-shrink-0" style={{ color: T.n400 }} strokeWidth={1.5} />
                <p className="text-[10px]" style={{ color: T.n500, fontFamily: 'var(--font-family)' }}>Feuchte</p>
              </div>
              <p className="text-sm font-semibold" style={{ color: T.n950, fontFamily: 'var(--font-family)' }}>
                {weather.feuchtigkeit}
              </p>
            </div>

            <div className="rounded-lg p-2.5" style={{ backgroundColor: T.n50 }}>
              <div className="flex items-center gap-1 mb-1">
                <Wind className="w-3 h-3 flex-shrink-0" style={{ color: T.n400 }} strokeWidth={1.5} />
                <p className="text-[10px]" style={{ color: T.n500, fontFamily: 'var(--font-family)' }}>Wind</p>
              </div>
              <p className="text-sm font-semibold" style={{ color: T.n950, fontFamily: 'var(--font-family)' }}>
                {weather.wind}
              </p>
            </div>

            <button
              onClick={() => setUvDetailOpen(true)}
              className="rounded-lg p-2.5 text-left transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
              style={{ backgroundColor: T.n50 }}
            >
              <div className="flex items-center gap-1 mb-1">
                <Sun className="w-3 h-3 flex-shrink-0" style={{ color: T.n400 }} strokeWidth={1.5} />
                <p className="text-[10px]" style={{ color: T.n500, fontFamily: 'var(--font-family)' }}>UV</p>
                {weather.uvWarning && (
                  <AlertTriangle className="w-2.5 h-2.5 ml-auto flex-shrink-0" style={{ color: T.n400 }} strokeWidth={2} />
                )}
              </div>
              <p className="text-sm font-semibold" style={{ color: T.n950, fontFamily: 'var(--font-family)' }}>
                {weather.uv}
              </p>
            </button>
          </div>

        </div>

        {/* ── TAGESPLANUNG ────────────────────────────────────────────────── */}
        {/* UX hypothesis: inline expandable time blocks reduce the need to   */}
        {/* navigate to Planung for basic daily recommendations.              */}
        <div>
          <p
            className="text-sm font-semibold mb-3"
            style={{ color: T.white, fontFamily: 'var(--font-family)' }}
          >
            Tagesplanung
          </p>

          <div className="space-y-2">
            {TODAY_BLOCKS.map((block, bi) => {
              const isOpen = expandedBlocks.has(bi);
              const BlockIcon =
                block.status === 'kritisch'      ? AlertTriangle
                : block.status === 'eingeschraenkt' ? AlertCircle
                : CheckCircle;

              return (
                <div
                  key={bi}
                  className="rounded-2xl overflow-hidden"
                  style={{ backgroundColor: T.n800 }}
                >
                  <button
                    onClick={() => toggleBlock(bi)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left min-h-[60px] transition-opacity hover:opacity-90"
                    aria-expanded={isOpen}
                  >
                    {/* Status icon */}
                    <div
                      className="flex items-center justify-center rounded-full flex-shrink-0 w-8 h-8"
                      style={{ backgroundColor: BLOCK_ICON_BG[block.status] }}
                    >
                      <BlockIcon
                        className="w-4 h-4"
                        style={{ color: BLOCK_ICON_COLOR[block.status] }}
                        strokeWidth={2}
                      />
                    </div>

                    {/* Time label */}
                    <p
                      className="text-base md:text-lg font-semibold flex-1"
                      style={{ color: T.white, fontFamily: 'var(--font-family)' }}
                    >
                      {block.timeLabel}
                    </p>

                    {/* Status label */}
                    <p
                      className="text-[11px] font-semibold uppercase tracking-wide flex-shrink-0 mr-1 hidden min-[360px]:block"
                      style={{
                        color: BLOCK_STATUS_COLOR[block.status],
                        fontFamily: 'var(--font-family)',
                      }}
                    >
                      {BLOCK_STATUS_LABEL[block.status]}
                    </p>

                    {/* Chevron */}
                    <ChevronDown
                      className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                      style={{
                        color: T.n400,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                      strokeWidth={1.5}
                    />
                  </button>

                  {/* Inline dark recommendations — matches HeuteView dark accordion */}
                  {isOpen && (
                    <div className="px-4 pb-3">
                      <DarkActionItems items={block.actions} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── WOCHENVORSCHAU ──────────────────────────────────────────────── */}
        {/* UX hypothesis: compact week preview removes the need to navigate  */}
        {/* to Planung just to check whether the rest of the week is safe.   */}
        <div className="pb-4">
          <p
            className="text-sm font-semibold mb-3"
            style={{ color: T.white, fontFamily: 'var(--font-family)' }}
          >
            Wochenvorschau
          </p>

          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: T.n800 }}>
            {WEEK_DAYS.map((day, i) => {
              const isDayOpen = expandedDay === i;
              return (
              <div
                key={i}
                className={i > 0 ? 'border-t' : ''}
                style={{ borderColor: T.n700 }}
              >
                <button
                  onClick={() => setExpandedDay(isDayOpen ? null : i)}
                  aria-expanded={isDayOpen}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left min-h-[52px] transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-primary)]"
                >
                  <StatusIconCircle
                    status={
                      day.status === 'gut'
                        ? 'ok'
                        : day.status === 'eingeschraenkt'
                          ? 'warnung'
                          : 'kritisch'
                    }
                    className="w-8 h-8 flex-shrink-0"
                    iconClassName="w-4 h-4"
                  />

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium"
                      style={{ color: T.white, fontFamily: 'var(--font-family)' }}
                    >
                      {day.label}
                    </p>
                    <p
                      className="text-[11px] leading-tight"
                      style={{
                        color:
                          day.status === 'umplanung'      ? T.criticalTint
                          : day.status === 'eingeschraenkt' ? T.iconWarning
                          : T.n300,
                        fontFamily: 'var(--font-family)',
                      }}
                    >
                      {DAY_STATUS_LABEL[day.status]}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0 mr-1">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: T.white, fontFamily: 'var(--font-family)' }}
                    >
                      {day.temp.max}°
                    </p>
                    <p
                      className="text-[11px]"
                      style={{ color: T.n300, fontFamily: 'var(--font-family)' }}
                    >
                      {day.temp.min}°
                    </p>
                  </div>

                  <ChevronDown
                    className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                    style={{ color: T.n400, transform: isDayOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    strokeWidth={1.5}
                  />
                </button>

                {isDayOpen && (
                  <div className="mx-3 mb-3 rounded-xl overflow-hidden bg-white">
                    {day.actions.map((action, ai) => (
                      <div
                        key={ai}
                        className={`flex items-center gap-2.5 px-3 py-2.5 ${ai > 0 ? 'border-t border-[var(--neutral-100)]' : ''}`}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: 'var(--neutral-400)' }}
                        />
                        <p
                          className="text-[13px] leading-snug"
                          style={{ color: 'var(--neutral-950)', fontFamily: 'var(--font-family)' }}
                        >
                          {action}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
            })}
          </div>

          {/* Explicit CTA to full PlanungView */}
          <button
            onClick={() => onNavigate('planung')}
            className="mt-2 w-full flex items-center justify-center gap-1.5 py-3 rounded-xl transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
            style={{ backgroundColor: T.n700 }}
          >
            <span
              className="text-sm"
              style={{ color: T.n300, fontFamily: 'var(--font-family)' }}
            >
              Vollständige Planung öffnen
            </span>
            <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: T.n400 }} strokeWidth={1.5} />
          </button>
        </div>

      </div>{/* /max-w-5xl */}

      {/* ── MODALS & TOASTS ─────────────────────────────────────────────── */}
      {showUndoToast && (
        <UndoToast
          message="Warnung ausgeblendet"
          onUndo={() => { setDwdWarningVisible(true); setShowUndoToast(false); }}
          onDismiss={() => setShowUndoToast(false)}
        />
      )}

      {uvDetailOpen && (
        <UVDetailView onClose={() => setUvDetailOpen(false)} />
      )}

      {beurtDetailOpen && (
        <BeurteilungstemperaturDetailView onClose={() => setBeurtDetailOpen(false)} />
      )}

    </div>
  );
}
