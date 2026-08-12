import {
  UserProfile,
  Skill,
  Concept,
  ReviewSchedule,
  GameSession,
  AnswerHistory,
  GameItem,
  LeaderboardEntry,
  WeeklyChallenge
} from '../types';
import {
  INITIAL_USER,
  SKILLS,
  CONCEPTS,
  INITIAL_SCHEDULES,
  GAME_ITEMS,
} from '../data/initialData';

const STORAGE_KEYS = {
  USER: 'msa_user_profile',
  SCHEDULES: 'msa_review_schedules',
  SESSIONS: 'msa_game_sessions',
  ANSWERS: 'msa_answer_history',
  WEEKLY_SCORE: 'msa_weekly_score',
};

export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') return INITIAL_USER;
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
    return INITIAL_USER;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_USER;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));
}

export function getSkills(): Skill[] {
  return SKILLS;
}

export function getConcepts(skillId?: string): Concept[] {
  if (skillId) {
    return CONCEPTS.filter((c) => c.skillId === skillId);
  }
  return CONCEPTS;
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getItemsForConcept(conceptId: string): GameItem[] {
  const matched = GAME_ITEMS.filter((item) => item.conceptId === conceptId);
  if (matched.length > 0) return matched;

  const concept = CONCEPTS.find((c) => c.id === conceptId);
  if (concept) {
    const skillConceptIds = CONCEPTS.filter((c) => c.skillId === concept.skillId).map((c) => c.id);
    const categoryMatched = GAME_ITEMS.filter((item) => skillConceptIds.includes(item.conceptId));
    if (categoryMatched.length > 0) return categoryMatched;
  }

  return GAME_ITEMS;
}

export function getJumbledItemsForConcept(conceptId: string): GameItem[] {
  const matched = getItemsForConcept(conceptId);
  // 1. Randomly shuffle the order of questions
  const shuffledQuestions = shuffleArray(matched);

  // 2. Randomly shuffle multiple-choice options inside each question
  return shuffledQuestions.map((item) => {
    if (item.options && item.options.length > 0) {
      return {
        ...item,
        options: shuffleArray(item.options),
      };
    }
    return item;
  });
}

export function getSchedules(): ReviewSchedule[] {
  if (typeof window === 'undefined') return INITIAL_SCHEDULES;
  const data = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(INITIAL_SCHEDULES));
    return INITIAL_SCHEDULES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_SCHEDULES;
  }
}

export function getGameSessions(): GameSession[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function getAnswerHistory(): AnswerHistory[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.ANSWERS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveGameSessionResult(
  session: GameSession,
  arg2?: ReviewSchedule | AnswerHistory[],
  arg3?: AnswerHistory[] | ReviewSchedule
): void {
  if (typeof window === 'undefined') return;

  let updatedSchedule: ReviewSchedule | undefined;
  let answersList: AnswerHistory[] = [];

  if (arg2 && 'conceptId' in arg2) {
    updatedSchedule = arg2 as ReviewSchedule;
  } else if (Array.isArray(arg2)) {
    answersList = arg2 as AnswerHistory[];
  }

  if (arg3 && 'conceptId' in arg3) {
    updatedSchedule = arg3 as ReviewSchedule;
  } else if (Array.isArray(arg3)) {
    answersList = arg3 as AnswerHistory[];
  }

  // 1. Save Session
  const existingSessions = getGameSessions();
  const newSessions = [session, ...existingSessions];
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(newSessions));

  // 2. Save Updated Schedule if provided
  if (updatedSchedule) {
    const existingSchedules = getSchedules();
    const newSchedules = existingSchedules.map((s) => {
      if (s.conceptId === updatedSchedule!.conceptId) {
        return updatedSchedule!;
      }
      return s;
    });
    if (!existingSchedules.some((s) => s.conceptId === updatedSchedule!.conceptId)) {
      newSchedules.push(updatedSchedule);
    }
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(newSchedules));
  }

  // 3. Save Answer History
  if (answersList.length > 0) {
    const existingAnswers = getAnswerHistory();
    const newAnswers = [...answersList, ...existingAnswers];
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(newAnswers));
  }

  // 4. Update User Streak & Daily Progress
  const user = getUserProfile();
  const todayStr = new Date().toISOString().split('T')[0];
  let streakDays = user.streakDays;

  if (user.lastSessionDate !== todayStr) {
    const lastDate = new Date(user.lastSessionDate);
    const today = new Date(todayStr);
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streakDays += 1;
    } else if (diffDays > 1) {
      streakDays = 1;
    }
  }

  // Check achievement unlocks
  const unlocked = new Set(user.unlockedAchievementIds || ['streak_7', 'sessions_10', 'calibration_master']);
  if (session.accuracy === 1.0) unlocked.add('perfect_session');
  if (newSessions.length >= 10) unlocked.add('sessions_10');
  if (session.confidenceCalibration >= 0.9) unlocked.add('calibration_master');
  if (streakDays >= 7) unlocked.add('streak_7');
  if (streakDays >= 14) unlocked.add('streak_14');

  const updatedUser: UserProfile = {
    ...user,
    streakDays,
    lastActive: new Date().toISOString(),
    lastSessionDate: todayStr,
    unlockedAchievementIds: Array.from(unlocked),
  };
  saveUserProfile(updatedUser);
}

