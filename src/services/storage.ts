import { Challenge, ImpactRecord, Badge, UserProfile, Campaign, ImpactStory, ProofTier } from '../types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_CHALLENGES,
  INITIAL_BADGES,
  INITIAL_IMPACT_RECORDS,
  INITIAL_CAMPAIGNS,
  INITIAL_STORIES
} from '../data/mockData';

const KEYS = {
  PROFILE: 'change360_user_profile',
  CHALLENGES: 'change360_challenges',
  IMPACT_RECORDS: 'change360_impact_records',
  BADGES: 'change360_badges',
  CAMPAIGNS: 'change360_campaigns',
  STORIES: 'change360_stories'
};

export class StorageService {
  static getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      return data ? JSON.parse(data) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  }

  static saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }

  static getChallenges(): Challenge[] {
    try {
      const data = localStorage.getItem(KEYS.CHALLENGES);
      return data ? JSON.parse(data) : INITIAL_CHALLENGES;
    } catch {
      return INITIAL_CHALLENGES;
    }
  }

  static saveChallenges(challenges: Challenge[]): void {
    try {
      localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(challenges));
    } catch (e) {
      console.error('Failed to save challenges', e);
    }
  }

  static getImpactRecords(): ImpactRecord[] {
    try {
      const data = localStorage.getItem(KEYS.IMPACT_RECORDS);
      return data ? JSON.parse(data) : INITIAL_IMPACT_RECORDS;
    } catch {
      return INITIAL_IMPACT_RECORDS;
    }
  }

  static saveImpactRecords(records: ImpactRecord[]): void {
    try {
      localStorage.setItem(KEYS.IMPACT_RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save impact records', e);
    }
  }

  static getBadges(): Badge[] {
    try {
      const data = localStorage.getItem(KEYS.BADGES);
      return data ? JSON.parse(data) : INITIAL_BADGES;
    } catch {
      return INITIAL_BADGES;
    }
  }

  static saveBadges(badges: Badge[]): void {
    try {
      localStorage.setItem(KEYS.BADGES, JSON.stringify(badges));
    } catch (e) {
      console.error('Failed to save badges', e);
    }
  }

  static getCampaigns(): Campaign[] {
    try {
      const data = localStorage.getItem(KEYS.CAMPAIGNS);
      return data ? JSON.parse(data) : INITIAL_CAMPAIGNS;
    } catch {
      return INITIAL_CAMPAIGNS;
    }
  }

  static saveCampaigns(campaigns: Campaign[]): void {
    try {
      localStorage.setItem(KEYS.CAMPAIGNS, JSON.stringify(campaigns));
    } catch (e) {
      console.error('Failed to save campaigns', e);
    }
  }

  static getStories(): ImpactStory[] {
    try {
      const data = localStorage.getItem(KEYS.STORIES);
      return data ? JSON.parse(data) : INITIAL_STORIES;
    } catch {
      return INITIAL_STORIES;
    }
  }

  static saveStories(stories: ImpactStory[]): void {
    try {
      localStorage.setItem(KEYS.STORIES, JSON.stringify(stories));
    } catch (e) {
      console.error('Failed to save stories', e);
    }
  }

  /**
   * Completes a challenge with strict prevention of duplicate point awards.
   */
  static completeChallenge(
    challengeId: string,
    reflectionNotes: string,
    proofTier: ProofTier = 'SELF_REPORTED_ACTION'
  ): { challenge: Challenge; pointsAwarded: number; newBadgeUnlocked: Badge | null } {
    const challenges = this.getChallenges();
    const challengeIndex = challenges.findIndex(c => c.id === challengeId);

    if (challengeIndex === -1) {
      throw new Error('Challenge not found');
    }

    const current = challenges[challengeIndex];
    if (current.isPointsAwarded && current.status === 'COMPLETED') {
      // Duplicate prevention
      return { challenge: current, pointsAwarded: 0, newBadgeUnlocked: null };
    }

    const updatedChallenge: Challenge = {
      ...current,
      status: 'COMPLETED',
      completionDate: Date.now(),
      reflectionNotes,
      proofTier,
      isPointsAwarded: true
    };
    challenges[challengeIndex] = updatedChallenge;
    this.saveChallenges(challenges);

    // Record impact
    const records = this.getImpactRecords();
    const newRecord: ImpactRecord = {
      id: `rec-${Date.now()}`,
      title: updatedChallenge.title,
      category: updatedChallenge.category,
      proofTier,
      pointsEarned: updatedChallenge.points,
      timestamp: Date.now(),
      relatedChallengeId: updatedChallenge.id,
      notes: reflectionNotes
    };
    records.unshift(newRecord);
    this.saveImpactRecords(records);

    // Update profile points and streak
    const profile = this.getProfile();
    const updatedProfile: UserProfile = {
      ...profile,
      totalPoints: profile.totalPoints + updatedChallenge.points,
      lastActiveDate: Date.now()
    };
    this.saveProfile(updatedProfile);

    // Evaluate badges
    const badges = this.getBadges();
    let newlyUnlockedBadge: Badge | null = null;

    const updatedBadges = badges.map(badge => {
      if (!badge.isUnlocked) {
        let shouldUnlock = false;
        let progress = badge.progress;

        if (badge.id === 'first_step') {
          shouldUnlock = true;
          progress = 1.0;
        } else if (badge.id === 'eco_champion') {
          const ecoCount = records.filter(
            r => r.category === 'Environment & Sustainability' || r.category === 'Waste Management & Recycling'
          ).length;
          progress = Math.min(1.0, ecoCount / 3);
          shouldUnlock = ecoCount >= 3;
        } else if (badge.id === 'digital_advocate') {
          const digitalCount = records.filter(
            r => r.category === 'Digital Literacy & Safety' || r.category === 'Cyberbullying Awareness'
          ).length;
          progress = Math.min(1.0, digitalCount / 2);
          shouldUnlock = digitalCount >= 2;
        } else if (badge.id === 'community_helper') {
          const commCount = records.filter(r => r.category === 'Community Service & Volunteering' || r.category === 'Civic Responsibility').length;
          progress = Math.min(1.0, commCount / 2);
          shouldUnlock = commCount >= 2;
        }

        if (shouldUnlock && !badge.isUnlocked) {
          const unlocked = { ...badge, isUnlocked: true, unlockedDate: Date.now(), progress: 1.0 };
          newlyUnlockedBadge = unlocked;
          return unlocked;
        }
        return { ...badge, progress };
      }
      return badge;
    });

    this.saveBadges(updatedBadges);

    return {
      challenge: updatedChallenge,
      pointsAwarded: updatedChallenge.points,
      newBadgeUnlocked: newlyUnlockedBadge
    };
  }

  /**
   * Resets all demo data to initial factory states.
   */
  static resetAllDemoData(): void {
    localStorage.removeItem(KEYS.PROFILE);
    localStorage.removeItem(KEYS.CHALLENGES);
    localStorage.removeItem(KEYS.IMPACT_RECORDS);
    localStorage.removeItem(KEYS.BADGES);
    localStorage.removeItem(KEYS.CAMPAIGNS);
    localStorage.removeItem(KEYS.STORIES);
  }

  /**
   * Exports entire local database as a structured JSON object.
   */
  static exportAllDataJson(): string {
    const data = {
      app: 'CHANGE360',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      challenges: this.getChallenges(),
      impactRecords: this.getImpactRecords(),
      badges: this.getBadges(),
      campaigns: this.getCampaigns(),
      stories: this.getStories()
    };
    return JSON.stringify(data, null, 2);
  }
}
