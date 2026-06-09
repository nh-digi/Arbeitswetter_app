import { Settings, Edit3 } from 'lucide-react';

type View = 'heute' | 'planung' | 'warnung' | 'einstellungen' | 'styleguide';

interface PageHeaderProps {
  title: string;
  variant?: 'dark' | 'light';
  showSettings?: boolean;
  showLocationButton?: boolean;
  onNavigate?: (view: View) => void;
  onOpenSettings?: () => void;
  subtitle?: string;
  icon?: React.ElementType;
  activeLocation?: string | null;
  schwere?: string;
  bekleidung?: string;
}

export default function PageHeader({
  title,
  variant = 'light',
  showSettings = false,
  showLocationButton = false,
  onNavigate,
  onOpenSettings,
  subtitle,
  icon: Icon,
  activeLocation,
  schwere,
  bekleidung,
}: PageHeaderProps) {
  const isDark = variant === 'dark';
  const handleOpenSettings = () => onOpenSettings ? onOpenSettings() : onNavigate?.('einstellungen');

  const LocationButton = () => (
    <button
      onClick={handleOpenSettings}
      className="inline-flex items-center gap-2 rounded-2xl px-3 md:px-4 py-2 md:py-2 h-9 md:h-10 border transition-all duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 flex-1 md:flex-initial overflow-hidden"
      style={{
        backgroundColor: isDark ? 'var(--neutral-800)' : 'var(--muted)',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'transparent',
      }}
    >
      <Edit3
        className="w-3.5 md:w-4 h-3.5 md:h-4 flex-shrink-0"
        strokeWidth={1.5}
        style={{ color: isDark ? '#E2E8F0' : 'var(--muted-foreground)' }}
      />
      <span
        className="text-xs md:text-[15px] truncate"
        style={{
          color: isDark ? '#E2E8F0' : 'var(--muted-foreground)',
          fontFamily: 'var(--font-family)'
        }}
      >
        {activeLocation ?? 'Kein Standort'}{schwere ? ` · ${schwere}` : ''}{bekleidung ? ` · ${bekleidung}` : ''}
      </span>
    </button>
  );

  return (
    <div
      className="px-4 md:px-8 py-3 md:py-5"
      style={{ backgroundColor: isDark ? 'var(--neutral-black)' : 'transparent' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Mobile: Stacked layout */}
        <div className="md:hidden space-y-3">
          <div className="flex items-center gap-3">
            {Icon && (
              <Icon
                className="w-6 h-6 flex-shrink-0"
                strokeWidth={2}
                style={{ color: isDark ? 'white' : 'var(--neutral-950)' }}
              />
            )}
            <h1
              className="text-xl"
              style={{
                color: isDark ? 'white' : 'var(--neutral-950)',
                fontFamily: 'var(--font-family)',
                fontWeight: 600,
                lineHeight: 1.2,
                letterSpacing: '-0.5px'
              }}
            >
              {title}
            </h1>
          </div>

          {subtitle && (
            <p
              className="text-sm leading-[1.3]"
              style={{
                color: isDark ? '#E2E8F0' : 'var(--neutral-600)',
                fontFamily: 'var(--font-family)'
              }}
            >
              {subtitle}
            </p>
          )}

          {(showLocationButton || showSettings) && (
            <div className="flex items-center gap-2">
              {showLocationButton && <LocationButton />}
              {showSettings && (
                <button
                  onClick={handleOpenSettings}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors border flex-shrink-0"
                  style={{
                    backgroundColor: isDark ? 'var(--neutral-800)' : 'transparent',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                  }}
                >
                  <Settings
                    className="w-4 h-4"
                    strokeWidth={1.5}
                    style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'var(--neutral-600)' }}
                  />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Desktop: Horizontal layout */}
        <div className="hidden md:block">
          <div className="flex items-center gap-3 mb-2">
            {Icon && (
              <Icon
                className="w-8 h-8 flex-shrink-0"
                strokeWidth={2}
                style={{ color: isDark ? 'white' : 'var(--neutral-950)' }}
              />
            )}
            <h1
              className="text-2xl"
              style={{
                color: isDark ? 'white' : 'var(--neutral-950)',
                fontFamily: 'var(--font-family)',
                fontWeight: 600,
                lineHeight: 1.2,
                letterSpacing: '-0.5px'
              }}
            >
              {title}
            </h1>
          </div>

          {subtitle && (
            <p
              className="text-sm leading-[1.3] mb-4"
              style={{
                color: isDark ? '#E2E8F0' : 'var(--neutral-600)',
                fontFamily: 'var(--font-family)'
              }}
            >
              {subtitle}
            </p>
          )}

          {(showLocationButton || showSettings) && (
            <div className="flex items-center justify-between mt-4">
              {showLocationButton ? (
                <>
                  <div className="flex-1 max-w-2xl">
                    <LocationButton />
                  </div>
                  {showSettings && (
                    <button
                      onClick={handleOpenSettings}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors border flex-shrink-0 ml-4"
                      style={{
                        backgroundColor: isDark ? 'var(--neutral-800)' : 'transparent',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                      }}
                    >
                      <Settings
                        className="w-5 h-5"
                        strokeWidth={1.5}
                        style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'var(--neutral-600)' }}
                      />
                    </button>
                  )}
                </>
              ) : showSettings ? (
                <div className="flex justify-end">
                  <button
                    onClick={handleOpenSettings}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors border flex-shrink-0"
                    style={{
                      backgroundColor: isDark ? 'var(--neutral-800)' : 'transparent',
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                    }}
                  >
                    <Settings
                      className="w-5 h-5"
                      strokeWidth={1.5}
                      style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'var(--neutral-600)' }}
                    />
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
