import React, { useState, useEffect } from 'react';
import {
  Clock, Check, CheckCircle, AlertTriangle,
  ChevronDown, ChevronUp, Thermometer, Droplet, Wind, Sun, Scale,
} from 'lucide-react';
import PageHeader from './PageHeader';
import { StatusIconCircle } from './StatusBadge';
import UVDetailViewWeekly from './UVDetailViewWeekly';
import BeurteilungstemperaturDetailViewWeekly from './BeurteilungstemperaturDetailViewWeekly';
import ActionList, { type ActionItem } from './ActionList';

// ── Types ─────────────────────────────────────────────────────────────────────

type DayStatus = 'gut' | 'eingeschraenkt' | 'umplanung';
type BlockStatus = 'ok' | 'eingeschraenkt' | 'kritisch';

interface ActionBlock {
  timeLabel: string;
  status: BlockStatus;
  actions: string[];
}

interface Hazard {
  iconType: 'thermometer' | 'sun' | 'scale';
  text: string;
  detail: string;
}

export interface Day {
  date: string;
  shortDate: string;
  status: DayStatus;
  temp: { min: number; max: number };
  bannerTitle?: string;
  bannerSubtitle?: string;
  actionBlocks: ActionBlock[];
  hazards: Hazard[];
  conditions: {
    lufttemp: string;
    feuchtigkeit: string;
    wind: string;
    uv: string;
    beurteilungsTemp: string;
    assessmentAlert: boolean;
  };
}

type View = 'heute' | 'planung' | 'warnung' | 'einstellungen' | 'styleguide';

// ── Data ──────────────────────────────────────────────────────────────────────

