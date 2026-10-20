"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { adService } from '@/lib/ads';

interface Props {
  onClose: () => void;
}

export default function ShopModal({ onClose }: Props) {
  const { coins, addCoins } = useGameStore();
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(3);
  const [claimFeedback, setClaimFeedback] = useState<string | null>(null);

  const handleWatchAdForCoins = async () => {
    if (isWatchingAd) return;
    setIsWatchingAd(true);

    const result = await adService.showRewardedAd(
      'shop_coins',
      () => {},
      (secondsLeft) => setAdCountdown(secondsLeft)
    );

    setIsWatchingAd(false);
    if (result.rewarded) {
      addCoins(50);
      setClaimFeedback('+50 🪙 ajoutées à votre solde !');
      setTimeout(() => setClaimFeedback(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      {/* Rewarded Ad Countdown Overlay */}
      <AnimatePresence>
        {isWatchingAd && (
          <motion.div
            className="absolute inset-0 z-60 bg-black/90 flex flex-col items-center justify-center p-6 text-white text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-4" />
            <p className="text-xl font-black mb-1">Lecture de la publicité...</p>
            <p className="text-sm text-white/70 mb-4">Récompense dans {adCountdown}s</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="w-full max-w-sm bg-gradient-to-b from-stone-900 to-stone-950 text-white rounded-3xl p-6 shadow-2xl border border-white/10 flex flex-col items-center relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
      >
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪙</span>
            <span className="text-xl font-black">{coins} Pièces</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-white/70"
          >
            ✕
          </button>
        </div>

        <h3 className="text-2xl font-black mb-1">Boutique Pièces</h3>
        <p className="text-xs text-white/60 mb-4 text-center">
          Obtenez des pièces pour débloquer des indices quand vous êtes bloqué !
        </p>

        {claimFeedback && (
          <div className="w-full py-2 mb-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-center text-xs font-bold text-amber-300">
            {claimFeedback}
          </div>
        )}

        {/* Free Coins via Video Ad Card */}
        <div className="w-full p-4 bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-yellow-500/10 border-2 border-amber-400/30 rounded-2xl mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎬</div>
            <div className="text-left">
              <p className="text-base font-black text-amber-300">Vidéo Gratuite</p>
              <p className="text-xs text-white/60">+50 pièces immédiates</p>
            </div>
          </div>
          <button
            onClick={handleWatchAdForCoins}
            disabled={isWatchingAd}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-black text-xs rounded-xl shadow-md active:scale-95 transition-transform"
          >
            Regarder
          </button>
        </div>

        {/* Coin Packs */}
        <div className="w-full space-y-2 mb-4">
          {[
            { coins: 250, price: '0,99 €', badge: 'Populaire', icon: '💰' },
            { coins: 750, price: '2,49 €', badge: 'Meilleur Choix', icon: '💎' },
            { coins: 2000, price: '4,99 €', badge: 'Ultra Zen', icon: '👑' },
          ].map((pack) => (
            <div
              key={pack.coins}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{pack.icon}</span>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">{pack.coins} Pièces</p>
                  <span className="text-[10px] text-amber-400 font-semibold">{pack.badge}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  addCoins(pack.coins);
                  setClaimFeedback(`+${pack.coins} 🪙 ajoutées ! (Mode Démo)`);
                  setTimeout(() => setClaimFeedback(null), 3000);
                }}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl active:scale-95 transition-transform"
              >
                {pack.price}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-white/10 text-white/80 font-bold text-sm rounded-xl hover:bg-white/20 transition-colors"
        >
          Fermer
        </button>
      </motion.div>
    </div>
  );
}
