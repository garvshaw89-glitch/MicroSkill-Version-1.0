import React, { useState } from 'react';
import { UserProfile, GameSession, ReviewSchedule } from '../types';
import { AVATAR_OPTIONS, ACHIEVEMENTS_DEF } from '../data/avatars';
import { updateAccount } from '../lib/auth';
import { 
  User, 
  Mail, 
  Calendar, 
  Flame, 
  Trophy, 
  ShieldCheck, 
  Check, 
  LogOut, 
  Settings, 
  Sparkles, 
  Target, 
  Bot, 
  Zap, 
  BrainCircuit, 
  Code2, 
  CheckCircle2, 
  Gamepad2, 
  Award, 
  Globe, 
  Code, 
  Volume2, 
  VolumeX, 
  Edit3,
  UserCheck
} from 'lucide-react';

interface ProfileSectionProps {
  user: UserProfile;
  sessions: GameSession[];
  schedules: ReviewSchedule[];
  onProfileUpdated: (updatedUser: UserProfile) => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  user,
  sessions,
  schedules,
  onProfileUpdated,
  onOpenAuthModal,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');

  // Form State
  const [displayName, setDisplayName] = useState<string>(user.displayName || '');
  const [bio, setBio] = useState<string>(user.bio || '');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(user.avatar || 'arcade_bot');
  const [dailyGoal, setDailyGoal] = useState<number>(user.dailyGoalSessions || 3);
  const [targetLanguages, setTargetLanguages] = useState<string[]>(
    user.preferences?.targetLanguages || ['Spanish', 'Mandarin']
  );
  const [targetCoding, setTargetCoding] = useState<string[]>(
    user.preferences?.targetCodingLanguages || ['JavaScript', 'Python']
  );
  const [isSavedMessage, setIsSavedMessage] = useState<boolean>(false);

