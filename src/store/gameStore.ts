import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getWorldForLevel, WorldChapter } from '@/lib/worlds';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
}

interface GameState {
  coins: number;
  xp: number;
  playerLevel: number;
  currentLevel: number;
  totalWordsFound: number;
  totalBonusWords: number;
  bonusJarWords: string[];
  bonusJarCapacity: number;
  achievements: Achievement[];
  dailyStreak: number;
  lastPlayedDate: string | null;
  settings: GameSettings;
  unlockedMonuments: string[];

  // Actions
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addXP: (amount: number) => void;
  completeLevel: (bonusMultiplier?: number) => { coinsEarned: number; xpEarned: number; worldCompleted: boolean };
  recordWordFound: (word: string, isBonus: boolean) => void;
  claimBonusJar: () => number;
  checkAchievements: () => void;
  updateDailyStreak: () => void;
  updateSettings: (partial: Partial<GameSettings>) => void;
  getCurrentWorld: () => { world: WorldChapter; levelInWorld: number; progressPercent: number };
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_word', name: 'Premier Mot', description: 'Trouver votre premier mot', unlocked: false },
  { id: 'word_50', name: 'Explorateur', description: 'Trouver 50 mots', unlocked: false },
  { id: 'word_200', name: 'Centurion', description: 'Trouver 200 mots', unlocked: false },
  { id: 'word_500', name: 'Maître des Mots', description: 'Trouver 500 mots', unlocked: false },
  { id: 'bonus_10', name: 'Chasseur de Bonus', description: 'Remplir le bocal de mots bonus', unlocked: false },
  { id: 'world_paris', name: 'Parisian Zen', description: 'Compléter le chapitre de Paris', unlocked: false },
  { id: 'world_rome', name: 'Gladiateur', description: 'Compléter le Colisée de Rome', unlocked: false },
  { id: 'world_pyramids', name: 'Pharaon', description: 'Percer le secret des Pyramides', unlocked: false },
  { id: 'streak_3', name: 'Sur un Roll', description: '3 jours consécutifs', unlocked: false },
  { id: 'streak_7', name: 'Semaine Parfaite', description: '7 jours consécutifs', unlocked: false },
];

const XP_PER_LEVEL = 100;
const BONUS_JAR_MAX = 5;

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      coins: 150, // Starting gift
      xp: 0,
      playerLevel: 1,
      currentLevel: 1,
      totalWordsFound: 0,
      totalBonusWords: 0,
      bonusJarWords: [],
      bonusJarCapacity: BONUS_JAR_MAX,
      achievements: ACHIEVEMENTS,
      dailyStreak: 1,
      lastPlayedDate: null,
      settings: {
        soundEnabled: true,
        musicEnabled: true,
        hapticsEnabled: true,
      },
      unlockedMonuments: [],

      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),

      spendCoins: (amount) => {
        const { coins } = get();
        if (coins < amount) return false;
        set((state) => ({ coins: state.coins - amount }));
        return true;
      },

      addXP: (amount) => {
        const { xp, playerLevel } = get();
        const newXP = xp + amount;
        const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
        set({ xp: newXP, playerLevel: Math.max(playerLevel, newLevel) });
      },

      completeLevel: (bonusMultiplier = 1) => {
        const state = get();
        const baseCoins = 20;
        const baseXP = 50;
        const coinsEarned = baseCoins * bonusMultiplier;
        const xpEarned = baseXP;

        const currentWorldInfo = getWorldForLevel(state.currentLevel);
        const nextWorldInfo = getWorldForLevel(state.currentLevel + 1);
        const worldCompleted = currentWorldInfo.world.id !== nextWorldInfo.world.id;

        const nextLevel = state.currentLevel + 1;
        const unlocked = [...state.unlockedMonuments];
        if (worldCompleted && !unlocked.includes(currentWorldInfo.world.id)) {
          unlocked.push(currentWorldInfo.world.id);
        }

        set({
          currentLevel: nextLevel,
          coins: state.coins + coinsEarned,
          unlockedMonuments: unlocked,
        });

        get().addXP(xpEarned);
        get().checkAchievements();

        return { coinsEarned, xpEarned, worldCompleted };
      },

      recordWordFound: (word: string, isBonus: boolean) => {
        const state = get();
        const newTotal = state.totalWordsFound + 1;

        if (isBonus) {
          const newBonusWords = [...state.bonusJarWords];
          if (!newBonusWords.includes(word)) {
            newBonusWords.push(word);
          }
          set({
            totalWordsFound: newTotal,
            totalBonusWords: state.totalBonusWords + 1,
            bonusJarWords: newBonusWords,
          });
          get().addXP(15);
          get().addCoins(5);
        } else {
          set({ totalWordsFound: newTotal });
          get().addXP(10);
          get().addCoins(5);
        }
        get().checkAchievements();
      },

      claimBonusJar: () => {
        const state = get();
        if (state.bonusJarWords.length < state.bonusJarCapacity) return 0;
        const rewardCoins = 50;
        set({
          coins: state.coins + rewardCoins,
          bonusJarWords: [],
        });
        get().addXP(30);
        return rewardCoins;
      },

      checkAchievements: () => {
        const { totalWordsFound, totalBonusWords, currentLevel, dailyStreak, achievements, unlockedMonuments } = get();
        const updated = achievements.map((a) => {
          if (a.unlocked) return a;
          let unlock = false;
          if (a.id === 'first_word' && totalWordsFound >= 1) unlock = true;
          if (a.id === 'word_50' && totalWordsFound >= 50) unlock = true;
          if (a.id === 'word_200' && totalWordsFound >= 200) unlock = true;
          if (a.id === 'word_500' && totalWordsFound >= 500) unlock = true;
          if (a.id === 'bonus_10' && totalBonusWords >= 10) unlock = true;
          if (a.id === 'world_paris' && unlockedMonuments.includes('france')) unlock = true;
          if (a.id === 'world_rome' && unlockedMonuments.includes('italy')) unlock = true;
          if (a.id === 'world_pyramids' && unlockedMonuments.includes('egypt')) unlock = true;
          if (a.id === 'streak_3' && dailyStreak >= 3) unlock = true;
          if (a.id === 'streak_7' && dailyStreak >= 7) unlock = true;

          return unlock ? { ...a, unlocked: true } : a;
        });

        set({ achievements: updated });
      },

      updateDailyStreak: () => {
        const today = new Date().toDateString();
        const { lastPlayedDate, dailyStreak } = get();

        if (lastPlayedDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastPlayedDate === yesterday.toDateString()) {
          set({ dailyStreak: dailyStreak + 1, lastPlayedDate: today });
        } else {
          set({ dailyStreak: 1, lastPlayedDate: today });
        }
      },

      updateSettings: (partial) => {
        set((state) => ({
          settings: { ...state.settings, ...partial },
        }));
      },

      getCurrentWorld: () => {
        return getWorldForLevel(get().currentLevel);
      },
    }),
    {
      name: 'motzen-storage-v2',
    }
  )
);
