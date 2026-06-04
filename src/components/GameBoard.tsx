"use client";

import React, { useState, useEffect } from 'react';
import LetterWheel from './LetterWheel';
import Grid, { GridWord } from './Grid';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/store/gameStore';

interface LevelData {
  level: number;
  masterWord: string;
  letters: string[];
  required_words: string[];
  bonus_words: string[];
  layout: GridWord[];
}

interface Props {
  onBackToHome: () => void;
}

export default function GameBoard({ onBackToHome }: Props) {
  const { coins, currentLevel, spendCoins, completeLevel, recordWordFound, addCoins } = useGameStore();
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ text: string, type: 'success' | 'error' | 'bonus' } | null>(null);
  const [loading, setLoading] = useState(true);
  const [levelComplete, setLevelComplete] = useState(false);
  const [bonusWordsList, setBonusWordsList] = useState<string[]>([]);

  const fetchLevel = async (level: number) => {
    setLoading(true);
    setLevelComplete(false);
    try {
      const res = await fetch(`/api/levels?level=${level}`);
      const data: LevelData = await res.json();
      setLevelData(data);
      setFoundWords([]);
    } catch (e) {
      console.error("Failed to load level", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevel(currentLevel);
  }, [currentLevel]);

  const handleWordComplete = (word: string) => {
    if (!levelData || word.length < 2) return;

    if (levelData.required_words.includes(word)) {
      if (foundWords.includes(word)) {
        showFeedback('Déjà trouvé !', 'error');
      } else {
        const newFound = [...foundWords, word];
        setFoundWords(newFound);
        recordWordFound(false);
        showFeedback(`+10 🪙  ${word}`, 'success');

        if (newFound.length === levelData.required_words.length) {
          handleLevelComplete();
        }
      }
    } else if (levelData.bonus_words.includes(word)) {
      if (!bonusWordsList.includes(word)) {
        setBonusWordsList(prev => [...prev, word]);
        recordWordFound(true);
        showFeedback(`Bonus ! +5 🪙  ${word}`, 'bonus');
      } else {
        showFeedback('Déjà trouvé !', 'error');
      }
    } else {
      showFeedback('Introuvable', 'error');
    }
  };

  const handleLevelComplete = () => {
    setLevelComplete(true);
    confetti({
      particleCount: 200,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#a78bfa']
    });
    setTimeout(() => {
      completeLevel();
      setBonusWordsList([]);
      fetchLevel(currentLevel + 1);
    }, 2500);
  };

  const handleHint = () => {
    if (!levelData) return;
    if (!spendCoins(25)) {
      showFeedback("Pas assez de pièces !", 'error');
      return;
    }
    const unfound = levelData.required_words.filter(w => !foundWords.includes(w));
    if (unfound.length > 0) {
      const wordToReveal = unfound[0];
      const newFound = [...foundWords, wordToReveal];
      setFoundWords(newFound);
      showFeedback(`Indice ! ${wordToReveal}`, 'success');
      if (newFound.length === levelData.required_words.length) {
        handleLevelComplete();
      }
    }
  };

  const handleShuffle = () => {
    if (levelData) {
      setLevelData({ ...levelData, letters: [...levelData.letters].sort(() => 0.5 - Math.random()) });
    }
  };

  const showFeedback = (text: string, type: 'success' | 'error' | 'bonus') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 1800);
  };

  if (loading || !levelData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <motion.div
          className="text-6xl"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          💬
        </motion.div>
        <p className="font-bold text-primary animate-pulse text-lg">Génération du niveau...</p>
      </div>
    );
  }

  const progress = foundWords.length / levelData.required_words.length;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4 min-h-screen pt-6 pb-8">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-4">
        <button 
          onClick={onBackToHome}
          className="bg-white/80 px-4 py-2 rounded-full font-bold text-foreground/60 shadow-sm hover:bg-white transition-colors flex items-center gap-1"
        >
          ← Accueil
        </button>
        <div className="bg-white/80 px-4 py-2 rounded-full font-black text-primary shadow-sm flex items-center gap-1">
          🌟 Niv {currentLevel}
        </div>
        <div className="bg-white/80 px-4 py-2 rounded-full font-black text-accent shadow-sm flex items-center gap-1">
          🪙 {coins}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/50 rounded-full h-2 mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-amber-300 rounded-full"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Grid */}
      <div className="flex-1 flex items-center justify-center w-full min-h-[250px] my-4">
        <Grid layout={levelData.layout} foundWords={foundWords} />
      </div>

      {/* Bonus Words */}
      {bonusWordsList.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-2 justify-center mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {bonusWordsList.map(w => (
            <span key={w} className="bg-accent/20 text-accent font-bold px-3 py-1 rounded-full text-sm">
              {w}
            </span>
          ))}
        </motion.div>
      )}

      {/* Feedback Toast */}
      <div className="h-12 flex items-center justify-center mb-2">
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.85 }}
              className={`px-6 py-2 rounded-full font-bold text-white shadow-lg text-sm
                ${feedback.type === 'success' ? 'bg-primary' :
                  feedback.type === 'error' ? 'bg-red-400' : 'bg-accent'}`}
            >
              {feedback.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Level Complete Overlay */}
      <AnimatePresence>
        {levelComplete && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 text-center shadow-2xl mx-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <div className="text-6xl mb-3">🎉</div>
              <h2 className="text-3xl font-black text-foreground mb-2">Niveau Terminé !</h2>
              <p className="text-foreground/60 mb-4">+50 XP · +20 🪙</p>
              <div className="animate-pulse text-primary font-bold">Niveau suivant en cours...</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter Wheel */}
      <div className="my-4">
        <LetterWheel letters={levelData.letters} onWordComplete={handleWordComplete} />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-2">
        <button
          onClick={handleShuffle}
          className="bg-white/80 p-4 rounded-full shadow-md text-xl hover:bg-white transition-colors active:scale-95"
          title="Mélanger"
        >
          🔀
        </button>
        <button
          onClick={handleHint}
          className="bg-white/80 px-5 py-4 rounded-full shadow-md text-sm font-bold hover:bg-white transition-colors flex items-center gap-2 active:scale-95"
          title="Indice (-25 pièces)"
        >
          💡 Indice <span className="text-primary font-black">-25🪙</span>
        </button>
      </div>
    </div>
  );
}
