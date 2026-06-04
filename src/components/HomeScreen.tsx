"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface Props {
  onPlay: () => void;
  onLeaderboard: () => void;
  onRewards: () => void;
}

export default function HomeScreen({ onPlay, onLeaderboard, onRewards }: Props) {
  const { coins, playerLevel, xp, currentLevel, dailyStreak } = useGameStore();
  const xpForNext = 100;
  const xpProgress = (xp % xpForNext) / xpForNext * 100;

  return (
    <div className="flex flex-col items-center justify-between min-h-screen w-full max-w-md mx-auto p-6 pt-12 pb-10">
      
      {/* Logo & Title */}
      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="text-7xl mb-2">💬</div>
        <h1 className="text-5xl font-black tracking-tight text-foreground">
          Mot<span className="text-primary">Zen</span>
        </h1>
        <p className="text-foreground/60 text-base font-medium">Trouve les mots cachés</p>
      </motion.div>

      {/* Player Card */}
      <motion.div
        className="w-full bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-xl border border-white mt-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-xs text-foreground/50 font-semibold uppercase tracking-wider">Niveau Joueur</p>
            <p className="text-3xl font-black text-foreground">{playerLevel}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-foreground/50 font-semibold uppercase tracking-wider">Pièces</p>
            <p className="text-3xl font-black text-primary">🪙 {coins}</p>
          </div>
        </div>
        {/* XP Bar */}
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-amber-300 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </div>
        <p className="text-xs text-foreground/40 mt-1">{xp % xpForNext}/{xpForNext} XP pour le prochain niveau</p>

        {/* Stats Row */}
        <div className="flex justify-around mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-black text-foreground">{currentLevel}</p>
            <p className="text-xs text-foreground/50">Niveau Jeu</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-accent">🔥 {dailyStreak}</p>
            <p className="text-xs text-foreground/50">Jours Consécutifs</p>
          </div>
        </div>
      </motion.div>

      {/* Main Buttons */}
      <div className="w-full flex flex-col gap-4 mt-6">
        <motion.button
          onClick={onPlay}
          className="w-full py-5 bg-gradient-to-r from-primary to-amber-400 text-white font-black text-2xl rounded-2xl shadow-lg shadow-primary/30 active:scale-95 flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          🎮 Jouer — Niveau {currentLevel}
        </motion.button>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🏆', label: 'Classement', action: onLeaderboard },
            { icon: '🎁', label: 'Récompenses', action: onRewards },
            { icon: '⚙️', label: 'Paramètres', action: () => {} },
          ].map((item, i) => (
            <motion.button
              key={item.label}
              onClick={item.action}
              className="py-4 bg-white/80 backdrop-blur-sm rounded-2xl font-bold text-sm text-foreground shadow-sm border border-white flex flex-col items-center gap-2 active:scale-95"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">{item.icon}</span>
              {item.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Daily Reward Banner */}
      {dailyStreak > 0 && (
        <motion.div
          className="w-full bg-gradient-to-r from-accent to-emerald-400 rounded-2xl p-4 mt-4 flex items-center gap-4 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <span className="text-3xl">🎁</span>
          <div>
            <p className="font-black">Récompense quotidienne</p>
            <p className="text-sm opacity-90">Série de {dailyStreak} jours ! Réclamez vos pièces.</p>
          </div>
          <button className="ml-auto bg-white/30 px-3 py-1 rounded-lg font-bold text-sm">
            +50 🪙
          </button>
        </motion.div>
      )}

      <p className="text-foreground/30 text-xs mt-6">MotZen v1.0 · Made with ❤️</p>
    </div>
  );
}