const DAYS: Day[] = [
  {
    date: 'Dienstag, 6. Mai',
    shortDate: 'Di',
    status: 'eingeschraenkt',
    temp: { min: 22, max: 34 },
    bannerTitle: 'Erhöhte Hitzebelastung am Nachmittag',
    bannerSubtitle: 'Entwarnung ab 16:00 Uhr',
    actionBlocks: [
      {
        timeLabel: 'Bis 12:00 Uhr',
        status: 'ok',
        actions: ['Schwere Arbeiten möglichst abschließen', 'Materialien vorbereiten empfohlen'],

      },
      {
        timeLabel: '12:00 – 14:00',
        status: 'eingeschraenkt',
        actions: ['Leichte Tätigkeiten empfohlen', '15 Min. Pause pro Stunde empfohlen', 'Ausreichend Trinkwasser empfohlen'],
      },
      {
        timeLabel: '14:00 – 16:00',
        status: 'kritisch',
        actions: ['Aufenthalt im Freien möglichst vermeiden', 'Schattenplätze nutzen empfohlen', 'Verlängerte Pausen empfohlen', 'Ausreichend Trinkwasser empfohlen'],
      },
      {
        timeLabel: 'Ab 16:00',
        status: 'ok',
        actions: ['Leichte Außenarbeiten wieder möglich', 'Regelmäßige Pausen empfohlen'],
      },
    ],
    hazards: [
      { iconType: 'thermometer', text: 'Hitze: 34°C am Nachmittag', detail: 'Extreme Belastung für körperliche Arbeit ab 12 Uhr' },
      { iconType: 'sun', text: 'UV-Index: 7 (hoch)', detail: 'Sonnenschutz Klasse 50+ empfohlen' },
      { iconType: 'scale', text: 'Schwere Arbeit + direkte Sonne', detail: 'Kreislaufbelastung stark erhöht' },
    ],
    conditions: { lufttemp: '34°C', feuchtigkeit: '45%', wind: '8 km/h, Böen: 22 km/h', uv: '7 (Hoch)', beurteilungsTemp: '36°C', assessmentAlert: true },
  },
  {
    date: 'Mittwoch, 7. Mai',
    shortDate: 'Mi',
    status: 'umplanung',
    temp: { min: 24, max: 36 },
    bannerTitle: 'Warnung vor Hitze und UV',
    bannerSubtitle: 'Entwarnung ab 17:00 Uhr',
    actionBlocks: [
      {
        timeLabel: 'Bis 10:00 Uhr',
        status: 'ok',
        actions: [
          'Außenarbeiten möglichst auf das Nötigste beschränken',
          'Leichtere Tätigkeiten empfohlen',
        ],
      },
      {
        timeLabel: '10:00 – 17:00',
        status: 'kritisch',
        actions: ['Außenarbeiten möglichst vermeiden', 'Schattenplätze nutzen empfohlen', 'Verlängerte Pausen empfohlen', 'Ausreichend Trinkwasser empfohlen'],
      },
      {
        timeLabel: 'Ab 17:00',
        status: 'ok',
        actions: ['Leichte Außenarbeiten wieder möglich', 'Regelmäßige Pausen empfohlen'],
      },
    ],
    hazards: [
      { iconType: 'thermometer', text: 'Hitze: 34°C am Nachmittag', detail: 'Extreme Hitzebelastung ganztägig ab 10 Uhr' },
      { iconType: 'sun', text: 'UV-Index: 8 (sehr hoch)', detail: 'Maximaler Sonnenschutz empfohlen' },
      { iconType: 'scale', text: 'Schwere Arbeit + direkte Sonne', detail: 'Sehr hohe Kreislaufbelastung — Außenarbeiten möglichst vermeiden' },
    ],
    conditions: { lufttemp: '34°C', feuchtigkeit: '38%', wind: '5 km/h, Böen: 18 km/h', uv: '8 (Sehr hoch)', beurteilungsTemp: '34°C', assessmentAlert: true },
  },
  {
    date: 'Donnerstag, 8. Mai',
    shortDate: 'Do',
    status: 'eingeschraenkt',
    temp: { min: 23, max: 35 },
    bannerTitle: 'Nachmittag eingeschränkt',
    bannerSubtitle: 'Entwarnung ab 17:00 Uhr',
    actionBlocks: [
      {
        timeLabel: 'Bis 11:00 Uhr',
        status: 'ok',
        actions: ['Schwere Arbeiten möglichst abschließen', 'Volle Produktivität möglich'],
      },
      {
        timeLabel: '11:00 – 15:00',
        status: 'eingeschraenkt',
        actions: ['Leichte Tätigkeiten empfohlen', 'Verlängerte Pausen empfohlen', 'Ausreichend Getränke empfohlen'],
      },
      {
        timeLabel: '15:00 – 17:00',
        status: 'kritisch',
        actions: ['Aufenthalt im Freien möglichst vermeiden', 'Schattenplätze nutzen empfohlen', 'Ausreichend Trinkwasser empfohlen'],
      },
      {
        timeLabel: 'Ab 17:00',
        status: 'ok',
        actions: ['Leichte Arbeiten wieder möglich'],
      },
    ],
    hazards: [
      { iconType: 'thermometer', text: 'Hitze: 35°C am Nachmittag', detail: 'Extreme Hitzebelastung am Nachmittag' },
      { iconType: 'sun', text: 'UV-Index: 7 (hoch)', detail: 'Sonnenschutz empfohlen' },
      { iconType: 'scale', text: 'Schwere Arbeit bei Hitze', detail: 'Kreislaufbelastung stark erhöht nachmittags' },
    ],
    conditions: { lufttemp: '35°C', feuchtigkeit: '41%', wind: '10 km/h, Böen: 28 km/h', uv: '7 (Hoch)', beurteilungsTemp: '37°C', assessmentAlert: true },
  },
  {
    date: 'Freitag, 9. Mai',
    shortDate: 'Fr',
    status: 'gut',
    temp: { min: 20, max: 28 },
    actionBlocks: [
      {
        timeLabel: 'Ganztägig',
        status: 'ok',
        actions: ['Normale Arbeitsplanung möglich', 'Sonnenschutz empfohlen', 'Reguläre Pausen empfohlen'],
      },
    ],
    hazards: [
      { iconType: 'thermometer', text: 'Angenehme Temperaturen', detail: 'Keine besondere Hitzebelastung erwartet' },
    ],
    conditions: { lufttemp: '28°C', feuchtigkeit: '52%', wind: '14 km/h, Böen: 35 km/h', uv: '5 (Mittel)', beurteilungsTemp: '28°C', assessmentAlert: false },
  },
  {
    date: 'Samstag, 10. Mai',
    shortDate: 'Sa',
    status: 'gut',
    temp: { min: 18, max: 26 },
    actionBlocks: [
      {
        timeLabel: 'Ganztägig',
        status: 'ok',
        actions: ['Keine besonderen Maßnahmen nötig', 'Reguläre Pausen empfohlen', 'Sonnenschutz empfohlen'],
      },
    ],
    hazards: [
      { iconType: 'thermometer', text: 'Optimale Bedingungen', detail: 'Normale Arbeitsplanung ohne Einschränkungen möglich' },
    ],
    conditions: { lufttemp: '26°C', feuchtigkeit: '55%', wind: '18 km/h, Böen: 42 km/h', uv: '4 (Mittel)', beurteilungsTemp: '25°C', assessmentAlert: false },
  },
];

