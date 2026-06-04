import React, { useState, useRef, useEffect } from 'react';
import {
  HardHat, MapPin, Sun, CloudSun, Leaf, Building2,
  Check, Info, Clock, Plus, MoreVertical, Trash2,
  Pencil, ChevronRight, Moon, Sunrise,
} from 'lucide-react';
import PageHeader from './PageHeader';

type Schwere      = 'leicht' | 'mittel' | 'schwer';
type Umgebung     = 'sonne' | 'teilschatten' | 'schatten' | 'innen';
type Schicht      = 'früh' | 'tag' | 'nacht';
type StandortModus = 'gps' | 'arbeitsort';

interface Ort { id: number; name: string; city: string; }

const SCHICHT_PRESETS: Record<Schicht, { start: string; end: string }> = {
  früh:  { start: '05:00', end: '13:00' },
  tag:   { start: '06:00', end: '14:00' },
  nacht: { start: '22:00', end: '06:00' },
};

const SCHWERE_LABEL: Record<Schwere, string> = {
  leicht: 'Für leichte Tätigkeiten, z. B. Inspektionen',
  mittel: 'Mittel für typische körperliche Arbeit',
  schwer: 'Für schwere körperliche Arbeit, z. B. Bauarbeiten',
};

const UMGEBUNG_OPTIONS: { id: Umgebung; label: string; sub: string; Icon: React.ElementType }[] = [
  { id: 'sonne',        label: 'Direkte Sonne',       sub: 'Meist ohne Schatten',     Icon: Sun       },
  { id: 'teilschatten', label: 'Teilw. verschattet',  sub: 'Gelegentl. Schatten',     Icon: CloudSun  },
  { id: 'schatten',     label: 'Überw. verschattet',  sub: 'Viel Schatten verfügbar', Icon: Leaf      },
  { id: 'innen',        label: 'Innen-/Außenwechsel', sub: 'Wechselnde Umgebung',     Icon: Building2 },
];

// Soft tint selected style (chips + cards)
const SEL = 'bg-[#eef2fd] text-[#1d3fa3] border-[#325cda]/40';
const UNSEL = 'bg-neutral-50 text-black/60 border-black/[0.08] hover:border-black/20 hover:text-black/80';

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function ShiftTimeline({ start, end, schicht }: { start: string; end: string; schicht: Schicht }) {
  const TOTAL = 24 * 60;
  const s = timeToMinutes(start);
  const e = timeToMinutes(end);
  const overnight = e <= s;

  const seg1Left  = (s / TOTAL) * 100;
  const seg1Width = overnight ? ((TOTAL - s) / TOTAL) * 100 : ((e - s) / TOTAL) * 100;
  const seg2Width = overnight ? (e / TOTAL) * 100 : 0;
  const durationMin = overnight ? (TOTAL - s + e) : (e - s);
  const durationH   = Math.floor(durationMin / 60);

  // Recommended early window 05:00–09:00
  const recL = ((5 * 60) / TOTAL) * 100;
  const recW = ((4 * 60) / TOTAL) * 100;

  return (
    <div className="mb-4">
      {/* Bar */}
      <div className="relative h-9 md:h-10 rounded-xl overflow-hidden border border-black/[0.06]">
        {/* Night zones */}
        <div className="absolute inset-y-0 left-0   bg-neutral-100" style={{ width: '25%' }} />
        <div className="absolute inset-y-0 right-0  bg-neutral-100" style={{ width: '25%' }} />
        {/* Daylight 06–18 */}
        <div className="absolute inset-y-0 bg-amber-50" style={{ left: '25%', width: '50%' }} />
        {/* Recommended early window (5–9) */}
        <div className="absolute inset-y-0 bg-emerald-50"
          style={{ left: `${recL}%`, width: `${recW}%` }} />
        {/* Work segment(s) */}
        <div className="absolute top-1.5 bottom-1.5 bg-[#325cda] rounded-lg"
          style={{ left: `${seg1Left}%`, width: `${seg1Width}%` }} />
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
              <Icon className="w-3 h-3 text-black/60" strokeWidth={1.5} />
            ) : (
              <div className="w-3 h-3" />
            )}
            <span className="text-xs text-black/60 tabular-nums">{label}:00</span>
          </div>
        ))}
      </div>

      {/* Duration + hint */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-black/60">{durationH} Stunden</span>
        {schicht === 'früh' && (
          <span className="text-xs text-[#166534] font-medium">
            Empfohlen bei Hitze
          </span>
        )}
        {schicht === 'nacht' && (
          <span className="text-xs text-black/60">Nachtschicht</span>
        )}
      </div>
    </div>
  );
}

