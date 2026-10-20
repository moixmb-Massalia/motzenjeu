"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeScreen from '@/components/HomeScreen';
import GameBoard from '@/components/GameBoard';
import Leaderboard from '@/components/Leaderboard';
import DailyReward from '@/components/DailyReward';
import LoginScreen from '@/components/LoginScreen';

type Screen = 'home' | 'game' | 'leaderboard' | 'rewards' | 'login';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};

export default function App() {
  // Start on 'home' directly (zero friction guest play, Words of Wonders style)
  const [screen, setScreen] = useState<Screen>('home');

  return (
    <div className="relative overflow-hidden min-h-screen bg-stone-950">
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <motion.div
            key="home"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <HomeScreen
              onPlay={() => setScreen('game')}
              onLeaderboard={() => setScreen('leaderboard')}
              onRewards={() => setScreen('rewards')}
              onOpenLogin={() => setScreen('login')}
            />
          </motion.div>
        )}

        {screen === 'game' && (
          <motion.div
            key="game"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <GameBoard onBackToHome={() => setScreen('home')} />
          </motion.div>
        )}

        {screen === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <Leaderboard onClose={() => setScreen('home')} />
          </motion.div>
        )}

        {screen === 'rewards' && (
          <motion.div
            key="rewards"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <DailyReward onClose={() => setScreen('home')} />
          </motion.div>
        )}

        {screen === 'login' && (
          <motion.div
            key="login"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <LoginScreen onSuccess={() => setScreen('home')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
