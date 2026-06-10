import React from 'react';
import { Shield, Clock, Droplet, AlertCircle, AlertTriangle, Info, CheckCircle, X, Thermometer, Wind, Sun, HardHat, Shirt } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Cell, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip } from 'recharts';
import DetailRowList from './DetailRowList';
import type { Day } from './PlanungView';

interface BeurteilungstemperaturDetailViewWeeklyProps {
  onClose: () => void;
  days: Day[];
  selectedDayIndex?: number;
}

const backArrow = 'M12 4.9992L4.9992 12L12 19.0008M4.9992 12H19.0008';

function parseTemp(s: string): number {
  return parseInt(s) || 0;
}

function getLevelInfo(temp: number) {
  if (temp < 25) return { level: 1, label: 'Gering',   solidColor: 'var(--status-icon-ok)',       textColor: 'var(--status-success-text)' };
  if (temp < 28) return { level: 2, label: 'Mäßig',    solidColor: 'var(--status-warning)',        textColor: 'var(--neutral-600)' };
  if (temp < 32) return { level: 3, label: 'Stark',    solidColor: 'var(--status-strong)',         textColor: 'var(--neutral-600)' };
  return               { level: 4, label: 'Kritisch',  solidColor: 'var(--status-critical-tint)',  textColor: 'var(--status-critical)' };
}

