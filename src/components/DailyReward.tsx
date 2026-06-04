"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function DailyReward({ onClose }: { onClose: () => void }) {
  const { dailyStreak, addCoins, updateDailyStreak, achievements } = useGameStore();
  const [claimed, setClaimed] = useState(false);
  const [reward, setReward] = useState(0);

  useEffect(() => {
    updateDailyStreak();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rewardAmount = 50 + (dailyStreak - 1) * 10;

  const handleClaim = () => {
    addCoins(rewardAmount);
    setReward(rewardAmount);
    setClaimed(true);
  };

  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="flex flex-col w-full max-w-md mx-auto p-6 min-h-screen pt-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onClose} className="bg-white/80 p-3 rounded-full shadow-sm text-xl">←</button>
        <h2 className="text-3xl font-black">Récompenses</h2>
      </div>

      {/* Daily Streak Card */}
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 text-white mb-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="font-bold opacity-90">Série Quotidienne</p>
            <p className="text-5xl font-black">🔥 {dailyStreak}</p>
            <p className="opacity-80 text-sm">jours consécutifs</p>
          </div>
          <div className="text-right">
            <p className="opacity-80 text-sm">Récompense</p>
            <p className="text-4xl font-black">+{rewardAmount}🪙</p>
          </div>
        </div>

        {/* Days of week */}
        <div className="flex justify-between gap-1">
          {days.map((day, i) => (
            <div key={day} className={`flex-1 rounded-xl py-2 text-center text-xs font-bold
              ${i < dailyStreak ? 'bg-white/30' : 'bg-white/10'}`}>
              {i < dailyStreak ? '✅' : '○'}
              <div className="mt-1">{day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Claim Button */}
      <AnimatePresence>
        {!claimed ? (
          <motion.button
            onClick={handleClaim}
            className="w-full py-5 bg-gradient-to-r from-primary to-amber-400 text-white font-black text-xl rounded-2xl shadow-lg active:scale-95"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            🎁 Réclamez +{rewardAmount} pièces !
          </motion.button>
        ) : (
          <motion.div
            className="w-full py-5 bg-accent rounded-2xl text-white font-black text-xl text-center shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            🎉 +{reward} pièces ajoutées !
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievements */}
      <div className="mt-8">
        <h3 className="font-black text-xl mb-4">Succès</h3>
        <div className="flex flex-col gap-3">
          {achievements.map(a => (
            <div key={a.id} className={`flex items-center gap-4 p-4 rounded-2xl border
              ${a.unlocked ? 'bg-accent/10 border-accent/30' : 'bg-white/60 border-white/80'}`}>
              <span className="text-2xl">{a.unlocked ? '🏆' : '🔒'}</span>
              <div className="flex-1">
                <p className={`font-bold ${a.unlocked ? 'text-accent' : 'text-foreground/50'}`}>{a.name}</p>
                <p className="text-xs text-foreground/50">{a.description}</p>
              </div>
              {a.unlocked && <span className="text-accent font-black text-sm">✓</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