// ── CSS token map ─────────────────────────────────────────────────────────────

const T = {
  black:       'var(--neutral-black)',
  n950:        'var(--neutral-950)',
  n800:        'var(--neutral-800)',
  n700:        'var(--neutral-700)',
  n600:        'var(--neutral-600)',
  n500:        'var(--neutral-500)',
  n300:        'var(--neutral-300)',
  n100:        'var(--neutral-100)',
  n50:         'var(--neutral-50)',
  white:       'var(--neutral-white)',
  brand:       'var(--brand-primary)',
  critical:    'var(--status-critical)',
  criticalBg:  'var(--status-critical-bg)',
  criticalTint:'var(--status-critical-tint)',
  warning:     'var(--status-warning)',
  warningBg:   'var(--status-warning-bg)',
  success:     'var(--status-success)',
  successText: 'var(--status-success-text)',
} as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CFG = {
  gut:           { color: T.success,  Icon: CheckCircle,   textOnColor: T.white, label: 'Aktuell keine Warnungen', legendLabel: 'Aktuell keine Warnungen' },
  eingeschraenkt:{ color: T.warning,  Icon: AlertTriangle, textOnColor: T.n800,  label: 'Eingeschränkter Betrieb', legendLabel: 'Warnung' },
  umplanung:     { color: T.critical, Icon: AlertTriangle, textOnColor: T.white, label: 'Umplanung nötig', legendLabel: 'Kritisch' },
};

const HAZARD_ICONS = {
  thermometer: Thermometer,
  sun: Sun,
  scale: Scale,
};

// Handlungsempfehlungen — same data as HeuteView's ActionsCard.
// Order within each level: technisch → organisatorisch → personenbezogen
const ACTIONS_L1: ActionItem[] = [
  { cat: 'organisatorisch', short: 'Normale Arbeitsplanung möglich', long: 'Keine besonderen Schutzmaßnahmen erforderlich. Reguläre Pausen und Sonnenschutz werden empfohlen.' },
];

const ACTIONS_L2: ActionItem[] = [
  { cat: 'technisch',       short: 'Sonnenschutz aufstellen',           long: 'Aufstellen von Sonnensegeln, Überdachungen oder provisorischen Abschirmwänden direkt über dem Arbeitsplatz.' },
  { cat: 'technisch',       short: 'Lüftung / Ventilatoren nutzen',     long: 'Einsatz von Ventilatoren zur Durchlüftung, um die Schweißverdunstung zu unterstützen.' },
  { cat: 'organisatorisch', short: 'Getränke bereitstellen',            long: 'Kostenfreie Bereitstellung von geeignetem Mineralwasser oder abgekühlten Tees in ausreichender Menge.' },
  { cat: 'organisatorisch', short: 'Arbeitstempo flexibilisieren',      long: 'Erlaubnis und Ermöglichung einer selbstständigen, verantwortungsvollen Anpassung von Arbeitsschwere und Arbeitstempo.' },
  { cat: 'personenbezogen', short: 'Viel trinken',                      long: 'Regelmäßig kleine Mengen trinken – als Orientierung gilt etwa ein Glas (100–150 ml) alle 15 bis 30 Minuten.' },
  { cat: 'personenbezogen', short: 'Luftige Kleidung & Kopfbedeckung', long: 'Tragen von atmungsaktiver, heller Kleidung und Kopfbedeckung. Vorgeschriebene Schutzkleidung muss getragen werden, aber die Isolation darunter sollte reduziert werden.' },
];

