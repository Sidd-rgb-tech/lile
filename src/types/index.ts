export type AwarenessCategory =
  | 'Environment & Sustainability'
  | 'Waste Management & Recycling'
  | 'Climate & Conservation'
  | 'Education & Literacy'
  | 'Equality & Inclusion'
  | 'Digital Literacy & Safety'
  | 'Cyberbullying Awareness'
  | 'Road Safety'
  | 'Community Service & Volunteering'
  | 'Physical Health & Habits'
  | 'Mental Well-being & Stress'
  | "Women's Safety & Health"
  | 'Child Safety & Protection'
  | 'Civic Responsibility'
  | 'Animal Welfare'
  | 'Disaster Preparedness'
  | 'Responsible Technology Use'
  | 'Public Health Awareness'
  | 'Financial Literacy & Consumption'
  | 'School & Community Improvement';

export type ChallengeDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type ChallengeStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'AWAITING_VERIFICATION'
  | 'VERIFIED';

export type ProofTier =
  | 'LEARNING_COMPLETED'
  | 'SELF_REPORTED_ACTION'
  | 'VERIFIED_ACTIVITY'
  | 'MEASURED_OUTCOME';

export interface Challenge {
  id: string;
  title: string;
  category: AwarenessCategory;
  difficulty: ChallengeDifficulty;
  estimatedDurationMinutes: number;
  shortDescription: string;
  learningObjective: string;
  instructions: string;
  expectedOutcome: string;
  points: number;
  status: ChallengeStatus;
  completionDate?: number;
  reflectionNotes?: string;
  proofTier: ProofTier;
  isPointsAwarded: boolean;
}

export interface ImpactRecord {
  id: string;
  title: string;
  category: AwarenessCategory;
  proofTier: ProofTier;
  pointsEarned: number;
  timestamp: number;
  relatedChallengeId?: string;
  notes: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  isUnlocked: boolean;
  unlockedDate?: number;
  progress: number; // 0 to 1
}

export interface Campaign {
  id: string;
  title: string;
  category: AwarenessCategory;
  description: string;
  objectives: string[];
  durationText: string;
  participantCount: number;
  isJoined: boolean;
  suggestedActions: string[];
}

export interface ImpactStory {
  id: string;
  title: string;
  category: AwarenessCategory;
  summary: string;
  actionTaken: string;
  lessonsLearned: string;
  suggestedActionForReader: string;
  isFavorited: boolean;
  relatedChallengeId?: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  isGuestMode: boolean;
  isGoogleUser: boolean;
  isOnboardingCompleted: boolean;
  dailyTargetMinutes: number;
  preferredPosterVibe: string;
  totalPoints: number;
  currentStreakDays: number;
  lastActiveDate: number;
  selectedCauses: AwarenessCategory[];
  notificationsEnabled: boolean;
  isDarkMode: boolean;
}

export type AssistantMode =
  | 'explain_simply'
  | 'detailed_explanation'
  | 'action_guide'
  | 'quiz_me';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
  isDemoNotice?: boolean;
  model?: string;
  mode?: AssistantMode;
  suggestedActions?: string[];
}

export type PosterTemplateType =
  | 'vibrant_eco'
  | 'bold_neon'
  | 'clean_minimal'
  | 'infographic'
  | 'community'
  | 'health'
  | 'school'
  | 'personal_summary';

export interface PosterConfig {
  type: 'daily' | 'weekly' | 'monthly' | 'custom' | 'school' | 'community';
  category: AwarenessCategory;
  template: PosterTemplateType;
  headline: string;
  subheadline: string;
  callToAction: string;
  bullets: string[];
  authorOrOrgName: string;
  includeImpactStats: boolean;
  hashtag: string;
}
