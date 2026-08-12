import React, { useState } from 'react';
import { loginUser, signupUser, UserAccount } from '../lib/auth';
import { AVATAR_OPTIONS } from '../data/avatars';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Bot, 
  Zap, 
  BrainCircuit, 
  Code2, 
  Flame, 
  User, 
  KeyRound, 
  Mail, 
  ShieldCheck 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserAccount) => void;
  defaultTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  defaultTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);

  // Sync activeTab when modal opens or defaultTab prop changes
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>('alex.chen@example.com');
  const [loginPassword, setLoginPassword] = useState<string>('demo123');

  // Signup form state
  const [signupName, setSignupName] = useState<string>('');
  const [signupEmail, setSignupEmail] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('');
  const [signupAvatar, setSignupAvatar] = useState<string>('arcade_bot');
  const [signupDailyGoal, setSignupDailyGoal] = useState<number>(3);

  // Status state
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginEmail.trim()) {
      setError('Please enter your email address.');
      return;
    }

    const res = loginUser(loginEmail, loginPassword);
    if (!res.success || !res.user) {
      setError(res.error || 'Login failed.');
      return;
    }

    setSuccessMessage(`Welcome back, ${res.user.displayName}!`);
    setTimeout(() => {
      onAuthSuccess(res.user!);
      onClose();
    }, 600);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signupName.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (signupPassword && signupPassword.length < 4) {
      setError('Password should be at least 4 characters long.');
      return;
    }

    const res = signupUser({
      displayName: signupName,
      email: signupEmail,
      password: signupPassword,
      avatar: signupAvatar,
      dailyGoalSessions: signupDailyGoal,
    });

    if (!res.success || !res.user) {
      setError(res.error || 'Signup failed.');
      return;
    }

    setSuccessMessage(`Account created! Welcome, ${res.user.displayName}.`);
    setTimeout(() => {
      onAuthSuccess(res.user!);
      onClose();
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    setError(null);
    const res = loginUser('alex.chen@example.com', 'demo123');
    if (res.success && res.user) {
      setSuccessMessage('Demo Sign-In Successful!');
      setTimeout(() => {
        onAuthSuccess(res.user!);
        onClose();
      }, 500);
    } else {
      // Fallback: create demo user
      const signupRes = signupUser({
        displayName: 'Alex Chen',
        email: 'alex.chen@example.com',
        password: 'demo123',
        avatar: 'arcade_bot',
      });
      if (signupRes.user) {
        onAuthSuccess(signupRes.user);
        onClose();
      }
    }
  };

  const renderAvatarIcon = (iconName: string, className = 'w-5 h-5') => {
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

  return (
    <div className="fixed inset-0 z-50 bg-[#09090B]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0C0C0E] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col my-8">
        {/* Header Bar */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-sans">
                Microskill Account
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Sign in or register to sync overall progress
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#09090B] px-6">
          <button
            onClick={() => {
              setActiveTab('login');
              setError(null);
            }}
            className={`py-3 px-4 font-mono text-xs font-bold border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'login'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setError(null);
            }}
            className={`py-3 px-4 font-mono text-xs font-bold border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'signup'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full bg-[#09090B] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 font-sans"
                    placeholder="alex.chen@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#09090B] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 font-sans"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-white/10 w-full"></div>
                  <span className="bg-[#0C0C0E] px-3 text-[10px] font-mono text-slate-500 uppercase">OR</span>
                </div>

                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 rounded-xl font-mono text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 transition-all border border-white/10 flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Instant 1-Click Demo Sign-In</span>
                </button>
              </div>
            </form>
          ) : (
            /* Signup Tab */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 mb-1.5">
                  Full Display Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                    maxLength={30}
                    className="w-full bg-[#09090B] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 font-sans"
                    placeholder="e.g. Garv Shaw"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="w-full bg-[#09090B] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 font-sans"
                    placeholder="garv.shaw@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full bg-[#09090B] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 font-sans"
                    placeholder="Create password"
                  />
                </div>
              </div>

              {/* Avatar Selector Grid */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">
                  Select Starting Avatar
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {AVATAR_OPTIONS.map((avatar) => {
                    const isSelected = signupAvatar === avatar.id;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setSignupAvatar(avatar.id)}
                        className={`p-2 rounded-xl border flex flex-col items-center text-center space-y-1 transition-all ${
                          isSelected
                            ? 'bg-emerald-500/10 border-emerald-500 text-white'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${avatar.bgGradient} border ${avatar.borderColor} flex items-center justify-center ${avatar.textColor}`}>
                          {renderAvatarIcon(avatar.iconName, 'w-4 h-4')}
                        </div>
                        <span className="text-[10px] font-bold line-clamp-1">{avatar.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Daily Practice Target */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">
                  Daily Practice Goal
                </label>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  {[3, 5, 10].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setSignupDailyGoal(goal)}
                      className={`py-2 px-3 rounded-xl border font-bold text-center transition-all ${
                        signupDailyGoal === goal
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {goal} Sessions/day
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Profile & Start Learning</span>
              </button>
            </form>
          )}

          {/* Guest Exploration Option */}
          <div className="pt-2 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-mono text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-4"
            >
              Skip for now & Explore as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