export default function EinstellungenView() {
  const [schwere,       setSchwere]       = useState<Schwere>('mittel');
  const [umgebung,      setUmgebung]      = useState<Umgebung>('sonne');
  const [schicht,       setSchicht]       = useState<Schicht>('tag');
  const [startZeit,     setStartZeit]     = useState('06:00');
  const [endZeit,       setEndZeit]       = useState('14:00');
  const [standortModus, setStandortModus] = useState<StandortModus>('gps');
  const [aktiveOrtId,   setAktiveOrtId]   = useState<number | null>(null);
  const [swipedIdx,     setSwipedIdx]     = useState<number | null>(null);
  const [showSaved,     setShowSaved]     = useState(false);
  const [showOrtFeedback, setShowOrtFeedback] = useState(false);
  const [orte, setOrte] = useState<Ort[]>([
    { id: 1, name: 'Baustelle Berlin Ost', city: 'Berlin'    },
    { id: 2, name: 'Lager Nord',           city: 'Hamburg'   },
    { id: 3, name: 'Windpark Süd',         city: 'Flensburg' },
  ]);

  const startRef    = useRef<HTMLInputElement>(null);
  const endRef      = useRef<HTMLInputElement>(null);
  const touchX      = useRef(0);
  const savedTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ortTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleOrtTap = (idx: number, id: number) => {
    if (swipedIdx === idx) { setSwipedIdx(null); return; }
    setStandortModus('arbeitsort');
    setAktiveOrtId(id);
    markSaved();
    setShowOrtFeedback(true);
    if (ortTimer.current) clearTimeout(ortTimer.current);
    ortTimer.current = setTimeout(() => setShowOrtFeedback(false), 2200);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent, idx: number) => {
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx < -50) setSwipedIdx(idx);
    else if (dx > 20) setSwipedIdx(null);
  };

  const deleteOrt = (id: number) => {
    setOrte(prev => prev.filter(o => o.id !== id));
    if (aktiveOrtId === id) setAktiveOrtId(null);
    setSwipedIdx(null);
    markSaved();
  };

  const triggerPicker = (ref: React.RefObject<HTMLInputElement>) => {
    try { ref.current?.showPicker?.(); } catch { ref.current?.click(); }
  };

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
        <PageHeader
          title="Einstellungen"
          variant="light"
        />
      </div>

      {/* Autosave feedback - now outside header */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-2">
        <div className="flex justify-end">
          <span
            className="text-xs text-black/60 flex items-center gap-1.5 pb-0.5 transition-opacity duration-300"
            style={{ opacity: showSaved ? 1 : 0 }}
            aria-live="polite"
          >
            <Check className="w-3 h-3 text-[#166534]" strokeWidth={2.5} />
            Gespeichert
          </span>
        </div>
      </div>

      <div className="px-4 md:px-8 pt-6 space-y-8 max-w-4xl mx-auto">

        {/* ── SECTION 1: Arbeitsprofil ─────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <HardHat className="w-3.5 h-3.5 text-black/60" strokeWidth={1.5} />
            <p className="text-xs font-semibold tracking-widest uppercase text-black/60">Arbeitsprofil</p>
            <p className="text-xs text-black/60 ml-1">· Beeinflusst Empfehlungen</p>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-black/[0.06] divide-y divide-black/[0.05]">

            {/* Arbeitsschwere */}
            <div className="p-4 md:p-6">
              <div className="flex items-center gap-1.5 mb-3">
                <p className="text-sm font-semibold text-black">Arbeitsschwere</p>
                <button aria-label="Info zur Arbeitsschwere" className="rounded p-0.5 hover:bg-black/[0.04] transition-colors">
                  <Info className="w-3.5 h-3.5 text-black/60" strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex gap-2 md:gap-3">
                <Chip label="Leicht" selected={schwere === 'leicht'} onClick={() => change(setSchwere)('leicht')} />
                <Chip label="Mittel" selected={schwere === 'mittel'} onClick={() => change(setSchwere)('mittel')} />
                <Chip label="Schwer" selected={schwere === 'schwer'} onClick={() => change(setSchwere)('schwer')} />
              </div>
              <p className="text-xs text-black/60 mt-2.5 leading-relaxed">{SCHWERE_LABEL[schwere]}</p>
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
                        className={`w-5 h-5 mb-3 ${sel ? 'text-[#325cda]' : 'text-black/60'}`}
                        strokeWidth={1.5}
                      />
                      <p className={`text-xs font-semibold leading-tight ${sel ? 'text-[#1d3fa3]' : 'text-black/80'}`}>
                        {label}
                      </p>
                      <p className={`text-xs mt-1 leading-tight ${sel ? 'text-[#325cda]' : 'text-black/60'}`}>
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
              <ShiftTimeline start={startZeit} end={endZeit} schicht={schicht} />

              {/* Time pills */}
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => triggerPicker(startRef)}
                  className="flex items-center gap-2 bg-neutral-50 border border-black/10 rounded-xl px-4 py-2.5
                    hover:border-[#325cda]/40 hover:bg-[#eef2fd] transition-colors active:scale-[0.98]"
                >
                  <Clock className="w-3.5 h-3.5 text-black/60" strokeWidth={1.5} />
                  <span className="text-sm font-semibold tabular-nums text-black">{startZeit}</span>
                </button>

                <div className="flex items-center gap-1 text-black/50">
                  <div className="w-4 h-px bg-current" />
                  <div className="w-1 h-1 rounded-full bg-current" />
                  <div className="w-4 h-px bg-current" />
                </div>

                <button
                  onClick={() => triggerPicker(endRef)}
                  className="flex items-center gap-2 bg-neutral-50 border border-black/10 rounded-xl px-4 py-2.5
                    hover:border-[#325cda]/40 hover:bg-[#eef2fd] transition-colors active:scale-[0.98]"
                >
                  <Clock className="w-3.5 h-3.5 text-black/60" strokeWidth={1.5} />
                  <span className="text-sm font-semibold tabular-nums text-black">{endZeit}</span>
                </button>

                <input ref={startRef} type="time" value={startZeit}
                  onChange={e => { setStartZeit(e.target.value); markSaved(); }}
                  className="sr-only" aria-label="Arbeitsbeginn" />
                <input ref={endRef} type="time" value={endZeit}
                  onChange={e => { setEndZeit(e.target.value); markSaved(); }}
                  className="sr-only" aria-label="Arbeitsende" />
              </div>

              <p className="text-xs text-black/60 leading-relaxed">
                Frühere Arbeitszeiten werden bei Hitze empfohlen
              </p>
            </div>

          </div>
        </section>

        {/* ── SECTION 2: Standort ─────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <MapPin className="w-3.5 h-3.5 text-black/60" strokeWidth={1.5} />
            <p className="text-xs font-semibold tracking-widest uppercase text-black/60">Standort</p>
            <p className="text-xs text-black/60 ml-1">· Verbessert lokale Vorhersagen</p>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-black/[0.06] divide-y divide-black/[0.05]">

            {/* Standortmodus */}
            <div className="p-4 md:p-6">
              <p className="text-sm font-semibold text-black mb-3">Standortmodus</p>
              <div className="flex gap-2 md:gap-3 mb-3">
                <Chip
                  label="GPS automatisch"
                  selected={standortModus === 'gps'}
                  onClick={() => { setStandortModus('gps'); setAktiveOrtId(null); markSaved(); }}
                />
                <Chip
                  label="Arbeitsort"
                  selected={standortModus === 'arbeitsort'}
                  onClick={() => { setStandortModus('arbeitsort'); markSaved(); }}
                />
              </div>
              {standortModus === 'gps' && (
                <div className="flex items-center gap-2 py-0.5">
                  <div className="w-4 h-4 rounded-full bg-[#ECFDF5] border border-emerald-300 flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-[#166534]" strokeWidth={3} />
                  </div>
                  <p className="text-xs text-black/60">Standort erkannt · München, Bayern</p>
                </div>
              )}
              {standortModus === 'arbeitsort' && !aktiveOrtId && (
                <input
                  type="text"
                  placeholder="Stadt oder Postleitzahl eingeben"
                  className="w-full px-3.5 py-3 text-sm bg-neutral-50 border border-black/10 rounded-xl
                    focus:outline-none focus:border-[#325cda]/40 focus:bg-[#eef2fd]/40
                    transition-colors placeholder:text-black/60"
                />
              )}
            </div>

            {/* Gespeicherte Orte */}
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-black">Gespeicherte Orte</p>
                <span
                  className="text-xs text-[#166534] flex items-center gap-1 transition-opacity duration-300"
                  style={{ opacity: showOrtFeedback ? 1 : 0 }}
                  aria-live="polite"
                >
                  <Check className="w-3 h-3" strokeWidth={2.5} />
                  Arbeitsort geändert
                </span>
              </div>
              <div className="space-y-2 mb-3">
                {orte.map((ort, idx) => {
                  const isActive = standortModus === 'arbeitsort' && aktiveOrtId === ort.id;
                  const isSwiped = swipedIdx === idx;
                  return (
                    <div key={ort.id} className="relative rounded-xl overflow-hidden">
                      {/* Swipe actions */}
                      <div className="absolute right-0 top-0 bottom-0 flex">
                        <button
                          onClick={() => setSwipedIdx(null)}
                          className="w-14 bg-neutral-200 flex items-center justify-center
                            hover:bg-neutral-300 transition-colors"
                          aria-label="Bearbeiten"
                        >
                          <Pencil className="w-4 h-4 text-black/60" strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => deleteOrt(ort.id)}
                          className="w-14 bg-red-500 flex items-center justify-center rounded-r-xl
                            hover:bg-red-600 transition-colors"
                          aria-label="Löschen"
                        >
                          <Trash2 className="w-4 h-4 text-white" strokeWidth={1.5} />
                        </button>
                      </div>

                      {/* Main row */}
                      <div
                        style={{
                          transform: isSwiped ? 'translateX(-112px)' : 'translateX(0)',
                          transition: 'transform 0.2s ease',
                        }}
                        onTouchStart={onTouchStart}
                        onTouchEnd={e => onTouchEnd(e, idx)}
                        onClick={() => handleOrtTap(idx, ort.id)}
                        className={`group flex items-center gap-3 px-3.5 py-3.5 rounded-xl cursor-pointer border
                          transition-all select-none active:scale-[0.99] ${
                          isActive
                            ? 'bg-[#eef2fd] border-[#325cda]/30'
                            : 'bg-white border-black/[0.06] hover:border-black/20 hover:bg-neutral-50 active:bg-neutral-100'
                        }`}
                      >
                        <MapPin
                          className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-[#325cda]' : 'text-black/60'}`}
                          strokeWidth={1.5}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-tight transition-colors ${isActive ? 'font-semibold text-[#1d3fa3]' : 'text-black/80'}`}>
                            {ort.name}
                          </p>
                          <p className={`text-xs mt-0.5 transition-colors ${isActive ? 'text-[#325cda]' : 'text-black/60'}`}>
                            {ort.city}
                          </p>
                        </div>
                        {isActive ? (
                          <span className="text-xs font-semibold bg-[#325cda]/10 text-[#1d3fa3] border border-[#325cda]/20 px-2 py-0.5 rounded-full flex-shrink-0">
                            Aktiv
                          </span>
                        ) : (
                          <ChevronRight
                            className="w-4 h-4 text-black/60 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            strokeWidth={1.5}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add location */}
              <button
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                  border-2 border-dashed border-black/20 text-sm font-medium text-black/60
                  hover:border-[#325cda]/50 hover:text-[#325cda] hover:bg-[#eef2fd]/40
                  active:scale-[0.99] active:bg-[#eef2fd]/60 transition-all"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Ort hinzufügen
              </button>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
