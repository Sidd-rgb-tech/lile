import React, { useState } from 'react';
import {
  User,
  Settings,
  Bell,
  RotateCcw,
  Download,
  Shield,
  Heart,
  Check,
  ChevronRight,
  Sparkles,
  Compass,
  Palette,
  Clock,
  ExternalLink
} from 'lucide-react';
import { UserProfile, AwarenessCategory } from '../../types';
import { ALL_CATEGORIES } from '../../data/mockData';
import { StorageService } from '../../services/storage';

interface ProfileSettingsScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onResetData: () => void;
  onReplayOnboarding?: () => void;
}

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({
  userProfile,
  onUpdateProfile,
  onResetData,
  onReplayOnboarding
}) => {
  const [name, setName] = useState(userProfile.displayName);
  const [isSaved, setIsSaved] = useState(false);
  const [showCauses, setShowCauses] = useState(false);
  const [selectedCauses, setSelectedCauses] = useState<AwarenessCategory[]>(
    userProfile.selectedCauses || []
  );

  const handleSaveName = () => {
    onUpdateProfile({
      ...userProfile,
      displayName: name.trim() || 'Changemaker',
      selectedCauses
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleToggleCause = (cause: AwarenessCategory) => {
    const updated = selectedCauses.includes(cause)
      ? selectedCauses.filter(c => c !== cause)
      : [...selectedCauses, cause];
    setSelectedCauses(updated);
    onUpdateProfile({
      ...userProfile,
      selectedCauses: updated
    });
  };

  const handleExportJson = () => {
    const jsonString = StorageService.exportAllDataJson();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `change360-data-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F9FA] text-slate-800 scrollbar-none pb-24">
      {/* Profile Header Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-rose-400 p-0.5 shadow-md shrink-0">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-teal-700 font-extrabold text-xl">
            {name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 truncate">{name}</h3>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
              userProfile.isGoogleUser 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {userProfile.isGoogleUser ? 'Google Account' : 'Guest Mode'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {userProfile.totalPoints} Impact Points • {userProfile.currentStreakDays}-day streak
          </p>
        </div>
      </div>

      {/* Changemaker Profile Info */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-teal-600" />
          Changemaker Identity
        </h4>

        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
            Display Name:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name or handle..."
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 outline-none transition"
            />
            <button
              onClick={handleSaveName}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-xs transition active:scale-95 flex items-center gap-1"
            >
              {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : null}
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Selected Causes Toggle */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => setShowCauses(!showCauses)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            <span>My Focus Causes ({selectedCauses.length})</span>
            <span className="text-teal-600 font-bold text-[11px]">
              {showCauses ? 'Hide' : 'Customize'}
            </span>
          </button>

          {showCauses && (
            <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
              {ALL_CATEGORIES.map(cat => {
                const isSelected = selectedCauses.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => handleToggleCause(cat)}
                    className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition active:scale-95 ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {cat} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Target & Poster Vibe Summary */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-sky-600" />
          Onboarding Goals & Aesthetic
        </h4>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100">
            <span className="text-[10px] font-bold text-sky-700 uppercase flex items-center gap-1">
              <Clock className="w-3 h-3" /> Daily Target
            </span>
            <p className="font-extrabold text-slate-900 text-sm mt-0.5">
              {userProfile.dailyTargetMinutes || 15} mins/day
            </p>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100">
            <span className="text-[10px] font-bold text-rose-700 uppercase flex items-center gap-1">
              <Palette className="w-3 h-3" /> Poster Vibe
            </span>
            <p className="font-extrabold text-slate-900 text-sm mt-0.5 truncate">
              {userProfile.preferredPosterVibe || 'Vibrant Modern'}
            </p>
          </div>
        </div>

        {onReplayOnboarding && (
          <button
            onClick={onReplayOnboarding}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Replay 3-Step Onboarding Quiz</span>
          </button>
        )}
      </div>

      {/* Preferences & Notifications */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Settings className="w-3.5 h-3.5 text-teal-600" />
          App Preferences
        </h4>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-slate-500" />
            <div>
              <span className="text-xs font-semibold text-slate-800 block">
                Daily Awareness Suggestions
              </span>
              <span className="text-[10px] text-slate-500">
                Gentle reminders for morning micro-actions
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={userProfile.notificationsEnabled}
            onChange={e =>
              onUpdateProfile({
                ...userProfile,
                notificationsEnabled: e.target.checked
              })
            }
            className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Data Management & Export */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-teal-600" />
          Data & Privacy (Offline-First)
        </h4>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          CHANGE360 stores your progress locally on device without unauthorized background tracking.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleExportJson}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-400 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Export Backup (.JSON)</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset all demo data and restore initial challenge states?')) {
                onResetData();
              }
            }}
            className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 hover:border-rose-300 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* App Architecture Spec Information */}
      <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-[11px] text-slate-500 space-y-1">
        <p className="font-bold text-slate-700">CHANGE360 Native Android v1.0.0 (Build 3)</p>
        <p>• Architecture: Kotlin MVVM • Jetpack Compose • Material 3 • Room v2 • StateFlow</p>
        <p>• Verified Proof of Impact: 4-Tier evidence classification with zero fabricated claims</p>
      </div>
    </div>
  );
};
