import { ChevronDown, Thermometer, Droplet, Wind, Sun, Shield, Clock, AlertCircle, Info, HardHat, Shirt, X } from 'lucide-react';
import { useState } from 'react';
import { StatusIconCircle } from './StatusBadge';

interface BeurteilungstemperaturDetailViewProps {
  onClose: () => void;
}

const svgPaths = {
  backArrow: "M12 4.9992L4.9992 12L12 19.0008M4.9992 12H19.0008",
};

const hourlyData = [
  { hour: '05', temp: 18 },
  { hour: '06', temp: 20 },
  { hour: '07', temp: 22 },
  { hour: '08', temp: 22 },
  { hour: '09', temp: 25 },
  { hour: '10', temp: 27 },
  { hour: '11', temp: 28 },
  { hour: '12', temp: 31 },
  { hour: '13', temp: 32 },
  { hour: '14', temp: 34 },
  { hour: '15', temp: 34 },
  { hour: '16', temp: 34 },
  { hour: '17', temp: 33 },
  { hour: '18', temp: 30 },
  { hour: '19', temp: 27 },
  { hour: '20', temp: 24 },
  { hour: '21', temp: 22 },
];

function getLevelInfo(temp: number) {
  if (temp < 25) return { label: 'Gering',  barBg: 'var(--status-success-bg)',  solidColor: 'var(--status-success)',   textColor: 'var(--status-success-text)' };
  if (temp < 28) return { label: 'Mäßig',   barBg: 'var(--status-caution)',     solidColor: 'var(--status-caution)',   textColor: 'var(--neutral-600)' };
  if (temp < 32) return { label: 'Stark',   barBg: 'var(--status-warning)',     solidColor: 'var(--status-warning)',   textColor: 'var(--neutral-600)' };
  return          { label: 'Kritisch', barBg: 'var(--status-critical)',    solidColor: 'var(--status-critical)',  textColor: 'var(--status-critical)' };
}

function getRealHour(): number { return new Date().getHours(); }

function getCurrentTemp(hour: number): number {
  const found = hourlyData.find(d => parseInt(d.hour) === hour);
  return found ? found.temp : 20;
}

const waermestufen: { status: 'ok' | 'maessig' | 'warnung' | 'kritisch'; label: string; range: string }[] = [
  { status: 'ok',       label: 'Gering',   range: 'Unter 25°C' },
  { status: 'maessig',  label: 'Mäßig',    range: '25–28°C'   },
  { status: 'warnung',  label: 'Stark',    range: '28–32°C'   },
  { status: 'kritisch', label: 'Kritisch', range: 'Über 32°C'  },
];

