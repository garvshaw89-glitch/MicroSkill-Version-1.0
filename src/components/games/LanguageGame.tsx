import React, { useState, useEffect } from 'react';
import { GameItem, GameType } from '../../types';
import { soundFx } from '../../lib/audio';
import { Volume2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

interface LanguageGameProps {
  gameType: GameType;
  items: GameItem[];
  difficulty: number;
  soundEnabled: boolean;
  onItemCompleted: (wasCorrect: boolean, responseTimeMs: number) => void;
  onSessionFinish: () => void;
}

export const LanguageGame: React.FC<LanguageGameProps> = ({
  gameType,
  items,
  difficulty,
  soundEnabled,
  onItemCompleted,
  onSessionFinish,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [assembledSentence, setAssembledSentence] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    setStartTime(Date.now());
    setSelectedAnswer(null);
    setAssembledSentence([]);
  }, [currentIndex]);

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 font-mono text-sm bg-slate-900 border border-slate-800 rounded-2xl p-6">
        Loading language engine items...
      </div>
    );
  }

  const currentItem = items[currentIndex] || items[0];

  const speakPrompt = () => {
    const lang = currentItem.typeMetadata?.language || 'es-ES';
    soundFx.speakText(currentItem.prompt, lang);
  };

  const handleSelectOption = (option: string) => {
    setSelectedAnswer(option);
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

  // Phrase Builder: Tap tile to assemble sentence
  const handleAddWordTile = (word: string) => {
    setAssembledSentence((prev) => [...prev, word]);
  };

  const handleRemoveWordTile = (index: number) => {
    setAssembledSentence((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitAssembledPhrase = () => {
    const responseTimeMs = Date.now() - startTime;
    const targetArr = Array.isArray(currentItem.correctAnswer) ? currentItem.correctAnswer : [currentItem.correctAnswer];
    const isCorrect = JSON.stringify(assembledSentence) === JSON.stringify(targetArr);

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
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <span>Language Session • Item {currentIndex + 1} / {items.length}</span>
        <span className="text-sky-400">Fluency Target: Tier B</span>
      </div>

      {gameType === 'phrase_builder' ? (
        /* Phrase Builder Mode */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Phrase Builder • Construct Target Sentence
            </span>
            <h3 className="text-lg font-bold text-white">{currentItem.prompt}</h3>
          </div>

          {/* Assembled Sentence Box */}
          <div className="min-h-[70px] bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap gap-2 items-center">
            {assembledSentence.length === 0 ? (
              <span className="text-xs font-mono text-slate-600">Tap words below to assemble your response...</span>
            ) : (
              assembledSentence.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRemoveWordTile(idx)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-rose-600 text-white font-mono text-sm font-semibold transition-all shadow-md"
                >
                  {word} ×
                </button>
              ))
            )}
          </div>

          {/* Available Word Pool */}
          <div className="flex flex-wrap gap-2 pt-2">
            {currentItem.options?.map((word, idx) => (
              <button
                key={idx}
                onClick={() => handleAddWordTile(word)}
                className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500 text-slate-200 font-mono text-sm font-medium transition-all"
              >
                {word}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmitAssembledPhrase}
            disabled={assembledSentence.length === 0}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg transition-all disabled:opacity-50"
          >
            Verify Sentence Construction
          </button>
        </div>
      ) : (
        /* Translation Match / Conversation Snippet / Vocabulary Duel */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              {gameType === 'conversation_snippet' ? 'Conversation Snippet' : 'Receptive Fluency Match'}
            </span>

            <button
              onClick={speakPrompt}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-sky-600 text-sky-300 hover:text-white transition-all text-xs font-mono"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen Audio</span>
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">
              {currentItem.prompt}
            </h3>
            {currentItem.subPrompt && (
              <p className="text-xs font-mono text-slate-400">{currentItem.subPrompt}</p>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3">
            {currentItem.options?.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOpt = option === currentItem.correctAnswer;
              let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-sky-500';

              if (selectedAnswer) {
                if (isCorrectOpt) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold';
                }
              }

              return (
                <button
                  key={option}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleSelectOption(option)}
                  className={`p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{option}</span>
                  {selectedAnswer && isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {selectedAnswer && isSelected && !isCorrectOpt && <XCircle className="w-5 h-5 text-rose-400" />}
                </button>
              );
            })}
          </div>

          {selectedAnswer && currentItem.explanation && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-sky-400 font-mono">Pragmatic Note:</span>
              <p>{currentItem.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
