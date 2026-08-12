import React, { useState, useEffect } from 'react';
import { 
  Concept, 
  GameType, 
  GameItem, 
  GameSession, 
  AnswerHistory, 
  ReviewSchedule 
} from '../types';
import { TypingGame } from './games/TypingGame';
import { LanguageGame } from './games/LanguageGame';
import { MathGame } from './games/MathGame';
import { CodingGame } from './games/CodingGame';
import { SessionSummary } from './SessionSummary';
import { getJumbledItemsForConcept, saveGameSessionResult } from '../lib/storage';
import { calculateMasteryAndSchedule, clampDifficulty, MasteryResult } from '../lib/spacedRepetition';
import { X, Clock, BrainCircuit, Sparkles } from 'lucide-react';

interface GameSessionContainerProps {
  concept: Concept;
  gameType: GameType;
  currentSchedule: ReviewSchedule | null;
  soundEnabled: boolean;
  onExitSession: () => void;
  onSessionSaved: () => void;
}

export const GameSessionContainer: React.FC<GameSessionContainerProps> = ({
  concept,
  gameType,
  currentSchedule,
  soundEnabled,
  onExitSession,
  onSessionSaved,
}) => {
  const [items, setItems] = useState<GameItem[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(
    currentSchedule ? currentSchedule.intervalDays > 7 ? 1.8 : 1.0 : concept.minDifficulty
  );
  
  const [answers, setAnswers] = useState<AnswerHistory[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [sessionStartTime] = useState<string>(new Date().toISOString());

  // Load items in jumbled non-repeating order
  useEffect(() => {
    const loadedItems = getJumbledItemsForConcept(concept.id);
    setItems(loadedItems);
  }, [concept.id]);

  // Session timer ticker
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished]);

  const handleItemCompleted = (wasCorrect: boolean, responseTimeMs: number) => {
    const answerEntry: AnswerHistory = {
      id: `ans_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sessionId: `sess_${Date.now()}`,
      conceptId: concept.id,
      answerIndex: answers.length,
      wasCorrect,
      userConfidence: wasCorrect ? 4 : 2,
      responseTimeMs,
      difficultyAtAnswer: currentDifficulty,
      createdAt: new Date().toISOString(),
    };

    setAnswers((prev) => [...prev, answerEntry]);
  };

  const handleSessionFinish = () => {
    setIsFinished(true);
  };

  // Calculate session metrics
  const totalCorrect = answers.filter((a) => a.wasCorrect).length;
  const totalItems = answers.length || 1;
  const accuracy = totalCorrect / totalItems;

  // Intermediate result calculation
  const intermediateScheduleResult: MasteryResult = calculateMasteryAndSchedule(
    currentSchedule,
    concept,
    accuracy,
    4, // default 4, will be updated by user input
    currentDifficulty
  );

  const handleFinalSave = (userConfidenceRating: number) => {
    const finalScheduleResult = calculateMasteryAndSchedule(
      currentSchedule,
      concept,
      accuracy,
      userConfidenceRating,
      currentDifficulty
    );

    const newDifficulty = clampDifficulty(
      currentDifficulty + finalScheduleResult.difficultyAdjustment,
      concept
    );

    const gameSession: GameSession = {
      id: `sess_${Date.now()}`,
      userId: 'user_default',
      skillId: concept.skillId,
      conceptId: concept.id,
      gameType,
      sessionStart: sessionStartTime,
      sessionEnd: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      difficultyLevel: newDifficulty,
      accuracy,
      itemsCorrect: totalCorrect,
      itemsTotal: totalItems,
      confidenceCalibration: finalScheduleResult.confidenceCalibration,
    };

    const updatedSchedule: ReviewSchedule = {
      id: currentSchedule?.id || `sched_${Date.now()}`,
      userId: 'user_default',
      conceptId: concept.id,
      masteryLevel: finalScheduleResult.masteryLevel,
      status: finalScheduleResult.status,
      lastPlayed: new Date().toISOString(),
      nextReviewDate: finalScheduleResult.nextReviewDate,
      reviewCount: (currentSchedule?.reviewCount || 0) + 1,
      intervalDays: finalScheduleResult.intervalDays,
      accuracyRolling30d: accuracy,
      confidenceCalibrationAvg: finalScheduleResult.confidenceCalibration,
      createdAt: currentSchedule?.createdAt || new Date().toISOString(),
    };

    saveGameSessionResult(gameSession, updatedSchedule, answers);
    onSessionSaved();
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md overflow-y-auto p-4 md:p-6 flex flex-col justify-between">
      {/* Top Session Bar */}
      <div className="max-w-4xl mx-auto w-full flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {concept.title}
          </span>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            Game Engine: <strong className="text-white uppercase">{gameType.replace('_', ' ')}</strong>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-mono text-xs text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          <button
            onClick={onExitSession}
            aria-label="Exit Game Session"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Game Payload */}
      <div className="max-w-4xl mx-auto w-full py-6 flex-1 flex flex-col justify-center">
        {isFinished ? (
          <SessionSummary
            concept={concept}
            session={{
              id: '',
              userId: '',
              skillId: concept.skillId,
              conceptId: concept.id,
              gameType,
              sessionStart: sessionStartTime,
              durationSeconds: elapsedSeconds,
              difficultyLevel: currentDifficulty,
              accuracy,
              itemsCorrect: totalCorrect,
              itemsTotal: totalItems,
              confidenceCalibration: intermediateScheduleResult.confidenceCalibration,
            }}
            scheduleResult={intermediateScheduleResult}
            onFinishAndSave={handleFinalSave}
          />
        ) : (
          <>
            {concept.skillId === 'skill_typing' && (
              <TypingGame
                gameType={gameType}
                items={items}
                difficulty={currentDifficulty}
                soundEnabled={soundEnabled}
                onItemCompleted={handleItemCompleted}
                onSessionFinish={handleSessionFinish}
              />
            )}

            {concept.skillId === 'skill_language' && (
              <LanguageGame
                gameType={gameType}
                items={items}
                difficulty={currentDifficulty}
                soundEnabled={soundEnabled}
                onItemCompleted={handleItemCompleted}
                onSessionFinish={handleSessionFinish}
              />
            )}

            {concept.skillId === 'skill_math' && (
              <MathGame
                gameType={gameType}
                items={items}
                difficulty={currentDifficulty}
                soundEnabled={soundEnabled}
                onItemCompleted={handleItemCompleted}
                onSessionFinish={handleSessionFinish}
              />
            )}

            {concept.skillId === 'skill_coding' && (
              <CodingGame
                gameType={gameType}
                items={items}
                difficulty={currentDifficulty}
                soundEnabled={soundEnabled}
                onItemCompleted={handleItemCompleted}
                onSessionFinish={handleSessionFinish}
              />
            )}
          </>
        )}
      </div>

      {/* Footer Exit Safeguard */}
      {!isFinished && (
        <div className="max-w-4xl mx-auto w-full pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Latency Validation: &lt;500ms • Session Persistence Active</span>
          <button
            onClick={handleSessionFinish}
            className="text-indigo-400 hover:text-indigo-300 font-bold underline"
          >
            Finish Session Early
          </button>
        </div>
      )}
    </div>
  );
};
