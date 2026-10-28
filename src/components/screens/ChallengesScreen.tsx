import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Filter,
  Check,
  ChevronRight,
  X,
  Target,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Challenge, AwarenessCategory, ChallengeDifficulty, ProofTier } from '../../types';
import { ALL_CATEGORIES } from '../../data/mockData';

interface ChallengesScreenProps {
  challenges: Challenge[];
  selectedCategoryFilter: AwarenessCategory | null;
  onSelectCategoryFilter: (category: AwarenessCategory | null) => void;
  onStartChallenge: (id: string) => void;
  onCompleteChallenge: (id: string, reflection: string, proofTier: ProofTier) => void;
}

export const ChallengesScreen: React.FC<ChallengesScreenProps> = ({
  challenges,
  selectedCategoryFilter,
  onSelectCategoryFilter,
  onStartChallenge,
  onCompleteChallenge
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ChallengeDifficulty | 'ALL'>('ALL');
  const [activeModalChallenge, setActiveModalChallenge] = useState<Challenge | null>(null);
  const [reflectionInput, setReflectionInput] = useState('');
  const [selectedProofTier, setSelectedProofTier] = useState<ProofTier>('SELF_REPORTED_ACTION');

  const filteredChallenges = useMemo(() => {
    return challenges.filter(c => {
      const matchesCategory = !selectedCategoryFilter || c.category === selectedCategoryFilter;
      const matchesDifficulty = selectedDifficulty === 'ALL' || c.difficulty === selectedDifficulty;
      const matchesSearch =
        !searchQuery.trim() ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [challenges, selectedCategoryFilter, selectedDifficulty, searchQuery]);

  const handleOpenModal = (challenge: Challenge) => {
    setActiveModalChallenge(challenge);
    setReflectionInput(challenge.reflectionNotes || '');
    setSelectedProofTier(challenge.proofTier || 'SELF_REPORTED_ACTION');
  };

  const handleStart = () => {
    if (!activeModalChallenge) return;
    onStartChallenge(activeModalChallenge.id);
    setActiveModalChallenge(prev => (prev ? { ...prev, status: 'IN_PROGRESS' } : null));
  };

  const handleComplete = () => {
    if (!activeModalChallenge) return;
    const finalReflection = reflectionInput.trim() || 'Completed action as instructed in the challenge guide.';

    onCompleteChallenge(activeModalChallenge.id, finalReflection, selectedProofTier);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}

    setActiveModalChallenge(null);
  };

  const difficultyColors: Record<ChallengeDifficulty, string> = {
    EASY: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    MEDIUM: 'text-amber-700 bg-amber-50 border-amber-200',
    HARD: 'text-rose-700 bg-rose-50 border-rose-200'
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] text-slate-800 overflow-hidden">
      {/* Search & Category Filter Section */}
      <div className="p-3 bg-white border-b border-slate-200/90 space-y-2.5 shrink-0 shadow-2xs">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search 20+ awareness challenges..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          <button
            onClick={() => onSelectCategoryFilter(null)}
            className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-bold transition active:scale-95 ${
              selectedCategoryFilter === null
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Causes ({challenges.length})
          </button>
          {ALL_CATEGORIES.map(category => {
            const count = challenges.filter(c => c.category === category).length;
            const isSelected = selectedCategoryFilter === category;
            return (
              <button
                key={category}
                onClick={() => onSelectCategoryFilter(category)}
                className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-medium transition active:scale-95 whitespace-nowrap ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Difficulty Filter Strip */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            Difficulty:
          </span>
          {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition active:scale-95 ${
                selectedDifficulty === diff
                  ? 'bg-teal-100 text-teal-800 border border-teal-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges List Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-none pb-24">
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Target className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No challenges found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Try adjusting your search query or reset the category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectCategoryFilter(null);
                setSelectedDifficulty('ALL');
              }}
              className="mt-3 px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredChallenges.map(challenge => (
            <div
              key={challenge.id}
              onClick={() => handleOpenModal(challenge)}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-400/80 transition cursor-pointer active:scale-99 shadow-xs group"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-extrabold text-teal-700 tracking-wide uppercase">
                  {challenge.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                      difficultyColors[challenge.difficulty]
                    }`}
                  >
                    {challenge.difficulty}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      challenge.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : challenge.status === 'IN_PROGRESS'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {challenge.status === 'COMPLETED'
                      ? 'Completed ✓'
                      : challenge.status === 'IN_PROGRESS'
                      ? 'In Progress'
                      : 'Available'}
                  </span>
                </div>
              </div>

              <h3 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition">
                {challenge.title}
              </h3>

              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {challenge.shortDescription}
              </p>

              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {challenge.estimatedDurationMinutes} mins
                </span>

                <span className="flex items-center gap-1 font-extrabold text-teal-700">
                  <Sparkles className="w-3 h-3 text-teal-500" />
                  +{challenge.points} pts
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Challenge Detail & Action Modal */}
      {activeModalChallenge && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] overflow-y-auto space-y-4 text-slate-800 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-teal-700 uppercase tracking-wider">
                  {activeModalChallenge.category}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">
                  {activeModalChallenge.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalChallenge(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Badges / Meta strip */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                +{activeModalChallenge.points} pts
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {activeModalChallenge.estimatedDurationMinutes} mins
              </span>
              <span
                className={`px-2.5 py-1 rounded-xl font-bold border uppercase ${
                  difficultyColors[activeModalChallenge.difficulty]
                }`}
              >
                {activeModalChallenge.difficulty}
              </span>
            </div>

            {/* Learning Objective */}
            <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3">
              <h4 className="text-[11px] font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                Learning Objective
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {activeModalChallenge.learningObjective}
              </p>
            </div>

            {/* Step-by-Step Instructions */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Instructions & Action Steps
              </h4>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                {activeModalChallenge.instructions}
              </div>
            </div>

            {/* Expected Outcome */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
                Expected Measurable Outcome
              </h4>
              <p className="text-xs text-emerald-700 font-bold">
                {activeModalChallenge.expectedOutcome}
              </p>
            </div>

            {/* Completion & Reflection Form */}
            {activeModalChallenge.status === 'COMPLETED' ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Challenge Already Completed!</span>
                </div>
                <p className="text-[11px] text-slate-700">
                  Proof Tier: <strong className="text-slate-900">{activeModalChallenge.proofTier}</strong>
                </p>
                {activeModalChallenge.reflectionNotes && (
                  <p className="text-[11px] text-slate-600 mt-1 italic">
                    "{activeModalChallenge.reflectionNotes}"
                  </p>
                )}
                <p className="text-[10px] text-emerald-700 mt-2 font-medium">
                  ✓ Points (+{activeModalChallenge.points}) credited to your impact balance. Duplicate reward prevention active.
                </p>
              </div>
            ) : (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                {/* Proof Tier Selection */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Proof of Impact Evidence Level:
                  </label>
                  <select
                    value={selectedProofTier}
                    onChange={e => setSelectedProofTier(e.target.value as ProofTier)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  >
                    <option value="SELF_REPORTED_ACTION">Self-Reported Action (Honest habit)</option>
                    <option value="LEARNING_COMPLETED">Learning Completed (Educational quiz / module)</option>
                    <option value="VERIFIED_ACTIVITY">Verified Activity (Supervisor / school code)</option>
                    <option value="MEASURED_OUTCOME">Measured Outcome (Documented quantitative outcome)</option>
                  </select>
                </div>

                {/* Reflection input */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Your Reflection & Action Notes:
                  </label>
                  <textarea
                    rows={2}
                    value={reflectionInput}
                    onChange={e => setReflectionInput(e.target.value)}
                    placeholder="Describe what you did, who benefited, or what you learned..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex items-center gap-2 pt-2">
              {activeModalChallenge.status === 'NOT_STARTED' && (
                <button
                  onClick={handleStart}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-teal-800 font-bold text-xs transition active:scale-95"
                >
                  Start Challenge
                </button>
              )}

              {activeModalChallenge.status !== 'COMPLETED' ? (
                <button
                  onClick={handleComplete}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Complete & Claim Points</span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveModalChallenge(null)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
