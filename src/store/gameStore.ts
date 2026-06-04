import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

interface GameState {
  coins: number;
  xp: number;
  playerLevel: number;
  currentLevel: number;
  totalWordsFound: number;
  totalBonusWords: number;
  achievements: Achievement[];
  dailyStreak: number;
  lastPlayedDate: string | null;

  // Actions
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addXP: (amount: number) => void;
  completeLevel: () => void;
  recordWordFound: (isBonus: boolean) => void;
  checkAchievements: () => void;
  updateDailyStreak: () => void;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_word', name: 'Premier Mot', description: 'Trouver votre premier mot', unlocked: false },
  { id: 'word_100', name: 'Centurion', description: 'Trouver 100 mots', unlocked: false },
  { id: 'word_500', name: 'Maître des Mots', description: 'Trouver 500 mots', unlocked: false },
  { id: 'bonus_10', name: 'Chasseur de Bonus', description: 'Trouver 10 mots bonus', unlocked: false },
  { id: 'bonus_50', name: 'Expert Bonus', description: 'Trouver 50 mots bonus', unlocked: false },
  { id: 'level_10', name: 'Accro', description: 'Terminer 10 niveaux', unlocked: false },
  { id: 'level_50', name: 'Vétéran', description: 'Terminer 50 niveaux', unlocked: false },
  { id: 'streak_3', name: 'Sur un Roll', description: '3 jours consécutifs', unlocked: false },
  { id: 'streak_7', name: 'Semaine Parfaite', description: '7 jours consécutifs', unlocked: false },
];

const XP_PER_LEVEL = 100;

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      coins: 100,
      xp: 0,
      playerLevel: 1,
      currentLevel: 1,
      totalWordsFound: 0,
      totalBonusWords: 0,
      achievements: ACHIEVEMENTS,
      dailyStreak: 0,
      lastPlayedDate: null,

      addCoins: (amount) => set(state => ({ coins: state.coins + amount })),

      spendCoins: (amount) => {
        const { coins } = get();
        if (coins < amount) return false;
        set(state => ({ coins: state.coins - amount }));
        return true;
      },

      addXP: (amount) => {
        const { xp, playerLevel } = get();
        const newXP = xp + amount;
        const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
        set({ xp: newXP, playerLevel: Math.max(playerLevel, newLevel) });
      },

      completeLevel: () => {
        const { currentLevel } = get();
        set({ currentLevel: currentLevel + 1 });
        get().addXP(50);
        get().addCoins(20);
        get().checkAchievements();
      },

      recordWordFound: (isBonus) => {
        const state = get();
        const newTotal = state.totalWordsFound + 1;
        const newBonus = isBonus ? state.totalBonusWords + 1 : state.totalBonusWords;
        set({ totalWordsFound: newTotal, totalBonusWords: newBonus });
        get().addXP(10);
        if (isBonus) get().addCoins(5);
        else get().addCoins(10);
        get().checkAchievements();
      },

      checkAchievements: () => {
        const { totalWordsFound, totalBonusWords, currentLevel, dailyStreak, achievements } = get();
        const updated = achievements.map(a => {
          if (a.unlocked) return a;
          let unlocked = false;
          switch (a.id) {
            case 'first_word': unlocked = totalWordsFound >= 1; break;
            case 'word_100': unlocked = totalWordsFound >= 100; break;
            case 'word_500': unlocked = totalWordsFound >= 500; break;
            case 'bonus_10': unlocked = totalBonusWords >= 10; break;
            case 'bonus_50': unlocked = totalBonusWords >= 50; break;
            case 'level_10': unlocked = currentLevel >= 10; break;
            case 'level_50': unlocked = currentLevel >= 50; break;
            case 'streak_3': unlocked = dailyStreak >= 3; break;
            case 'streak_7': unlocked = dailyStreak >= 7; break;
          }
          return { ...a, unlocked };
        });
        set({ achievements: updated });
      },

      updateDailyStreak: () => {
        const { lastPlayedDate, dailyStreak } = get();
        const today = new Date().toISOString().split('T')[0];
        if (lastPlayedDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const newStreak = lastPlayedDate === yesterdayStr ? dailyStreak + 1 : 1;
        set({ dailyStreak: newStreak, lastPlayedDate: today });
        get().checkAchievements();
      },
    }),
    { name: 'word-game-storage' }
  )
);
