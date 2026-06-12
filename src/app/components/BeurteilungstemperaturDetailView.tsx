import React from 'react';
import { Thermometer, Droplet, Wind, Sun, Shield, Clock, AlertCircle, AlertTriangle, Info, CheckCircle, Dumbbell, Shirt, X } from 'lucide-react';
import DetailRowList from './DetailRowList';
import { SCHWERE_SHORT, BEKLEIDUNG_SHORT } from '../constants/workProfile';

interface BeurteilungstemperaturDetailViewProps {
  onClose: () => void;
  activeLocation?: string | null;
  beurteilungstemperatur?: number;
  statusLabel?: string;
  schwere?: string;
  bekleidung?: string;
}

const svgPaths = {
  backArrow: "M12 4.9992L4.9992 12L12 19.0008M4.9992 12H19.0008",
};

// Beurteilungstemperatur formula — identical to HeuteView's getBeurteilungstemperatur
// (default: schwere=heavy, bekleidung=work, feuchtigkeit=low, wind=light, sonne=direct 10–17)
function calcBT(h: number): number {
  let lufttemp = 25;
  if (h >= 8  && h < 9)  lufttemp = 27;
  if (h >= 9  && h < 11) lufttemp = 31;
  if (h >= 11 && h < 13) lufttemp = 34;
  if (h >= 13 && h < 17) lufttemp = 37;
  if (h >= 17 && h < 18) lufttemp = 33;
  let corrections = 3; // arbeitsschwere(+3) + bekleidung(+1) + feuchtigkeit(0) + wind(-1)
  if (h >= 10 && h < 17) corrections += 2; // direct sun
  return Math.round(lufttemp + corrections);
}

// Bar chart uses air temperature so the color gradient shows a natural Gering→Kritisch arc.
// The big display number uses calcBT() (actual Beurteilungstemperatur with corrections).
function getLufttemp(h: number): number {
  if (h >= 13 && h < 17) return 37;
  if (h >= 11 && h < 13) return 34;
  if (h >= 9  && h < 11) return 31;
  if (h >= 8  && h < 9)  return 27;
  if (h >= 17 && h < 18) return 33;
  if (h >= 18 && h < 20) return 28;
  if (h >= 20)            return 24;
  // Early morning (< 8): gradual warm-up from overnight low
  return Math.round(18 + h * 0.8);
}

const hourlyData = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map(h => ({
  hour: String(h).padStart(2, '0'),
  temp: getLufttemp(h),
}));

function getLevelInfo(temp: number) {
  if (temp < 25) return { level: 1, label: 'Gering',   barBg: 'var(--status-success-bg)',  solidColor: 'var(--status-icon-ok)',      textColor: 'var(--status-success-text)' };
  if (temp < 28) return { level: 2, label: 'Mäßig',    barBg: 'var(--status-warning-bg)',  solidColor: 'var(--status-warning)',      textColor: 'var(--neutral-600)' };
  if (temp < 32) return { level: 3, label: 'Stark',    barBg: 'var(--status-strong-bg)',   solidColor: 'var(--status-strong)',       textColor: 'var(--neutral-600)' };
  return          { level: 4, label: 'Kritisch',  barBg: 'var(--status-critical-bg)', solidColor: 'var(--status-critical-tint)', textColor: 'var(--status-critical)' };
}

function getRealHour(): number { return new Date().getHours(); }

function getCurrentTemp(hour: number): number {
  return calcBT(hour);
}

// Weather values matching HeuteView's getWeatherStats() — same data source
function getWeatherValues(h: number) {
  let temp = 25;
  if (h >= 8  && h < 9)  temp = 27;
  if (h >= 9  && h < 11) temp = 31;
  if (h >= 11 && h < 13) temp = 34;
  if (h >= 13 && h < 17) temp = 37;
  if (h >= 17 && h < 18) temp = 33;

  let humidity = 45;
  if (h >= 9  && h < 11) humidity = 32;
  if (h >= 11 && h < 13) humidity = 24;
  if (h >= 13 && h < 17) humidity = 20;
  if (h >= 17 && h < 18) humidity = 28;

  let wind = '5 km/h, Böen: 12 km/h';
  if (h >= 10 && h < 17) wind = '10 km/h, Böen: 22 km/h';
  if (h >= 17) wind = '8 km/h, Böen: 18 km/h';

  let uv = '2 (Niedrig)';
  if (h >= 9  && h < 11) uv = '7 (Hoch)';
  if (h >= 11 && h < 13) uv = '9 (Sehr hoch)';
  if (h >= 13 && h < 17) uv = '10 (Sehr hoch)';
  if (h >= 17 && h < 18) uv = '6 (Hoch)';

  return { temp, humidity, wind, uv };
}

