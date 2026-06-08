import React, { useState, useRef, useEffect } from 'react';
import {
  HardHat, MapPin, Sun, CloudSun, Leaf, Building2,
  Check, Info, Clock, Trash2,
  ChevronRight, Moon, Sunrise, Bell, X, LocateFixed, Search,
} from 'lucide-react';
import PageHeader from './PageHeader';
import { Switch } from './ui/switch';

type Schwere    = 'leicht' | 'mittel' | 'schwer';
type Bekleidung = 'leicht' | 'mittel' | 'schwer';
type Umgebung   = 'sonne' | 'teilschatten' | 'schatten' | 'innen';
type Schicht    = 'früh' | 'tag' | 'nacht';

interface Ort { id: number; name: string; city: string; lat?: number; lng?: number; }
interface OrtVorschlag { id: string; name: string; region: string; lat: number; lng: number; }

interface EinstellungenProps {
  startZeit: string; setStartZeit: (v: string) => void;
  endZeit: string;   setEndZeit:   (v: string) => void;
  orte: Ort[];       setOrte:      React.Dispatch<React.SetStateAction<Ort[]>>;
  aktiveOrtId: number | null; setAktiveOrtId: (id: number | null) => void;
  schwere: Schwere;       setSchwere:    (v: Schwere) => void;
  bekleidung: Bekleidung; setBekleidung: (v: Bekleidung) => void;
  onClose?: () => void;
}

const MOCK_VORSCHLÄGE: OrtVorschlag[] = [
  { id: 'berlin-mitte',   name: 'Berlin Mitte',   region: 'Berlin',  lat: 52.5200, lng: 13.4050 },
  { id: 'hamburg-mitte',  name: 'Hamburg Mitte',  region: 'Hamburg', lat: 53.5511, lng: 9.9937  },
  { id: 'hamburg-hafen',  name: 'Hamburg Hafen',  region: 'Hamburg', lat: 53.5453, lng: 9.9679  },
  { id: 'hamburg-altona', name: 'Hamburg Altona', region: 'Hamburg', lat: 53.5498, lng: 9.9356  },
  { id: 'munich',         name: 'München',        region: 'Bayern',  lat: 48.1351, lng: 11.5820 },
  { id: 'cologne',        name: 'Köln',           region: 'NRW',     lat: 50.9333, lng: 6.9500  },
  { id: 'frankfurt',      name: 'Frankfurt',      region: 'Hessen',  lat: 50.1109, lng: 8.6821  },
  { id: 'flensburg',      name: 'Flensburg',      region: 'S-H',     lat: 54.7833, lng: 9.4333  },
];

const SCHICHT_PRESETS: Record<Schicht, { start: string; end: string }> = {
  früh:  { start: '05:00', end: '13:00' },
  tag:   { start: '06:00', end: '14:00' },
  nacht: { start: '22:00', end: '06:00' },
};

const SCHWERE_LABEL: Record<Schwere, string> = {
  leicht: 'Stehen, Gehen, Kontrolle, leichte Montagearbeiten',
  mittel: 'Handwerk, Montage, moderate Hebe- und Tragearbeiten',
  schwer: 'Schaufeln, Graben, schwere Hebe- und Tragearbeiten',
};

const BEKLEIDUNG_LABEL: Record<Bekleidung, string> = {
  leicht: 'Atmungsaktive Bekleidung, z. B. T-Shirt, Baumwoll-Arbeitshose',
  mittel: 'Typische Arbeitskleidung, z. B. Hemd, Arbeitshose (Baumwoll-Mix)',
  schwer: 'Schwere Schutzkleidung, z. B. Warnschutzoverall, Wetterschutzanzug',
};

const UMGEBUNG_OPTIONS: { id: Umgebung; label: string; sub: string; Icon: React.ElementType }[] = [
  { id: 'sonne',        label: 'Direkte Sonne',       sub: 'Meist ohne Schatten',     Icon: Sun       },
  { id: 'teilschatten', label: 'Teilw. verschattet',  sub: 'Gelegentl. Schatten',     Icon: CloudSun  },
  { id: 'schatten',     label: 'Überw. verschattet',  sub: 'Viel Schatten verfügbar', Icon: Leaf      },
  { id: 'innen',        label: 'Innen-/Außenwechsel', sub: 'Wechselnde Umgebung',     Icon: Building2 },
];

