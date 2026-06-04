import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  addDoc,
} from 'firebase/firestore';
import { db } from './client';

// ─────────────────────────────────────────────
// USER
// ─────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  username: string;
  coins: number;
  xp: number;
  playerLevel: number;
  currentLevel: number;
  totalWordsFound: number;
  totalBonusWords: number;
  dailyStreak: number;
  lastPlayedDate: string | null;
  isPremium: boolean;
  createdAt: unknown;
}

export async function createUserProfile(uid: string, username: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    uid,
    username,
    coins: 100,
    xp: 0,
    playerLevel: 1,
    currentLevel: 1,
    totalWordsFound: 0,
    totalBonusWords: 0,
    dailyStreak: 0,
    lastPlayedDate: null,
    isPremium: false,
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, data as Record<string, unknown>);
}

// ─────────────────────────────────────────────
// PLAYER PROGRESS
// ─────────────────────────────────────────────

export async function saveProgress(
  uid: string,
  levelId: number,
  foundWords: string[],
  completed: boolean
): Promise<void> {
  const progressRef = doc(db, 'progress', `${uid}_${levelId}`);
  await setDoc(progressRef, {
    uid,
    levelId,
    foundWords,
    completed,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// ─────────────────────────────────────────────
// BONUS WORDS
// ─────────────────────────────────────────────

export async function saveBonusWord(uid: string, word: string): Promise<void> {
  await addDoc(collection(db, 'bonusWords'), {
    uid,
    word,
    foundAt: serverTimestamp(),
  });
}

// ─────────────────────────────────────────────
// LEADERBOARD
// ─────────────────────────────────────────────

export async function getLeaderboard(limitCount = 10): Promise<UserProfile[]> {
  const q = query(
    collection(db, 'users'),
    orderBy('xp', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as UserProfile);
}

// ─────────────────────────────────────────────
// DAILY PUZZLE
// ─────────────────────────────────────────────

export async function getDailyCompletion(uid: string, date: string): Promise<boolean> {
  const ref = doc(db, 'dailyCompletions', `${uid}_${date}`);
  const snap = await getDoc(ref);
  return snap.exists();
}

export async function setDailyCompletion(uid: string, date: string): Promise<void> {
  const ref = doc(db, 'dailyCompletions', `${uid}_${date}`);
  await setDoc(ref, { uid, date, completedAt: serverTimestamp() });
}