export function getWeeklyChallenge(): WeeklyChallenge {
  const userScore = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.WEEKLY_SCORE) : null;
  return {
    id: 'weekly_ch_04',
    title: 'Weekly Speed & Precision Sprint',
    description: 'Achieve 50+ WPM with >90% accuracy in High-Frequency Word Sprints.',
    skillId: 'skill_typing',
    gameType: 'word_sprint',
    targetScoreLabel: '50 WPM • 90%+ Accuracy',
    endDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    participantsCount: 1420,
    topScore: 78,
    userBestScore: userScore ? parseInt(userScore, 10) : undefined,
  };
}

export function saveWeeklyChallengeScore(score: number): void {
  if (typeof window === 'undefined') return;
  const currentBest = localStorage.getItem(STORAGE_KEYS.WEEKLY_SCORE);
  const best = currentBest ? Math.max(parseInt(currentBest, 10), score) : score;
  localStorage.setItem(STORAGE_KEYS.WEEKLY_SCORE, best.toString());

  const user = getUserProfile();
  const unlocked = new Set(user.unlockedAchievementIds || []);
  unlocked.add('weekly_competitor');
  user.unlockedAchievementIds = Array.from(unlocked);
  saveUserProfile(user);
}

export function getMockLeaderboardData(categoryFilter: string = 'all'): LeaderboardEntry[] {
  const user = getUserProfile();
  const sessions = getGameSessions();
  
  const userBestAcc = sessions.length > 0
    ? Math.round(Math.max(...sessions.map((s) => s.accuracy)) * 100)
    : 88;

  const baseEntries: LeaderboardEntry[] = [
    { rank: 1, userId: 'u_01', displayName: 'Elena Rostova', avatar: 'cyber_fox', score: 98, metricLabel: 'Mastery Pct', accuracy: 98, streakDays: 28 },
    { rank: 2, userId: 'u_02', displayName: 'Kenji Sato', avatar: 'neon_ninja', score: 95, metricLabel: 'Mastery Pct', accuracy: 96, streakDays: 21 },
    { rank: 3, userId: 'u_03', displayName: 'Marcus Vance', avatar: 'spark_wizard', score: 92, metricLabel: 'Mastery Pct', accuracy: 94, streakDays: 19 },
    { rank: 4, userId: user.id, displayName: user.displayName, avatar: user.avatar || 'arcade_bot', score: Math.min(userBestAcc + 4, 94), metricLabel: 'Mastery Pct', accuracy: userBestAcc, streakDays: user.streakDays },
    { rank: 5, userId: 'u_04', displayName: 'Aisha Patel', avatar: 'quantum_owl', score: 89, metricLabel: 'Mastery Pct', accuracy: 91, streakDays: 12 },
    { rank: 6, userId: 'u_05', displayName: 'Liam O\'Connor', avatar: 'pixel_dragon', score: 86, metricLabel: 'Mastery Pct', accuracy: 88, streakDays: 16 },
    { rank: 7, userId: 'u_06', displayName: 'Sophia Chen', avatar: 'arcade_bot', score: 83, metricLabel: 'Mastery Pct', accuracy: 85, streakDays: 9 },
    { rank: 8, userId: 'u_07', displayName: 'Devon Hayes', avatar: 'cyber_fox', score: 79, metricLabel: 'Mastery Pct', accuracy: 82, streakDays: 7 },
  ];

  return baseEntries.sort((a, b) => b.score - a.score).map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
  }));
}

export function exportUserDataJSON(): void {
  const data = {
    user: getUserProfile(),
    schedules: getSchedules(),
    sessions: getGameSessions(),
    answers: getAnswerHistory(),
    skills: SKILLS,
    concepts: CONCEPTS,
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `microskill_arcade_export_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function resetToInitialData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
  localStorage.removeItem(STORAGE_KEYS.SESSIONS);
  localStorage.removeItem(STORAGE_KEYS.ANSWERS);
  window.location.reload();
}
