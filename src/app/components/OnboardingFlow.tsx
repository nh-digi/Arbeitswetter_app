import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft, X, MapPin, HardHat, Clock, Check,
  Search, LocateFixed, Shirt, ShieldCheck, Eye,
  Sunrise, Sun, Moon,
} from 'lucide-react';

type Schwere    = 'leicht' | 'mittel' | 'schwer';
type Bekleidung = 'leicht' | 'mittel' | 'schwer';
type Schicht    = 'früh' | 'tag' | 'nacht';

interface Ort { id: number; name: string; city: string; lat?: number; lng?: number; }
interface OrtVorschlag { id: string; name: string; region: string; lat: number; lng: number; }

interface OnboardingFlowProps {
  schwere:        Schwere;
  setSchwere:     (v: Schwere) => void;
  bekleidung:     Bekleidung;
  setBekleidung:  (v: Bekleidung) => void;
  startZeit:      string;
  setStartZeit:   (v: string) => void;
  endZeit:        string;
  setEndZeit:     (v: string) => void;
  orte:           Ort[];
  setOrte:        React.Dispatch<React.SetStateAction<Ort[]>>;
  aktiveOrtId:    number | null;
  setAktiveOrtId: (id: number | null) => void;
  onClose:        () => void;
}

// ── Constants (same as EinstellungenView) ─────────────────────────────────────

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

const SCHWERE_OPTIONS: { id: Schwere; label: string; sub: string; Icon: React.ElementType }[] = [
  { id: 'leicht', label: 'Leichte Arbeit',  sub: 'Für leichte Tätigkeiten, z. B. Inspektionen',        Icon: Eye        },
  { id: 'mittel', label: 'Mittlere Arbeit', sub: 'Mittel für typische körperliche Arbeit',              Icon: HardHat    },
  { id: 'schwer', label: 'Schwere Arbeit',  sub: 'Für schwere körperliche Arbeit, z. B. Bauarbeiten',  Icon: ShieldCheck },
];

const BEKLEIDUNG_OPTIONS: { id: Bekleidung; label: string; sub: string; Icon: React.ElementType }[] = [
  { id: 'leicht', label: 'Leichte Kleidung', sub: 'T-Shirt, dünne Hose',                      Icon: Shirt      },
  { id: 'mittel', label: 'Arbeitskleidung',  sub: 'Arbeitshose, Hemd',                          Icon: HardHat    },
  { id: 'schwer', label: 'Schutzausrüstung', sub: 'Warnweste, Helm, Sicherheitsschuhe',         Icon: ShieldCheck },
];

const SCHWERE_LABEL: Record<Schwere, string> = {
  leicht: 'Leichte Arbeit',
  mittel: 'Mittlere Arbeit',
  schwer: 'Schwere Arbeit',
};

const BEKLEIDUNG_LABEL: Record<Bekleidung, string> = {
  leicht: 'Leichte Kleidung',
  mittel: 'Arbeitskleidung',
  schwer: 'Schutzausrüstung',
};

const SCHICHT_LABEL: Record<Schicht, string> = {
  früh:  'Frühschicht',
  tag:   'Tagschicht',
  nacht: 'Nachtschicht',
};

// ── Shared UI classes (same as EinstellungenView) ─────────────────────────────
const SEL   = 'bg-[#eef2fd] text-[#1d3fa3] border-[#325cda]/40';
const UNSEL = 'bg-neutral-50 text-muted-foreground border-black/[0.08] hover:border-black/20 hover:text-black/80';

// ── Chip (identical to EinstellungenView) ─────────────────────────────────────
function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 rounded-xl text-sm transition-all border ${
        selected ? `${SEL} font-semibold` : `${UNSEL} font-medium`
      }`}
    >
      {label}
    </button>
  );
}

// ── SelectionCard (Arbeitsumgebung-style from EinstellungenView) ──────────────
function SelectionCard<T extends string>({
  id, label, sub, Icon, selected, onClick,
}: { id: T; label: string; sub: string; Icon: React.ElementType; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full p-4 rounded-xl text-left transition-all border flex items-center gap-4 ${
        selected ? SEL : `bg-neutral-50 border-black/[0.08] hover:border-black/20`
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3">
          <Check className="w-3.5 h-3.5 text-[#325cda]" strokeWidth={2.5} />
        </div>
      )}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
        selected ? 'bg-[#325cda]/10' : 'bg-white border border-black/[0.06]'
      }`}>
        <Icon className={`w-4.5 h-4.5 ${selected ? 'text-[#325cda]' : 'text-muted-foreground'}`} strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <p className={`text-sm font-semibold leading-tight ${selected ? 'text-[#1d3fa3]' : 'text-black/80'}`}>{label}</p>
        <p className={`text-xs mt-0.5 leading-tight ${selected ? 'text-[#325cda]' : 'text-muted-foreground'}`}>{sub}</p>
      </div>
    </button>
  );
}