const ACTIONS_L3: ActionItem[] = [
  { cat: 'technisch',       short: 'Kühlung verstärken',                long: 'Aktivierung von Wasserservern, Luftduschen oder mobilen Kühlgeräten im betroffenen Arbeitsbereich.' },
  { cat: 'technisch',       short: 'Sonnenschutz intensivieren',        long: 'Zwingende Intensivierung und lückenlose Umsetzung aller Verschattungsmaßnahmen aus Stufe 2.' },
  { cat: 'organisatorisch', short: 'Schwere Arbeit in kühlere Stunden', long: 'Verlegung schwerer körperlicher Arbeiten in die kühleren Morgen- oder Abendstunden (z. B. durch Gleitzeit oder Schichtverlegung).' },
  { cat: 'organisatorisch', short: 'Entwärmungspausen einführen',       long: 'Einplanung zusätzlicher Tätigkeitsunterbrechungen und passiver Entwärmungsphasen. Viele kurze Pausen sind effektiver als wenige lange.' },
  { cat: 'personenbezogen', short: 'Pausen im Schatten verbringen',     long: 'Ruhepausen dürfen nicht am aufgeheizten Arbeitsplatz verbracht werden, sondern in schattigen oder extra gekühlten Bereichen.' },
  { cat: 'personenbezogen', short: 'Kollegen aktiv im Blick behalten',  long: 'Gegenseitige Beobachtung der Beschäftigten auf erste Anzeichen von Hitzeerkrankungen (Schwindel, Erschöpfung, Sonnenstich).' },
];

const ACTIONS_BY_STATUS: Record<BlockStatus, ActionItem[]> = {
  ok: ACTIONS_L1,
  eingeschraenkt: ACTIONS_L2,
  kritisch: ACTIONS_L3,
};

// Unused references retained for legacy data shape
void Check;

// ── Sub-components ────────────────────────────────────────────────────────────

