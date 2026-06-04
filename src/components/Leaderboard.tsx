"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function Leaderboard({ onClose }: { onClose: () => void }) {
  const { playerLevel, xp, currentLevel, totalWordsFound } = useGameStore();

  // Mock leaderboard data
  const players = [
    { rank: 1, name: 'Sophie L.', xp: 4850, level: 49, flag: '🇫🇷' },
    { rank: 2, name: 'Marc D.', xp: 4120, level: 42, flag: '🇨🇦' },
    { rank: 3, name: 'Elena K.', xp: 3900, level: 39, flag: '🇧🇪' },
    { rank: 4, name: 'Vous', xp, level: currentLevel, flag: '⭐', isMe: true },
    { rank: 5, name: 'Jules B.', xp: 1200, level: 13, flag: '🇫🇷' },
    { rank: 6, name: 'Amina S.', xp: 980, level: 10, flag: '🇲🇦' },
    { rank: 7, name: 'Pierre T.', xp: 750, level: 8, flag: '🇫🇷' },
  ].sort((a, b) => b.xp - a.xp).map((p, i) => ({ ...p, rank: i + 1 }));

  const medalColors = ['🥇', '🥈', '🥉'];

  return (
    <div className="flex flex-col w-full max-w-md mx-auto p-6 min-h-screen pt-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onClose} className="bg-white/80 p-3 rounded-full shadow-sm text-xl">←</button>
        <h2 className="text-3xl font-black">Classement</h2>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/50 rounded-xl p-1 mb-6 gap-1">
        {['Mondial', 'Hebdo', 'Amis'].map((tab, i) => (
          <button
            key={tab}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${i === 0 ? 'bg-primary text-white shadow-sm' : 'text-foreground/60'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end gap-4 mb-8">
        {players.slice(0, 3).map((player, i) => (
          <motion.div
            key={player.name}
            className={`flex flex-col items-center ${i === 0 ? 'order-2' : i === 1 ? 'order-1' : 'order-3'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="text-3xl mb-1">{player.flag}</span>
            <div className={`rounded-t-2xl flex flex-col items-center justify-end pb-3 px-4 pt-6 font-bold text-white
              ${i === 0 ? 'h-24 bg-gradient-to-t from-amber-500 to-yellow-400 w-24' :
                i === 1 ? 'h-16 bg-gradient-to-t from-slate-400 to-slate-300 w-20' :
                'h-12 bg-gradient-to-t from-amber-700 to-amber-600 w-20'}
            `}>
              <span className="text-2xl">{medalColors[i]}</span>
              <span className="text-xs mt-1">{player.name.split(' ')[0]}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full List */}
      <div className="flex flex-col gap-3">
        {players.map((player, i) => (
          <motion.div
            key={player.name}
            className={`flex items-center gap-4 p-4 rounded-2xl shadow-sm border
              ${player.isMe
                ? 'bg-primary/10 border-primary/30'
                : 'bg-white/80 border-white'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="w-8 text-center font-black text-foreground/50 text-lg">
              {i < 3 ? medalColors[i] : `#${player.rank}`}
            </span>
            <span className="text-2xl">{player.flag}</span>
            <div className="flex-1">
              <p className={`font-bold ${player.isMe ? 'text-primary' : ''}`}>{player.name}</p>
              <p className="text-xs text-foreground/50">Niv. jeu {player.level}</p>
            </div>
            <div className="text-right">
              <p className="font-black text-foreground">{player.xp.toLocaleString()}</p>
              <p className="text-xs text-foreground/50">XP</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
