"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorldChapter } from '@/lib/worlds';
import { adService } from '@/lib/ads';

interface Props {
  level: number;
  world: WorldChapter;
  levelInWorld: number;
  worldLevelsCount: number;
  isWorldCompleted: boolean;
  onNextLevel: () => void;
  onDoubleReward: () => void;
  hasDoubled: boolean;
}

export default function VictoryModal({
  level,
  world,
  levelInWorld,
  worldLevelsCount,
  isWorldCompleted,
  onNextLevel,
  onDoubleReward,
  hasDoubled,
}: Props) {
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(3);

  const handleWatchAd = async () => {
    if (hasDoubled || isWatchingAd) return;
    setIsWatchingAd(true);

    const result = await adService.showRewardedAd(
      'double_level',
      () => {},
      (secondsLeft) => setAdCountdown(secondsLeft)
    );

    setIsWatchingAd(false);
    if (result.rewarded) {
      onDoubleReward();
    }
  };

  const progressPct = Math.min(100, Math.round((levelInWorld / worldLevelsCount) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 overflow-y-auto">
      {/* Rewarded Ad Countdown Overlay (if active) */}
      <AnimatePresence>
        {isWatchingAd && (
          <motion.div
            className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-6 text-white text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-4" />
            <p className="text-xl font-black mb-1">Publicité Sponsorisée...</p>
            <p className="text-sm text-white/70 mb-4">Récompense dans {adCountdown} seconde{adCountdown > 1 ? 's' : ''}</p>
            <div className="w-48 bg-white/20 h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-amber-400 h-full"
                animate={{ width: `${((3 - adCountdown) / 3) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="w-full max-w-sm bg-gradient-to-b from-stone-900 to-stone-950 text-white rounded-3xl p-6 shadow-2xl border border-amber-400/30 flex flex-col items-center text-center relative overflow-hidden my-auto"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Glow Header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* Trophée animé */}
        <motion.div
          className="text-6xl mb-1"
          animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          🏆
        </motion.div>

        {/* Félicitations Banner */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-xs uppercase tracking-widest mb-1.5"
        >
          <span>✨</span>
          <span>FÉLICITATIONS !</span>
          <span>✨</span>
        </motion.div>

        <h2 className="text-2xl font-black tracking-tight text-white mb-2">
          NIVEAU {level} RÉUSSI !
        </h2>

        {/* Wonder World Progression Card */}
        <div className="w-full bg-stone-800/80 border border-white/10 rounded-2xl p-4 my-2 text-left">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {world.flag} {world.name}, {world.country}
            </span>
            <span className="text-xs font-black text-white/70">
              {levelInWorld}/{worldLevelsCount}
            </span>
          </div>
          <p className="text-base font-extrabold text-white mb-2">{world.monument}</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ delay: 0.2, duration: 0.8 }}
            />
          </div>

          {isWorldCompleted && (
            <motion.div
              className="mt-3 p-2.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 rounded-xl text-center text-xs font-black text-amber-300 flex items-center justify-center gap-1.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              🎉 Merveille Terminée ! Nouveau Chapitre Débloqué !
            </motion.div>
          )}
        </div>

        {/* Récompenses gagnées */}
        <div className="flex justify-center gap-3 my-2 w-full">
          <div className="flex-1 bg-amber-400/10 border border-amber-400/30 py-2.5 px-3 rounded-2xl text-center">
            <span className="text-xl font-black text-amber-400">
              🪙 +{hasDoubled ? 40 : 20}
            </span>
            <p className="text-[10px] font-semibold text-amber-200/80 uppercase tracking-wide">Pièces</p>
          </div>
          <div className="flex-1 bg-blue-400/10 border border-blue-400/30 py-2.5 px-3 rounded-2xl text-center">
            <span className="text-xl font-black text-blue-400">+50</span>
            <p className="text-[10px] font-semibold text-blue-200/80 uppercase tracking-wide">XP</p>
          </div>
        </div>

        {/* Bouton Pub Récompensée (Doubler les pièces) */}
        {!hasDoubled ? (
          <motion.button
            onClick={handleWatchAd}
            className="w-full py-3.5 px-4 my-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>🎬</span>
            <span>Doubler les gains (+40 🪙)</span>
          </motion.button>
        ) : (
          <div className="my-1.5 py-1.5 text-xs font-bold text-amber-400 flex items-center justify-center gap-1">
            ✨ Gains doublés avec succès ! (+40 🪙)
          </div>
        )}

        {/* Bouton Principal : Niveau Suivant (C'est le joueur qui décide !) */}
        <motion.button
          onClick={onNextLevel}
          className="w-full py-4 mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2.5"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>NIVEAU SUIVANT</span>
          <span className="text-lg">➔</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
