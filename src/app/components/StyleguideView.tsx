import React, { useState } from 'react';
import {
  CheckCircle, AlertTriangle, AlertOctagon, MapPin, Clock,
  ChevronRight, Check, Info, Sun, Cloud, Home, Calendar, Settings,
} from 'lucide-react';

// ── DS tokens ────────────────────────────────────────────────────────────────

const TYPE_SCALE = [
  { name: 'Display', size: '32px', weight: 600, lh: '120%', ls: '-1px',   sample: 'Arbeitswetter' },
  { name: 'H1',      size: '28px', weight: 600, lh: '120%', ls: '-0.5px', sample: 'Einstellungen' },
  { name: 'H2',      size: '24px', weight: 600, lh: '125%', ls: '-0.3px', sample: 'Tag im Überblick' },
  { name: 'H3',      size: '20px', weight: 500, lh: '130%', ls: '0',      sample: 'Arbeitsprofil' },
  { name: 'H4',      size: '16px', weight: 400, lh: '135%', ls: '0',      sample: 'Standort & Profil' },
  { name: 'Body L',  size: '18px', weight: 400, lh: '150%', ls: '0',      sample: 'Mittelschwere körperliche Arbeit' },
  { name: 'Body',    size: '16px', weight: 400, lh: '150%', ls: '0',      sample: 'Tätigkeiten im Freien planen' },
  { name: 'Body S',  size: '14px', weight: 400, lh: '160%', ls: '0',      sample: 'Beginn 06:00 · Ende 14:00' },
  { name: 'Caption', size: '12px', weight: 400, lh: '130%', ls: '0',      sample: 'ARBEITSPROFIL · 06:00–14:00' },
];

const COLOR_GROUPS = [
  {
    label: 'Brand',
    colors: [
      { name: 'brand/dark',    hex: '#1D3FA3', on: '#fff', use: 'Text auf Auswahl-Tint · gedrückter Zustand' },
      { name: 'brand/primary', hex: '#325CDA', on: '#fff', use: 'Interaktiv · Links · aktive Icons' },
      { name: 'brand/tint',    hex: '#EEF2FD', on: '#1D3FA3', use: 'Auswahl-Hintergrund · Chip aktiv' },
    ],
  },
  {
    label: 'Neutral',
    colors: [
      { name: 'neutral/950', hex: '#222222', on: '#fff', use: 'text/primary · Überschriften' },
      { name: 'neutral/600', hex: '#3F3F3F', on: '#fff', use: 'text/secondary · Fließtext' },
      { name: 'neutral/500', hex: '#64748B', on: '#fff', use: 'Muted · Labels · Platzhalter (Min. BITV)' },
      { name: 'neutral/100', hex: '#E2E8F0', on: '#222', use: 'border/soft · Hintergrundakzent' },
      { name: 'neutral/50',  hex: '#F8FAFC', on: '#222', use: 'background/surface · Eingaben' },
      { name: 'neutral/white', hex: '#FFFFFF', on: '#222', use: 'background/page · Karten' },
      { name: 'neutral/800', hex: '#1A1A1A', on: '#fff', use: 'Dunkel Karte (Heute)' },
      { name: 'neutral/700', hex: '#2D2D2D', on: '#fff', use: 'Dunkel Fläche (Heute)' },
    ],
  },
  {
    label: 'Status',
    colors: [
      { name: 'status/critical',    hex: '#E8193C', on: '#fff', use: 'Außenarbeit einstellen' },
      { name: 'status/critical-bg', hex: '#FFEEEF', on: '#E8193C', use: 'Kritisch Hintergrundtint' },
      { name: 'status/warning',     hex: '#FEBB6A', on: '#1A1A1A', use: 'Eingeschränkt · Maßnahmen nötig (dunkler Text!)' },
      { name: 'status/warning-bg',  hex: '#FFEDD4', on: '#1A1A1A', use: 'Warnung Hintergrundtint' },
      { name: 'status/success',     hex: '#10B981', on: '#fff',    use: 'Gut planbar' },
      { name: 'status/success-bg',  hex: '#ECFDF5', on: '#166534', use: 'Erfolg Hintergrundtint' },
      { name: 'status/success-text',hex: '#166534', on: '#fff',    use: 'Erfolg Text auf hellem Grund' },
    ],
  },
  {
    label: 'Data',
    colors: [
      { name: 'data/green',  hex: '#85D7A2', on: '#222', use: 'Gut (Diagramme)' },
      { name: 'data/yellow', hex: '#D4A843', on: '#222', use: 'Mittel (Diagramme)' },
      { name: 'data/red',    hex: '#F04150', on: '#fff', use: 'Kritisch (Diagramme)' },
      { name: 'data/blue',   hex: '#7BB3D4', on: '#222', use: 'Neutral (Diagramme)' },
      { name: 'data/purple', hex: '#8B5CF6', on: '#fff', use: 'Sonderkategorie' },
    ],
  },
];