// ── Value Chip (summary rows) ─────────────────────────────────────────────────
function ValueChip({ label }: { label: string }) {
  return (
    <span className="bg-[#eef2fd] text-[#1d3fa3] rounded-full px-2.5 py-0.5 text-xs font-semibold flex-shrink-0">
      {label}
    </span>
  );
}

// ── Time helpers (same as EinstellungenView) ────────────────────────────────────
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

// ── ShiftTimeline (identical to EinstellungenView) ────────────────────────────
function ShiftTimeline({
  start, end, schicht, onStartChange, onEndChange, onCommit,
}: {
  start: string; end: string; schicht: 'früh' | 'tag' | 'nacht';
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
    <div className="mb-2">
      <div
        ref={containerRef}
        className="relative h-9 rounded-xl overflow-hidden border border-black/[0.06]"
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div className="absolute inset-y-0 left-0 bg-neutral-100" style={{ width: '25%' }} />
        <div className="absolute inset-y-0 right-0 bg-neutral-100" style={{ width: '25%' }} />
        <div className="absolute inset-y-0 bg-amber-50" style={{ left: '25%', width: '50%' }} />
        <div className="absolute inset-y-0 bg-emerald-50" style={{ left: `${recL}%`, width: `${recW}%` }} />
        <div
          className="absolute top-1.5 bottom-1.5 bg-[#325cda] rounded-lg cursor-grab active:cursor-grabbing touch-none select-none"
          style={{ left: `${seg1Left}%`, width: `${seg1Width}%` }}
          onPointerDown={ev => startDrag(ev, 'move')}
        >
          <div className="absolute left-0 inset-y-0 w-3 cursor-ew-resize" onPointerDown={ev => startDrag(ev, 'resize-start')} />
          <div className="absolute right-0 inset-y-0 w-3 cursor-ew-resize" onPointerDown={ev => startDrag(ev, 'resize-end')} />
        </div>
        {overnight && (
          <div className="absolute top-1.5 bottom-1.5 bg-[#325cda] rounded-lg" style={{ left: '0%', width: `${seg2Width}%` }} />
        )}
      </div>
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
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-xs text-muted-foreground">{durationH} Stunden</span>
        {schicht === 'früh' && <span className="text-xs text-[#166534] font-medium">Empfohlen bei Hitze</span>}
        {schicht === 'nacht' && <span className="text-xs text-muted-foreground">Nachtschicht</span>}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function OnboardingFlow({
  schwere, setSchwere,
  bekleidung, setBekleidung,
  startZeit, setStartZeit,
  endZeit, setEndZeit,
  orte, setOrte,
  aktiveOrtId, setAktiveOrtId,
  onClose,
}: OnboardingFlowProps) {
  const TOTAL_STEPS = 6;
  const [step, setStep]       = useState(0);
  const directionRef          = useRef<1 | -1>(1);
  const [animKey, setAnimKey] = useState(0);

  // Location search state
  const [suchQuery,  setSuchQuery]  = useState('');
  const [suchFokus,  setSuchFokus]  = useState(false);
  const [auswahl,    setAuswahl]    = useState<OrtVorschlag | null>(null);
  const suchInputRef = useRef<HTMLInputElement>(null);

  // Time draft state (for editable inputs)
  const [startZeitDraft, setStartZeitDraft] = useState<string | null>(null);
  const [endZeitDraft,   setEndZeitDraft]   = useState<string | null>(null);

  // Shift preset display (local — synced to props)
  const [schicht, setSchicht] = useState<Schicht>(() => {
    if (startZeit === '05:00' && endZeit === '13:00') return 'früh';
    if (startZeit === '22:00' && endZeit === '06:00') return 'nacht';
    return 'tag';
  });

  function go(next: number) {
    directionRef.current = next > step ? 1 : -1;
    setStep(next);
    setAnimKey(k => k + 1);
  }

  function handleSchicht(s: Schicht) {
    setSchicht(s);
    setStartZeit(SCHICHT_PRESETS[s].start);
    setEndZeit(SCHICHT_PRESETS[s].end);
  }

  function handleSelectCity(v: OrtVorschlag) {
    setAuswahl(v);
    setSuchQuery(`${v.name}, ${v.region}`);
    setSuchFokus(false);
    // Live-apply immediately
    const newId = Date.now();
    setOrte(prev => {
      const without = prev.filter(o => o.name !== v.name);
      return [{ id: newId, name: v.name, city: v.region, lat: v.lat, lng: v.lng }, ...without];
    });
    setAktiveOrtId(newId);
  }

  function handleGPS() {
    const gps: OrtVorschlag = { id: 'gps', name: 'Hamburg Mitte', region: 'Hamburg', lat: 53.5511, lng: 9.9937 };
    handleSelectCity(gps);
    setSuchQuery('Aktueller Standort');
  }

  function clearCity() {
    setSuchQuery('');
    setAuswahl(null);
    suchInputRef.current?.focus();
  }

  const vorschläge = suchQuery.trim().length > 0
    ? MOCK_VORSCHLÄGE.filter(v =>
        v.name.toLowerCase().includes(suchQuery.toLowerCase()) ||
        v.region.toLowerCase().includes(suchQuery.toLowerCase())
      ).slice(0, 4)
    : MOCK_VORSCHLÄGE.slice(0, 4);

  const showDropdown = suchFokus && !auswahl;

  // Derive active location name for summary
  const activeOrt = orte.find(o => o.id === aktiveOrtId);

  // ── Screens ─────────────────────────────────────────────────────────────────

  const screens = [
    // 0 — Willkommen
    <div key="welcome" className="flex-1 flex flex-col">
      <div className="my-auto pt-14 flex flex-col items-center text-center gap-6">
        <div className="w-24 h-24 rounded-3xl bg-[#eef2fd] flex items-center justify-center">
          <HardHat className="w-12 h-12 text-[#325cda]" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-black leading-tight">
            Willkommen bei<br />Arbeitswetter
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Hitze- und UV-Schutz für Ihre Arbeit im Freien. Richten Sie Ihr Arbeitsprofil in wenigen Schritten ein.
          </p>
        </div>
      </div>
    </div>,

    // 1 — Standort
    <div key="standort" className="space-y-4 pt-2">
      <div>
        <div className="flex items-center gap-2 mb-1 px-0.5">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Standort</p>
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-black mt-2">Wo arbeiten Sie?</h2>
        <p className="text-sm text-muted-foreground mt-1">Für genaue lokale Vorhersagen und Warnungen.</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06]">
        <div className="relative p-4">
          <label className="block text-sm font-semibold text-black mb-3" htmlFor="ob-ort-suche">
            Arbeitsort suchen
          </label>
          <div className={`bg-neutral-100 border rounded-xl transition-all ${
            suchFokus ? 'border-[#325cda] bg-white shadow-[0_0_0_3px_rgba(50,92,218,0.12)]' : 'border-transparent'
          } ${showDropdown ? 'rounded-b-none border-b-0' : ''}`}>
            <div className="flex items-center gap-3 px-3.5 py-3">
              <Search className={`w-4 h-4 flex-shrink-0 transition-colors ${suchFokus ? 'text-[#325cda]' : 'text-black/30'}`} strokeWidth={2} />
              <input
                id="ob-ort-suche"
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
                  onClick={clearCity}
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
            <div className="absolute left-4 right-4 bg-white border border-[#325cda] border-t-black/[0.06] rounded-b-xl shadow-lg divide-y divide-black/[0.05] overflow-hidden z-10">
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={handleGPS}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-50 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-full bg-[#eef2fd] flex items-center justify-center flex-shrink-0">
                  <LocateFixed className="w-3.5 h-3.5 text-[#325cda]" strokeWidth={2} />
                </div>
                <span className="text-sm font-semibold text-black">Aktueller Standort</span>
              </button>
              {vorschläge.map(v => (
                <button
                  key={v.id}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => handleSelectCity(v)}
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
            <div className="mt-3 bg-[#eef2fd] rounded-xl border border-[#325cda]/20 p-3.5 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#325cda]/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-3.5 h-3.5 text-[#325cda]" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1d3fa3]">{auswahl.name}</p>
                <p className="text-xs text-[#325cda]/70">{auswahl.region}</p>
              </div>
              <button onClick={clearCity} className="text-[#325cda]/50 hover:text-[#325cda] transition-colors">
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </div>


    </div>,

    // 2 — Arbeitsschwere
    <div key="schwere" className="flex-1 flex flex-col justify-center space-y-4 py-4">
      <div>
        <div className="flex items-center gap-2 mb-1 px-0.5">
          <HardHat className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Arbeitsprofil</p>
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-black mt-2">Wie schwer ist Ihre Arbeit?</h2>
        <p className="text-sm text-muted-foreground mt-1">Beeinflusst die Beurteilungstemperatur.</p>
      </div>
      <div className="space-y-2.5">
        {SCHWERE_OPTIONS.map(opt => (
          <SelectionCard
            key={opt.id}
            id={opt.id}
            label={opt.label}
            sub={opt.sub}
            Icon={opt.Icon}
            selected={schwere === opt.id}
            onClick={() => setSchwere(opt.id)}
          />
        ))}
      </div>
    </div>,

    // 3 — Arbeitskleidung
    <div key="bekleidung" className="flex-1 flex flex-col justify-center space-y-4 py-4">
      <div>
        <div className="flex items-center gap-2 mb-1 px-0.5">
          <Shirt className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Arbeitsprofil</p>
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-black mt-2">Welche Kleidung tragen Sie?</h2>
        <p className="text-sm text-muted-foreground mt-1">Schwere Kleidung erhöht die Wärmebelastung.</p>
      </div>
      <div className="space-y-2.5">
        {BEKLEIDUNG_OPTIONS.map(opt => (
          <SelectionCard
            key={opt.id}
            id={opt.id}
            label={opt.label}
            sub={opt.sub}
            Icon={opt.Icon}
            selected={bekleidung === opt.id}
            onClick={() => setBekleidung(opt.id)}
          />
        ))}
      </div>
    </div>,

    // 4 — Arbeitszeiten
    <div key="zeiten" className="flex-1 flex flex-col justify-center space-y-4 py-2">
      <div>
        <div className="flex items-center gap-2 mb-1 px-0.5">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Arbeitszeiten</p>
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-black mt-2">Wann arbeiten Sie?</h2>
        <p className="text-sm text-muted-foreground mt-1">Frühschichten reduzieren die Hitzebelastung.</p>
      </div>
      <div className="bg-white rounded-2xl border border-black/[0.06] p-4 space-y-4">
        {/* Shift chips */}
        <div className="flex gap-2">
          <Chip label="Früh"  selected={schicht === 'früh'}  onClick={() => handleSchicht('früh')}  />
          <Chip label="Tag"   selected={schicht === 'tag'}   onClick={() => handleSchicht('tag')}   />
          <Chip label="Nacht" selected={schicht === 'nacht'} onClick={() => handleSchicht('nacht')} />
        </div>
        {/* Interactive timeline */}
        <ShiftTimeline
          start={startZeit}
          end={endZeit}
          schicht={schicht}
          onStartChange={t => { setStartZeit(t); }}
          onEndChange={t => { setEndZeit(t); }}
          onCommit={() => {}}
        />
        {/* Editable time inputs */}
        <div className="flex items-center gap-3">
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
                if (isValidTime(val)) setStartZeit(val);
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
                if (isValidTime(val)) setEndZeit(val);
                setEndZeitDraft(null);
              }}
              className="text-sm font-semibold tabular-nums text-black bg-transparent border-none outline-none cursor-text p-0 m-0 w-[50px]"
              aria-label="Arbeitsende"
            />
          </label>
        </div>
        <p className="text-xs text-muted-foreground">Frühere Arbeitszeiten werden bei Hitze empfohlen</p>
      </div>
    </div>,

    // 5 — Zusammenfassung
    <div key="summary" className="flex-1 flex flex-col justify-center space-y-4 py-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-black">Ihre Einstellungen</h2>
        <p className="text-sm text-muted-foreground mt-1">Alles korrekt? Sie können jederzeit in den Einstellungen anpassen.</p>
      </div>
      <div className="bg-white rounded-2xl border border-black/[0.06] divide-y divide-black/[0.05]">
        {/* Location */}
        <div className="flex items-center gap-3 px-4 py-3.5">
          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
          <span className="text-sm text-black flex-1">Standort</span>
          <ValueChip label={activeOrt?.name ?? 'Nicht gesetzt'} />
        </div>
        {/* Schwere */}
        <div className="flex items-center gap-3 px-4 py-3.5">
          <HardHat className="w-4 h-4 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
          <span className="text-sm text-black flex-1">Arbeitsschwere</span>
          <ValueChip label={SCHWERE_LABEL[schwere]} />
        </div>
        {/* Bekleidung */}
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Shirt className="w-4 h-4 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
          <span className="text-sm text-black flex-1">Kleidung</span>
          <ValueChip label={BEKLEIDUNG_LABEL[bekleidung]} />
        </div>
        {/* Arbeitszeiten */}
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
          <span className="text-sm text-black flex-1">Arbeitszeiten</span>
          <ValueChip label={`${SCHICHT_LABEL[schicht]} · ${startZeit}–${endZeit}`} />
        </div>
      </div>
      <p className="text-xs text-center text-muted-foreground px-4">
        Alle Werte sind bereits aktiv. Sie können alles jederzeit unter <span className="font-medium text-black/60">Einstellungen</span> ändern.
      </p>
    </div>,
  ];

  const isLastStep = step === TOTAL_STEPS - 1;
  const ctaLabel   = step === 0 ? 'Einrichtung starten' : isLastStep ? 'App starten' : 'Weiter';
  const showSkip   = step === 1; // location step only

  // ── Layout ──────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-white md:bg-[#f0f4fe] flex items-center justify-center">

      {/* Card */}
      <div className={[
        'relative bg-white flex flex-col',
        // Mobile: fills the whole screen
        'w-full h-full',
        // Desktop: centered elevated card
        'md:w-[480px] md:h-[580px] md:max-h-[88vh] md:rounded-2xl md:shadow-[0_8px_48px_-8px_rgba(50,92,218,0.18)] md:ring-1 md:ring-black/[0.06]',
      ].join(' ')}>

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
          {/* Back */}
          <button
            onClick={() => step > 0 ? go(step - 1) : onClose()}
            className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/[0.06] transition-colors ${step === 0 ? 'invisible' : ''}`}
            aria-label="Zurück"
          >
            <ChevronLeft className="w-4 h-4 text-black/60" strokeWidth={2} />
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-4 h-1.5 bg-[#325cda]'
                    : i < step
                    ? 'w-1.5 h-1.5 bg-[#325cda]/40'
                    : 'w-1.5 h-1.5 bg-neutral-200'
                }`}
              />
            ))}
          </div>

          {/* Close / Skip — no close on step 0 (welcome), only from step 1+ */}
          {showSkip ? (
            <button
              onClick={() => go(step + 1)}
              className="text-xs font-medium text-muted-foreground hover:text-black transition-colors px-1"
            >
              Überspringen
            </button>
          ) : step === 0 ? (
            <div className="w-8" />
          ) : (
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/[0.06] transition-colors"
              aria-label="Schließen"
            >
              <X className="w-4 h-4 text-black/40" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* ── Screen content (animated) ── */}
        <div className="flex-1 overflow-y-auto flex flex-col px-5 md:px-7 pb-4" style={{ minHeight: 0 }}>
          <div
            key={animKey}
            className="flex-1 flex flex-col min-h-full"
            style={{
              animation: `onboarding-slide-${directionRef.current === 1 ? 'in' : 'in-back'} 320ms cubic-bezier(0.4,0,0.2,1) both`,
            }}
          >
            {screens[step]}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="flex-shrink-0 px-5 md:px-7 pb-7 pt-3 bg-white">
          <button
            onClick={() => {
              if (isLastStep) { onClose(); }
              else { go(step + 1); }
            }}
            className="w-full bg-[#325cda] hover:bg-[#1d3fa3] active:scale-[0.99] text-white text-sm font-semibold rounded-xl py-3.5 transition-all"
          >
            {ctaLabel}
          </button>
        </div>
      </div>

      {/* Slide animations */}
      <style>{`
        @keyframes onboarding-slide-in {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes onboarding-slide-in-back {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
      `}</style>
    </div>
  );
}
