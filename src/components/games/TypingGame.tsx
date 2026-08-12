import React, { useState, useEffect, useRef } from 'react';
import { GameItem, GameType } from '../../types';
import { soundFx } from '../../lib/audio';
import { Zap, AlertCircle, Play, CheckCircle2 } from 'lucide-react';

interface TypingGameProps {
  gameType: GameType;
  items: GameItem[];
  difficulty: number;
  soundEnabled: boolean;
  onItemCompleted: (wasCorrect: boolean, responseTimeMs: number) => void;
  onSessionFinish: () => void;
}

export const TypingGame: React.FC<TypingGameProps> = ({
  gameType,
  items,
  difficulty,
  soundEnabled,
  onItemCompleted,
  onSessionFinish,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [combo, setCombo] = useState<number>(1);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  
  // Autocorrect Hunt state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setStartTime(Date.now());
    setUserInput('');
    setErrorIndex(null);
    setSelectedOption(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 font-mono text-sm bg-slate-900 border border-slate-800 rounded-2xl p-6">
        Loading typing engine items...
      </div>
    );
  }

  const currentItem = items[currentIndex] || items[0];

  const targetText = (typeof currentItem.correctAnswer === 'string' ? currentItem.correctAnswer : currentItem.prompt);

  // Handle Typing Input for Word Sprint & Keystroke Rhythm
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const now = Date.now();
    const elapsedMinutes = Math.max(0.01, (now - startTime) / 60000);

    // Calculate WPM (5 chars = 1 word)
    const wordsTyped = value.length / 5;
    const currentWpm = Math.round(wordsTyped / elapsedMinutes);
    setWpm(currentWpm);

    // Check accuracy & current error
    let errors = 0;
    let mismatchAt: number | null = null;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== targetText[i]) {
        errors++;
        if (mismatchAt === null) mismatchAt = i;
      }
    }

    if (mismatchAt !== null) {
      setErrorIndex(mismatchAt);
      soundFx.playIncorrect(soundEnabled);
      setCombo(1);
    } else {
      setErrorIndex(null);
      if (value.length > 0) {
        soundFx.playTick(soundEnabled);
      }
    }

    const currentAcc = Math.max(0, Math.round(((value.length - errors) / Math.max(1, value.length)) * 100));
    setAccuracy(currentAcc);
    setUserInput(value);

    // Check completion
    if (value === targetText) {
      const responseTimeMs = Date.now() - startTime;
      const isCorrect = errors === 0;
      if (isCorrect) {
        soundFx.playCorrect(soundEnabled);
        setCombo((c) => c + 1);
      }
      onItemCompleted(isCorrect, responseTimeMs);

      if (currentIndex + 1 >= items.length) {
        onSessionFinish();
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }
  };

  // Autocorrect Hunt option selector
  const handleSelectAutocorrectOption = (option: string) => {
    setSelectedOption(option);
    const responseTimeMs = Date.now() - startTime;
    const isCorrect = option === currentItem.correctAnswer;

    if (isCorrect) {
      soundFx.playCorrect(soundEnabled);
      setCombo((c) => c + 1);
    } else {
      soundFx.playIncorrect(soundEnabled);
      setCombo(1);
    }

    onItemCompleted(isCorrect, responseTimeMs);

    setTimeout(() => {
      if (currentIndex + 1 >= items.length) {
        onSessionFinish();
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Engine Gauges */}
      <div className="grid grid-cols-3 gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
        <div>
          <div className="text-[10px] font-mono text-slate-400 uppercase">Typing Speed</div>
          <div className="text-xl font-bold font-mono text-emerald-400">{wpm} WPM</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-slate-400 uppercase">Precision</div>
          <div className="text-xl font-bold font-mono text-indigo-400">{accuracy}%</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-slate-400 uppercase">Streak Multiplier</div>
          <div className="text-xl font-bold font-mono text-amber-400 flex items-center justify-center space-x-1">
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>{combo}x</span>
          </div>
        </div>
      </div>

      {/* Game Mode Render */}
      {gameType === 'autocorrect_hunt' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Autocorrect Hunt • Spot the AI Typo
            </span>
            <h3 className="text-lg font-bold text-white">
              {currentItem.prompt}
            </h3>
            <p className="text-xs text-slate-400">
              Select the correct spelling or fix for the typo in the passage:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentItem.options?.map((opt) => {
              const isSelected = selectedOption === opt;
              const isCorrectOpt = opt === currentItem.correctAnswer;
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
                  key={opt}
                  disabled={selectedOption !== null}
                  onClick={() => handleSelectAutocorrectOption(opt)}
                  className={`p-4 rounded-xl border text-left text-sm font-mono transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {selectedOption && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Word Sprint / Keystroke Rhythm */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Item {currentIndex + 1} of {items.length}</span>
            <span>Target Difficulty: {difficulty.toFixed(1)}</span>
          </div>

          {/* Target Text Visualization */}
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-base md:text-lg leading-relaxed tracking-wide select-none">
            {targetText.split('').map((char, index) => {
              let charStyle = 'text-slate-500';
              if (index < userInput.length) {
                if (userInput[index] === char) {
                  charStyle = 'text-emerald-400 font-bold bg-emerald-500/10';
                } else {
                  charStyle = 'text-rose-400 font-bold bg-rose-500/20 underline';
                }
              } else if (index === userInput.length) {
                charStyle = 'text-white bg-indigo-600 animate-pulse px-0.5 rounded';
              }

              return (
                <span key={index} className={charStyle}>
                  {char}
                </span>
              );
            })}
          </div>

          {/* User Input Input Field */}
          <div className="space-y-2">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Start typing here..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white font-mono text-base outline-none transition-all shadow-inner"
            />
            {errorIndex !== null && (
              <div className="flex items-center space-x-1.5 text-rose-400 text-xs font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Typo detected at position {errorIndex + 1}! Press backspace to correct.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