const waermestufen: { bg: string; Icon: React.ElementType; stufe: string; label: string; range: string }[] = [
  { bg: 'var(--status-icon-ok)',       Icon: CheckCircle,   stufe: 'Hitzestufe 1', label: 'Geringe Belastung',  range: 'Bis 26°C'    },
  { bg: 'var(--status-warning)',       Icon: Info,          stufe: 'Hitzestufe 2', label: 'Mäßige Belastung',   range: 'Über 26 bis 30°C' },
  { bg: 'var(--status-strong)',        Icon: AlertCircle,   stufe: 'Hitzestufe 3', label: 'Starke Belastung',   range: 'Über 30 bis 35°C' },
  { bg: 'var(--status-critical-tint)', Icon: AlertTriangle, stufe: 'Hitzestufe 4', label: 'Kritische Belastung', range: 'Über 35°C'  },
];

const massnahmen = [
  {
    Icon: Shield,
    label: 'Sonnenschutz & Kühlung',
    detail: 'Sonnencreme LSF 50+, Kopfbedeckung mit breiter Krempe und helle, atmungsaktive Kleidung empfohlen. Kühle Aufenthaltsorte in Pausen nutzen.',
  },
  {
    Icon: Clock,
    label: 'Arbeitszeiten anpassen',
    detail: 'Schwere körperliche Arbeiten möglichst in die frühen Morgenstunden (vor 10 Uhr) oder Abendstunden verlegen. In den Mittagsstunden Pausen verlängern.',
  },
  {
    Icon: Droplet,
    label: 'Ausreichend Wasser trinken',
    detail: 'Mindestens 0,5 Liter Wasser pro Stunde empfohlen. Regelmäßiges Trinken auch ohne Durstgefühl. Koffeinhaltige Getränke meiden.',
  },
];