const einflussfaktoren = [
  {
    Icon: Thermometer,
    label: 'Temperatur',
    value: '34°C',
    description: 'Die Lufttemperatur ist der wichtigste Faktor. Hohe Temperaturen erhöhen die Wärmebelastung des Körpers direkt.',
  },
  {
    Icon: Droplet,
    label: 'Feuchtigkeit',
    value: '45%',
    description: 'Erhöhte Luftfeuchtigkeit vermindert die Schweißverdunstung und verstärkt die gefühlte Wärme.',
  },
  {
    Icon: Wind,
    label: 'Wind',
    value: '5 km/h, Böen: 25 km/h',
    description: 'Geringe Konvektionskühlung. Wind kann die Wärmebelastung bei hohen Temperaturen leicht senken.',
  },
  {
    Icon: Sun,
    label: 'UV',
    value: '8, Sehr hoch',
    description: 'Erhöht die Strahlungsbelastung auf der Haut und verstärkt die Wärmeempfindung im Freien.',
  },
  {
    Icon: HardHat,
    label: 'Arbeitsschwere',
    value: 'Schwer',
    description: 'Schwere körperliche Tätigkeiten erhöhen die Körperkerntemperatur erheblich. Eingestellt unter Einstellungen → Arbeitsprofil.',
  },
  {
    Icon: Shirt,
    label: 'Bekleidung',
    value: 'Schwere Arbeitskleidung',
    description: 'Schwere Schutzkleidung reduziert die Schweißverdunstung und erhöht die thermische Belastung. Eingestellt unter Einstellungen → Arbeitsprofil.',
  },
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

export default function BeurteilungstemperaturDetailView({ onClose }: BeurteilungstemperaturDetailViewProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openEinflussIndex, setOpenEinflussIndex] = useState<number | null>(null);

  const currentHour = getRealHour();
  const currentTemp = getCurrentTemp(currentHour);
  const currentLevel = getLevelInfo(currentTemp);

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const maxBarTemp = 40;

  return (
    <div className="fixed inset-0 z-50">
      {/* Desktop backdrop */}
      <div
        className="hidden lg:block absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — full-screen on mobile, right drawer on desktop */}
      <div className="absolute inset-0 bg-white overflow-y-auto lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[560px] lg:shadow-2xl">

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
              {currentTemp}°C
            </p>
            <div>
              <p
                style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.14px', color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}
                className="lg:text-[44px] lg:tracking-[-0.22px]"
              >
                {currentLevel.label}
              </p>
              <p style={{ fontSize: 12, lineHeight: 1.3, color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }}>
                Heute, {timeStr} Uhr · München
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
              const isCritical = temp >= 32;
              const isWarning = temp >= 28 && temp < 32;

              const isOk = temp < 25;
              const isMaessig = temp >= 25 && temp < 28;

              return (
                <div
                  key={hour}
                  className="flex flex-col items-center flex-1"
                >
                  {/* Status icon in circle */}
                  <div style={{ height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isCritical && (
                      <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'var(--status-icon-critical)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AlertCircle className="w-2 h-2 text-black" strokeWidth={2.5} />
                      </div>
                    )}
                    {isWarning && (
                      <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'var(--status-icon-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AlertCircle className="w-2 h-2 text-black" strokeWidth={2.5} />
                      </div>
                    )}
                    {isMaessig && (
                      <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'var(--status-caution)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Info className="w-2 h-2 text-black" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                  {/* Temperature label */}
                  <p style={{
                    fontSize: 8,
                    fontWeight: isNow ? 700 : 400,
                    color: isNow ? 'var(--foreground)' : 'var(--muted-foreground)',
                    fontFamily: 'var(--font-family)',
                    lineHeight: 1,
                    marginBottom: 2,
                    whiteSpace: 'nowrap',
                  }}>
                    {temp}°
                  </p>
                  {/* Bar */}
                  <div
                    className="w-full rounded-sm"
                    style={{
                      height: barHeightPx,
                      backgroundColor: isNow ? level.solidColor : level.barBg,
                      boxShadow: isNow
                        ? `0 0 0 1.5px ${level.solidColor}`
                        : isOk
                          ? `0 0 0 1px var(--status-success)`
                          : 'none',
                    }}
                  />
                  {/* Hour label */}
                  <p style={{
                    fontSize: 8,
                    fontWeight: isNow ? 600 : 400,
                    color: isNow ? 'var(--foreground)' : 'var(--muted-foreground)',
                    fontFamily: 'var(--font-family)',
                    marginTop: 2,
                    lineHeight: 1,
                  }}>
                    {hour}
                  </p>
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
            {waermestufen.map(({ status, label, range }, i) => (
              <div
                key={label}
                className="flex items-center px-4 py-3 lg:py-4"
                style={{
                  backgroundColor: i % 2 === 0 ? 'var(--neutral-50)' : 'white',
                  borderBottom: i < waermestufen.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <StatusIconCircle status={status} className="w-7 h-7 mr-3" iconClassName="w-3.5 h-3.5" />
                <p className="flex-1 text-sm" style={{ fontWeight: 600, color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}>
                  {label}
                </p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }}>{range}</p>
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
              {massnahmen.map(({ Icon, label, detail }, i) => (
                <div key={label}>
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center gap-2.5 lg:gap-3 py-2 lg:py-3 rounded-lg cursor-pointer lg:min-h-[44px] text-left"
                    style={{ minHeight: 40, background: 'none', border: 'none' }}
                  >
                    <div
                      className="flex items-center justify-center rounded-lg flex-shrink-0 lg:w-[28px] lg:h-[28px]"
                      style={{ width: 24, height: 24, backgroundColor: 'var(--accent)' }}
                    >
                      <Icon className="w-3 lg:w-3.5 h-3 lg:h-3.5" style={{ color: 'var(--muted-foreground)' }} strokeWidth={1.5} />
                    </div>
                    <p className="flex-1 text-xs lg:text-sm" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}>
                      {label}
                    </p>
                    <ChevronDown
                      className="w-3.5 lg:w-4 h-3.5 lg:h-4 flex-shrink-0 transition-transform"
                      style={{ color: 'var(--muted-foreground)', transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      strokeWidth={1.5}
                    />
                  </button>
                  {openIndex === i && (
                    <p
                      className="pb-2 text-xs lg:text-sm"
                      style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)', lineHeight: 1.6, paddingLeft: 36 }}
                    >
                      {detail}
                    </p>
                  )}
                  {i < massnahmen.length - 1 && (
                    <div className="w-full h-px" style={{ backgroundColor: 'var(--border)' }} />
                  )}
                </div>
              ))}
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
              {einflussfaktoren.map(({ Icon, label, value, description }, i) => (
                <div key={label}>
                  <button
                    onClick={() => setOpenEinflussIndex(openEinflussIndex === i ? null : i)}
                    className="w-full flex items-center gap-2.5 lg:gap-3 py-2 lg:py-3 rounded-lg cursor-pointer lg:min-h-[44px] text-left"
                    style={{ minHeight: 40, background: 'none', border: 'none' }}
                  >
                    <div
                      className="flex items-center justify-center rounded-lg flex-shrink-0 lg:w-[28px] lg:h-[28px]"
                      style={{ width: 24, height: 24, backgroundColor: 'var(--accent)' }}
                    >
                      <Icon className="w-3 lg:w-3.5 h-3 lg:h-3.5" style={{ color: 'var(--muted-foreground)' }} strokeWidth={1.5} />
                    </div>
                    <p className="flex-1 text-xs lg:text-sm" style={{ fontWeight: 600, color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}>
                      {label}
                    </p>
                    <p className="text-xs lg:text-sm mr-2" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }}>{value}</p>
                    <ChevronDown
                      className="w-3.5 lg:w-4 h-3.5 lg:h-4 flex-shrink-0 transition-transform"
                      style={{ color: 'var(--muted-foreground)', transform: openEinflussIndex === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      strokeWidth={1.5}
                    />
                  </button>
                  {openEinflussIndex === i && (
                    <p
                      className="pb-2 text-xs lg:text-sm"
                      style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)', lineHeight: 1.6, paddingLeft: 36 }}
                    >
                      {description}
                    </p>
                  )}
                  {i < einflussfaktoren.length - 1 && (
                    <div className="w-full h-px" style={{ backgroundColor: 'var(--border)' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
