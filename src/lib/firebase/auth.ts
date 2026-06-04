"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { auth } from './client';
import { createUserProfile, getUserProfile } from './firestore';

// ─── Sign Up ───────────────────────────────
export async function signUp(email: string, password: string, username: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await createUserProfile(credential.user.uid, username);
  return credential.user;
}

// ─── Sign In ───────────────────────────────
export async function signIn(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

// ─── Google Sign In ────────────────────────
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  
  // Create profile if first time
  const existing = await getUserProfile(credential.user.uid);
  if (!existing) {
    const username = credential.user.displayName || `Joueur_${credential.user.uid.slice(0, 6)}`;
    await createUserProfile(credential.user.uid, username);
  }
  
  return credential.user;
}

// ─── Sign Out ──────────────────────────────
export async function signOut() {
  await firebaseSignOut(auth);
}

// ─── Auth State Listener ───────────────────
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
