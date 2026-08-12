export interface AvatarOption {
  id: string;
  name: string;
  description: string;
  iconName: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'arcade_bot',
    name: 'Arcade Bot',
    description: 'Precision automated micro-learning agent.',
    iconName: 'Bot',
    bgGradient: 'from-emerald-500/20 to-teal-600/20',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-400',
    accentColor: '#10b981',
  },
  {
    id: 'cyber_fox',
    name: 'Cyber Fox',
    description: 'Agile reaction time & speedy typing reflexes.',
    iconName: 'Zap',
    bgGradient: 'from-amber-500/20 to-orange-600/20',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-400',
    accentColor: '#f59e0b',
  },
  {
    id: 'quantum_owl',
    name: 'Quantum Owl',
    description: 'Deep spaced repetition & cognitive calibration.',
    iconName: 'BrainCircuit',
    bgGradient: 'from-blue-500/20 to-indigo-600/20',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-400',
    accentColor: '#3b82f6',
  },
  {
    id: 'neon_ninja',
    name: 'Neon Ninja',
    description: 'Flawless code syntax & rapid bug hunting.',
    iconName: 'Code2',
    bgGradient: 'from-purple-500/20 to-fuchsia-600/20',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-400',
    accentColor: '#a855f7',
  },
  {
    id: 'pixel_dragon',
    name: 'Pixel Dragon',
    description: 'Unstoppable daily streak master.',
    iconName: 'Flame',
    bgGradient: 'from-rose-500/20 to-red-600/20',
    borderColor: 'border-rose-500',
    textColor: 'text-rose-400',
    accentColor: '#f43f5e',
  },
  {
    id: 'spark_wizard',
    name: 'Spark Wizard',
    description: 'Mental math deduction & formula balancing.',
    iconName: 'Sparkles',
    bgGradient: 'from-sky-500/20 to-cyan-600/20',
    borderColor: 'border-sky-500',
    textColor: 'text-sky-400',
    accentColor: '#38bdf8',
  },
];

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'accuracy' | 'volume' | 'calibration' | 'challenge';
  targetValue: number;
  metricKey: string;
}

export const ACHIEVEMENTS_DEF: AchievementDef[] = [
  {
    id: 'streak_7',
    title: '7-Day Memory Anchor',
    description: 'Maintain an active review streak for 7 consecutive days.',
    icon: 'Flame',
    category: 'streak',
    targetValue: 7,
    metricKey: 'streakDays',
  },
  {
    id: 'streak_14',
    title: 'Fortnight Champion',
    description: 'Reach a 14-day study streak with zero decayed reviews.',
    icon: 'Trophy',
    category: 'streak',
    targetValue: 14,
    metricKey: 'streakDays',
  },
  {
    id: 'perfect_session',
    title: 'Flawless Precision',
    description: 'Complete any game session with 100% accuracy.',
    icon: 'CheckCircle2',
    category: 'accuracy',
    targetValue: 1,
    metricKey: 'perfectSessions',
  },
  {
    id: 'sessions_10',
    title: 'Arcade Scholar',
    description: 'Complete 10 total micro-learning game sessions.',
    icon: 'Gamepad2',
    category: 'volume',
    targetValue: 10,
    metricKey: 'totalSessions',
  },
  {
    id: 'calibration_master',
    title: 'Calibrated Mind',
    description: 'Achieve 90%+ confidence-accuracy alignment in a session.',
    icon: 'Target',
    category: 'calibration',
    targetValue: 0.9,
    metricKey: 'bestCalibration',
  },
  {
    id: 'weekly_competitor',
    title: 'Weekly Challenger',
    description: 'Participate in a weekly rotating Arcade challenge.',
    icon: 'Award',
    category: 'challenge',
    targetValue: 1,
    metricKey: 'weeklyChallengesCompleted',
  },
];
