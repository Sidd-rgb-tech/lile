import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Award,
  Flame,
  CheckCircle2,
  Calendar,
  Filter,
  ShieldCheck,
  TrendingUp,
  Clock,
  Layers,
  Info
} from 'lucide-react';
import { UserProfile, ImpactRecord, Badge, ProofTier } from '../../types';

interface ImpactScreenProps {
  userProfile: UserProfile;
  impactRecords: ImpactRecord[];
  badges: Badge[];
}

export const ImpactScreen: React.FC<ImpactScreenProps> = ({
  userProfile,
  impactRecords,
  badges
}) => {
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'history'>('overview');

  const filteredRecords = useMemo(() => {
    const now = Date.now();
    return impactRecords.filter(record => {
      if (timeFilter === 'week') return now - record.timestamp <= 7 * 86400000;
      if (timeFilter === 'month') return now - record.timestamp <= 30 * 86400000;
      return true;
    });
  }, [impactRecords, timeFilter]);

  // Proof of Impact breakdown counts
  const proofBreakdown = useMemo(() => {
    const counts: Record<ProofTier, number> = {
      LEARNING_COMPLETED: 0,
      SELF_REPORTED_ACTION: 0,
      VERIFIED_ACTIVITY: 0,
      MEASURED_OUTCOME: 0
    };
    filteredRecords.forEach(r => {
      counts[r.proofTier] = (counts[r.proofTier] || 0) + 1;
    });
    return counts;
  }, [filteredRecords]);

  // Category counts for visualization
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredRecords.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [filteredRecords]);

  const proofTiersInfo: Record<ProofTier, { title: string; color: string; desc: string }> = {
    LEARNING_COMPLETED: {
      title: 'Learning Completed',
      color: 'text-sky-700 bg-sky-100 border-sky-200',
      desc: 'Completed verified quizzes & educational reading'
    },
    SELF_REPORTED_ACTION: {
      title: 'Self-Reported Action',
      color: 'text-emerald-700 bg-emerald-100 border-emerald-200',
      desc: 'Honest user-reported daily lifestyle swaps'
    },
    VERIFIED_ACTIVITY: {
      title: 'Verified Activity',
      color: 'text-purple-700 bg-purple-100 border-purple-200',
      desc: 'Supervisor sign-off or validated proof code'
    },
    MEASURED_OUTCOME: {
      title: 'Measured Outcome',
      color: 'text-amber-700 bg-amber-100 border-amber-200',
      desc: 'Quantifiable, documented community metrics'
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] text-slate-800 overflow-hidden">
      {/* Top Header & Sub-Navigation */}
      <div className="p-3 bg-white border-b border-slate-200/90 space-y-2.5 shrink-0 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight">
              My Impact Dashboard
            </h2>
            <p className="text-[10px] text-teal-700 font-bold">
              Proof of Impact Framework • Verifiable Action Tiers
            </p>
          </div>

          {/* Time Filter Pill Group */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5">
            {(['week', 'month', 'all'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition active:scale-95 ${
                  timeFilter === tf
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tf === 'week' ? 'Week' : tf === 'month' ? 'Month' : 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-1 rounded-lg text-xs font-bold transition active:scale-95 ${
              activeTab === 'overview'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-1 rounded-lg text-xs font-bold transition active:scale-95 ${
              activeTab === 'badges'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Badges ({badges.filter(b => b.isUnlocked).length}/10)
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1 rounded-lg text-xs font-bold transition active:scale-95 ${
              activeTab === 'history'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            History ({filteredRecords.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-none pb-24">
        {activeTab === 'overview' && (
          <>
            {/* High-level stats summary */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-base font-black text-slate-900">
                    {userProfile.totalPoints}
                  </span>
                  <p className="text-[10px] text-slate-500 font-semibold">Total Impact Points</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                  <Flame className="w-4 h-4 fill-rose-500 text-rose-500" />
                </div>
                <div>
                  <span className="text-base font-black text-slate-900">
                    {userProfile.currentStreakDays} Days
                  </span>
                  <p className="text-[10px] text-slate-500 font-semibold">Action Streak</p>
                </div>
              </div>
            </div>

            {/* Proof of Impact Framework (Section 11) */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Proof of Impact Evidence Tiers
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Zero Fabricated Data
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(proofTiersInfo) as ProofTier[]).map(tierKey => {
                  const info = proofTiersInfo[tierKey];
                  const count = proofBreakdown[tierKey];

                  return (
                    <div
                      key={tierKey}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-800 leading-tight">
                          {info.title}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border ${info.color}`}
                        >
                          {count}
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-500 mt-1 leading-tight">{info.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Breakdown Chart */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Actions by Cause
                  </h3>
                </div>
              </div>

              {categoryCounts.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">
                  No recorded activities in this timeframe.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {categoryCounts.slice(0, 5).map(([category, count]) => {
                    const percentage = Math.round(
                      (count / Math.max(1, filteredRecords.length)) * 100
                    );
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-700 font-semibold truncate max-w-[200px]">
                            {category}
                          </span>
                          <span className="text-teal-700 font-bold">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                          <div
                            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Badges Gallery Tab */}
        {activeTab === 'badges' && (
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-white border border-slate-200/90 flex items-center justify-between text-xs shadow-2xs">
              <span className="text-slate-700 font-medium">
                Unlocked: <strong className="text-teal-700 font-bold">{badges.filter(b => b.isUnlocked).length}</strong> of 10
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Awarded on genuine actions</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border transition active:scale-98 ${
                    badge.isUnlocked
                      ? 'bg-white border-teal-200 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        badge.isUnlocked
                          ? 'bg-teal-100 text-teal-700 border border-teal-200'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <Award className="w-4 h-4" />
                    </div>
                    {badge.isUnlocked ? (
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-full border border-emerald-200">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-500 font-medium">
                        {Math.round(badge.progress * 100)}%
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{badge.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                    {badge.description}
                  </p>

                  {!badge.isUnlocked && (
                    <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${badge.progress * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-2">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No activity records logged in this timeframe.
              </div>
            ) : (
              filteredRecords.map(record => (
                <div
                  key={record.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-teal-700 uppercase tracking-wide">
                      {record.category}
                    </span>
                    <span className="text-xs font-black text-teal-700">
                      +{record.pointsEarned} pts
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {record.title}
                  </h4>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded-md border ${
                        proofTiersInfo[record.proofTier]?.color || 'text-slate-600'
                      }`}
                    >
                      {proofTiersInfo[record.proofTier]?.title || record.proofTier}
                    </span>
                    <span className="font-medium">
                      {new Date(record.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  {record.notes && (
                    <p className="text-[10px] text-slate-500 italic pt-0.5">
                      "{record.notes}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
