import React, { useState, useEffect } from 'react';
import { GameItem, GameType } from '../../types';
import { soundFx } from '../../lib/audio';
import { Calculator, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

interface MathGameProps {
  gameType: GameType;
  items: GameItem[];
  difficulty: number;
  soundEnabled: boolean;
  onItemCompleted: (wasCorrect: boolean, responseTimeMs: number) => void;
  onSessionFinish: () => void;
}

export const MathGame: React.FC<MathGameProps> = ({
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
        Loading math engine items...
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
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <span className="flex items-center space-x-2">
          <Calculator className="w-4 h-4 text-amber-400" />
          <span>Math Engine • Problem {currentIndex + 1} / {items.length}</span>
        </span>
        <span className="text-amber-400 font-bold">Difficulty: {difficulty.toFixed(1)}</span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {gameType === 'pattern_vault' ? 'Pattern Vault Sequence' :
             gameType === 'equation_builder' ? 'Equation Balancing' :
             'Rapid Calculation'}
          </span>

          <h3 className="text-2xl font-extrabold text-white font-mono tracking-wide py-2">
            {currentItem.prompt}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentItem.options?.map((option) => {
            const isSelected = selectedOption === option;
            const isCorrectOpt = option === currentItem.correctAnswer;
            let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-amber-500';

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
                className={`p-5 rounded-xl border text-center font-mono text-lg font-bold transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span className="w-full">{option}</span>
                {selectedOption && isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                {selectedOption && isSelected && !isCorrectOpt && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {selectedOption && currentItem.explanation && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-amber-400 font-mono">Mathematical Proof / Step:</span>
            <p className="font-mono">{currentItem.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};