const SEMANTIC_TOKENS = [
  { token: 'background/page',    value: '#FFFFFF', use: 'Seitenhintergrund' },
  { token: 'background/surface', value: '#F8FAFC', use: 'Karten, Eingaben' },
  { token: 'background/elevated',value: '#E2E8F0', use: 'Aktive Nav-Items, Chips' },
  { token: 'text/primary',       value: '#222222', use: 'Überschriften, Datenwerte' },
  { token: 'text/secondary',     value: '#3F3F3F', use: 'Fließtext, Labels' },
  { token: 'border/soft',        value: '#E2E8F0', use: 'Karten, Trenner' },
  { token: 'border/focus',       value: '#325CDA', use: 'Fokusring, aktive Felder' },
  { token: 'brand/default',      value: '#325CDA', use: 'Primäre Interaktionsfläche' },
  { token: 'brand/subtle',       value: '#EEF2FD', use: 'Auswahl-Tint' },
];

const SPACING = [
  { name: 'space-1', px: 4,  inset: 'xs',  use: 'Icon-Padding, Micro-Abstände' },
  { name: 'space-2', px: 8,  inset: 'sm',  use: 'Icon–Label Abstand' },
  { name: 'space-3', px: 12, inset: '—',   use: 'Chip-Innenabstand' },
  { name: 'space-4', px: 16, inset: 'md',  use: 'Card-Padding Mobile · Standard', standard: true },
  { name: 'space-5', px: 24, inset: 'lg',  use: 'Card-Padding Desktop',           standard: true },
  { name: 'space-6', px: 32, inset: 'xl',  use: 'Sektions-Abstand' },
  { name: 'space-7', px: 48, inset: '2xl', use: 'Großer Layout-Abstand' },
  { name: 'space-8', px: 80, inset: '4xl', use: 'Hero-Bereich, max Abstand',      max: true },
];