function DayCard({ day, active, onClick }: { day: Day; active: boolean; onClick: () => void }) {
  const cfg = STATUS_CFG[day.status];
  return (
    <button
      onClick={onClick}
      className="relative flex-shrink-0 flex-1 min-w-[68px] md:min-w-[120px] rounded-xl md:rounded-[12px] transition-colors"
      style={{
        backgroundColor: active ? 'var(--neutral-600)' : 'var(--neutral-700)',
      }}
    >
      {/* Content */}
      <div className="flex flex-col md:flex-row items-center gap-0.5 md:gap-3 px-2 py-1.5 md:px-4 md:py-3.5">
        {/* Icon */}
        <StatusIconCircle
          status={day.status === 'gut' ? 'ok' : day.status === 'eingeschraenkt' ? 'warnung' : 'kritisch'}
          className="w-[32px] h-[32px] md:w-10 md:h-10"
          iconClassName="w-[15px] h-[15px] md:w-5 md:h-5"
        />

        {/* Text - Mobile: stacked center, Desktop: horizontal left */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-auto">
          <p className="text-sm md:text-base font-semibold leading-[1.5] text-white">
            {day.shortDate}
          </p>
          <p className="text-xs leading-[1.3] text-white md:hidden">
            {day.temp.max}°
          </p>
          <p className="text-xs leading-[1.3] text-[#E2E8F0] hidden md:block">
            {day.temp.max}° · {day.temp.min}°
          </p>
        </div>
      </div>

      {/* Border */}
      <div
        className="absolute inset-0 rounded-xl md:rounded-[12px] border pointer-events-none"
        style={{
          borderColor: active ? 'var(--neutral-50)' : 'var(--neutral-600)',
        }}
      />
    </button>
  );
}

function StatusBadge({ status }: { status: BlockStatus }) {
  if (status === 'ok') return (
    <span className="inline-flex items-center gap-0.5 md:gap-1 text-xs font-semibold px-1.5 md:px-2 py-0.5 rounded-full flex-shrink-0 text-[var(--status-success-text)] bg-[var(--status-success-bg)]">
      <CheckCircle className="w-2.5 md:w-3 h-2.5 md:h-3" strokeWidth={2} />
      Gering
    </span>
  );
  if (status === 'kritisch') return (
    <span className="inline-flex items-center gap-0.5 md:gap-1 text-xs font-semibold px-1.5 md:px-2 py-0.5 rounded-full flex-shrink-0 text-[var(--status-critical)] bg-[var(--status-critical-bg)] border border-[var(--status-critical)]/20">
      <AlertTriangle className="w-2.5 md:w-3 h-2.5 md:h-3" strokeWidth={2} />
      Kritisch
    </span>
  );
  return (
    <span className="inline-flex items-center gap-0.5 md:gap-1 text-xs font-semibold px-1.5 md:px-2 py-0.5 rounded-full flex-shrink-0 text-[var(--neutral-800)] bg-[var(--status-warning-bg)] border border-[var(--status-warning)]/40">
      <AlertTriangle className="w-2.5 md:w-3 h-2.5 md:h-3" strokeWidth={2} />
      Warnung
    </span>
  );
}

const FACTOR_ICON: Record<string, React.ElementType> = {
  hitze: Thermometer,
  uv: Sun,
  trockenheit: Droplet,
};
const FACTOR_LABEL: Record<string, string> = {
  hitze: 'Hitze',
  uv: 'UV',
  trockenheit: 'Trockenheit',
};

function FactorChip({ kind, status }: { kind: 'hitze' | 'uv' | 'trockenheit'; status: BlockStatus }) {
  const Icon = FACTOR_ICON[kind];
  const bg = status === 'kritisch' ? T.criticalTint : T.warning;
  return (
    <span className="inline-flex items-center gap-0.5 md:gap-1 text-xs font-semibold px-1.5 md:px-2 py-0.5 rounded-full flex-shrink-0"
      style={{ backgroundColor: bg, color: '#000000' }}>
      <Icon className="w-2.5 md:w-3 h-2.5 md:h-3" strokeWidth={2} />
      {FACTOR_LABEL[kind]}
    </span>
  );
}

function getBlockFactors(block: ActionBlock, _day: Day): ('hitze' | 'uv' | 'trockenheit')[] {
  // Mirror the HeuteView simulation: factors scale with the block's status level.
  // - ok           → none
  // - eingeschraenkt (mäßig/stark) → Hitze + UV
  // - kritisch     → Hitze + UV + Trockenheit
  if (block.status === 'ok') return [];
  if (block.status === 'kritisch') return ['hitze', 'uv', 'trockenheit'];
  return ['hitze', 'uv'];
}

function MetricTile({
  icon: Icon, label, value, alert = false, onClick,
}: { icon: React.ElementType; label: string; value: string; alert?: boolean; onClick?: () => void }) {
  const content = (
    <>
      <div className="flex items-center gap-1 md:gap-1.5 mb-1 md:mb-1.5">
        <Icon className="w-3 md:w-3.5 h-3 md:h-3.5 text-[#E2E8F0]" strokeWidth={1.5} />
        <p className="text-xs leading-tight text-[#E2E8F0]">{label}</p>
      </div>
      <p className="text-sm md:text-base font-semibold text-white">{value}</p>
      {alert && (
        <AlertTriangle className="absolute bottom-2 md:bottom-2.5 right-2 md:right-2.5 w-3 md:w-3.5 h-3 md:h-3.5 text-white/30" strokeWidth={1.5} />
      )}
    </>
  );
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="rounded-lg md:rounded-xl p-2.5 md:p-3 relative bg-[var(--neutral-950)] text-left transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--neutral-800)]"
      >
        {content}
      </button>
    );
  }
  return (
    <div className="rounded-lg md:rounded-xl p-2.5 md:p-3 relative bg-[var(--neutral-950)]">
      {content}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PlanungView({ onNavigate, onOpenSettings, activeLocation, schwere, bekleidung }: { onNavigate: (view: View) => void; onOpenSettings?: () => void; activeLocation?: string | null; schwere?: string; bekleidung?: string; }) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [expandedHazard, setExpandedHazard] = useState<number | null>(null);
  const [uvDetailOpen, setUvDetailOpen] = useState(false);
  const [beurtDetailOpen, setBeurtDetailOpen] = useState(false);
  const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(
    () => new Set(DAYS[1].actionBlocks.map((_, i) => i).filter(i => DAYS[1].actionBlocks[i].status !== 'ok'))
  );

  const d = DAYS[selectedDay];

  useEffect(() => {
    setExpandedBlocks(new Set(d.actionBlocks.map((_, i) => i).filter(i => d.actionBlocks[i].status !== 'ok')));
  }, [selectedDay]);

  const toggleBlock = (i: number) => setExpandedBlocks(prev => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });
  const dayCfg = STATUS_CFG[d.status];
  const hasWarning = d.status !== 'gut';

  return (
    <div className="min-h-screen bg-black">

      {/* ── Header ── */}
      <PageHeader
        title="Planung"
        variant="dark"
        showLocationButton
        onNavigate={onNavigate}
        onOpenSettings={onOpenSettings}
        activeLocation={activeLocation}
        schwere={schwere}
        bekleidung={bekleidung}
      />

      {/* ── Day selector & Legend ── */}
      <div className="px-4 md:px-8">
        <div className="max-w-5xl mx-auto space-y-3 md:space-y-7">
          <div className="flex gap-1.5 md:gap-[6px] overflow-x-auto pb-1 scrollbar-none">
            {DAYS.map((day, i) => (
              <DayCard key={i} day={day} active={selectedDay === i} onClick={() => setSelectedDay(i)} />
            ))}
          </div>

          {/* ── Legend ── */}
          <div className="flex flex-wrap gap-x-3 md:gap-x-4 gap-y-1">
            {(['gut', 'umplanung', 'eingeschraenkt'] as DayStatus[]).map((status) => {
              const cfg = STATUS_CFG[status];
              const bgColor = status === 'gut' ? 'bg-[var(--status-success)]' : status === 'eingeschraenkt' ? 'bg-[#FFB530]' : 'bg-[#FF878A]';
              const textColor = status === 'eingeschraenkt' ? 'text-black' : 'text-white';
              return (
                <div key={status} className="flex items-center gap-1.5">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${bgColor}`}>
                    <cfg.Icon className="w-2.5 h-2.5 text-black" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs text-[#E2E8F0]">{cfg.legendLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="pt-3 md:pt-5 gap-3 md:gap-5 flex flex-col md:flex-row">

            {/* ── LEFT: Plan content ── */}
            <div className="bg-white rounded-2xl md:rounded-3xl pt-4 md:pt-8 px-4 md:px-7 pb-5 md:pb-9 space-y-2.5 md:space-y-4 flex-1">

              {/* Date heading */}
              <div className="space-y-0.5 md:space-y-1">
                <p className="text-xs text-[var(--neutral-500)]">Hinweise zur Arbeitsplanung:</p>
                <h2 className="text-[var(--neutral-950)]" style={{ fontSize: 'var(--type-size-h2)' }}>
                  {d.date}
                </h2>
              </div>

              {/* Time blocks */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2 md:mb-4 text-[var(--neutral-500)]">Planung</p>
                <div className="space-y-2.5 md:space-y-5">
                  {d.actionBlocks.map((block, bi) => {
                    const isBlockOpen = expandedBlocks.has(bi);
                    return (
                      <div key={bi}>
                        <button
                          onClick={() => toggleBlock(bi)}
                          className="w-full flex items-start gap-2 mb-1 md:mb-2 text-left"
                        >
                          <div className="flex flex-col gap-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className={block.status === 'kritisch' ? 'text-[var(--status-critical)]' : 'text-[var(--neutral-950)]'}
                                style={{ fontSize: 'var(--type-size-h3)' }}>
                                {block.timeLabel}
                              </h3>
                              <StatusBadge status={block.status} />
                            </div>
                            {getBlockFactors(block, d).length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {getBlockFactors(block, d).map((f) => (
                                  <FactorChip key={f} kind={f} status={block.status} />
                                ))}
                              </div>
                            )}
                          </div>
                          {isBlockOpen
                            ? <ChevronUp className="w-4 h-4 flex-shrink-0 mt-1 text-[var(--neutral-400)]" strokeWidth={1.5} />
                            : <ChevronDown className="w-4 h-4 flex-shrink-0 mt-1 text-[var(--neutral-400)]" strokeWidth={1.5} />
                          }
                        </button>

                        {isBlockOpen && (
                          <ActionList
                            items={ACTIONS_BY_STATUS[block.status]}
                            variant={block.status === 'kritisch' ? 'critical' : 'default'}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── RIGHT: two dark cards ── */}
            <div className="flex flex-col gap-3 md:gap-4 md:w-[360px]">

            {/* Hazard details */}
            <div className="rounded-xl md:rounded-2xl p-4 md:p-5 bg-[var(--neutral-800)]">
              <p className="font-semibold mb-3 md:mb-4 text-white" style={{ fontSize: 'var(--type-size-body)' }}>
                Details zu möglichen Gefährdungen und Belastungen
              </p>
              <div>
                {d.hazards.map((hazard, i) => {
                  const Icon = HAZARD_ICONS[hazard.iconType];
                  const isOpen = expandedHazard === i;
                  return (
                    <div key={i} className={i > 0 ? 'border-t border-white/[0.08]' : ''}>
                      <button
                        onClick={() => setExpandedHazard(isOpen ? null : i)}
                        className="w-full flex items-center gap-2 md:gap-3 py-2 md:py-3 text-left"
                      >
                        <Icon className="w-3.5 md:w-4 h-3.5 md:h-4 flex-shrink-0 text-white/50" strokeWidth={1.5} />
                        <span className="flex-1 leading-snug text-white/80" style={{ fontSize: 'var(--type-size-body)' }}>{hazard.text}</span>
                        {isOpen
                          ? <ChevronUp className="w-3.5 md:w-4 h-3.5 md:h-4 flex-shrink-0 text-white/30" strokeWidth={1.5} />
                          : <ChevronDown className="w-3.5 md:w-4 h-3.5 md:h-4 flex-shrink-0 text-white/30" strokeWidth={1.5} />
                        }
                      </button>
                      {isOpen && (
                        <p className="leading-relaxed pb-2 md:pb-3 text-white/50" style={{ fontSize: 'var(--type-size-body)' }}>{hazard.detail}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current conditions */}
            <div className="rounded-xl md:rounded-2xl p-4 md:p-5 bg-[var(--neutral-800)]">
              <p className="text-sm md:text-base font-semibold mb-3 md:mb-4 text-white">
                Prognose für {d.date.split(',')[0]}
              </p>
              <div className="grid grid-cols-2 gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                <MetricTile icon={Thermometer} label="Lufttemperatur" value={d.conditions.lufttemp} />
                <MetricTile icon={Droplet} label="relative Luftfeuchtigkeit" value={d.conditions.feuchtigkeit} />
                <MetricTile icon={Wind} label="Wind" value={d.conditions.wind} />
                <MetricTile icon={Sun} label="UV" value={d.conditions.uv} alert={d.conditions.assessmentAlert} onClick={() => setUvDetailOpen(true)} />
              </div>

              {/* Assessment temperature — full width blue tile */}
              <button
                type="button"
                onClick={() => setBeurtDetailOpen(true)}
                className="w-full text-left rounded-lg md:rounded-xl p-3 md:p-4 relative bg-[var(--brand-primary)] transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <div className="flex items-center gap-1 md:gap-1.5 mb-0.5 md:mb-1">
                  <Wind className="w-3 md:w-3.5 h-3 md:h-3.5 text-white/80" strokeWidth={1.5} />
                  <p className="text-xs text-white/80">Beurteilungstemperatur</p>
                </div>
                <p className="font-semibold leading-tight text-white" style={{ fontSize: 'var(--type-size-display)' }}>
                  {d.conditions.beurteilungsTemp}
                </p>
                {d.conditions.assessmentAlert && (
                  <AlertTriangle className="absolute bottom-2.5 md:bottom-3 right-2.5 md:right-3 w-3.5 md:w-4 h-3.5 md:h-4 text-white/60" strokeWidth={1.5} />
                )}
              </button>
            </div>

            </div>
          </div>
        </div>
      </div>

      {uvDetailOpen && (
        <UVDetailViewWeekly onClose={() => setUvDetailOpen(false)} days={DAYS} selectedDayIndex={selectedDay} />
      )}
      {beurtDetailOpen && (
        <BeurteilungstemperaturDetailViewWeekly onClose={() => setBeurtDetailOpen(false)} days={DAYS} selectedDayIndex={selectedDay} />
      )}

    </div>
  );
}
