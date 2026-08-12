import React, { useState, useEffect } from 'react';
import { GameItem, GameType } from '../../types';
import { soundFx } from '../../lib/audio';
import { Code, CheckCircle2, XCircle, Terminal } from 'lucide-react';

interface CodingGameProps {
  gameType: GameType;
  items: GameItem[];
  difficulty: number;
  soundEnabled: boolean;
  onItemCompleted: (wasCorrect: boolean, responseTimeMs: number) => void;
  onSessionFinish: () => void;
}

export const CodingGame: React.FC<CodingGameProps> = ({
  gameType,
  items,
  difficulty,
  soundEnabled,
  onItemCompleted,
  onSessionFinish,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    setStartTime(Date.now());
    setSelectedOption(null);
  }, [currentIndex]);

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 font-mono text-sm bg-slate-900 border border-slate-800 rounded-2xl p-6">
        Loading coding engine items...
      </div>
    );
  }

  const currentItem = items[currentIndex] || items[0];

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    const responseTimeMs = Date.now() - startTime;
    const isCorrect = option === currentItem.correctAnswer;

    if (isCorrect) {
      soundFx.playCorrect(soundEnabled);
    } else {
      soundFx.playIncorrect(soundEnabled);
    }

    onItemCompleted(isCorrect, responseTimeMs);

    setTimeout(() => {
      if (currentIndex + 1 >= items.length) {
        onSessionFinish();
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <span className="flex items-center space-x-2">
          <Code className="w-4 h-4 text-indigo-400" />
          <span>Software Engineering Engine • Task {currentIndex + 1} / {items.length}</span>
        </span>
        <span className="text-indigo-400 font-bold">Difficulty: {difficulty.toFixed(1)}</span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {gameType === 'bug_bounty' ? 'Bug Bounty • Spot the Flaw' :
             gameType === 'algorithm_visualizer' ? 'Algorithm Execution Trace' :
             gameType === 'api_challenge' ? 'SQL & API Architecture' :
             'Syntax Puzzle'}
          </span>

          <h3 className="text-lg font-bold text-white">
            {currentItem.prompt}
          </h3>
        </div>

        {/* Code Snippet Box */}
        {currentItem.codeSnippet && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs md:text-sm text-emerald-300 overflow-x-auto leading-relaxed shadow-inner">
            <div className="flex items-center space-x-2 text-[10px] text-slate-500 mb-2 border-b border-slate-800 pb-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>execution_context.ts</span>
            </div>
            <pre><code>{currentItem.codeSnippet}</code></pre>
          </div>
        )}

        {/* Multiple Choice Answers */}
        <div className="grid grid-cols-1 gap-3">
          {currentItem.options?.map((option) => {
            const isSelected = selectedOption === option;
            const isCorrectOpt = option === currentItem.correctAnswer;
            let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-indigo-500';

            if (selectedOption) {
              if (isCorrectOpt) {
                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
              } else if (isSelected) {
                btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold';
              }
            }

            return (
              <button
                key={option}
                disabled={selectedOption !== null}
                onClick={() => handleSelectOption(option)}
                className={`p-4 rounded-xl border text-left font-mono text-xs md:text-sm transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{option}</span>
                {selectedOption && isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                {selectedOption && isSelected && !isCorrectOpt && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {selectedOption && currentItem.explanation && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-indigo-400 font-mono">Code Audit Notes:</span>
            <p className="font-mono">{currentItem.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};
