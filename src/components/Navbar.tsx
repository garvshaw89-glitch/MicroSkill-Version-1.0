import React from 'react';
import { 
  Flame, 
  BarChart3, 
  LayoutDashboard, 
  Grid3X3, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Download,
  Zap,
  Trophy,
  User,
  LogIn,
  Bot,
  BrainCircuit,
  Code2
} from 'lucide-react';
import { UserProfile } from '../types';
import { exportUserDataJSON } from '../lib/storage';
import { AVATAR_OPTIONS } from '../data/avatars';

interface NavbarProps {
  currentView: 'dashboard' | 'skills' | 'analytics' | 'leaderboards' | 'profile';
  onNavigate: (view: 'dashboard' | 'skills' | 'analytics' | 'leaderboards' | 'profile') => void;
  user: UserProfile;
  onToggleSound: () => void;
  onStartQuickReview: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  onToggleSound,
  onStartQuickReview,
  onOpenAuthModal,
}) => {
  const avatarDef = AVATAR_OPTIONS.find((a) => a.id === user.avatar) || AVATAR_OPTIONS[0];

  const renderAvatarIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Bot':
        return <Bot className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'BrainCircuit':
        return <BrainCircuit className={className} />;
      case 'Code2':
        return <Code2 className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#09090B] backdrop-blur border-b border-white/10 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#09090B] rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold tracking-tight text-lg text-white font-mono">
                  MICROSKILL
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                  ARCADE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider font-mono uppercase">
                Science-Backed Microlearning
              </p>
            </div>
          </div>

          {/* Navigation Views */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#0C0C0E] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'dashboard'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('skills')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'skills'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Skill Matrix</span>
            </button>

            <button
              onClick={() => onNavigate('analytics')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'analytics'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Retention Science</span>
            </button>

            <button
              onClick={() => onNavigate('leaderboards')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'leaderboards'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Leaderboards</span>
            </button>

            <button
              onClick={() => onNavigate('profile')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'profile'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center space-x-3">
            {/* Quick Review Button */}
            <button
              onClick={onStartQuickReview}
              className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Due Review</span>
            </button>

            {/* Streak Counter */}
            <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-amber-400 text-xs font-mono font-bold">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{user.streakDays || 1}d Streak</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              title={user.soundEnabled ? 'Mute SFX' : 'Enable SFX'}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all border border-white/10"
            >
              {user.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Login / Profile Trigger Pill */}
            <button
              onClick={onOpenAuthModal}
              title="Account Login / Sign Up"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center space-x-2 transition-all"
            >
              <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${avatarDef.bgGradient} border ${avatarDef.borderColor} flex items-center justify-center ${avatarDef.textColor}`}>
                {renderAvatarIcon(avatarDef.iconName, 'w-3.5 h-3.5')}
              </div>
              <span className="text-xs font-mono font-bold text-white hidden sm:inline truncate max-w-[100px]">
                {user.displayName || 'Sign In'}
              </span>
              <LogIn className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile view selector */}
      <div className="md:hidden border-t border-white/10 bg-[#0C0C0E]">
        <div className="flex overflow-x-auto py-2 px-2 space-x-1 justify-between sm:justify-around scrollbar-none">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs shrink-0 whitespace-nowrap transition-colors ${
              currentView === 'dashboard' ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => onNavigate('skills')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs shrink-0 whitespace-nowrap transition-colors ${
              currentView === 'skills' ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Skills</span>
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs shrink-0 whitespace-nowrap transition-colors ${
              currentView === 'analytics' ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => onNavigate('leaderboards')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs shrink-0 whitespace-nowrap transition-colors ${
              currentView === 'leaderboards' ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Leaderboard</span>
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs shrink-0 whitespace-nowrap transition-colors ${
              currentView === 'profile' ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};
