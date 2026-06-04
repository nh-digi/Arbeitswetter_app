import { useState } from 'react';
import { Home, Calendar, AlertTriangle, Settings } from 'lucide-react';
import HeuteView from './components/HeuteView';
import PlanungView from './components/PlanungView';
import WarnungView from './components/WarnungView';
import EinstellungenView from './components/EinstellungenView';
type View = 'heute' | 'planung' | 'warnung' | 'einstellungen';
interface Ort { id: number; name: string; city: string; lat?: number; lng?: number; }

export default function App() {
  const [activeView, setActiveView] = useState<View>('heute');
  const [startZeit,    setStartZeit]    = useState('06:00');
  const [endZeit,      setEndZeit]      = useState('14:00');
  const [schwere,      setSchwere]      = useState<'leicht' | 'mittel' | 'schwer'>('mittel');
  const [orte,         setOrte]         = useState<Ort[]>([
    { id: 1, name: 'Berlin Ost', city: 'Baustelle A10', lat: 52.5200, lng: 13.4050 },
    { id: 2, name: 'Hamburg',    city: 'Lager Nord',    lat: 53.5511, lng: 9.9937  },
  ]);
  const [aktiveOrtId,  setAktiveOrtId]  = useState<number | null>(null);
  const activeOrt = orte.find(o => o.id === aktiveOrtId) ?? null;
  const SCHWERE_SHORT: Record<'leicht' | 'mittel' | 'schwer', string> = { leicht: 'Leicht', mittel: 'Mittel', schwer: 'Schwer' };

  const navItems = [
    { id: 'heute'         as View, label: 'Heute',          icon: Home,          dot: false },
    { id: 'planung'       as View, label: 'Planung',        icon: Calendar,      dot: false },
    { id: 'warnung'       as View, label: 'DWD Warnungen',  icon: AlertTriangle, dot: true  },
    { id: 'einstellungen' as View, label: 'Einstellungen',  icon: Settings,      dot: false },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        {activeView === 'heute'         && <HeuteView onNavigate={setActiveView} activeLocation={activeOrt?.name ?? null} workStart={startZeit} workEnd={endZeit} schwere={SCHWERE_SHORT[schwere]} />}
        {activeView === 'planung'       && <PlanungView onNavigate={setActiveView} />}
        {activeView === 'warnung'       && <WarnungView onNavigate={setActiveView} />}
        {activeView === 'einstellungen' && <EinstellungenView startZeit={startZeit} setStartZeit={setStartZeit} endZeit={endZeit} setEndZeit={setEndZeit} orte={orte} setOrte={setOrte} aktiveOrtId={aktiveOrtId} setAktiveOrtId={setAktiveOrtId} schwere={schwere} setSchwere={setSchwere} />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'text-[#1d3fa3]' : 'text-[#64748b] hover:text-black/80'
                }`}
              >
                <span className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2]' : 'stroke-[1.5]'}`} />
                  {item.dot && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#E8193C] border border-white" />
                  )}
                </span>
                <span className="text-xs leading-none hidden min-[400px]:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Side Navigation */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-[#e2e8f0]">
        <div className="px-6 pt-6 pb-4">
          <p className="text-base text-black">Arbeitswetter</p>
        </div>
        <div className="h-px bg-[#e2e8f0]" />
        <div className="p-3 flex-1">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 h-10 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#e2e8f0] text-[#1d3fa3]'
                      : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-black/80'
                  }`}
                >
                  <span className="relative flex-shrink-0">
                    <Icon
                      className="w-[18px] h-[18px]"
                      strokeWidth={isActive ? 2 : 1.5}
                      style={{ color: isActive ? '#325cda' : '#64748b' }}
                    />
                    {item.dot && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#E8193C] border border-white" />
                    )}
                  </span>
                  <span className="text-base">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </nav>

      {/* Desktop Content Offset */}
      <style>{`
        @media (min-width: 768px) { main { margin-left: 16rem; } }
      `}</style>
    </div>
  );
}
