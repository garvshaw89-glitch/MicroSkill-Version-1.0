export type SkillCategory = 'typing' | 'language' | 'math' | 'coding';

export type AccountTier = 'free' | 'premium' | 'team';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatar?: string;
  bio?: string;
  title?: string;
  accountTier: AccountTier;
  createdAt: string;
  lastActive: string;
  streakDays: number;
  lastSessionDate: string;
  dailyGoalSessions: number;
  soundEnabled: boolean;
  unlockedAchievementIds?: string[];
  preferences: {
    targetLanguages: string[];
    targetCodingLanguages: string[];
    mathFocusLevel: number;
  };
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  iconName: string;
  active: boolean;
  color: string;
  accentColor: string;
}

export type MasteryStatus = 'UNFAMILIAR' | 'LEARNING' | 'PROFICIENT' | 'MASTERED';

export interface Concept {
  id: string;
  skillId: string;
  title: string;
  description: string;
  minDifficulty: number; // 0.5 - 3.0
  maxDifficulty: number;
  estimatedHours: number;
  category: string;
  tierOrLevel: string;
}

export type GameType = 
  // Typing
  | 'keystroke_rhythm' | 'word_sprint' | 'autocorrect_hunt'
  // Language
  | 'translation_match' | 'conversation_snippet' | 'vocabulary_duel' | 'phrase_builder'
  // Math
  | 'calculation_sprint' | 'pattern_vault' | 'problem_solver' | 'equation_builder'
  // Coding
  | 'syntax_puzzle' | 'algorithm_visualizer' | 'bug_bounty' | 'api_challenge';

export interface GameSession {
  id: string;
  userId: string;
  skillId: string;
  conceptId: string;
  gameType: GameType;
  sessionStart: string;
  sessionEnd?: string;
  durationSeconds: number;
  difficultyLevel: number;
  accuracy: number;
  itemsCorrect: number;
  itemsTotal: number;
  confidenceCalibration: number;
  metadata?: Record<string, any>;
}

export interface ReviewSchedule {
  id: string;
  userId: string;
  conceptId: string;
  masteryLevel: number;
  status: MasteryStatus;
  lastPlayed: string;
  nextReviewDate: string;
  reviewCount: number;
  intervalDays: number;
  accuracyRolling30d: number;
  confidenceCalibrationAvg: number;
  createdAt: string;
}

export interface AnswerHistory {
  id: string;
  sessionId: string;
  conceptId: string;
  answerIndex: number;
  wasCorrect: boolean;
  userConfidence: number;
  responseTimeMs: number;
  difficultyAtAnswer: number;
  createdAt: string;
}

export interface GameItem {
  id: string;
  conceptId: string;
  prompt: string;
  subPrompt?: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  difficulty: number;
  typeMetadata?: Record<string, any>;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatar: string;
  score: number;
  metricLabel: string;
  accuracy: number;
  streakDays: number;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  skillId: string;
  gameType: GameType;
  targetScoreLabel: string;
  endDate: string;
  participantsCount: number;
  topScore: number;
  userBestScore?: number;
}
