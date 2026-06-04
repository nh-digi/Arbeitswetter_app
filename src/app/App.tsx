import { useState } from 'react';
import { Home, Calendar, AlertTriangle, Settings, BookOpen } from 'lucide-react';
import HeuteView from './components/HeuteView';
import PlanungView from './components/PlanungView';
import WarnungView from './components/WarnungView';
import EinstellungenView from './components/EinstellungenView';
import StyleguideView from './components/StyleguideView';

type View = 'heute' | 'planung' | 'warnung' | 'einstellungen' | 'styleguide';

export default function App() {
  const [activeView, setActiveView] = useState<View>('heute');

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
        {activeView === 'heute'         && <HeuteView onNavigate={setActiveView} />}
        {activeView === 'planung'       && <PlanungView onNavigate={setActiveView} />}
        {activeView === 'warnung'       && <WarnungView onNavigate={setActiveView} />}
        {activeView === 'einstellungen' && <EinstellungenView />}
        {activeView === 'styleguide'    && <StyleguideView />}
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
                <span className="text-xs leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile styleguide icon — floating, above nav */}
      <button
        onClick={() => setActiveView(activeView === 'styleguide' ? 'heute' : 'styleguide')}
        className={`md:hidden fixed bottom-[72px] right-4 w-9 h-9 rounded-full border shadow-sm
          flex items-center justify-center transition-all z-20 ${
          activeView === 'styleguide'
            ? 'bg-[#325cda] border-[#325cda] text-white'
            : 'bg-white border-black/10 text-black/40 hover:text-black/60'
        }`}
        title="Design System"
        aria-label="Design System"
      >
        <BookOpen className="w-4 h-4" strokeWidth={1.5} />
      </button>

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

        {/* Desktop styleguide link — bottom of sidebar */}
        <div className="px-3 pb-4 border-t border-[#e2e8f0] pt-3">
          <button
            onClick={() => setActiveView(activeView === 'styleguide' ? 'heute' : 'styleguide')}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors ${
              activeView === 'styleguide'
                ? 'bg-[#eef2fd] text-[#1d3fa3]'
                : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-black/80'
            }`}
            title="Design System"
          >
            <BookOpen className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.5} />
            <span className="text-sm">Design System</span>
          </button>
        </div>
      </nav>

      {/* Desktop Content Offset */}
      <style>{`
        @media (min-width: 768px) { main { margin-left: 16rem; } }
      `}</style>
    </div>
  );
}