// Soft tint selected style (chips + cards)
const SEL = 'bg-[#eef2fd] text-[#1d3fa3] border-[#325cda]/40';
const UNSEL = 'bg-neutral-50 text-muted-foreground border-black/[0.08] hover:border-black/20 hover:text-black/80';

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function formatTimeInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  return digits;
}

function isValidTime(val: string): boolean {
  const match = val.match(/^(\d{2}):(\d{2})$/);
  if (!match) return false;
  const h = parseInt(match[1], 10);
  const min = parseInt(match[2], 10);
  return h >= 0 && h <= 23 && min >= 0 && min <= 59;
}

function ShiftTimeline({
  start, end, schicht, onStartChange, onEndChange, onCommit,
}: {
  start: string; end: string; schicht: Schicht;
  onStartChange: (t: string) => void;
  onEndChange: (t: string) => void;
  onCommit: () => void;
}) {
  const TOTAL = 24 * 60;
  const sMin = timeToMinutes(start);
  const eMin = timeToMinutes(end);
  const overnight = eMin <= sMin;

  const seg1Left  = (sMin / TOTAL) * 100;
  const seg1Width = overnight ? ((TOTAL - sMin) / TOTAL) * 100 : ((eMin - sMin) / TOTAL) * 100;
  const seg2Width = overnight ? (eMin / TOTAL) * 100 : 0;
  const durationMin = overnight ? (TOTAL - sMin + eMin) : (eMin - sMin);
  const durationH   = Math.floor(durationMin / 60);

  // Recommended early window 05:00–09:00
  const recL = ((5 * 60) / TOTAL) * 100;
  const recW = ((4 * 60) / TOTAL) * 100;

  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    mode: 'move' | 'resize-start' | 'resize-end';
    startX: number;
    origStartMin: number;
    origEndMin: number;
  } | null>(null);

  function minutesToTime(min: number): string {
    const m = ((min % TOTAL) + TOTAL) % TOTAL;
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }

  function startDrag(ev: React.PointerEvent, mode: 'move' | 'resize-start' | 'resize-end') {
    ev.preventDefault();
    ev.stopPropagation();
    dragRef.current = { mode, startX: ev.clientX, origStartMin: sMin, origEndMin: eMin };
    containerRef.current?.setPointerCapture(ev.pointerId);
  }

  function onMove(ev: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const deltaMin = Math.round(((ev.clientX - drag.startX) / rect.width * TOTAL) / 15) * 15;
    if (drag.mode === 'move') {
      onStartChange(minutesToTime(drag.origStartMin + deltaMin));
      onEndChange(minutesToTime(drag.origEndMin + deltaMin));
    } else if (drag.mode === 'resize-start') {
      onStartChange(minutesToTime(drag.origStartMin + deltaMin));
    } else {
      onEndChange(minutesToTime(drag.origEndMin + deltaMin));
    }
  }

  function onUp() {
    if (dragRef.current) { dragRef.current = null; onCommit(); }
  }

  return (
    <div className="mb-4">
      {/* Bar */}
      <div
        ref={containerRef}
        className="relative h-9 md:h-10 rounded-xl overflow-hidden border border-black/[0.06]"
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {/* Night zones */}
        <div className="absolute inset-y-0 left-0   bg-neutral-100" style={{ width: '25%' }} />
        <div className="absolute inset-y-0 right-0  bg-neutral-100" style={{ width: '25%' }} />
        {/* Daylight 06–18 */}
        <div className="absolute inset-y-0 bg-amber-50" style={{ left: '25%', width: '50%' }} />
        {/* Recommended early window (5–9) */}
        <div className="absolute inset-y-0 bg-emerald-50"
          style={{ left: `${recL}%`, width: `${recW}%` }} />
        {/* Work segment – draggable */}
        <div
          className="absolute top-1.5 bottom-1.5 bg-[#325cda] rounded-lg cursor-grab active:cursor-grabbing touch-none select-none"
          style={{ left: `${seg1Left}%`, width: `${seg1Width}%` }}
          onPointerDown={ev => startDrag(ev, 'move')}
        >
          {/* Left resize handle */}
          <div
            className="absolute left-0 inset-y-0 w-3 cursor-ew-resize"
            onPointerDown={ev => startDrag(ev, 'resize-start')}
          />
          {/* Right resize handle */}
          <div
            className="absolute right-0 inset-y-0 w-3 cursor-ew-resize"
            onPointerDown={ev => startDrag(ev, 'resize-end')}
          />
        </div>
        {overnight && (
          <div className="absolute top-1.5 bottom-1.5 bg-[#325cda] rounded-lg"
            style={{ left: '0%', width: `${seg2Width}%` }} />
        )}
      </div>

      {/* Tick row */}
      <div className="flex justify-between mt-1 px-0.5 items-center">
        {[
          { label: '0', Icon: null },
          { label: '6', Icon: Sunrise },
          { label: '12', Icon: Sun },
          { label: '18', Icon: Moon },
          { label: '24', Icon: null },
        ].map(({ label, Icon }) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            {Icon ? (
              <Icon className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
            ) : (
              <div className="w-3 h-3" />
            )}
            <span className="text-xs text-muted-foreground tabular-nums">{label}:00</span>
          </div>
        ))}
      </div>

      {/* Duration + hint */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-muted-foreground">{durationH} Stunden</span>
        {schicht === 'früh' && (
          <span className="text-xs text-[#166534] font-medium">
            Empfohlen bei Hitze
          </span>
        )}
        {schicht === 'nacht' && (
          <span className="text-xs text-muted-foreground">Nachtschicht</span>
        )}
      </div>
    </div>
  );
}

