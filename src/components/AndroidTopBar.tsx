import React from 'react';
import { ArrowLeft, Flame, User, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface AndroidTopBarProps {
  title: string;
  showBack: boolean;
  onBack: () => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
}

export const AndroidTopBar: React.FC<AndroidTopBarProps> = ({
  title,
  showBack,
  onBack,
  userProfile,
  onOpenProfile
}) => {
  return (
    <div className="h-14 px-4 bg-white/95 backdrop-blur border-b border-slate-200/80 flex items-center justify-between shrink-0 z-20">
      <div className="flex items-center gap-2.5">
        {showBack ? (
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition active:scale-90"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white font-black text-xs shadow-sm">
            360
          </div>
        )}

        <div>
          <h1 className="font-extrabold text-sm tracking-tight text-slate-900 leading-tight">
            {title}
          </h1>
          {!showBack && (
            <p className="text-[10px] text-teal-600 font-semibold">
              Social Impact Platform
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Streak Pill */}
        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-amber-700">
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{userProfile.currentStreakDays}d</span>
        </div>

        {/* Points Pill */}
        <div className="flex items-center gap-1 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-teal-800">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>{userProfile.totalPoints}</span>
        </div>

        {/* Profile Avatar Button */}
        <button
          onClick={onOpenProfile}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-400 flex items-center justify-center text-slate-700 hover:text-teal-700 transition active:scale-95 ml-0.5"
          title="Open Profile & Settings"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
