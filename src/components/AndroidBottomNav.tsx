import React from 'react';
import { Home, Bot, CheckSquare, BarChart3, Palette } from 'lucide-react';

export type MainTab = 'home' | 'assistant' | 'challenges' | 'impact' | 'poster';

interface AndroidBottomNavProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  currentTab,
  onSelectTab
}) => {
  const tabs = [
    { id: 'home' as MainTab, label: 'Home', icon: Home },
    { id: 'assistant' as MainTab, label: 'AI Guide', icon: Bot },
    { id: 'challenges' as MainTab, label: 'Challenges', icon: CheckSquare },
    { id: 'impact' as MainTab, label: 'My Impact', icon: BarChart3 },
    { id: 'poster' as MainTab, label: 'Poster', icon: Palette }
  ];

  return (
    <nav className="h-16 px-2 bg-white/95 backdrop-blur border-t border-slate-200/80 flex items-center justify-around shrink-0 z-20 shadow-xs">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className="flex-1 flex flex-col items-center justify-center py-1 group relative transition-transform active:scale-95"
          >
            {/* Material 3 active pill indicator */}
            <div
              className={`px-4 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                isActive
                  ? 'bg-teal-50 text-teal-700 border border-teal-200 shadow-xs'
                  : 'text-slate-400 group-hover:text-slate-600'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-105 stroke-[2.3]' : 'stroke-[1.8]'}`} />
            </div>
            <span
              className={`text-[10px] mt-0.5 tracking-tight font-medium transition-colors ${
                isActive ? 'text-teal-800 font-bold' : 'text-slate-400'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
