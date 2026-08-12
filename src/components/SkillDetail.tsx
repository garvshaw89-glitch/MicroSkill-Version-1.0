import React, { useState } from 'react';
import { 
  Skill, 
  Concept, 
  ReviewSchedule, 
  GameType, 
  MasteryStatus,
  GameSession
} from '../types';
import { 
  Keyboard, 
  Languages, 
  Calculator, 
  Code, 
  BrainCircuit, 
  Play, 
  Calendar,
  Layers
} from 'lucide-react';
import { SkillHeatmap } from './SkillHeatmap';

interface SkillDetailProps {
  skills: Skill[];
  concepts: Concept[];
  schedules: ReviewSchedule[];
  sessions?: GameSession[];
  selectedSkillId?: string;
  onStartSession: (conceptId: string, gameType: GameType) => void;
}

export const SkillDetail: React.FC<SkillDetailProps> = ({
  skills,
  concepts,
  schedules,
  sessions = [],
  selectedSkillId,
  onStartSession,
}) => {
  const [activeSkillId, setActiveSkillId] = useState<string>(
    selectedSkillId || skills[0]?.id || 'skill_typing'
  );

  const activeSkill = skills.find((s) => s.id === activeSkillId) || skills[0];
  const activeConcepts = concepts.filter((c) => c.skillId === activeSkillId);

  const getScheduleForConcept = (conceptId: string): ReviewSchedule | undefined => {
    return schedules.find((s) => s.conceptId === conceptId);
  };

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

  const renderStatusBadge = (status?: MasteryStatus) => {
    switch (status) {
      case 'MASTERED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            MASTERED (90%+)
          </span>
        );
      case 'PROFICIENT':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
            PROFICIENT (70-89%)
          </span>
        );
      case 'LEARNING':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            LEARNING (30-69%)
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
            UNFAMILIAR (&lt;30%)
          </span>
        );
    }
  };

  // Get game options per skill domain
  const getGameTypesForSkill = (skillId: string): { type: GameType; label: string }[] => {
    if (skillId === 'skill_typing') {
      return [
        { type: 'word_sprint', label: 'Word Sprint' },
        { type: 'keystroke_rhythm', label: 'Keystroke Rhythm' },
        { type: 'autocorrect_hunt', label: 'Autocorrect Hunt' },
      ];
    }
    if (skillId === 'skill_language') {
      return [
        { type: 'translation_match', label: 'Translation Match' },
        { type: 'conversation_snippet', label: 'Conversation Snippet' },
        { type: 'vocabulary_duel', label: 'Vocabulary Duel' },
        { type: 'phrase_builder', label: 'Phrase Builder' },
      ];
    }
    if (skillId === 'skill_math') {
      return [
        { type: 'calculation_sprint', label: 'Calculation Sprint' },
        { type: 'pattern_vault', label: 'Pattern Vault' },
        { type: 'equation_builder', label: 'Equation Builder' },
        { type: 'problem_solver', label: 'Problem Solver' },
      ];
    }
    return [
      { type: 'syntax_puzzle', label: 'Syntax Puzzle' },
      { type: 'algorithm_visualizer', label: 'Algorithm Trace' },
      { type: 'bug_bounty', label: 'Bug Bounty' },
      { type: 'api_challenge', label: 'API & SQL Challenge' },
    ];
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Skill Tabs Selector */}
      <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-none">
        {skills.map((skill) => {
          const isActive = skill.id === activeSkillId;
          return (
            <button
              key={skill.id}
              onClick={() => setActiveSkillId(skill.id)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {renderSkillIcon(skill.iconName, 'w-4 h-4')}
              </div>
              <div className="text-left">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  {skill.category}
                </div>
                <div className="text-sm font-bold text-white">{skill.name}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Domain Summary Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">
              Skill Domain Breakdown
            </span>
            <h1 className="text-2xl font-extrabold text-white">
              {activeSkill.name}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              {activeSkill.description}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-mono font-bold">
              {activeConcepts.length} Concepts Tracked
            </span>
          </div>
        </div>

        {/* Concept List */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white font-mono flex items-center space-x-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Concept Progression & Spaced Review Schedule</span>
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {activeConcepts.map((concept) => {
              const schedule = getScheduleForConcept(concept.id);
              const gameTypes = getGameTypesForSkill(activeSkill.id);
              const masteryPct = schedule ? Math.round(schedule.masteryLevel * 100) : 15;

              return (
                <div
                  key={concept.id}
                  className="bg-slate-950/60 border border-slate-800/90 hover:border-slate-700 rounded-xl p-5 transition-all space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center space-x-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {concept.tierOrLevel}
                        </span>
                        {renderStatusBadge(schedule?.status)}
                      </div>

                      <h3 className="text-base font-bold text-white">
                        {concept.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {concept.description}
                      </p>
                    </div>

                    <div className="flex items-center space-x-6 min-w-[200px] justify-between md:justify-end">
                      <div className="text-right space-y-1">
                        <div className="text-xs font-mono text-slate-400">Mastery Level</div>
                        <div className="text-lg font-bold font-mono text-white">{masteryPct}%</div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="text-xs font-mono text-slate-400 flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Next Review</span>
                        </div>
                        <div className="text-xs font-mono font-semibold text-indigo-300">
                          {schedule
                            ? new Date(schedule.nextReviewDate).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'Available Now'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${masteryPct}%` }}
                    />
                  </div>

                  {/* Game Type Buttons for concept */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-400">
                      Target Difficulty: {concept.minDifficulty.toFixed(1)} - {concept.maxDifficulty.toFixed(1)}
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {gameTypes.map((gt) => (
                        <button
                          key={gt.type}
                          onClick={() => onStartSession(concept.id, gt.type)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white transition-all border border-slate-700/80 flex items-center space-x-1.5 active:scale-95"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{gt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Domain Skill Heatmaps Matrix */}
      <SkillHeatmap
        skills={skills}
        concepts={concepts}
        sessions={sessions}
        schedules={schedules}
        defaultSkillId={activeSkillId}
        showAllSkillsGrid={true}
      />
    </div>
  );
};
