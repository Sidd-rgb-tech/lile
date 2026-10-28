import React from 'react';
import { BookOpen, Bookmark, BookmarkCheck, ArrowRight, Lightbulb } from 'lucide-react';
import { ImpactStory } from '../../types';

interface StoriesScreenProps {
  stories: ImpactStory[];
  onToggleBookmark: (id: string) => void;
  onOpenRelatedChallenge: (challengeId: string) => void;
}

export const StoriesScreen: React.FC<StoriesScreenProps> = ({
  stories,
  onToggleBookmark,
  onOpenRelatedChallenge
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F8F9FA] text-slate-800 scrollbar-none pb-24">
      <div>
        <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          Impact Stories & Inspiration
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Educational stories illustrating how small actions produce meaningful social change.
        </p>
      </div>

      <div className="space-y-3">
        {stories.map(story => (
          <div
            key={story.id}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-400/80 transition space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-teal-700 uppercase tracking-wide">
                {story.category}
              </span>
              <button
                onClick={() => onToggleBookmark(story.id)}
                className="text-slate-400 hover:text-amber-500 transition active:scale-95"
                title={story.isFavorited ? 'Remove Bookmark' : 'Save Story'}
              >
                {story.isFavorited ? (
                  <BookmarkCheck className="w-4 h-4 text-amber-500" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {story.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {story.summary}
              </p>
            </div>

            {/* Action Taken */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                Action Taken:
              </span>
              <p className="text-xs text-slate-700">{story.actionTaken}</p>
            </div>

            {/* Lessons Learned */}
            <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-3">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                Key Takeaway:
              </span>
              <p className="text-xs text-emerald-900 font-medium">{story.lessonsLearned}</p>
            </div>

            {/* Suggested Reader Action */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[11px] text-slate-500 italic flex-1 pr-2">
                "Suggested: {story.suggestedActionForReader}"
              </p>
              {story.relatedChallengeId && (
                <button
                  onClick={() => onOpenRelatedChallenge(story.relatedChallengeId!)}
                  className="px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold flex items-center gap-1 shrink-0 transition active:scale-95"
                >
                  <span>Challenge</span>
                  <ArrowRight className="w-3 h-3 text-teal-600" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
