import React, { useState, useEffect } from 'react';
import { Smartphone, Maximize2, Minimize2, Volume2, VolumeX, Sparkles, Code, PieChart, ArrowLeftRight } from 'lucide-react';

interface AndroidDeviceFrameProps {
  children: React.ReactNode;
  isDeviceMode: boolean;
  onToggleDeviceMode: () => void;
  onOpenCodeExport: () => void;
  onOpenGraphPlotter: () => void;
  onOpenUnitConverter: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentTheme: string;
  onThemeChange: (theme: any) => void;
}

export const AndroidDeviceFrame: React.FC<AndroidDeviceFrameProps> = ({
  children,
  isDeviceMode,
  onToggleDeviceMode,
  onOpenCodeExport,
  onOpenGraphPlotter,
  onOpenUnitConverter,
  soundEnabled,
  onToggleSound,
  currentTheme,
  onThemeChange,
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const themeColors = [
    { id: 'dynamic-blue', name: 'Material Blue', bg: 'bg-blue-600' },
    { id: 'dynamic-purple', name: 'Material Purple', bg: 'bg-purple-600' },
    { id: 'emerald', name: 'Emerald Wave', bg: 'bg-emerald-600' },
    { id: 'sunset', name: 'Sunset Amber', bg: 'bg-amber-600' },
    { id: 'amoled-dark', name: 'OLED Black', bg: 'bg-zinc-900' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 select-none font-sans">
      {/* Top Application Header */}
      <header className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-4 py-3 px-4 mb-4 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
            <span className="text-lg">f(x)</span>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              Android M3 Scientific Calculator
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                Jetpack Compose
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Kotlin • Material Design 3 • Shunting-Yard RPN Parser • History Bottom Sheet
            </p>
          </div>
        </div>

        {/* Header Action Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenUnitConverter}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Unit Converter"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Units</span>
          </button>

          <button
            onClick={onOpenGraphPlotter}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Interactive Function Plotter"
          >
            <PieChart className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Grapher</span>
          </button>

          <button
            onClick={onOpenCodeExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all font-mono"
            title="Export Kotlin & Compose Code"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Kotlin Source</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

          {/* Theme Palette Dots */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
            {themeColors.map((t) => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`w-5 h-5 rounded-full ${t.bg} transition-all transform ${
                  currentTheme === t.id ? 'scale-110 ring-2 ring-white ring-offset-1 ring-offset-slate-900' : 'opacity-70 hover:opacity-100'
                }`}
                title={t.name}
              />
            ))}
          </div>

          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled
                ? 'bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={soundEnabled ? 'Mute Key Sounds' : 'Enable Key Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onToggleDeviceMode}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
            title={isDeviceMode ? 'Expanded View' : 'Device Shell View'}
          >
            {isDeviceMode ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </header>

      {/* Main Display Canvas */}
      {isDeviceMode ? (
        /* Realistic Android Phone Device Frame */
        <div className="relative my-auto py-2 transition-all duration-300">
          <div className="relative w-[360px] sm:w-[390px] h-[780px] bg-slate-900 rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[6px] border-slate-800 ring-1 ring-white/10 flex flex-col overflow-hidden">
            
            {/* Phone Hardware Side Buttons (Decorative) */}
            <div className="absolute -right-[9px] top-28 w-[3px] h-12 bg-slate-700 rounded-r-sm" />
            <div className="absolute -right-[9px] top-44 w-[3px] h-16 bg-slate-700 rounded-r-sm" />

            {/* Top Status Bar with Camera Notch */}
            <div className="w-full h-8 px-6 pt-1 flex items-center justify-between text-[11px] font-semibold text-slate-300 z-30 shrink-0">
              <span className="font-mono">{time || '09:41'}</span>
              
              {/* Hole punch camera */}
              <div className="w-3.5 h-3.5 bg-black rounded-full ring-1 ring-slate-800 shadow-inner mx-auto" />

              <div className="flex items-center gap-1.5 text-slate-300">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.3c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.2 19.54 10.55 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                </svg>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3C6.95 3 2.55 5.7 0 9.76L12 21 24 9.76C21.45 5.7 17.05 3 12 3z"/>
                </svg>
                <div className="w-5 h-2.5 border border-slate-300 rounded-[2px] p-[1px] flex items-center">
                  <div className="w-3.5 h-full bg-emerald-400 rounded-[1px]" />
                </div>
              </div>
            </div>

            {/* Calculator App Screen Content */}
            <div className="flex-1 w-full flex flex-col overflow-hidden rounded-[32px] relative z-10 bg-slate-950">
              {children}
            </div>

            {/* Android Bottom Gesture Navigation Bar */}
            <div className="w-full h-5 flex items-center justify-center pt-1 shrink-0 z-30">
              <div className="w-32 h-1 bg-slate-500/60 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        /* Expanded Full Screen Container */
        <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-4 sm:p-6 overflow-hidden flex-1 my-auto flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};
