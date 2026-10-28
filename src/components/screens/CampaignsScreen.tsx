import React from 'react';
import { Megaphone, Users, Palette, Check } from 'lucide-react';
import { Campaign } from '../../types';

interface CampaignsScreenProps {
  campaigns: Campaign[];
  onToggleJoinCampaign: (id: string) => void;
  onNavigateToPosterForCampaign: (campaign: Campaign) => void;
}

export const CampaignsScreen: React.FC<CampaignsScreenProps> = ({
  campaigns,
  onToggleJoinCampaign,
  onNavigateToPosterForCampaign
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F8F9FA] text-slate-800 scrollbar-none pb-24">
      <div>
        <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
          <Megaphone className="w-4 h-4 text-purple-600" />
          School & Community Campaigns
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Join collective drives for environmental, road safety, and civic betterment.
        </p>
      </div>

      <div className="space-y-3">
        {campaigns.map(camp => (
          <div
            key={camp.id}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-400/80 transition space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-teal-700 uppercase tracking-wide">
                {camp.category}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" />
                {camp.participantCount} changemakers
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">{camp.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {camp.description}
              </p>
            </div>

            {/* Campaign Objectives */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Core Objectives:
              </span>
              {camp.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-[10px] text-teal-700 font-bold">
                {camp.durationText}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateToPosterForCampaign(camp)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition active:scale-95"
                  title="Create a campaign poster"
                >
                  <Palette className="w-3.5 h-3.5 text-teal-600" />
                  <span>Poster</span>
                </button>

                <button
                  onClick={() => onToggleJoinCampaign(camp.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 flex items-center gap-1 ${
                    camp.isJoined
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-teal-600 hover:bg-teal-500 text-white shadow-xs'
                  }`}
                >
                  {camp.isJoined ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Joined</span>
                    </>
                  ) : (
                    <span>Join Campaign</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
