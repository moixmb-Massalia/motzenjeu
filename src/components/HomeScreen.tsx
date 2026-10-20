"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { getWorldForLevel } from '@/lib/worlds';
import ShopModal from './ShopModal';
import SettingsModal from './SettingsModal';

interface Props {
  onPlay: () => void;
  onLeaderboard: () => void;
  onRewards: () => void;
  onOpenLogin: () => void;
}

export default function HomeScreen({ onPlay, onLeaderboard, onRewards, onOpenLogin }: Props) {
  const { coins, playerLevel, xp, currentLevel, dailyStreak } = useGameStore();
  const [showShop, setShowShop] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { world, levelInWorld, progressPercent } = getWorldForLevel(currentLevel);
  const xpForNext = 100;
  const xpProgress = ((xp % xpForNext) / xpForNext) * 100;

  return (
    <div className={`flex flex-col items-center justify-between min-h-screen w-full max-w-md mx-auto p-5 pt-8 pb-8 bg-gradient-to-b ${world.theme.bgGradient} text-white select-none transition-colors duration-700`}>
      
      {/* Top Bar: Profile & Coins & Settings */}
      <div className="w-full flex justify-between items-center z-10">
        {/* XP Level pill */}
        <div className="bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-sm">
          <span className="text-base">🌟</span>
          <span className="text-xs font-black">Niv {playerLevel}</span>
        </div>

        {/* Coins button opening Shop */}
        <button
          onClick={() => setShowShop(true)}
          className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 px-3.5 py-1.5 rounded-full font-black text-xs text-amber-300 backdrop-blur-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <span>🪙</span>
          <span>{coins}</span>
          <span className="bg-amber-400 text-stone-950 rounded-full w-4 h-4 flex items-center justify-center text-[10px] ml-0.5 font-black">+</span>
        </button>

        {/* Settings button */}
        <button
          onClick={() => setShowSettings(true)}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-sm backdrop-blur-sm active:scale-95 transition-all"
        >
          ⚙️
        </button>
      </div>

      {/* Main Branding Logo & Title */}
      <motion.div
        className="flex flex-col items-center text-center my-4 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-6xl mb-2 drop-shadow-lg"
          animate={{ rotate: [0, 4, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          🌍
        </motion.div>
        <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-md">
          Mot<span className="text-amber-400">Zen</span>
        </h1>
        <p className="text-xs text-white/70 font-semibold tracking-wide uppercase mt-1">
          Le Voyage des Mots
        </p>
      </motion.div>

      {/* Words of Wonders: Active Chapter & Monument Card */}
      <motion.div
        className="w-full bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/15 shadow-2xl z-10 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>{world.flag}</span>
              <span>{world.name}, {world.country}</span>
            </span>
            <h2 className="text-xl font-black text-white mt-0.5">{world.monument}</h2>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-white/60">Étape</span>
            <p className="text-base font-black text-amber-300">
              {levelInWorld} <span className="text-xs text-white/40">/ {world.levelsCount}</span>
            </p>
          </div>
        </div>

        <p className="text-xs text-white/70 italic mb-4">
          &ldquo;{world.description}&rdquo;
        </p>

        {/* Progress Bar in current Wonder */}
        <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10 mb-2">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-white/50 font-semibold">
          <span>Niveau {currentLevel} en cours</span>
          <span>{progressPercent}% complété</span>
        </div>
      </motion.div>

      {/* Primary Action Button (Play level) */}
      <div className="w-full flex flex-col gap-3 my-4 z-10">
        <motion.button
          onClick={onPlay}
          className="w-full py-5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-950 font-black text-xl rounded-2xl shadow-xl shadow-amber-500/30 active:scale-95 flex items-center justify-center gap-3 transition-transform"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-2xl">🎮</span>
          <span>JOUER — NIVEAU {currentLevel}</span>
        </motion.button>

        {/* Secondary Navigation Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <motion.button
            onClick={() => setShowShop(true)}
            className="py-3 px-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl flex flex-col items-center gap-1 backdrop-blur-sm active:scale-95 transition-all"
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">🎬</span>
            <span className="text-[11px] font-black text-amber-300">Pub Gratuite</span>
            <span className="text-[9px] text-white/60">+50 🪙</span>
          </motion.button>

          <motion.button
            onClick={onRewards}
            className="py-3 px-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl flex flex-col items-center gap-1 backdrop-blur-sm active:scale-95 transition-all"
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">🎁</span>
            <span className="text-[11px] font-black text-white">Cadeau</span>
            <span className="text-[9px] text-amber-400">🔥 {dailyStreak}j</span>
          </motion.button>

          <motion.button
            onClick={onLeaderboard}
            className="py-3 px-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl flex flex-col items-center gap-1 backdrop-blur-sm active:scale-95 transition-all"
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">🏆</span>
            <span className="text-[11px] font-black text-white">Classement</span>
            <span className="text-[9px] text-white/60">Mondial</span>
          </motion.button>
        </div>
      </div>

      {/* Footer XP bar */}
      <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-2.5 px-3 z-10">
        <div className="flex justify-between items-center text-[10px] text-white/60 font-bold mb-1">
          <span>Niveau Joueur {playerLevel}</span>
          <span>{xp % xpForNext} / {xpForNext} XP</span>
        </div>
        <div className="w-full bg-black/30 h-1.5 rounded-full overflow-hidden">
          <div className="bg-blue-400 h-full rounded-full" style={{ width: `${xpProgress}%` }} />
        </div>
      </div>

      {/* Shop Modal */}
      {showShop && <ShopModal onClose={() => setShowShop(false)} />}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onOpenLogin={onOpenLogin}
        />
      )}
    </div>
  );
}