const waermestufen: { bg: string; Icon: React.ElementType; label: string; range: string }[] = [
  { bg: 'var(--status-icon-ok)',        Icon: CheckCircle,   label: 'Gering',   range: 'Unter 25°C' },
  { bg: 'var(--status-warning)',        Icon: Info,          label: 'Mäßig',    range: '25–28°C'    },
  { bg: 'var(--status-strong)',         Icon: AlertCircle,   label: 'Stark',    range: '28–32°C'    },
  { bg: 'var(--status-critical-tint)',  Icon: AlertTriangle, label: 'Kritisch', range: 'Über 32°C'  },
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

export default function BeurteilungstemperaturDetailViewWeekly({
  onClose,
  days,
  selectedDayIndex = 0,
}: BeurteilungstemperaturDetailViewWeeklyProps) {
  const selDay = days[selectedDayIndex];
  const einflussfaktoren = selDay ? [
    { Icon: Thermometer, label: 'Temperatur',            value: selDay.conditions.lufttemp,      description: 'Die Lufttemperatur ist der wichtigste Faktor. Hohe Temperaturen erhöhen die Wärmebelastung des Körpers direkt.' },
    { Icon: Droplet,     label: 'Feuchtigkeit',          value: selDay.conditions.feuchtigkeit,  description: 'Erhöhte Luftfeuchtigkeit vermindert die Schweißverdunstung und verstärkt die gefühlte Wärme.' },
    { Icon: Wind,        label: 'Wind',                  value: selDay.conditions.wind,           description: 'Geringe Konvektionskühlung. Wind kann die Wärmebelastung bei hohen Temperaturen leicht senken.' },
    { Icon: Sun,         label: 'UV',                    value: selDay.conditions.uv,             description: 'Erhöht die Strahlungsbelastung auf der Haut und verstärkt die Wärmeempfindung im Freien.' },
    { Icon: HardHat,     label: 'Arbeitsschwere',        value: 'Eingestellt in Arbeitsprofil',   description: 'Schwere körperliche Tätigkeiten erhöhen die Körperkerntemperatur erheblich. Eingestellt unter Einstellungen → Arbeitsprofil.' },
    { Icon: Shirt,       label: 'Bekleidung',            value: 'Eingestellt in Arbeitsprofil',   description: 'Schwere Schutzkleidung reduziert die Schweißverdunstung und erhöht die thermische Belastung. Eingestellt unter Einstellungen → Arbeitsprofil.' },
  ] : [];

  const chartData = days.map(d => ({
    name: d.shortDate,
    date: d.date,
    temp: parseTemp(d.conditions.beurteilungsTemp),
  }));

  const peakTemp = Math.max(...chartData.map(d => d.temp));
  const peakLevel = getLevelInfo(peakTemp);

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
                <path d={backArrow} stroke="var(--foreground)" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </button>
            <p style={{ fontWeight: 600, fontSize: 16, lineHeight: 1.35, color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}>
              Beurteilungstemperatur – Woche
            </p>
          </div>
        </div>

        {/* Desktop Header */}
        <div
          className="hidden lg:flex items-center justify-between px-6 py-4 sticky top-0 z-10 bg-white border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <p style={{ fontWeight: 600, fontSize: 16, color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}>
            Beurteilungstemperatur – Wochenübersicht
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

          {/* Peak highlight */}
          <div className="mb-6 lg:mb-8">
            <div className="flex items-baseline gap-3 lg:gap-4">
              <p
                style={{ fontSize: 72, fontWeight: 700, lineHeight: 1, color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}
                className="lg:text-[80px]"
              >
                {peakTemp}°C
              </p>
              <div>
                <p
                  style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2, color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}
                  className="lg:text-[44px]"
                >
                  {peakLevel.label}
                </p>
                <p style={{ fontSize: 12, lineHeight: 1.3, color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }}>
                  Höchstwert diese Woche · mittlere körperl. Arbeit, Sonne
                </p>
              </div>
            </div>
          </div>

          {/* Week bar chart */}
          <div className="mb-8 lg:mb-10">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 16, right: 32, left: 0, bottom: 0 }} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="0" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' } as React.SVGProps<SVGTextElement>}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis domain={[0, 42]} hide />
                <ReferenceLine
                  y={25}
                  stroke="var(--status-warning)"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                  label={{ value: '25°', position: 'right', fontSize: 12, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }}
                />
                <ReferenceLine
                  y={28}
                  stroke="var(--status-strong)"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                  label={{ value: '28°', position: 'right', fontSize: 12, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }}
                />
                <ReferenceLine
                  y={32}
                  stroke="var(--status-critical-tint)"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                  label={{ value: '32°', position: 'right', fontSize: 12, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      const lvl = getLevelInfo(d.temp);
                      return (
                        <div className="bg-white border rounded-lg px-3 py-2 shadow-lg" style={{ borderColor: 'var(--border)' }}>
                          <p style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)', marginBottom: 2 }}>{d.date}</p>
                          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}>
                            {d.temp}°C · {lvl.label}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="temp" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => {
                    const lvl = getLevelInfo(entry.temp);
                    return (
                      <Cell
                        key={index}
                        fill={lvl.solidColor}
                        opacity={index === selectedDayIndex ? 1 : 0.55}
                        stroke={index === selectedDayIndex ? 'var(--foreground)' : 'none'}
                        strokeWidth={index === selectedDayIndex ? 1.5 : 0}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="h-px my-6 lg:my-8" style={{ backgroundColor: 'var(--border)' }} />

          {/* Day list */}
          <div className="mb-6 lg:mb-8">
            <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.35, color: 'var(--foreground)', fontFamily: 'var(--font-family)', marginBottom: 12 }}>
              Tagesübersicht
            </p>
            <div className="rounded-[16px] overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
              {days.map((day, i) => {
                const temp = parseTemp(day.conditions.beurteilungsTemp);
                const lvl = getLevelInfo(temp);
                const isSelected = i === selectedDayIndex;
                return (
                  <div
                    key={i}
                    className="flex items-center px-4 py-3"
                    style={{
                      backgroundColor: isSelected ? 'var(--neutral-100)' : i % 2 === 0 ? 'white' : 'var(--neutral-50)',
                      borderBottom: i < days.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <div className="w-3 h-3 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: lvl.solidColor }} />
                    <p
                      className="flex-1 text-sm"
                      style={{ fontWeight: isSelected ? 700 : 500, color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}
                    >
                      {day.date}
                    </p>
                    <p className="text-sm mr-3" style={{ fontWeight: 600, color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}>
                      {temp}°C
                    </p>
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: lvl.solidColor, color: '#000' }}
                    >
                      {lvl.label}
                    </span>
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
              {waermestufen.map(({ bg, Icon, label, range }, i) => (
                <div
                  key={label}
                  className="flex items-center px-4 py-3 lg:py-4"
                  style={{
                    backgroundColor: i % 2 === 0 ? 'var(--neutral-50)' : 'white',
                    borderBottom: i < waermestufen.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div
                    className="w-7 h-7 mr-3 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: 'var(--neutral-black)' }} strokeWidth={2} />
                  </div>
                  <p className="flex-1 text-sm" style={{ fontWeight: 600, color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}>
                    {label}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }}>{range}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px my-6 lg:my-8" style={{ backgroundColor: 'var(--border)' }} />

          {/* Maßnahmen */}
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
          {einflussfaktoren.length > 0 && (
            <div className="mb-6 lg:mb-8">
              <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.35, color: 'var(--foreground)', fontFamily: 'var(--font-family)', marginBottom: 12 }}>
                Einflussfaktoren
              </p>
              <p style={{ fontSize: 12, lineHeight: 1.4, color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)', marginBottom: 12 }}>
                {selDay?.date}
              </p>
              <div className="rounded-[16px] overflow-hidden" style={{ backgroundColor: 'var(--neutral-50)' }}>
                <div className="px-3 lg:px-4 pt-4 lg:pt-5 pb-3 lg:pb-4 flex flex-col gap-1.5 lg:gap-2">
                  <DetailRowList items={einflussfaktoren.map(e => ({ ...e, detail: e.description }))} />
                </div>
              </div>
            </div>
          )}

          {/* Footer note */}
          <p style={{ fontSize: 'var(--type-size-caption)', lineHeight: 1.5, color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }}>
            Alle Werte beziehen sich auf Tagesspitzenwerte bei mittlerer körperlicher Arbeit und direkter Sonneneinstrahlung.
          </p>

        </div>
      </div>
    </div>
  );
}
