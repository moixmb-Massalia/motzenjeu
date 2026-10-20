"use client";

import React, { useState, useEffect, useCallback } from 'react';
import LetterWheel from './LetterWheel';
import Grid, { GridWord } from './Grid';
import VictoryModal from './VictoryModal';
import ShopModal from './ShopModal';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/store/gameStore';
import { getWorldForLevel } from '@/lib/worlds';
import { adService } from '@/lib/ads';
import { sound } from '@/lib/audio';

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
  const {
    coins,
    currentLevel,
    spendCoins,
    addCoins,
    completeLevel,
    recordWordFound,
    bonusJarWords,
    bonusJarCapacity,
    claimBonusJar,
    settings,
  } = useGameStore();

  useEffect(() => {
    sound.setPreferences(settings.soundEnabled, settings.hapticsEnabled);
  }, [settings]);

  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' | 'bonus' } | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showVictory, setShowVictory] = useState(false);
  const [hasDoubledLevelCoins, setHasDoubledLevelCoins] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [isWatchingAdForHint, setIsWatchingAdForHint] = useState(false);

  // Current World / Wonder info
  const { world, levelInWorld } = getWorldForLevel(currentLevel);

  const loadLevel = useCallback(async (levelNumber: number) => {
    try {
      const { generateLevel } = await import('@/lib/level-generator');
      const { getMasterWordForLevel, DICTIONARY } = await import('@/lib/dictionary');

      const { masterWord, targetWordCount } = getMasterWordForLevel(levelNumber);
      const result = generateLevel(masterWord, DICTIONARY, targetWordCount);

      setLevelData({
        level: levelNumber,
        masterWord,
        ...result,
      });
      setFoundWords([]);
      setHasDoubledLevelCoins(false);
    } catch (e) {
      console.error('Failed to generate level', e);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    loadLevel(currentLevel);
  }, [currentLevel, loadLevel]);

  const showFeedback = (text: string, type: 'success' | 'error' | 'bonus') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 1800);
  };

  const handleWordComplete = (word: string) => {
    if (!levelData || word.length < 2) return;

    if (levelData.required_words.includes(word)) {
      if (foundWords.includes(word)) {
        sound.playWordError();
        showFeedback('Déjà trouvé !', 'error');
      } else {
        const newFound = [...foundWords, word];
        setFoundWords(newFound);
        recordWordFound(word, false);
        sound.playWordSuccess();
        showFeedback(`+10 🪙  ${word}`, 'success');

        if (newFound.length === levelData.required_words.length) {
          triggerLevelVictory();
        }
      }
    } else if (levelData.bonus_words.includes(word)) {
      if (!bonusJarWords.includes(word)) {
        recordWordFound(word, true);
        sound.playBonusSuccess();
        showFeedback(`Mot Bonus ! +5 🪙  ${word}`, 'bonus');
      } else {
        sound.playWordError();
        showFeedback('Bonus déjà trouvé !', 'error');
      }
    } else {
      sound.playWordError();
      showFeedback('Introuvable', 'error');
    }
  };

  const triggerLevelVictory = () => {
    sound.playVictoryFanfare();
    confetti({
      particleCount: 160,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#fbbf24'],
    });
    // Open the victory modal without wiping or flashing the screen
    setShowVictory(true);
  };

  const handleNextLevelFromModal = async () => {
    setShowVictory(false);

    // Show Interstitial ad if frequency condition is met
    if (adService.shouldShowInterstitial(currentLevel)) {
      await adService.showInterstitial();
    }

    // Complete level in state (advances currentLevel)
    completeLevel(hasDoubledLevelCoins ? 2 : 1);
  };

  const handleDoubleReward = () => {
    if (!hasDoubledLevelCoins) {
      addCoins(20); // Adds the other 20 to make +40
      setHasDoubledLevelCoins(true);
    }
  };

  const handleHint = async () => {
    if (!levelData) return;

    const unfound = levelData.required_words.filter((w) => !foundWords.includes(w));
    if (unfound.length === 0) return;

    // Check if player has enough coins or wants a rewarded ad
    if (coins < 25) {
      // Offer rewarded video for free hint
      setIsWatchingAdForHint(true);
      const res = await adService.showRewardedAd('free_hint');
      setIsWatchingAdForHint(false);

      if (res.rewarded) {
        revealWord(unfound[0]);
        showFeedback('Indice Débloqué via Pub ! 💡', 'success');
      }
      return;
    }

    if (spendCoins(25)) {
      revealWord(unfound[0]);
    }
  };

  const revealWord = (wordToReveal: string) => {
    sound.playCoinSound();
    const newFound = [...foundWords, wordToReveal];
    setFoundWords(newFound);
    showFeedback(`Indice : ${wordToReveal}`, 'success');

    if (newFound.length === levelData?.required_words.length) {
      triggerLevelVictory();
    }
  };

  const handleShuffle = () => {
    sound.playShuffleSound();
    if (levelData) {
      setLevelData({
        ...levelData,
        letters: [...levelData.letters].sort(() => 0.5 - Math.random()),
      });
    }
  };

  const handleClaimJar = () => {
    const reward = claimBonusJar();
    if (reward > 0) {
      sound.playCoinSound();
      showFeedback(`Bocal ouvert ! +${reward} 🪙`, 'success');
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.3 } });
    } else {
      showFeedback(`Bocal : ${bonusJarWords.length}/${bonusJarCapacity} mots`, 'bonus');
    }
  };

  // Safe initial loading only on very first cold start
  if (isInitializing || !levelData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-950 text-white p-6">
        <motion.div
          className="text-6xl mb-4"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          🌍
        </motion.div>
        <p className="font-black text-amber-400 text-lg">Préparation de votre voyage...</p>
      </div>
    );
  }

  const progress = foundWords.length / levelData.required_words.length;
  const isJarFull = bonusJarWords.length >= bonusJarCapacity;

  return (
    <div className={`relative flex flex-col items-center justify-between w-full max-w-md mx-auto min-h-screen p-4 pt-6 pb-8 bg-gradient-to-b ${world.theme.bgGradient} text-white select-none overflow-hidden transition-colors duration-700`}>
      {/* Rewarded Ad Hint Overlay */}
      {isWatchingAdForHint && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center text-center p-6">
          <div className="w-14 h-14 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-4" />
          <p className="text-xl font-black mb-1">Publicité Indice...</p>
          <p className="text-sm text-white/70">Votre indice gratuit sera dévoilé juste après !</p>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="w-full flex flex-col gap-2 z-10">
        <div className="w-full flex justify-between items-center">
          {/* Back button */}
          <button
            onClick={onBackToHome}
            className="bg-white/10 hover:bg-white/20 border border-white/10 px-3.5 py-1.5 rounded-full font-bold text-xs text-white/90 backdrop-blur-sm transition-all flex items-center gap-1 active:scale-95"
          >
            ← Quitter
          </button>

          {/* Wonder / Level Badge */}
          <div className="bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full font-black text-xs text-amber-300 backdrop-blur-sm flex items-center gap-1.5 shadow-sm">
            <span>{world.flag}</span>
            <span>Niv {currentLevel}</span>
            <span className="text-white/40">·</span>
            <span className="text-white/70 font-semibold">{levelInWorld}/{world.levelsCount}</span>
          </div>

          {/* Coins & Shop trigger */}
          <button
            onClick={() => setShowShop(true)}
            className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 px-3.5 py-1.5 rounded-full font-black text-xs text-amber-300 backdrop-blur-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <span>🪙</span>
            <span>{coins}</span>
            <span className="bg-amber-400 text-stone-950 rounded-full w-4 h-4 flex items-center justify-center text-[10px] ml-0.5">+</span>
          </button>
        </div>

        {/* Wonder Title Subtitle */}
        <div className="flex justify-between items-center px-1">
          <p className="text-xs font-bold text-white/70 tracking-wide">
            {world.monument}
          </p>

          {/* Bonus Jar Chest Trigger */}
          <button
            onClick={handleClaimJar}
            className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
              isJarFull
                ? 'bg-amber-400 text-stone-950 animate-bounce shadow-md shadow-amber-400/50'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <span>🏺</span>
            <span>{bonusJarWords.length}/{bonusJarCapacity}</span>
            {isJarFull && <span className="font-black text-[10px] uppercase ml-1">Ouvrir !</span>}
          </button>
        </div>

        {/* Level Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-200 rounded-full"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Crossword Grid */}
      <div className="flex-1 flex items-center justify-center w-full min-h-[220px] my-3 z-10">
        <Grid layout={levelData.layout} foundWords={foundWords} />
      </div>

      {/* Feedback Toast */}
      <div className="h-10 flex items-center justify-center mb-1 z-10">
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.85 }}
              className={`px-5 py-1.5 rounded-full font-black text-xs shadow-lg backdrop-blur-md ${
                feedback.type === 'success'
                  ? 'bg-emerald-500 text-white border border-emerald-400/40'
                  : feedback.type === 'error'
                  ? 'bg-rose-500 text-white border border-rose-400/40'
                  : 'bg-amber-400 text-stone-950 border border-amber-300'
              }`}
            >
              {feedback.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Letter Wheel (Words of Wonders Circle) */}
      <div className="my-2 z-10">
        <LetterWheel letters={levelData.letters} onWordComplete={handleWordComplete} />
      </div>

      {/* Bottom Power-Ups Bar (Shuffle & Hint) */}
      <div className="w-full flex justify-center items-center gap-6 mt-1 z-10">
        {/* Shuffle Button */}
        <motion.button
          onClick={handleShuffle}
          className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white shadow-lg flex items-center justify-center text-2xl backdrop-blur-sm active:scale-90 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          title="Mélanger les lettres"
        >
          🔀
        </motion.button>

        {/* Hint Button */}
        <motion.button
          onClick={handleHint}
          className={`h-14 px-6 rounded-full shadow-lg flex items-center gap-2.5 backdrop-blur-sm active:scale-95 transition-all ${
            coins >= 25
              ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 font-black'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Révéler un mot"
        >
          <span className="text-2xl">💡</span>
          <div className="text-left">
            <p className="text-xs font-black uppercase tracking-wider leading-none">Indice</p>
            <p className="text-[11px] opacity-90 leading-tight">
              {coins >= 25 ? '-25 🪙' : '🎬 Gratuit'}
            </p>
          </div>
        </motion.button>
      </div>

      {/* Victory Modal (Words of Wonders celebratory transition) */}
      <AnimatePresence>
        {showVictory && (
          <VictoryModal
            level={currentLevel}
            world={world}
            levelInWorld={levelInWorld}
            worldLevelsCount={world.levelsCount}
            isWorldCompleted={levelInWorld >= world.levelsCount}
            onNextLevel={handleNextLevelFromModal}
            onDoubleReward={handleDoubleReward}
            hasDoubled={hasDoubledLevelCoins}
          />
        )}
      </AnimatePresence>

      {/* Shop Modal */}
      {showShop && <ShopModal onClose={() => setShowShop(false)} />}
    </div>
  );
}
