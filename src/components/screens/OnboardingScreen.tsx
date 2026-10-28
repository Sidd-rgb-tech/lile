import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, ShieldCheck, Palette, Clock, CheckCircle2, HeartHandshake } from 'lucide-react';
import { UserProfile, AwarenessCategory } from '../../types';
import { ALL_CATEGORIES } from '../../data/mockData';

interface OnboardingScreenProps {
  currentProfile: UserProfile;
  onCompleteOnboarding: (profile: UserProfile) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  currentProfile,
  onCompleteOnboarding
}) => {
  const [step, setStep] = useState<number>(0); // 0: Welcome/Auth, 1: Causes, 2: Target, 3: Vibe
  const [isGoogleUser, setIsGoogleUser] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>(currentProfile.displayName);
  const [selectedCauses, setSelectedCauses] = useState<AwarenessCategory[]>(currentProfile.selectedCauses || []);
  const [dailyTargetMinutes, setDailyTargetMinutes] = useState<number>(currentProfile.dailyTargetMinutes || 15);
  const [preferredPosterVibe, setPreferredPosterVibe] = useState<string>(currentProfile.preferredPosterVibe || 'Vibrant Modern');

  const toggleCause = (cause: AwarenessCategory) => {
    setSelectedCauses(prev =>
      prev.includes(cause) ? prev.filter(c => c !== cause) : [...prev, cause]
    );
  };

  const handleFinish = () => {
    onCompleteOnboarding({
      ...currentProfile,
      displayName: displayName || (isGoogleUser ? 'Alex Morgan' : 'Changemaker'),
      isGoogleUser,
      isGuestMode: !isGoogleUser,
      isOnboardingCompleted: true,
      selectedCauses,
      dailyTargetMinutes,
      preferredPosterVibe
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-white via-emerald-50/40 to-rose-50/40 p-5 overflow-y-auto text-slate-800 scrollbar-none">
      {step === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-6">
          {/* Logo Badge */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-rose-400 p-1 shadow-lg shadow-teal-500/20 animate-pulse">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-teal-700 font-black text-2xl">
              360°
            </div>
          </div>

          <div>
            <span className="text-[11px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              SOCIAL IMPACT PLATFORM
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
              CHANGE360
            </h1>
            <p className="text-sm font-bold text-teal-700 mt-1">
              Learn. Act. Track. Inspire.
            </p>
            <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
              Transform positive awareness into tangible, verifiable daily action across 20 social causes.
            </p>
          </div>

          <div className="w-full space-y-3 pt-4">
            {/* Continue with Google (Simulated OAuth flow) */}
            <button
              onClick={() => {
                setIsGoogleUser(true);
                setDisplayName('Alex Morgan');
                setStep(1);
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 shadow-md flex items-center justify-center gap-3 transition-transform active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Skip for Guest Mode */}
            <button
              onClick={() => {
                setIsGoogleUser(false);
                setDisplayName('Changemaker');
                setStep(1);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-teal-700 transition"
            >
              Skip for Now (Explore in Guest Mode)
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
              Step 1 of 3
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">
              Select Your Focus Causes
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Pick 2 or more causes to personalize your challenges and daily impact feed.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-4 max-h-[50vh] overflow-y-auto pr-1">
              {ALL_CATEGORIES.map(category => {
                const isSelected = selectedCauses.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => toggleCause(category)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all active:scale-95 flex items-center justify-between ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="line-clamp-2">{category}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={selectedCauses.length === 0}
            className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <span>Next: Daily Target</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
              Step 2 of 3
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">
              Set Your Daily Impact Target
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Consistency matters more than intensity. How much time will you dedicate each day?
            </p>

            <div className="space-y-3 mt-4">
              {[
                { mins: 5, label: 'Light Explorer (5 mins/day)', desc: 'Quick daily habit checks, awareness reads, and quizzes.' },
                { mins: 15, label: 'Active Changemaker (15 mins/day)', desc: 'Balanced pace: single-use plastic audits, 2FA checks, micro-cleanups.' },
                { mins: 30, label: 'Community Champion (30 mins/day)', desc: 'Deep engagement: organizing campaigns, book drives, civic tickets.' }
              ].map(item => {
                const isSelected = dailyTargetMinutes === item.mins;
                return (
                  <button
                    key={item.mins}
                    onClick={() => setDailyTargetMinutes(item.mins)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all active:scale-98 ${
                      isSelected
                        ? 'bg-sky-50 border-sky-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-sky-900' : 'text-slate-900'}`}>
                        {item.label}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setStep(3)}
            className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <span>Next: Poster Aesthetic</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
              Step 3 of 3
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">
              Choose Your Poster Aesthetic
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your default graphic style for exported impact posters and social sharing.
            </p>

            <div className="space-y-3 mt-4">
              {[
                { vibe: 'Vibrant Modern', desc: 'High-energy neon mint & coral gradients, bold typography, badge stickers.', color: 'border-rose-400 bg-rose-50/50' },
                { vibe: 'Clean Minimalist', desc: 'Airy white space, crisp typography, clean structured cards.', color: 'border-teal-400 bg-teal-50/50' },
                { vibe: 'Bold Infographic', desc: 'Structured progress rings, statistical breakdown, high contrast.', color: 'border-sky-400 bg-sky-50/50' }
              ].map(item => {
                const isSelected = preferredPosterVibe === item.vibe;
                return (
                  <button
                    key={item.vibe}
                    onClick={() => setPreferredPosterVibe(item.vibe)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all active:scale-98 ${
                      isSelected
                        ? `border-2 ${item.color} shadow-sm`
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{item.vibe}</span>
                      {isSelected && <Check className="w-4 h-4 text-teal-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-teal-600 hover:from-rose-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-rose-500/20 flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <span>Launch CHANGE360</span>
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </button>
        </div>
      )}
    </div>
  );
};
