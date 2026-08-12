import React from 'react';
import { 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Keyboard, 
  Languages, 
  Calculator, 
  Code,
  CheckCircle2,
  AlertCircle,
  Play,
  Bot, 
  Zap, 
  BrainCircuit, 
  Code2, 
  Flame, 
  User, 
  Edit3
} from 'lucide-react';
import { UserProfile, Skill, Concept, ReviewSchedule, GameType } from '../types';
import { AVATAR_OPTIONS } from '../data/avatars';

interface DashboardProps {
  user: UserProfile;
  skills: Skill[];
  concepts: Concept[];
  schedules: ReviewSchedule[];
  onStartSession: (conceptId: string, gameType: GameType) => void;
  onNavigateToSkill: (skillId: string) => void;
  onOpenProfile?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  skills,
  concepts,
  schedules,
  onStartSession,
  onNavigateToSkill,
  onOpenProfile,
}) => {
  const avatarDef = AVATAR_OPTIONS.find((a) => a.id === user.avatar) || AVATAR_OPTIONS[0];

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
        return <User className={className} />;
    }
  };
  // Find concepts due for review (nextReviewDate <= today)
  const now = new Date();
  const dueSchedules = schedules.filter(
    (s) => new Date(s.nextReviewDate) <= now || s.masteryLevel < 0.5
  );

  const getConcept = (conceptId: string) => concepts.find((c) => c.id === conceptId);
  const getSkill = (skillId: string) => skills.find((s) => s.id === skillId);

  // Map icon helper
  const renderSkillIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Keyboard':
        return <Keyboard className={className} />;
      case 'Languages':
        return <Languages className={className} />;
      case 'Calculator':
        return <Calculator className={className} />;
      case 'Code':
        return <Code className={className} />;
      default:
        return <BrainCircuit className={className} />;
    }
  };

  // Calculate skill-level mastery averages
  const getSkillMastery = (skillId: string) => {
    const skillConcepts = concepts.filter((c) => c.skillId === skillId);
    if (skillConcepts.length === 0) return 0;

    const skillConceptIds = new Set(skillConcepts.map((c) => c.id));
    const relevantSchedules = schedules.filter((s) => skillConceptIds.has(s.conceptId));

    if (relevantSchedules.length === 0) return 40; // Default baseline baseline
    const totalMastery = relevantSchedules.reduce((acc, s) => acc + s.masteryLevel, 0);
    return Math.round((totalMastery / skillConcepts.length) * 100);
  };

  // Recommend default game type for a concept
  const getRecommendedGameType = (concept: Concept): GameType => {
    if (concept.skillId === 'skill_typing') {
      if (concept.id.includes('autocorrect')) return 'autocorrect_hunt';
      if (concept.id.includes('rhythm')) return 'keystroke_rhythm';
      return 'word_sprint';
    }
    if (concept.skillId === 'skill_language') {
      if (concept.id.includes('convo')) return 'conversation_snippet';
      if (concept.id.includes('ja')) return 'vocabulary_duel';
      return 'translation_match';
    }
    if (concept.skillId === 'skill_math') {
      if (concept.id.includes('patterns')) return 'pattern_vault';
      if (concept.id.includes('algebra')) return 'equation_builder';
      return 'calculation_sprint';
    }
    if (concept.skillId === 'skill_coding') {
      if (concept.id.includes('bug')) return 'bug_bounty';
      if (concept.id.includes('algo')) return 'algorithm_visualizer';
      return 'syntax_puzzle';
    }
    return 'word_sprint';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Banner / Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0C0C0E] border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            {/* Avatar badge */}
            <button
              onClick={onOpenProfile}
              title="Click to edit profile & avatars"
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarDef.bgGradient} border-2 ${avatarDef.borderColor} flex items-center justify-center shrink-0 ${avatarDef.textColor} shadow-lg hover:scale-105 transition-all group`}
            >
              {renderAvatarIcon(avatarDef.iconName, 'w-7 h-7')}
            </button>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                  {user.title || 'Arcade Member'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {dueSchedules.length} Review Slots Due Today
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl md:text-3xl font-light text-white leading-tight">
                  Welcome back, <span className="font-bold text-emerald-400">{user.displayName}</span>
                </h1>
                <button
                  onClick={onOpenProfile}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10 text-xs"
                  title="Edit Profile"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-slate-400 text-sm max-w-xl">
                {user.bio || 'Retention science schedules reviews right at your memory decay boundary for maximum recall.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 w-full md:w-auto justify-around md:justify-start">
            <div className="text-center px-3 border-r border-white/10">
              <div className="text-xl font-bold font-mono text-emerald-400">12</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Sessions/Wk</div>
            </div>
            <div className="text-center px-3 border-r border-white/10">
              <div className="text-xl font-bold font-mono text-emerald-400">84%</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Accuracy</div>
            </div>
            <div className="text-center px-3">
              <div className="text-xl font-bold font-mono text-amber-400">{user.streakDays}d</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Active Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Due for Review Queue Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white font-mono tracking-wide">
              🔥 Due for Review Today ({dueSchedules.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Optimized by Spaced Repetition Engine
          </span>
        </div>

        {dueSchedules.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="font-semibold text-white">All reviews completed for today!</p>
            <p className="text-xs mt-1">Explore optional practice sessions below to expand your skill matrix.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dueSchedules.map((schedule) => {
              const concept = getConcept(schedule.conceptId);
              if (!concept) return null;
              const skill = getSkill(concept.skillId);
              const gameType = getRecommendedGameType(concept);

              return (
                <div
                  key={schedule.id}
                  className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                        skill?.category === 'typing' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        skill?.category === 'language' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                        skill?.category === 'math' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {skill?.category || 'General'}
                      </span>
                      <span className="text-xs font-mono text-amber-400 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Mastery: {Math.round(schedule.masteryLevel * 100)}%</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-100 text-sm group-hover:text-indigo-300 transition-colors">
                        {concept.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {concept.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      Tier: {concept.tierOrLevel}
                    </span>
                    <button
                      onClick={() => onStartSession(concept.id, gameType)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Start 5m Review</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Skills Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-mono tracking-wide">
            ⏱️ Skill Domains & Available Sessions
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            4 Core Domains • 16 Custom Engines
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {skills.map((skill) => {
            const masteryPct = getSkillMastery(skill.id);
            const skillConcepts = concepts.filter((c) => c.skillId === skill.id);

            return (
              <div
                key={skill.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-5 space-y-4 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl ${
                      skill.category === 'typing' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      skill.category === 'language' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                      skill.category === 'math' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {renderSkillIcon(skill.iconName, 'w-6 h-6')}
                    </div>
                    <span className="text-xs font-mono text-slate-400 font-semibold">
                      {skillConcepts.length} Concepts
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base">
                      {skill.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {skill.description}
                    </p>
                  </div>

                  {/* Mastery Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Domain Mastery</span>
                      <span className="text-slate-200 font-bold">{masteryPct}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          skill.category === 'typing' ? 'bg-emerald-500' :
                          skill.category === 'language' ? 'bg-sky-500' :
                          skill.category === 'math' ? 'bg-amber-500' :
                          'bg-indigo-500'
                        }`}
                        style={{ width: `${masteryPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => onNavigateToSkill(skill.id)}
                    className="text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-1 transition-colors"
                  >
                    <span>View Matrix</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      const firstConcept = skillConcepts[0];
                      if (firstConcept) {
                        onStartSession(firstConcept.id, getRecommendedGameType(firstConcept));
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white transition-all border border-slate-700"
                  >
                    Practice
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Retention Science Callout Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs font-bold uppercase">
            <BrainCircuit className="w-4 h-4" />
            <span>Spaced Repetition & Confidence Calibration</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            30-Day Retention Guarantee Engine
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Unlike endless gamification grinders, Microskill Arcade tracks your <em>confidence alignment</em> vs. <em>actual accuracy</em>. Well-calibrated learners skip unnecessary repetition, while overconfident errors trigger reinforced review intervals.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => onStartSession(concepts[0].id, getRecommendedGameType(concepts[0]))}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Quick 5-Min Warmup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