export default function BeurteilungstemperaturDetailView({ onClose, activeLocation, beurteilungstemperatur: btProp, statusLabel: statusLabelProp, schwere, bekleidung }: BeurteilungstemperaturDetailViewProps) {
  const currentHour = getRealHour();
  const currentTemp = getCurrentTemp(currentHour);
  const currentLevel = getLevelInfo(currentTemp);

  // Use passed-in values from home screen when available, fall back to local calculation
  const displayTemp  = btProp          ?? currentTemp;
  const displayLabel = statusLabelProp ?? currentLevel.label;

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const maxBarTemp = 40;

  const w = getWeatherValues(currentHour);

  const SCHWERE_DESC: Record<string, string> = {
    leicht: 'Leichte körperliche Tätigkeiten erzeugen wenig Körperwärme. Der Einfluss auf die Beurteilungstemperatur ist gering.',
    mittel: 'Mittelschwere Arbeit erhöht die Körpertemperatur moderat. Bei Hitze regelmäßig Pausen einlegen und ausreichend trinken.',
    schwer: 'Schwere körperliche Tätigkeiten erhöhen die Körperkerntemperatur erheblich. Regelmäßige Kühlung und Pausen sind bei Hitze besonders wichtig.',
  };
  const BEKLEIDUNG_DESC: Record<string, string> = {
    leicht: 'Atmungsaktive Kleidung fördert die Schweißverdunstung und reduziert die thermische Belastung.',
    mittel: 'Typische Arbeitskleidung schränkt die Schweißverdunstung leicht ein und erhöht die Wärmebelastung moderat.',
    schwer: 'Schwere Schutzkleidung reduziert die Schweißverdunstung erheblich und erhöht die thermische Belastung stark.',
  };

  const einflussfaktoren = [
    { Icon: Thermometer, label: 'Luft-Temperatur', value: `${w.temp}°C`,   description: 'Die Lufttemperatur ist der wichtigste Faktor. Hohe Temperaturen erhöhen die Wärmebelastung des Körpers direkt.' },
    { Icon: Droplet,     label: 'Relative Luftfeuchtigkeit', value: `${w.humidity}%`, description: 'Erhöhte Luftfeuchtigkeit vermindert die Schweißverdunstung und verstärkt die gefühlte Wärme.' },
    { Icon: Wind,        label: 'Wind',           value: w.wind,           description: 'Geringe Konvektionskühlung. Wind kann die Wärmebelastung bei hohen Temperaturen leicht senken.' },
    { Icon: Sun,         label: 'UV-Index',       value: w.uv,             description: 'Erhöht die Strahlungsbelastung auf der Haut und verstärkt die Wärmeempfindung im Freien.' },
    { Icon: Dumbbell,     label: 'Arbeitsschwere', value: schwere ? (SCHWERE_SHORT[schwere as keyof typeof SCHWERE_SHORT] ?? schwere) : 'Nicht eingestellt', description: schwere ? (SCHWERE_DESC[schwere] ?? 'Eingestellt unter Einstellungen → Arbeitsprofil.') : 'Unter Einstellungen → Arbeitsprofil festlegen.' },
    { Icon: Shirt,       label: 'Bekleidung / PSA', value: bekleidung ? (BEKLEIDUNG_SHORT[bekleidung as keyof typeof BEKLEIDUNG_SHORT] ?? bekleidung) : 'Nicht eingestellt', description: bekleidung ? (BEKLEIDUNG_DESC[bekleidung] ?? 'Eingestellt unter Einstellungen → Arbeitsprofil.') : 'Unter Einstellungen → Arbeitsprofil festlegen.' },
  ];

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
      <div className="lg:hidden bg-white border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 px-4 py-3">
          <button onClick={onClose} className="w-6 h-6" aria-label="Zurück">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
              <path d={svgPaths.backArrow} stroke="var(--foreground)" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </button>
          <p style={{ fontWeight: 600, fontSize: 16, lineHeight: 1.35, color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}>
            Beurteilungstemperatur
          </p>
        </div>
      </div>

      {/* Desktop Header */}
      <div
        className="hidden lg:flex items-center justify-between px-6 py-4 sticky top-0 z-10 bg-white border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <p style={{ fontWeight: 600, fontSize: 16, color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}>
          Beurteilungstemperatur
        </p>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/[0.06] transition-colors"
          aria-label="Schließen"
        >
          <X className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} strokeWidth={2} />
        </button>
      </div>

      {/* Content */}
      <div className="bg-white px-4 lg:px-6 pt-4 pb-10">

        {/* Big value display */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-baseline gap-3 lg:gap-4">
            <p
              style={{ fontSize: 72, fontWeight: 700, lineHeight: 1, color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}
              className="lg:text-[80px]"
            >
              {displayTemp}°C
            </p>
            <div>
              <p
                style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.14px', color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}
                className="lg:text-[44px] lg:tracking-[-0.22px]"
              >
                {displayLabel}
              </p>
              <p style={{ fontSize: 12, lineHeight: 1.3, color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }}>
                Heute, {timeStr} Uhr{activeLocation ? ` · ${activeLocation}` : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="h-px my-6 lg:my-8" style={{ backgroundColor: 'var(--border)' }} />

        {/* Tagesverlauf */}
        <div className="mb-6 lg:mb-8">
          <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.35, color: 'var(--foreground)', fontFamily: 'var(--font-family)', marginBottom: 12 }}>
            Tagesverlauf
          </p>
          <div className="flex items-end" style={{ gap: 2 }}>
            {hourlyData.map(({ hour, temp }) => {
              const level = getLevelInfo(temp);
              const minTemp = 15;
              const maxTemp = 38;
              const barHeightPx = Math.max(12, ((temp - minTemp) / (maxTemp - minTemp)) * 80);
              const hourNum = parseInt(hour);
              const isNow = hourNum === currentHour;

              return (
                <div
                  key={hour}
                  className="flex flex-col items-center flex-1"
                >
                  {/* Temperature label — every bar */}
                  <p style={{
                    fontSize: 10,
                    fontWeight: isNow ? 700 : 500,
                    color: isNow ? 'var(--foreground)' : 'var(--muted-foreground)',
                    fontFamily: 'var(--font-family)',
                    lineHeight: 1,
                    marginBottom: 2,
                    whiteSpace: 'nowrap',
                  }}>
                    {temp}°
                  </p>
                  {/* Status icon in circle */}
                  <div style={{ height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: level.solidColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {level.level === 1 && <CheckCircle className="w-2 h-2 text-black" strokeWidth={2.5} />}
                      {level.level === 2 && <Info className="w-2 h-2 text-black" strokeWidth={2.5} />}
                      {level.level === 3 && <AlertCircle className="w-2 h-2 text-black" strokeWidth={2.5} />}
                      {level.level === 4 && <AlertTriangle className="w-2 h-2 text-black" strokeWidth={2.5} />}
                    </div>
                  </div>
                  {/* Bar */}
                  <div
                    className="w-full rounded-sm"
                    style={{
                      height: barHeightPx,
                      backgroundColor: level.solidColor,
                      boxShadow: isNow ? `0 0 0 1.5px var(--foreground)` : 'none',
                    }}
                  />
                  {/* Hour label — every bar, "Jetzt" pill for current */}
                  {isNow ? (
                    <div
                      style={{
                        marginTop: 3,
                        paddingLeft: 4,
                        paddingRight: 4,
                        paddingTop: 1,
                        paddingBottom: 1,
                        borderRadius: 999,
                        backgroundColor: 'var(--neutral-black, #000)',
                        lineHeight: 1,
                      }}
                    >
                      <p style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#fff',
                        fontFamily: 'var(--font-family)',
                        lineHeight: 1,
                      }}>
                        Jetzt
                      </p>
                    </div>
                  ) : (
                    <p style={{
                      fontSize: 10,
                      fontWeight: 400,
                      color: 'var(--muted-foreground)',
                      fontFamily: 'var(--font-family)',
                      marginTop: 2,
                      lineHeight: 1,
                    }}>
                      {hour}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-px my-6 lg:my-8" style={{ backgroundColor: 'var(--border)' }} />

        {/* Wärmestufen */}
        <div className="mb-6 lg:mb-8">
          <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.35, color: 'var(--foreground)', fontFamily: 'var(--font-family)', marginBottom: 12 }}>
            Wärmestufen
          </p>
          <div className="rounded-[16px] overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
            {waermestufen.map(({ bg, Icon, stufe, label, range }, i) => (
              <div
                key={stufe}
                className="flex items-center px-4 py-3 lg:py-4"
                style={{
                  backgroundColor: i % 2 === 0 ? 'var(--neutral-50)' : 'white',
                  borderBottom: i < waermestufen.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div className="w-7 h-7 mr-3 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: 'var(--neutral-black)' }} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-sm" style={{ fontWeight: 600, color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}>{stufe}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }}>{label}</p>
                </div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)', flexShrink: 0 }}>{range}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px my-6 lg:my-8" style={{ backgroundColor: 'var(--border)' }} />

        {/* Maßnahmen gegen Hitze */}
        <div className="mb-6 lg:mb-8">
          <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.35, color: 'var(--foreground)', fontFamily: 'var(--font-family)', marginBottom: 12 }}>
            Maßnahmen gegen Hitze
          </p>
          <div className="rounded-[16px] overflow-hidden" style={{ backgroundColor: 'var(--neutral-50)' }}>
            <div className="px-3 lg:px-4 pt-4 lg:pt-6 pb-3 lg:pb-4 flex flex-col gap-1.5 lg:gap-2">
              <DetailRowList items={massnahmen} />
            </div>
          </div>
        </div>

        <div className="h-px my-6 lg:my-8" style={{ backgroundColor: 'var(--border)' }} />

        {/* Einflussfaktoren */}
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.35, color: 'var(--foreground)', fontFamily: 'var(--font-family)', marginBottom: 12 }}>
            Einflussfaktoren
          </p>
          <div className="rounded-[16px] overflow-hidden" style={{ backgroundColor: 'var(--neutral-50)' }}>
            <div className="px-3 lg:px-4 pt-4 lg:pt-5 pb-3 lg:pb-4 flex flex-col gap-1.5 lg:gap-2">
              <DetailRowList items={einflussfaktoren.map(e => ({ ...e, detail: e.description }))} />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
