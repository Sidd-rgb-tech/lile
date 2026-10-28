import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Smartphone, Tablet, Code2, Download } from 'lucide-react';

interface AndroidPhoneFrameProps {
  children: React.ReactNode;
  onOpenCodeInspector: () => void;
  onDownloadProjectZip: () => void;
}

export const AndroidPhoneFrame: React.FC<AndroidPhoneFrameProps> = ({
  children,
  onOpenCodeInspector,
  onDownloadProjectZip
}) => {
  const [deviceMode, setDeviceMode] = useState<'pixel' | 'galaxy' | 'fullscreen'>('pixel');
  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-2 sm:p-4 select-none">
      {/* Top AI Studio Developer Control Bar */}
      <header className="w-full max-w-5xl mb-3 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/95 backdrop-blur border border-slate-800 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 via-emerald-400 to-rose-400 flex items-center justify-center font-bold text-white shadow-md shadow-teal-500/30 text-xs">
            360
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-tight text-white">CHANGE360</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Native Android 15 • Light & Vibrant (Build 3)
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Learn. Act. Track. Inspire. — Social Impact Platform
            </p>
          </div>
        </div>

        {/* Viewport switch & Android Studio Actions */}
        <div className="flex items-center gap-2">
          {/* Device toggle */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setDeviceMode('pixel')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                deviceMode === 'pixel'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Google Pixel 8 Pro Frame"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Pixel 8</span>
            </button>
            <button
              onClick={() => setDeviceMode('galaxy')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                deviceMode === 'galaxy'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Samsung Galaxy S24 Frame"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Galaxy S24</span>
            </button>
            <button
              onClick={() => setDeviceMode('fullscreen')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                deviceMode === 'fullscreen'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Expanded Fullscreen View"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Full</span>
            </button>
          </div>

          {/* Android Studio Inspector */}
          <button
            onClick={onOpenCodeInspector}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-400 text-xs font-semibold rounded-xl border border-teal-500/30 transition shadow-sm"
          >
            <Code2 className="w-3.5 h-3.5 text-teal-400" />
            <span>Code Hub</span>
          </button>

          {/* Download Project ZIP */}
          <button
            onClick={onDownloadProjectZip}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-500/20 transition active:scale-95"
            title="Download complete Android Studio Project (.ZIP) ready to build in Android Studio"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Android ZIP</span>
          </button>
        </div>
      </header>

      {/* Main Device Viewport */}
      <div className="w-full flex justify-center items-center flex-1 pb-4">
        {deviceMode === 'fullscreen' ? (
          <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
            {/* Status bar */}
            <div className="h-9 px-6 bg-white border-b border-slate-200/80 flex items-center justify-between text-xs text-slate-800">
              <span className="font-bold">{currentTime}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-teal-600">5G</span>
                <Wifi className="w-3.5 h-3.5 text-slate-700" />
                <Battery className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-50">
              {children}
            </div>
          </div>
        ) : (
          /* Realistic Smartphone Enclosure */
          <div
            className={`relative transition-all duration-300 shadow-[0_25px_60px_-15px_rgba(0,137,123,0.3)] ${
              deviceMode === 'pixel'
                ? 'w-[390px] h-[810px] rounded-[48px] p-3 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 border-[3.5px] border-slate-300'
                : 'w-[380px] h-[800px] rounded-[42px] p-2.5 bg-gradient-to-b from-slate-200 to-slate-300 border-[3px] border-slate-300'
            }`}
          >
            {/* Inner Phone Chassis & Screen Bezel */}
            <div className="w-full h-full bg-slate-50 rounded-[38px] overflow-hidden flex flex-col relative border border-slate-300 shadow-inner">
              {/* Android 15 Status Bar with Camera Hole */}
              <div className="h-9 w-full bg-white px-5 flex items-center justify-between text-xs text-slate-800 select-none z-30 shrink-0 border-b border-slate-100">
                <span className="font-bold text-[11px] tracking-tight">{currentTime}</span>

                {/* Front camera punch hole */}
                <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-[9px] font-black text-teal-600">5G</span>
                  <Wifi className="w-3 h-3 text-slate-700" />
                  <div className="flex items-center">
                    <span className="text-[10px] font-bold mr-0.5">94%</span>
                    <Battery className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/30" />
                  </div>
                </div>
              </div>

              {/* Dynamic Screen Content */}
              <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-50">
                {children}
              </div>

              {/* Android Gesture Navigation Pill Bar */}
              <div className="h-4 w-full bg-white flex items-center justify-center shrink-0 z-30 border-t border-slate-100">
                <div className="w-28 h-1 rounded-full bg-slate-400 hover:bg-slate-600 transition"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
