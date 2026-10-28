import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  ArrowRight,
  Bot,
  Palette,
  Megaphone,
  BookOpen,
  Award,
  ChevronRight,
  Compass,
  Lightbulb,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, Challenge, Badge, Campaign, AwarenessCategory } from '../../types';
import { ALL_CATEGORIES } from '../../data/mockData';
import { MainTab } from '../AndroidBottomNav';

interface HomeScreenProps {
  userProfile: UserProfile;
  challenges: Challenge[];
  badges: Badge[];
  campaigns: Campaign[];
  onNavigateTab: (tab: MainTab) => void;
  onOpenCampaigns: () => void;
  onOpenStories: () => void;
  onSelectCategoryFilter: (category: AwarenessCategory) => void;
  onQuickCompleteAction: (actionTitle: string, points: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userProfile,
  challenges,
  badges,
  campaigns,
  onNavigateTab,
  onOpenCampaigns,
  onOpenStories,
  onSelectCategoryFilter,
  onQuickCompleteAction
}) => {
  const [dailyActionDone, setDailyActionDone] = useState(false);

  const completedCount = challenges.filter(c => c.status === 'COMPLETED').length;
  const unlockedBadgesCount = badges.filter(b => b.isUnlocked).length;
  const featuredCampaign = campaigns[0];

  const handleDailyActionClick = () => {
    if (!dailyActionDone) {
      setDailyActionDone(true);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
      onQuickCompleteAction('Daily Action: Reusable Bottle Swap & Waste Audit', 30);
    }
  };

  // Circular progress calculation: daily goal is 30 mins or completed count %
  const dailyTargetMinutes = userProfile.dailyTargetMinutes || 15;
  const progressRatio = Math.min(1, Math.max(0.2, (completedCount * 10) / dailyTargetMinutes));
  const strokeDashoffset = 125.6 * (1 - progressRatio);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#F8F9FA] text-slate-800 scrollbar-none pb-24">
      {/* Welcome Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
            {userProfile.isGoogleUser ? 'Google Changemaker' : 'Active Changemaker'}
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Hello, {userProfile.displayName}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Turn social awareness into real, measurable daily action.
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-rose-400 p-0.5 shadow-sm">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-teal-700 font-extrabold text-xs shadow-inner">
            360°
          </div>
        </div>
      </div>

      {/* Progress & Gamification Stat Grid with Animated Gauge */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Circular Progress Gauge */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-slate-100"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="url(#progressGradient)"
                strokeWidth="4"
                strokeDasharray="125.6"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E676" />
                  <stop offset="100%" stopColor="#00B0FF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-black text-slate-900 leading-none">
                {Math.round(progressRatio * 100)}%
              </span>
              <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">
                Goal
              </span>
            </div>
          </div>

          {/* Stat metrics */}
          <div className="flex-1 grid grid-cols-3 divide-x divide-slate-100 text-center">
            <div className="px-1">
              <div className="flex items-center justify-center gap-1 text-teal-600 mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                <span className="text-base font-black text-slate-900">{userProfile.totalPoints}</span>
              </div>
              <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">
                Points
              </span>
            </div>

            <div className="px-1">
              <div className="flex items-center justify-center gap-1 text-rose-500 mb-0.5">
                <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span className="text-base font-black text-slate-900">{userProfile.currentStreakDays}d</span>
              </div>
              <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">
                Streak
              </span>
            </div>

            <div className="px-1">
              <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-base font-black text-slate-900">{unlockedBadgesCount}/10</span>
              </div>
              <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">
                Badges
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Recommended Action Card */}
      <div className="bg-gradient-to-br from-amber-50/70 via-white to-emerald-50/50 border border-amber-200/80 rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wide">
                Today's Recommended Action
              </span>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full border border-teal-200">
                +30 pts
              </span>
            </div>
            <h3 className="text-xs font-bold text-slate-900 mt-1">
              Reusable Hydration Swap & Micro-Audit
            </h3>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              Carry a refillable water flask today and decline single-use disposable cups or plastic straws.
            </p>

            <button
              onClick={handleDailyActionClick}
              disabled={dailyActionDone}
              className={`mt-3 w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs ${
                dailyActionDone
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                  : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/20'
              }`}
            >
              {dailyActionDone ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Action Logged for Today! (+30 pts)</span>
                </>
              ) : (
                <>
                  <span>Mark Done & Claim Points</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div>
        <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2.5">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onNavigateTab('assistant')}
            className="p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-500/50 flex items-center gap-2.5 text-left transition active:scale-95 shadow-2xs group"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 border border-sky-200">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-teal-600 transition">
                AI Assistant
              </span>
              <p className="text-[10px] text-slate-500">Ask causes or quiz</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('poster')}
            className="p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-500/50 flex items-center gap-2.5 text-left transition active:scale-95 shadow-2xs group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">
                Make Poster
              </span>
              <p className="text-[10px] text-slate-500">8 vibrant styles</p>
            </div>
          </button>

          <button
            onClick={onOpenCampaigns}
            className="p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-500/50 flex items-center gap-2.5 text-left transition active:scale-95 shadow-2xs group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition">
                Campaigns
              </span>
              <p className="text-[10px] text-slate-500">School & community</p>
            </div>
          </button>

          <button
            onClick={onOpenStories}
            className="p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-500/50 flex items-center gap-2.5 text-left transition active:scale-95 shadow-2xs group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition">
                Impact Stories
              </span>
              <p className="text-[10px] text-slate-500">Real inspiring stories</p>
            </div>
          </button>
        </div>
      </div>

      {/* Featured Campaign Banner */}
      {featuredCampaign && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-extrabold text-teal-700 uppercase tracking-wider">
              Featured Community Campaign
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              {featuredCampaign.participantCount} joined
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 leading-snug">
            {featuredCampaign.title}
          </h4>
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {featuredCampaign.description}
          </p>
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
            <span className="text-[10px] text-teal-700 font-semibold">
              {featuredCampaign.durationText}
            </span>
            <button
              onClick={onOpenCampaigns}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition"
            >
              <span>Explore Campaign</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Explore 20 Awareness Areas Carousel */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-teal-600" />
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              20 Awareness Categories
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Tap to filter</span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {ALL_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => {
                onSelectCategoryFilter(category);
                onNavigateTab('challenges');
              }}
              className="shrink-0 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700 hover:text-teal-700 hover:border-teal-300 transition active:scale-95 whitespace-nowrap shadow-2xs"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