  const currentAvatarDef = AVATAR_OPTIONS.find((a) => a.id === selectedAvatar) || AVATAR_OPTIONS[0];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      displayName: displayName.trim() || user.displayName,
      avatar: selectedAvatar,
      bio: bio.trim(),
      dailyGoalSessions: dailyGoal,
      preferences: {
        ...user.preferences,
        targetLanguages,
        targetCodingLanguages: targetCoding,
      },
    };

    updateAccount(updated);
    onProfileUpdated(updated);
    setIsSavedMessage(true);
    setTimeout(() => setIsSavedMessage(false), 2500);
  };

  const toggleLanguage = (lang: string) => {
    if (targetLanguages.includes(lang)) {
      setTargetLanguages(targetLanguages.filter((l) => l !== lang));
    } else {
      setTargetLanguages([...targetLanguages, lang]);
    }
  };

  const toggleCodingLang = (lang: string) => {
    if (targetCoding.includes(lang)) {
      setTargetCoding(targetCoding.filter((l) => l !== lang));
    } else {
      setTargetCoding([...targetCoding, lang]);
    }
  };

  const renderAvatarIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'Bot':
        return <Bot className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'BrainCircuit':
        return <BrainCircuit className={className} />;
      case 'Code2':
        return <Code2 className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const renderAchievementIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Flame':
        return <Flame className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      case 'CheckCircle2':
        return <CheckCircle2 className={className} />;
      case 'Gamepad2':
        return <Gamepad2 className={className} />;
      case 'Target':
        return <Target className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  // Compute Stats
  const avgAccuracy = sessions.length > 0
    ? Math.round((sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length) * 100)
    : 85;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Profile Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0C0C0E] border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start space-x-5">
            {/* Avatar Badge */}
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${currentAvatarDef.bgGradient} border-2 ${currentAvatarDef.borderColor} flex items-center justify-center shrink-0 ${currentAvatarDef.textColor} shadow-lg shadow-emerald-500/10`}>
              {renderAvatarIcon(currentAvatarDef.iconName, 'w-8 h-8 md:w-10 md:h-10')}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                  {user.title || 'Microlearning Veteran'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 uppercase">
                  {user.accountTier || 'Free'} Tier
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{user.email || 'alex.chen@example.com'}</span>
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {user.displayName}
              </h1>

              <p className="text-slate-400 text-xs md:text-sm max-w-xl">
                {user.bio || 'Daily micro-learner mastering touch typing, Spanish pragmatics, and algorithm tracing.'}
              </p>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenAuthModal}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-mono text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 transition-all border border-white/10 flex items-center justify-center space-x-2"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Switch Account</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-mono text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all border border-rose-500/30 flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-white/10 bg-[#0C0C0E] rounded-xl p-1 border">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Overview & Achievements</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Account Settings & Preferences</span>
        </button>
      </div>

      {/* Tab Body */}
      {activeTab === 'overview' ? (
        <div className="space-y-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0C0C0E] border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider mb-1">
                Active Streak
              </div>
              <div className="text-2xl font-bold font-mono text-amber-400 flex items-center justify-center space-x-1">
                <Flame className="w-5 h-5 fill-amber-400" />
                <span>{user.streakDays} Days</span>
              </div>
            </div>

            <div className="bg-[#0C0C0E] border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider mb-1">
                Sessions Completed
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {sessions.length || 14}
              </div>
            </div>

            <div className="bg-[#0C0C0E] border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider mb-1">
                Average Accuracy
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {avgAccuracy}%
              </div>
            </div>

            <div className="bg-[#0C0C0E] border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider mb-1">
                Daily Goal
              </div>
              <div className="text-2xl font-bold font-mono text-sky-400">
                {user.dailyGoalSessions || 3} / Day
              </div>
            </div>
          </div>

          {/* Unlocked Achievements Section */}
          <div className="bg-[#0C0C0E] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white font-mono flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span>Unlocked Arcade Badges ({user.unlockedAchievementIds?.length || 4}/{ACHIEVEMENTS_DEF.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {ACHIEVEMENTS_DEF.map((ach) => {
                const isUnlocked = user.unlockedAchievementIds?.includes(ach.id) || ['streak_7', 'sessions_10', 'calibration_master'].includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start space-x-3 ${
                      isUnlocked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                        : 'bg-white/5 border-white/10 opacity-50'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      isUnlocked
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-white/5 text-slate-500 border border-white/5'
                    }`}>
                      {renderAchievementIcon(ach.icon, 'w-5 h-5')}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{ach.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Session History Log */}
          <div className="bg-[#0C0C0E] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-mono flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>Recent Session History Log</span>
            </h3>

            {sessions.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono">No game sessions recorded yet. Start a review!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono text-slate-300">
                  <thead className="bg-[#09090B] text-slate-500 uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Game Type</th>
                      <th className="py-2.5 px-3">Accuracy</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3">Calibration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {sessions.slice(0, 6).map((s) => (
                      <tr key={s.id} className="hover:bg-white/5">
                        <td className="py-3 px-3 text-slate-400">
                          {new Date(s.sessionStart).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 font-bold text-white uppercase">
                          {s.gameType.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-3 text-emerald-400 font-bold">
                          {Math.round(s.accuracy * 100)}%
                        </td>
                        <td className="py-3 px-3 text-slate-400">
                          {s.durationSeconds}s
                        </td>
                        <td className="py-3 px-3 text-sky-400 font-bold">
                          {Math.round(s.confidenceCalibration * 100)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Settings Tab */
        <form onSubmit={handleSaveSettings} className="bg-[#0C0C0E] border border-white/10 rounded-2xl p-6 space-y-6">
          {isSavedMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>Profile settings successfully saved!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={30}
                className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 font-sans"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 mb-1.5">
                Daily Goal (Sessions / Day)
              </label>
              <select
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 font-sans"
              >
                <option value={1}>1 Session / Day (Casual)</option>
                <option value={3}>3 Sessions / Day (Recommended)</option>
                <option value={5}>5 Sessions / Day (Intense)</option>
                <option value={10}>10 Sessions / Day (Mastery)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 mb-1.5">
              Bio & Learning Tagline
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={150}
              rows={2}
              className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50 font-sans"
            />
          </div>

          {/* Avatar Selector Grid */}
          <div className="space-y-3">
            <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">
              Select Arcade Avatar
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AVATAR_OPTIONS.map((avatar) => {
                const isSelected = selectedAvatar === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center space-x-3 relative ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatar.bgGradient} border ${avatar.borderColor} flex items-center justify-center shrink-0 ${avatar.textColor}`}>
                      {renderAvatarIcon(avatar.iconName, 'w-5 h-5')}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white truncate">{avatar.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{avatar.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferences: Target Languages & Coding */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            <div>
              <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 mb-2 flex items-center space-x-1">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>Target Languages</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {['Spanish', 'Mandarin', 'French', 'German', 'Japanese'].map((lang) => {
                  const isChecked = targetLanguages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                        isChecked
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                          : 'bg-white/5 text-slate-500 border border-white/10'
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 mb-2 flex items-center space-x-1">
                <Code className="w-3.5 h-3.5 text-purple-400" />
                <span>Target Coding Languages</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {['JavaScript', 'Python', 'TypeScript', 'SQL', 'Rust'].map((code) => {
                  const isChecked = targetCoding.includes(code);
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => toggleCodingLang(code)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                        isChecked
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                          : 'bg-white/5 text-slate-500 border border-white/10'
                      }`}
                    >
                      {code}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-lg shadow-emerald-500/20"
            >
              Save Account Profile
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
