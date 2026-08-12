import React, { useState } from 'react';
import { 
  MasteryResult 
} from '../lib/spacedRepetition';
import { 
  Concept, 
  GameSession, 
  ReviewSchedule 
} from '../types';
import { 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  ArrowRight, 
  BrainCircuit, 
  Zap, 
  Sparkles,
  BarChart2
} from 'lucide-react';

interface SessionSummaryProps {
  concept: Concept;
  session: GameSession;
  scheduleResult: MasteryResult;
  onFinishAndSave: (avgConfidenceRating: number) => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  concept,
  session,
  scheduleResult,
  onFinishAndSave,
}) => {
  const [confidenceRating, setConfidenceRating] = useState<number>(4); // Default 4 = Confident
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
    onFinishAndSave(confidenceRating);
  };

  const confidenceLabels = [
    '1 • Unsure (Guessing)',
    '2 • Hesitant (Low Certainty)',
    '3 • Neutral (Moderate)',
    '4 • Confident (High Certainty)',
    '5 • Certain (Instant Mastery)',
  ];

  const accuracyPct = Math.round(session.accuracy * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      {!isSubmitted ? (
        /* Step 1: Post-Answer Confidence Rating Prompt */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Confidence Calibration Input</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white">
              Rate Your Confidence Level
            </h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              How certain did you feel during this session? The retention science engine compares your stated confidence against your actual {accuracyPct}% accuracy to tune your next review interval.
            </p>
          </div>

          {/* Confidence 1-5 Rating Slider / Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex justify-between font-mono text-xs text-slate-400">
              <span>Stated Certainty Rating</span>
              <span className="text-indigo-400 font-bold">{confidenceLabels[confidenceRating - 1]}</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setConfidenceRating(val)}
                  className={`py-3.5 rounded-xl font-mono text-lg font-bold border transition-all ${
                    confidenceRating === val
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/40 scale-105'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white shadow-xl transition-all flex items-center justify-center space-x-2"
          >
            <span>Calculate Updated Memory Schedule</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Step 2: Final Session Results & Review Schedule Computed */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h2 className="text-2xl font-extrabold text-white">
              Session Completed!
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Concept: {concept.title}
            </p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-center font-mono">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Accuracy</div>
              <div className="text-lg font-bold text-emerald-400">{accuracyPct}%</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase">New Mastery</div>
              <div className="text-lg font-bold text-indigo-400">
                {Math.round(scheduleResult.masteryLevel * 100)}%
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase">Difficulty Shift</div>
              <div className={`text-lg font-bold ${scheduleResult.difficultyAdjustment >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                {scheduleResult.difficultyAdjustment >= 0 ? `+${scheduleResult.difficultyAdjustment}` : scheduleResult.difficultyAdjustment}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase">Calibration</div>
              <div className="text-lg font-bold text-sky-400">
                {Math.round(scheduleResult.confidenceCalibration * 100)}%
              </div>
            </div>
          </div>

          {/* Next Scheduled Review Date */}
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="text-xs font-mono font-bold text-indigo-300">
                  Next Review Scheduled In {scheduleResult.intervalDays} Days
                </div>
                <div className="text-[11px] text-slate-400">
                  {new Date(scheduleResult.nextReviewDate).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {scheduleResult.status}
            </span>
          </div>

          <div className="pt-2 text-center">
            <p className="text-xs text-slate-400">
              Your results have been synced to local persistence and spaced repetition schedules.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
