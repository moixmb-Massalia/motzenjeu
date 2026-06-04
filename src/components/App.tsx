"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeScreen from '@/components/HomeScreen';
import GameBoard from '@/components/GameBoard';
import Leaderboard from '@/components/Leaderboard';
import DailyReward from '@/components/DailyReward';
import LoginScreen from '@/components/LoginScreen';

type Screen = 'login' | 'home' | 'game' | 'leaderboard' | 'rewards';

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');

  return (
    <div className="relative overflow-hidden min-h-screen">
      <AnimatePresence mode="wait">
        {screen === 'login' && (
          <motion.div key="login" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
            <LoginScreen onSuccess={() => setScreen('home')} />
          </motion.div>
        )}
        {screen === 'home' && (
          <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
            <HomeScreen
              onPlay={() => setScreen('game')}
              onLeaderboard={() => setScreen('leaderboard')}
              onRewards={() => setScreen('rewards')}
            />
          </motion.div>
        )}
        {screen === 'game' && (
          <motion.div key="game" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
            <GameBoard onBackToHome={() => setScreen('home')} />
          </motion.div>
        )}
        {screen === 'leaderboard' && (
          <motion.div key="leaderboard" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
            <Leaderboard onClose={() => setScreen('home')} />
          </motion.div>
        )}
        {screen === 'rewards' && (
          <motion.div key="rewards" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
            <DailyReward onClose={() => setScreen('home')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
