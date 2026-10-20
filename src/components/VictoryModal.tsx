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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      {/* Rewarded Ad Countdown Overlay (if active) */}
      <AnimatePresence>
        {isWatchingAd && (
          <motion.div
            className="absolute inset-0 z-60 bg-black/90 flex flex-col items-center justify-center p-6 text-white text-center"
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
        className="w-full max-w-sm bg-gradient-to-b from-stone-900 to-stone-950 text-white rounded-3xl p-6 shadow-2xl border border-white/10 flex flex-col items-center text-center relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Glow Header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* Crown / Stars */}
        <motion.div
          className="text-5xl mb-2"
          animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🏆
        </motion.div>

        <h2 className="text-2xl font-black tracking-tight text-white mb-1">
          NIVEAU {level} COMPLÉTÉ !
        </h2>

        {/* Wonder World Progression Card */}
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 my-3 text-left">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {world.flag} {world.name}, {world.country}
            </span>
            <span className="text-xs font-bold text-white/60">
              {levelInWorld}/{worldLevelsCount}
            </span>
          </div>
          <p className="text-base font-extrabold text-white mb-2">{world.monument}</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ delay: 0.3, duration: 0.8 }}
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

        {/* Rewards earned */}
        <div className="flex justify-center gap-4 my-2">
          <div className="bg-amber-400/10 border border-amber-400/30 px-4 py-2 rounded-xl text-center">
            <span className="text-xl font-black text-amber-400">
              🪙 +{hasDoubled ? 40 : 20}
            </span>
            <p className="text-[10px] font-semibold text-amber-200/70 uppercase">Pièces</p>
          </div>
          <div className="bg-blue-400/10 border border-blue-400/30 px-4 py-2 rounded-xl text-center">
            <span className="text-xl font-black text-blue-400">+50</span>
            <p className="text-[10px] font-semibold text-blue-200/70 uppercase">XP</p>
          </div>
        </div>

        {/* Rewarded Video Ad CTA (Double reward) */}
        {!hasDoubled ? (
          <motion.button
            onClick={handleWatchAd}
            className="w-full py-3.5 px-4 my-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>🎬</span>
            <span>Regarder une pub pour doubler (+40 🪙)</span>
          </motion.button>
        ) : (
          <div className="my-2 py-2 text-xs font-bold text-amber-400 flex items-center gap-1">
            ✨ Gains doublés avec succès ! (+40 🪙)
          </div>
        )}

        {/* Next Level CTA */}
        <motion.button
          onClick={onNextLevel}
          className="w-full py-4 mt-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-base rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Niveau Suivant</span>
          <span>→</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