export default function EinstellungenView({ startZeit, setStartZeit, endZeit, setEndZeit, orte, setOrte, aktiveOrtId, setAktiveOrtId, schwere, setSchwere, bekleidung, setBekleidung, onClose }: EinstellungenProps) {
  const [umgebung,      setUmgebung]      = useState<Umgebung>('sonne');
  const [schicht,       setSchicht]       = useState<Schicht>('tag');
  const [startZeitDraft, setStartZeitDraft] = useState<string | null>(null);
  const [endZeitDraft,   setEndZeitDraft]   = useState<string | null>(null);
  const [benachrichtigungen, setBenachrichtigungen] = useState(true);
  const [showSaved,     setShowSaved]     = useState(false);
  const [suchQuery,              setSuchQuery]              = useState('');
  const [suchFokus,              setSuchFokus]              = useState(false);
  const [auswahl,                setAuswahl]                = useState<OrtVorschlag | null>(null);
  const [neuerOrtId,             setNeuerOrtId]             = useState<number | null>(null);
  const [showStandortGespeichert, setShowStandortGespeichert] = useState(false);

  const savedTimer       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const standortTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const neuerOrtTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suchInputRef     = useRef<HTMLInputElement>(null);
  const dropdownRef      = useRef<HTMLDivElement>(null);

  // Flash autosave feedback
  const markSaved = () => {
    setShowSaved(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setShowSaved(false), 2200);
  };

  // Attach markSaved to all setters
  const change = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) =>
    (val: T) => { setter(val); markSaved(); };

  const handleSchicht = (s: Schicht) => {
    setSchicht(s);
    setStartZeit(SCHICHT_PRESETS[s].start);
    setEndZeit(SCHICHT_PRESETS[s].end);
    markSaved();
  };

  const deleteOrt = (id: number) => {
    setOrte(prev => prev.filter(o => o.id !== id));
    if (aktiveOrtId === id) setAktiveOrtId(null);
    markSaved();
  };

  const handleSaveOrt = () => {
    if (!auswahl) return;
    const newId = Date.now();
    setOrte(prev => [{ id: newId, name: auswahl.name, city: auswahl.region, lat: auswahl.lat, lng: auswahl.lng }, ...prev]);
    setAktiveOrtId(newId);
    setNeuerOrtId(newId);
    setShowStandortGespeichert(true);
    setSuchQuery('');
    setAuswahl(null);
    setSuchFokus(false);
    markSaved();
    if (standortTimer.current) clearTimeout(standortTimer.current);
    standortTimer.current = setTimeout(() => setShowStandortGespeichert(false), 3500);
    if (neuerOrtTimer.current) clearTimeout(neuerOrtTimer.current);
    neuerOrtTimer.current = setTimeout(() => setNeuerOrtId(null), 5000);
  };

  const handleGPSWählen = () => {
    setSuchQuery('Aktueller Standort');
    setAuswahl({ id: 'gps', name: 'Hamburg Mitte', region: 'Hamburg', lat: 53.5511, lng: 9.9937 });
    setSuchFokus(false);
  };

  const vorschläge = suchQuery.trim().length > 0
    ? MOCK_VORSCHLÄGE.filter(v =>
        v.name.toLowerCase().includes(suchQuery.toLowerCase()) ||
        v.region.toLowerCase().includes(suchQuery.toLowerCase())
      ).slice(0, 4)
    : MOCK_VORSCHLÄGE.slice(0, 4);

  const showDropdown = suchFokus && !auswahl;

  // Chip component for reuse
  const Chip = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`flex-1 py-3 rounded-xl text-sm transition-all border ${
        selected ? `${SEL} font-semibold` : `${UNSEL} font-medium`
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-neutral-100 pb-28">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-neutral-100/95 backdrop-blur-sm border-b border-black/[0.06]">
        <div className="relative">
          <PageHeader
            title="Einstellungen"
            variant="light"
          />
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/[0.06] transition-colors"
              aria-label="Schließen"
            >
              <X className="w-4 h-4" style={{ color: 'var(--neutral-600)' }} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* Autosave feedback - now outside header */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-2">
        <div className="flex justify-end">
          <span
            className="text-xs text-muted-foreground flex items-center gap-1.5 pb-0.5 transition-opacity duration-300"
            style={{ opacity: showSaved ? 1 : 0 }}
            aria-live="polite"
          >
            <Check className="w-3 h-3 text-[#166534]" strokeWidth={2.5} />
            Gespeichert
          </span>
        </div>
      </div>

      <div className="px-4 md:px-8 pt-6 space-y-8 max-w-4xl mx-auto">

        {/* ── SECTION 1: Standort ─────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Standort</p>
            <p className="text-xs text-muted-foreground ml-1">· Verbessert lokale Vorhersagen</p>
          </div>

          <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden divide-y divide-black/[0.05]">

            {/* Success banner */}
            <div
              className="flex items-center gap-3 bg-emerald-50 px-4 transition-all duration-300 overflow-hidden"
              style={{ maxHeight: showStandortGespeichert ? '64px' : '0px', opacity: showStandortGespeichert ? 1 : 0, paddingTop: showStandortGespeichert ? '12px' : '0', paddingBottom: showStandortGespeichert ? '12px' : '0' }}
              aria-live="polite"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-emerald-700" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-semibold text-emerald-800">Standort erfolgreich gespeichert</span>
            </div>

            {/* Search field + dropdown */}
            <div className="relative p-4 md:p-6" ref={dropdownRef}>
              <label className="block text-sm font-semibold text-black mb-3" htmlFor="ort-suche">
                Einsatzort suchen
              </label>
              <div className={`bg-neutral-100 border rounded-xl transition-all ${
                suchFokus ? 'border-[#325cda] bg-white shadow-[0_0_0_3px_rgba(50,92,218,0.12)]' : 'border-transparent'
              } ${showDropdown ? 'rounded-b-none border-b-0' : ''}`}>
                <div className="flex items-center gap-3 px-3.5 py-3">
                  <Search className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    suchFokus ? 'text-[#325cda]' : 'text-black/30'
                  }`} strokeWidth={2} />
                  <input
                    id="ort-suche"
                    ref={suchInputRef}
                    type="text"
                    value={suchQuery}
                    onChange={e => { setSuchQuery(e.target.value); setAuswahl(null); }}
                    onFocus={() => setSuchFokus(true)}
                    onBlur={() => setTimeout(() => setSuchFokus(false), 150)}
                    placeholder="Stadt oder Postleitzahl..."
                    className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground/60 text-black"
                    aria-label="Ort suchen"
                  />
                  {suchQuery && (
                    <button
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => { setSuchQuery(''); setAuswahl(null); suchInputRef.current?.focus(); }}
                      className="text-black/40 hover:text-black/70 transition-colors"
                      aria-label="Suche löschen"
                    >
                      <X className="w-4 h-4" strokeWidth={2} />
                    </button>
                  )}
                </div>
              </div>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute left-4 right-4 md:left-6 md:right-6 bg-white border border-[#325cda] border-t-black/[0.06] rounded-b-xl shadow-lg
                  divide-y divide-black/[0.05] overflow-hidden z-10">
                  {/* GPS option */}
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={handleGPSWählen}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#eef2fd] flex items-center justify-center flex-shrink-0">
                      <LocateFixed className="w-3.5 h-3.5 text-[#325cda]" strokeWidth={2} />
                    </div>
                    <span className="text-sm font-semibold text-black">Aktueller Standort</span>
                  </button>
                  {/* Search results */}
                  {vorschläge.map(v => (
                    <button
                      key={v.id}
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => { setAuswahl(v); setSuchQuery(`${v.name}, ${v.region}`); setSuchFokus(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-50 transition-colors text-left"
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground/60 flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-sm text-black">
                        <span className="font-semibold">{v.name}</span>
                        <span className="text-muted-foreground">, {v.region}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Selection confirmation */}
              {auswahl && (
                <div className="mt-3 bg-neutral-50 rounded-xl border border-black/[0.06] p-4">
                  {auswahl.id === 'gps' && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <LocateFixed className="w-3 h-3 text-[#325cda] flex-shrink-0" strokeWidth={2} />
                      <span className="text-xs font-medium text-[#325cda]">GPS-Standort</span>
                    </div>
                  )}
                  <p className="text-sm font-semibold text-black">{auswahl.name}, {auswahl.region}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Koordinaten: {auswahl.lat.toFixed(4)}° N, {auswahl.lng.toFixed(4)}° E
                  </p>
                  <button
                    onClick={handleSaveOrt}
                    className="w-full md:w-auto md:px-8 mt-3 bg-[#325cda] hover:bg-[#1d3fa3] active:scale-[0.99]
                      text-white text-sm font-semibold rounded-xl py-3 transition-all"
                  >
                    Als Arbeitsort speichern
                  </button>
                </div>
              )}
            </div>

            {/* Saved locations */}
            {orte.length > 0 && (
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground px-4 md:px-6 pt-4 pb-2">
                  Gespeicherte Standorte
                </p>
                <div className="divide-y divide-black/[0.05]">
                  {orte.map(ort => {
                    const isActive  = aktiveOrtId === ort.id;
                    const isNew     = neuerOrtId  === ort.id;
                    return (
                      <div
                        key={ort.id}
                        className={`flex items-center gap-3 px-4 md:px-6 py-3.5 transition-colors cursor-pointer ${
                          isActive ? 'bg-[#eef2fd]' : 'hover:bg-neutral-50'
                        }`}
                        onClick={() => { setAktiveOrtId(ort.id); markSaved(); }}
                        role="button"
                        aria-pressed={isActive}
                      >
                        <MapPin
                          className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#325cda]' : 'text-muted-foreground/50'}`}
                          strokeWidth={1.5}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold leading-tight ${
                            isActive ? 'text-[#1d3fa3]' : 'text-black/80'
                          }`}>{ort.name}</p>
                          {isNew ? (
                            <span className="text-xs font-semibold tracking-wide uppercase text-emerald-700">
                              Gerade gespeichert
                            </span>
                          ) : (
                            <p className="text-xs text-muted-foreground mt-0.5">{ort.city}</p>
                          )}
                        </div>
                        {isActive && (
                          <span className="text-xs font-semibold bg-[#325cda]/10 text-[#1d3fa3] border border-[#325cda]/20 px-2 py-0.5 rounded-full flex-shrink-0">
                            Aktiv
                          </span>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); deleteOrt(ort.id); }}
                          className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                          aria-label={`${ort.name} löschen`}
                        >
                          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </section>

        {/* ── SECTION 2: Arbeitsprofil ─────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <HardHat className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Arbeitsprofil</p>
            <p className="text-xs text-muted-foreground ml-1">· Beeinflusst Empfehlungen</p>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-black/[0.06] divide-y divide-black/[0.05]">

            {/* Arbeitsschwere */}
            <div className="p-4 md:p-6">
              <div className="flex items-center gap-1.5 mb-3">
                <p className="text-sm font-semibold text-black">Arbeitsschwere</p>
                <button aria-label="Info zur Arbeitsschwere" className="rounded p-0.5 hover:bg-black/[0.04] transition-colors">
                  <Info className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex gap-2 md:gap-3">
                <Chip label="Leicht" selected={schwere === 'leicht'} onClick={() => change(setSchwere)('leicht')} />
                <Chip label="Mittel" selected={schwere === 'mittel'} onClick={() => change(setSchwere)('mittel')} />
                <Chip label="Schwer" selected={schwere === 'schwer'} onClick={() => change(setSchwere)('schwer')} />
              </div>
              <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed">{SCHWERE_LABEL[schwere]}</p>
            </div>

            {/* Arbeitskleidung */}
            <div className="p-4 md:p-6">
              <div className="flex items-center gap-1.5 mb-3">
                <p className="text-sm font-semibold text-black">Arbeitskleidung</p>
                <button aria-label="Info zur Arbeitskleidung" className="rounded p-0.5 hover:bg-black/[0.04] transition-colors">
                  <Info className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex gap-2 md:gap-3">
                <Chip label="Leicht" selected={bekleidung === 'leicht'} onClick={() => change(setBekleidung)('leicht')} />
                <Chip label="Mittel" selected={bekleidung === 'mittel'} onClick={() => change(setBekleidung)('mittel')} />
                <Chip label="Schwer" selected={bekleidung === 'schwer'} onClick={() => change(setBekleidung)('schwer')} />
              </div>
              <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed">{BEKLEIDUNG_LABEL[bekleidung]}</p>
            </div>

            {/* Arbeitsumgebung */}
            <div className="p-4 md:p-6">
              <p className="text-sm font-semibold text-black mb-3">Arbeitsumgebung</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                {UMGEBUNG_OPTIONS.map(({ id, label, sub, Icon }) => {
                  const sel = umgebung === id;
                  return (
                    <button
                      key={id}
                      onClick={() => change(setUmgebung)(id)}
                      className={`relative p-3.5 md:p-4 rounded-xl text-left transition-all border ${
                        sel
                          ? `${SEL}`
                          : 'bg-neutral-50 border-black/[0.08] hover:border-black/20'
                      }`}
                    >
                      {sel && (
                        <div className="absolute top-2.5 right-2.5">
                          <Check className="w-3.5 h-3.5 text-[#325cda]" strokeWidth={2.5} />
                        </div>
                      )}
                      <Icon
                        className={`w-5 h-5 mb-3 ${sel ? 'text-[#325cda]' : 'text-muted-foreground'}`}
                        strokeWidth={1.5}
                      />
                      <p className={`text-xs font-semibold leading-tight break-words ${sel ? 'text-[#1d3fa3]' : 'text-black/80'}`}>
                        {label}
                      </p>
                      <p className={`text-xs mt-1 leading-tight break-words ${sel ? 'text-[#325cda]' : 'text-muted-foreground'}`}>
                        {sub}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Typische Arbeitszeiten */}
            <div className="p-4 md:p-6">
              <p className="text-sm font-semibold text-black mb-3">Typische Arbeitszeiten</p>

              {/* Shift chips */}
              <div className="flex gap-2 md:gap-3 mb-4">
                <Chip label="Früh"  selected={schicht === 'früh'}  onClick={() => handleSchicht('früh')}  />
                <Chip label="Tag"   selected={schicht === 'tag'}   onClick={() => handleSchicht('tag')}   />
                <Chip label="Nacht" selected={schicht === 'nacht'} onClick={() => handleSchicht('nacht')} />
              </div>

              {/* Timeline */}
              <ShiftTimeline
                start={startZeit}
                end={endZeit}
                schicht={schicht}
                onStartChange={setStartZeit}
                onEndChange={setEndZeit}
                onCommit={markSaved}
              />

              {/* Time inputs */}
              <div className="flex items-center gap-3 mb-3">
                <label className="flex items-center gap-2 bg-neutral-50 border border-black/10 rounded-xl px-4 py-2.5
                  hover:border-[#325cda]/40 hover:bg-[#eef2fd] transition-colors
                  focus-within:border-[#325cda]/60 focus-within:bg-[#eef2fd] focus-within:ring-2 focus-within:ring-[#325cda]/20
                  cursor-text">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 pointer-events-none" strokeWidth={1.5} />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={startZeitDraft ?? startZeit}
                    placeholder="HH:MM"
                    maxLength={5}
                    onChange={e => setStartZeitDraft(formatTimeInput(e.target.value))}
                    onFocus={e => { setStartZeitDraft(startZeit); e.target.select(); }}
                    onBlur={() => {
                      const val = startZeitDraft ?? startZeit;
                      if (isValidTime(val)) { setStartZeit(val); markSaved(); }
                      setStartZeitDraft(null);
                    }}
                    className="text-sm font-semibold tabular-nums text-black bg-transparent border-none outline-none cursor-text p-0 m-0 w-[50px]"
                    aria-label="Arbeitsbeginn"
                  />
                </label>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <div className="w-4 h-px bg-current" />
                  <div className="w-1 h-1 rounded-full bg-current" />
                  <div className="w-4 h-px bg-current" />
                </div>

                <label className="flex items-center gap-2 bg-neutral-50 border border-black/10 rounded-xl px-4 py-2.5
                  hover:border-[#325cda]/40 hover:bg-[#eef2fd] transition-colors
                  focus-within:border-[#325cda]/60 focus-within:bg-[#eef2fd] focus-within:ring-2 focus-within:ring-[#325cda]/20
                  cursor-text">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 pointer-events-none" strokeWidth={1.5} />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={endZeitDraft ?? endZeit}
                    placeholder="HH:MM"
                    maxLength={5}
                    onChange={e => setEndZeitDraft(formatTimeInput(e.target.value))}
                    onFocus={e => { setEndZeitDraft(endZeit); e.target.select(); }}
                    onBlur={() => {
                      const val = endZeitDraft ?? endZeit;
                      if (isValidTime(val)) { setEndZeit(val); markSaved(); }
                      setEndZeitDraft(null);
                    }}
                    className="text-sm font-semibold tabular-nums text-black bg-transparent border-none outline-none cursor-text p-0 m-0 w-[50px]"
                    aria-label="Arbeitsende"
                  />
                </label>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Frühere Schichten schützen Ihre Mitarbeiter bei Hitze
              </p>
            </div>

          </div>
        </section>

        {/* ── SECTION 3: Benachrichtigungen ───────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Bell className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Benachrichtigungen</p>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-black/[0.06]">
            <div className="flex items-center justify-between p-4 md:p-6">
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-semibold text-black">Push-Benachrichtigungen</p>
                <p className="text-xs mt-1 leading-relaxed">
                  {benachrichtigungen ? (
                    <><span className="font-semibold text-[#166534]">An</span><span className="text-muted-foreground"> · Hinweise bei Hitze, Unwetter und Arbeitsschutzempfehlungen</span></>
                  ) : (
                    <><span className="font-semibold text-muted-foreground">Aus</span><span className="text-muted-foreground"> · Du erhältst keine Hinweise</span></>
                  )}
                </p>
              </div>
              <Switch
                checked={benachrichtigungen}
                onCheckedChange={(val) => { setBenachrichtigungen(val); markSaved(); }}
                aria-label="Push-Benachrichtigungen aktivieren"
                className="data-[state=checked]:bg-[#325cda] flex-shrink-0 h-6 w-11"
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
