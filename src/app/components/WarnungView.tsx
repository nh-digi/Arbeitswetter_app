import { MapPin, Clock, Sun, Zap, Wind, CloudRain, ExternalLink, ChevronDown, Thermometer, Sunrise } from 'lucide-react';
import PageHeader from './PageHeader';

type View = 'heute' | 'planung' | 'warnung' | 'einstellungen';

export default function WarnungView({ onNavigate, onOpenSettings, activeLocation, schwere, bekleidung }: { onNavigate: (view: View) => void; onOpenSettings?: () => void; activeLocation?: string | null; schwere?: string; bekleidung?: string }) {
  const warnings = [
    {
      id: 1,
      severity: 'extreme',
      severityLabel: 'EXTREME',
      icon: Sun,
      title: 'Extreme Hitzebelastung',
      location: 'Brandenburg',
      timeStart: '09:42',
      timeEnd: '20:00',
      description: 'Extreme Hitzebelastung erwartet. Direkte Sonneneinstrahlung sollte möglichst vermieden werden. Die Warnung gilt für alle Landkreise in der genannten Region. Es ist mit einer erhöhten Waldbrandgefahr zu rechnen.',
      factors: [
        { label: 'Hitze', Icon: Thermometer },
        { label: 'UV-Strahlung', Icon: Sunrise },
      ],
      recommendations: [
        'Tätigkeiten im Freien in den Mittags- und Nachmittagsstunden nach Möglichkeit vermeiden',
        'Kopfbedeckung und leichte, luftdurchlässige Kleidung empfohlen',
        'Arbeiten im Schatten empfohlen – schattenspendende Maßnahmen bei Bedarf sinnvoll',
        'Ausreichend Trinkwasser bereithalten – regelmäßige Flüssigkeitsaufnahme wird empfohlen',
      ],
    },
    {
      id: 2,
      severity: 'unwetter',
      severityLabel: 'UNWETTER',
      icon: Zap,
      title: 'Schweres Gewitter',
      location: 'Spandau',
      timeStart: '14:00',
      timeEnd: '22:00',
      description: 'Schwere Unwetter mit Starkregen und Sturmböen erwartet. Betroffene Gebiete im Einzugsbereich sollten möglichst gemieden werden.',
      recommendations: [
        'Gegenstände im Freien möglichst sichern',
        'Abstand von Gebäuden, Bäumen, Gerüsten und Hochspannungsleitungen empfohlen',
        'Aufenthalte im Freien möglichst vermeiden',
      ],
    },
    {
      id: 3,
      severity: 'markant',
      severityLabel: 'MARKANT',
      icon: Wind,
      title: 'Starker Wind',
      location: 'Berlin, Brandenburg',
      timeStart: '11:30',
      timeEnd: '18:00',
      description: 'Markante Wettererscheinungen möglich. Lokale Gewitter und Windböen sind in weiten Teilen der Region zu erwarten.',
    },
    {
      id: 4,
      severity: 'wetter',
      severityLabel: 'WETTER',
      icon: CloudRain,
      title: 'Regen',
      location: 'Berlin, Brandenburg',
      timeStart: '08:00',
      timeEnd: '16:00',
      description: 'Wetterbedingte Einschränkungen möglich. Leichter Regen und bewölkter Himmel werden für den Nachmittag erwartet.',
    },
  ];

  const severityConfig = {
    extreme: {
      iconBg: 'bg-[#fb88ff]',
      tagBg: 'bg-[#fb88ff]',
      tagBorder: 'border-[var(--status-critical)]',
    },
    unwetter: {
      iconBg: 'bg-[#ff878a]',
      tagBg: 'bg-[#ff878a]',
      tagBorder: 'border-[var(--status-critical)]',
    },
    markant: {
      iconBg: 'bg-[var(--status-warning)]',
      tagBg: 'bg-[var(--status-warning)]',
      tagBorder: 'border-[#ff878a]',
    },
    wetter: {
      iconBg: 'bg-[var(--status-caution)]',
      tagBg: 'bg-[var(--status-caution)]',
      tagBorder: 'border-[var(--status-warning)]',
    },
  };

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: 'var(--neutral-950)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-sm border-b" style={{ backgroundColor: 'rgba(15,23,42,0.95)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <PageHeader
          title="Warnungen für Berlin & Brandenburg"
          variant="dark"
          showLocationButton
          onNavigate={onNavigate}
          onOpenSettings={onOpenSettings}
          activeLocation={activeLocation}
          schwere={schwere}
          bekleidung={bekleidung}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-[760px] mx-auto px-4 md:px-10 py-6 md:py-12 space-y-6">

        {/* Warning Cards */}
        {warnings.map((warning) => {
          const config = severityConfig[warning.severity as keyof typeof severityConfig];
          const Icon = warning.icon;

          return (
            <div
              key={warning.id}
              className="bg-[var(--neutral-50)] rounded-2xl px-6 py-5 space-y-3"
            >
              {/* Header */}
              <div className="flex items-center gap-2.5 w-full">
                <div
                  className={`${config.iconBg} rounded-3xl w-12 h-12 flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className="w-6 h-6 text-black" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div
                      className={`${config.tagBg} px-2 py-1 rounded border ${config.tagBorder} flex-shrink-0`}
                    >
                      <p className="text-xs leading-[1.3] text-black" style={{ fontWeight: 600 }}>
                        {warning.severityLabel}
                      </p>
                    </div>
                    <p className="text-base leading-normal text-[var(--neutral-950)]" style={{ fontWeight: 600 }}>
                      {warning.title}
                    </p>
                  </div>
                  {warning.factors && warning.factors.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      {warning.factors.map(({ label, Icon: FIcon }) => (
                        <span key={label} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ fontWeight: 500, backgroundColor: 'rgba(255,255,255,0.12)', color: 'var(--neutral-600)', border: '1px solid var(--neutral-100)' }}>
                          <FIcon className="w-3 h-3" strokeWidth={2} />
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Location & Time */}
              <div className="flex items-center gap-1.5 flex-wrap text-sm lg:text-base leading-[1.6]">
                <MapPin className="w-3.5 h-3.5 text-[var(--neutral-600)]" strokeWidth={2} />
                <span className="text-[var(--neutral-950)]" style={{ fontWeight: 600 }}>Ort:</span>
                <span className="text-[var(--neutral-950)]">{warning.location}</span>
                <span className="text-[var(--neutral-500)]">·</span>
                <Clock className="w-3.5 h-3.5 text-[var(--neutral-600)]" strokeWidth={2} />
                <span className="text-[var(--neutral-950)]" style={{ fontWeight: 600 }}>Zeitfenster:</span>
                <span className="text-[var(--neutral-950)]">{warning.timeStart} – Gültig bis {warning.timeEnd}</span>
              </div>

              {/* Separator */}
              <div className="h-px bg-[var(--neutral-100)]" />

              {/* Description */}
              <p className="text-sm lg:text-base leading-[1.5] text-[var(--neutral-950)]">
                {warning.description}
              </p>

              {/* Recommendations (if present) */}
              {warning.recommendations && warning.recommendations.length > 0 && (
                <>
                  <div className="h-px bg-[var(--neutral-100)]" />
                  <details className="group">
                    <summary className="cursor-pointer list-none flex items-center justify-between py-2 text-[var(--neutral-950)] hover:opacity-70 transition-opacity">
                      <span className="text-sm lg:text-base" style={{ fontWeight: 600 }}>
                        Empfohlene Maßnahmen
                      </span>
                      <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" strokeWidth={2} />
                    </summary>
                    <div className="pt-2">
                      <ul className="space-y-1.5">
                        {warning.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm lg:text-base leading-[1.5] text-[var(--neutral-950)] pl-4 relative">
                            <span className="absolute left-0">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </>
              )}
            </div>
          );
        })}

        {/* Source Attribution */}
        <div className="bg-[var(--neutral-50)] rounded-2xl px-6 py-4 border border-[var(--neutral-100)]">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm lg:text-base text-[var(--neutral-950)]" style={{ fontWeight: 600 }}>
                Quelle: Deutscher Wetterdienst (DWD)
              </p>
              <p className="text-xs leading-[1.5] text-[var(--neutral-600)] mt-1">
                Offizielle Wetterwarnungen werden vom Deutschen Wetterdienst bereitgestellt und automatisch aktualisiert.
              </p>
            </div>
            <a
              href="https://www.wettergefahren.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[var(--neutral-100)] hover:bg-[var(--neutral-100)] transition-colors text-sm text-[var(--neutral-950)]"
              style={{ fontWeight: 500 }}
            >
              <span>DWD öffnen</span>
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
