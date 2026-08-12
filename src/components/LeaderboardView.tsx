import React, { useState } from 'react';
import { UserProfile, GameType } from '../types';
import { getMockLeaderboardData, getWeeklyChallenge } from '../lib/storage';
import { AVATAR_OPTIONS } from '../data/avatars';
import { 
  Trophy, 
  Users, 
  Globe, 
  Sparkles, 
  Flame, 
  Play, 
  Clock, 
  Bot, 
  Zap, 
  BrainCircuit, 
  Code2 
} from 'lucide-react';

interface LeaderboardViewProps {
  user: UserProfile;
  onStartChallengeSession: (conceptId: string, gameType: GameType) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  user,
  onStartChallengeSession,
}) => {
  const [scope, setScope] = useState<'global' | 'friends'>('global');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const weeklyChallenge = getWeeklyChallenge();
  const leaderboardData = getMockLeaderboardData(categoryFilter);

  const renderAvatarIcon = (avatarId: string, className = 'w-5 h-5') => {
    const option = AVATAR_OPTIONS.find((a) => a.id === avatarId) || AVATAR_OPTIONS[0];
    switch (option.iconName) {
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

  const getAvatarDef = (avatarId: string) => {
    return AVATAR_OPTIONS.find((a) => a.id === avatarId) || AVATAR_OPTIONS[0];
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Weekly Challenge Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0C0C0E] border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold tracking-widest rounded border border-emerald-500/30 uppercase font-mono">
                🏆 Rotating Weekly Challenge
              </span>
              <span className="text-xs text-amber-400 font-mono flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Ends in 4d 12h</span>
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-light text-white leading-tight">
              {weeklyChallenge.title}
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              {weeklyChallenge.description} Target: <strong className="text-emerald-400">{weeklyChallenge.targetScoreLabel}</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 w-full md:w-auto">
            <div className="text-center px-4">
              <div className="text-[10px] text-slate-500 uppercase font-mono font-bold">Your Best Score</div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {weeklyChallenge.userBestScore ? `${weeklyChallenge.userBestScore} WPM` : 'No Entry Yet'}
              </div>
            </div>

            <button
              onClick={() => onStartChallengeSession('concept_typing_sprint', 'word_sprint')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all active:scale-95 whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Compete Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scope & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Scope Selector: Global vs Friends */}
        <div className="flex bg-[#0C0C0E] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setScope('global')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              scope === 'global'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Global Arena</span>
          </button>
          <button
            onClick={() => setScope('friends')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              scope === 'friends'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Friends</span>
          </button>
        </div>

        {/* Skill Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'typing', 'language', 'math', 'coding'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                categoryFilter === cat
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaderboardData.slice(0, 3).map((entry) => {
          const avatarDef = getAvatarDef(entry.avatar);
          const isGold = entry.rank === 1;
          const isSilver = entry.rank === 2;

          return (
            <div
              key={entry.userId}
              className={`bg-[#0C0C0E] border rounded-2xl p-6 relative flex flex-col items-center text-center space-y-3 ${
                isGold
                  ? 'border-amber-500/40 shadow-lg shadow-amber-500/10'
                  : isSilver
                  ? 'border-slate-300/30'
                  : 'border-amber-700/30'
              }`}
            >
              {/* Rank Medal Badge */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                isGold ? 'bg-amber-400 text-black' : isSilver ? 'bg-slate-300 text-black' : 'bg-amber-700 text-white'
              }`}>
                #{entry.rank}
              </div>

              {/* Avatar Box */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarDef.bgGradient} border-2 ${avatarDef.borderColor} flex items-center justify-center ${avatarDef.textColor} shadow-lg`}>
                {renderAvatarIcon(avatarDef.id, 'w-7 h-7')}
              </div>

              <div>
                <h3 className="font-bold text-white text-base">{entry.displayName}</h3>
                <span className="text-[10px] font-mono uppercase text-slate-500">{avatarDef.name}</span>
              </div>

              <div className="flex items-center space-x-4 pt-2 border-t border-white/10 w-full justify-around text-xs font-mono">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block">Score</span>
                  <span className="text-emerald-400 font-bold">{entry.score}%</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block">Streak</span>
                  <span className="text-amber-400 font-bold">{entry.streakDays}d</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#0C0C0E] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-base font-bold text-white font-mono flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-emerald-400" />
            <span>Leaderboard Rankings</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Updated Live Across Sessions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-[#09090B] text-slate-500 uppercase text-[10px] border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Competitor</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Active Streak</th>
                <th className="py-3 px-4">Mastery Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leaderboardData.map((entry) => {
                const isCurrentUser = entry.userId === user.id;
                const avatarDef = getAvatarDef(entry.avatar);

                return (
                  <tr
                    key={entry.userId}
                    className={`transition-colors ${
                      isCurrentUser
                        ? 'bg-emerald-500/10 text-white font-bold border-l-2 border-emerald-500'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-400">
                      #{entry.rank}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${avatarDef.bgGradient} border ${avatarDef.borderColor} flex items-center justify-center shrink-0 ${avatarDef.textColor}`}>
                          {renderAvatarIcon(avatarDef.id, 'w-4 h-4')}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center space-x-2">
                            <span>{entry.displayName}</span>
                            {isCurrentUser && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 uppercase font-mono">You</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500">{avatarDef.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold">
                      {entry.accuracy}%
                    </td>
                    <td className="py-3.5 px-4 text-amber-400 font-bold">
                      {entry.streakDays} days
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {entry.score}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