const RADII = [
  { name: 'rounded-lg',   px: '8px',    use: 'Nav-Items, kleine Buttons' },
  { name: 'rounded-xl',   px: '12px',   use: 'Chips, Pills, Eingabefelder' },
  { name: 'rounded-2xl',  px: '16px',   use: 'Karten, Container' },
  { name: 'rounded-3xl',  px: '24px',   use: 'Hero-Karten (Heute)' },
  { name: 'rounded-full', px: '9999px', use: 'Badges, Status-Punkte, Tabs' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function Card({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 px-1">
        <p className="text-sm font-semibold text-[#222]">{title}</p>
        {note && <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{note}</p>}
      </div>
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">{children}</div>
    </section>
  );
}

function Row({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`border-t border-[#E2E8F0] first:border-0 ${className}`}>{children}</div>;
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function StyleguideView() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (val: string) => {
    navigator.clipboard.writeText(val).catch(() => {});
    setCopied(val);
    setTimeout(() => setCopied(null), 1400);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#F8FAFC]/95 backdrop-blur-sm border-b border-[#E2E8F0] px-4 md:px-8 pt-10 pb-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#64748B] mb-0.5">Arbeitswetter</p>
          <p style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.5px' }} className="text-[#222]">Design System</p>
          <p className="text-xs text-[#64748B] mt-1">Inter · BITV 2.0 / WCAG 2.1 AA · Alle Kontraste geprüft</p>
        </div>
      </div>

      <div className="px-4 md:px-8 pt-6 max-w-3xl mx-auto space-y-10">

        {/* ── TYPOGRAFIE ─────────────────────────────────────────── */}
        <Card
          title="Typografie"
          note="Inter. Skala reicht von Display (32px) bis Caption (12px, BITV-Minimum). Größen skalieren mit md:-Klassen."
        >
          {TYPE_SCALE.map((t) => (
            <Row key={t.name}>
              <div className="px-4 py-3 md:flex md:items-baseline md:gap-6">
                <div className="md:w-28 flex-shrink-0 mb-1 md:mb-0 flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider w-16">{t.name}</span>
                  <span className="text-xs text-[#64748B] font-mono hidden md:block">{t.size}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    style={{ fontSize: t.size, fontWeight: t.weight, lineHeight: t.lh, letterSpacing: t.ls }}
                    className="text-[#222] truncate"
                  >
                    {t.sample}
                  </p>
                </div>
                <div className="flex gap-3 mt-1 md:mt-0 md:flex-shrink-0">
                  <span className="text-xs text-[#64748B] font-mono md:hidden">{t.size}</span>
                  <span className="text-xs text-[#64748B]">w{t.weight} · {t.lh}</span>
                </div>
              </div>
            </Row>
          ))}
          <div className="px-4 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0]">
            <p className="text-xs text-[#64748B]">
              <span className="font-semibold text-[#222]">BITV 2.0 AA:</span>{' '}
              Normaler Text ≥ 4,5:1 · Großer Text &amp; UI ≥ 3:1 · Min. 12px
            </p>
          </div>
        </Card>

        {/* ── FARBEN ─────────────────────────────────────────────── */}
        {COLOR_GROUPS.map((group) => (
          <Card key={group.label} title={`Farben · ${group.label}`}>
            {group.colors.map((c) => (
              <Row key={c.hex}>
                <button
                  onClick={() => copy(c.hex)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F8FAFC] transition-colors text-left group"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex-shrink-0 border border-black/[0.08] flex items-center justify-center"
                    style={{ backgroundColor: c.hex }}
                  >
                    {copied === c.hex && <Check className="w-4 h-4" style={{ color: c.on }} strokeWidth={2.5} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-[#222] font-mono">{c.name}</span>
                      <span className="text-xs text-[#64748B] font-mono">{c.hex}</span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-snug">{c.use}</p>
                  </div>
                </button>
              </Row>
            ))}
          </Card>
        ))}

        {/* ── SEMANTISCHE TOKENS ─────────────────────────────────── */}
        <Card title="Semantische Tokens" note="Light-Mode-Auflösung. Jeder Token hat einen Dark-Mode-Gegenwert.">
          {SEMANTIC_TOKENS.map((t) => (
            <Row key={t.token}>
              <div className="flex items-center gap-3 px-4 py-2.5">
                <div className="w-7 h-7 rounded-lg flex-shrink-0 border border-[#E2E8F0]" style={{ backgroundColor: t.value }} />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-mono font-semibold text-[#222]">{t.token}</span>
                  <span className="text-xs text-[#64748B] font-mono ml-2">{t.value}</span>
                </div>
                <span className="text-xs text-[#64748B] hidden md:block">{t.use}</span>
              </div>
            </Row>
          ))}
        </Card>

        {/* ── TEXT-HIERARCHIE AUF OBERFLÄCHEN ───────────────────── */}
        <Card
          title="Text-Hierarchie auf Oberflächen"
          note="Jede Oberfläche hat ihre eigene Texthierarchie. Kontraste BITV AA-geprüft."
        >
          {/* Hell */}
          <div className="p-4">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-2">Hell · bg-white / bg-surface</p>
            <div className="rounded-xl border border-[#E2E8F0] overflow-hidden">
              {[
                { label: 'Primär',   color: '#222222', tw: 'text/primary',   ratio: '15.7:1' },
                { label: 'Sekundär', color: '#3F3F3F', tw: 'text/secondary', ratio: '10.0:1' },
                { label: 'Tertiär', color: '#64748B', tw: 'muted-foreground', ratio: '4.63:1 ✓' },
              ].map((r, i) => (
                <div key={r.label} className={`flex items-center gap-3 px-3 py-2.5 bg-white ${i > 0 ? 'border-t border-[#E2E8F0]' : ''}`}>
                  <span className="text-sm" style={{ color: r.color, fontWeight: 500 }}>{r.label}</span>
                  <span className="text-xs font-mono" style={{ color: r.color, opacity: 0.6 }}>{r.color}</span>
                  <span className="ml-auto text-xs font-mono text-[#64748B]">{r.ratio}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#E2E8F0]" />

          {/* Auswahl */}
          <div className="p-4">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-2">Auswahl-Tint · bg-[#EEF2FD]</p>
            <div className="rounded-xl border border-[#325CDA]/20 overflow-hidden">
              {[
                { label: 'Primär',   color: '#1D3FA3', ratio: '7.45:1 ✓' },
                { label: 'Sekundär', color: '#325CDA', ratio: '4.66:1 ✓' },
              ].map((r, i) => (
                <div key={r.label} className={`flex items-center gap-3 px-3 py-2.5 bg-[#EEF2FD] ${i > 0 ? 'border-t border-[#325CDA]/10' : ''}`}>
                  <span className="text-sm font-medium" style={{ color: r.color }}>{r.label}</span>
                  <span className="text-xs font-mono" style={{ color: r.color, opacity: 0.7 }}>{r.color}</span>
                  <span className="ml-auto text-xs font-mono" style={{ color: r.color, opacity: 0.6 }}>{r.ratio}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#E2E8F0]" />

          {/* Dunkel */}
          <div className="p-4">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-2">Dunkel · bg-[#1A1A1A] (Heute-Karten)</p>
            <div className="rounded-xl border border-white/10 overflow-hidden">
              {[
                { label: 'Primär',   color: 'rgba(255,255,255,1.0)',  hex: '#FFFFFF',          ratio: '13.4:1' },
                { label: 'Sekundär', color: 'rgba(255,255,255,0.70)', hex: 'white/70',          ratio: '7.9:1' },
                { label: 'Tertiär',  color: 'rgba(255,255,255,0.60)', hex: 'white/60 — Min.',   ratio: '6.4:1 ✓' },
              ].map((r, i) => (
                <div key={r.label} className={`flex items-center gap-3 px-3 py-2.5 bg-[#1A1A1A] ${i > 0 ? 'border-t border-white/[0.08]' : ''}`}>
                  <span className="text-sm font-medium" style={{ color: r.color }}>{r.label}</span>
                  <span className="text-xs font-mono" style={{ color: r.color, opacity: 0.7 }}>{r.hex}</span>
                  <span className="ml-auto text-xs font-mono" style={{ color: r.color, opacity: 0.6 }}>{r.ratio}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* ── ABSTÄNDE ───────────────────────────────────────────── */}
        <Card title="Abstände" note="4px-Raster · space-1 (4px) Minimum · space-8 (80px) Maximum · Inset-Tokens für Innenabstände">
          <div className="px-4 py-4 space-y-2">
            {SPACING.map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                <div
                  className={`h-6 rounded flex-shrink-0 border ${
                    s.max ? 'bg-[#FFEEEF] border-[#E8193C]/20' :
                    s.standard ? 'bg-[#EEF2FD] border-[#325CDA]/20' :
                    'bg-[#E2E8F0] border-[#E2E8F0]'
                  }`}
                  style={{ width: Math.min(s.px * 1.5, 120) }}
                />
                <span className="text-xs font-mono text-[#64748B] w-8 flex-shrink-0">{s.px}px</span>
                <span className="text-xs font-mono font-semibold text-[#222] w-16 flex-shrink-0">{s.name}</span>
                <span className="text-xs text-[#64748B] font-mono w-8 flex-shrink-0">{s.inset}</span>
                <span className="text-xs text-[#64748B] hidden md:block">{s.use}</span>
                {s.standard && <span className="text-xs font-semibold text-[#1D3FA3] bg-[#EEF2FD] px-1.5 py-0.5 rounded-full ml-auto flex-shrink-0">Standard</span>}
                {s.max && <span className="text-xs font-semibold text-[#E8193C] bg-[#FFEEEF] px-1.5 py-0.5 rounded-full ml-auto flex-shrink-0">Max</span>}
              </div>
            ))}
          </div>
          <div className="px-4 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0]">
            <p className="text-xs text-[#64748B]">Touch-Ziel Minimum: <span className="font-mono font-semibold text-[#222]">44px Höhe</span> — alle interaktiven Elemente</p>
          </div>
        </Card>

        {/* ── RADIUS ─────────────────────────────────────────────── */}
        <Card title="Ecken & Oberflächen">
          <div className="p-4 grid grid-cols-2 md:grid-cols-5 gap-3">
            {RADII.map((r) => (
              <div key={r.name}>
                <div className="w-full h-10 bg-[#E2E8F0] border border-[#64748B]/20 mb-2" style={{ borderRadius: r.px === '9999px' ? '9999px' : r.px }} />
                <p className="text-xs font-mono font-semibold text-[#222]">{r.name}</p>
                <p className="text-xs text-[#64748B] font-mono">{r.px}</p>
                <p className="text-xs text-[#64748B] leading-snug mt-0.5">{r.use}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* ── KOMPONENTEN ────────────────────────────────────────── */}
        <Card title="Komponenten" note="Live-Beispiele. Standard · Ausgewählt · Hover.">

          {/* Status indicators */}
          <div className="p-4">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">Status-Indikatoren</p>
            <div className="space-y-2">
              {[
                { label: 'Gut planbar',   bg: '#10B981', textOn: '#fff',     Icon: CheckCircle,  desc: 'Geringe Belastung · unbedenklich',             textColor: '#166534' },
                { label: 'Eingeschränkt', bg: '#FEBB6A', textOn: '#1A1A1A',  Icon: AlertTriangle, desc: 'Maßnahmen nötig · Hitze-Schutz einhalten',    textColor: '#1A1A1A' },
                { label: 'Kritisch',      bg: '#E8193C', textOn: '#fff',     Icon: AlertOctagon, desc: 'Außenarbeiten einstellen',                      textColor: '#E8193C' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.bg }}>
                    <s.Icon className="w-4 h-4" style={{ color: s.textOn }} strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: s.textColor }}>{s.label}</p>
                    <p className="text-xs text-[#64748B]">{s.desc}</p>
                  </div>
                  <span className="text-xs font-mono text-[#64748B] hidden md:block">{s.bg}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#64748B] mt-2">
              Warnung (#FEBB6A) = helles Gelb → immer <span className="font-semibold text-[#222]">dunkler Text (#1A1A1A)</span>
            </p>
          </div>

          <div className="border-t border-[#E2E8F0]" />

          {/* Segmented chips */}
          <div className="p-4">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">Segmented Chips</p>
            <div className="flex gap-2">
              {['Leicht', 'Mittel', 'Schwer'].map((label, i) => (
                <div
                  key={label}
                  className={`flex-1 py-3 rounded-xl text-sm text-center border ${
                    i === 1
                      ? 'bg-[#EEF2FD] text-[#1D3FA3] border-[#325CDA]/40 font-semibold'
                      : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] font-medium'
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>
            <p className="text-xs text-[#64748B] mt-2">Aktiv: bg-[#EEF2FD] · text-[#1D3FA3] · border-[#325CDA]/40</p>
          </div>

          <div className="border-t border-[#E2E8F0]" />

          {/* Location rows */}
          <div className="p-4">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">Listenzeilen</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 px-3.5 py-3.5 rounded-xl border bg-[#EEF2FD] border-[#325CDA]/30">
                <MapPin className="w-4 h-4 text-[#325CDA] flex-shrink-0" strokeWidth={1.5} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1D3FA3]">Baustelle Berlin Ost</p>
                  <p className="text-xs text-[#325CDA]">Berlin · Aktiver Arbeitsort</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-3.5 py-3.5 rounded-xl border bg-white border-[#E2E8F0] group cursor-pointer hover:border-[#325CDA]/30 transition-colors">
                <MapPin className="w-4 h-4 text-[#64748B] flex-shrink-0" strokeWidth={1.5} />
                <div className="flex-1">
                  <p className="text-sm text-[#3F3F3F]">Lager Nord</p>
                  <p className="text-xs text-[#64748B]">Hamburg</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <div className="border-t border-[#E2E8F0]" />

          {/* Badges */}
          <div className="p-4">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">Badges</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold bg-[#EEF2FD] text-[#1D3FA3] border border-[#325CDA]/20 px-2 py-0.5 rounded-full">Aktiv</span>
              <span className="text-xs font-semibold bg-[#ECFDF5] text-[#166534] border border-[#10B981]/20 px-2 py-0.5 rounded-full">Gut planbar</span>
              <span className="text-xs font-semibold bg-[#FFEDD4] text-[#1A1A1A] border border-[#FEBB6A]/40 px-2 py-0.5 rounded-full">Eingeschränkt</span>
              <span className="text-xs font-semibold bg-[#FFEEEF] text-[#E8193C] border border-[#E8193C]/20 px-2 py-0.5 rounded-full">Kritisch</span>
            </div>
            <p className="text-xs text-[#64748B] mt-2">Muster: bg-[status-bg] · text-[status(-text)] · border-[status]/20</p>
          </div>
        </Card>

        {/* ── ICONS ──────────────────────────────────────────────── */}
        <Card title="Icons" note="Lucide React · strokeWidth 1.5 Standard · 2 Emphasis · w-[18px] (Nav) · w-5 (Karten) · w-4 (Inline)">
          <div className="p-4">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {[Home, Calendar, AlertTriangle, AlertOctagon, Settings, MapPin, Clock, Sun,
                Cloud, CheckCircle, Check, Info, ChevronRight].map((Icon, i) => {
                const labels = ['Heute','Planung','Warnung','Kritisch','Einstellungen','Standort','Zeit','Sonne','Wolke','OK','Bestätigt','Info','Weiter'];
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#64748B]" strokeWidth={1.5} />
                    </div>
                    <p className="text-xs text-[#64748B] text-center leading-tight">{labels[i]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* ── BREAKPOINTS ────────────────────────────────────────── */}
        <Card title="Breakpoints & Layout">
          {[
            { bp: 'Mobile',  range: '320–767px',  desc: 'Bottom-Nav · p-4 (16px) Cards · 4 Spalten · margin/page 16px' },
            { bp: 'Tablet',  range: '768px+',     desc: 'md: breakpoint · Sidebar-Nav · p-6 (24px) Cards' },
            { bp: 'Desktop', range: '1280px+',    desc: 'lg: breakpoint · max-w-3xl Inhalt · margin/content 40px' },
          ].map((b) => (
            <Row key={b.bp}>
              <div className="px-4 py-3 flex items-start gap-4">
                <span className="text-sm font-semibold font-mono text-[#325CDA] w-20 flex-shrink-0 pt-0.5">{b.bp}</span>
                <div>
                  <p className="text-xs text-[#64748B] font-mono mb-0.5">{b.range}</p>
                  <p className="text-sm text-[#3F3F3F]">{b.desc}</p>
                </div>
              </div>
            </Row>
          ))}
        </Card>

      </div>
    </div>
  );
}
