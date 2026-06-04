"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signIn, signUp, signInWithGoogle } from '@/lib/firebase/auth';

interface Props {
  onSuccess: () => void;
}

export default function LoginScreen({ onSuccess }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, username);
      }
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      if (msg.includes('email-already-in-use')) setError('Email déjà utilisé');
      else if (msg.includes('wrong-password') || msg.includes('invalid-credential')) setError('Email ou mot de passe incorrect');
      else if (msg.includes('weak-password')) setError('Mot de passe trop court (6 caractères min)');
      else setError('Une erreur est survenue, réessayez');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      onSuccess();
    } catch {
      setError('Connexion Google échouée');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-md mx-auto p-6">
      {/* Logo */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-6xl mb-3">💬</div>
        <h1 className="text-4xl font-black">Mot<span className="text-primary">Zen</span></h1>
        <p className="text-foreground/50 mt-1">Connectez-vous pour sauvegarder votre progression</p>
      </motion.div>

      {/* Google Button */}
      <motion.button
        onClick={handleGoogle}
        disabled={loading}
        className="w-full py-4 bg-white border-2 border-gray-200 rounded-2xl font-bold text-foreground shadow-sm flex items-center justify-center gap-3 hover:border-primary/50 transition-colors mb-6 disabled:opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c3 0 5.8 1.1 7.9 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.7-3-11.9-7.3l-6.6 5C9.5 39.6 16.3 44 24 44z"/>
          <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.6 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-4z"/>
        </svg>
        Continuer avec Google
      </motion.button>

      <div className="w-full flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-foreground/40 text-sm">ou</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Pseudo (ex: SuperJoueur42)"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="w-full px-4 py-4 bg-white border-2 border-gray-100 rounded-2xl font-medium focus:outline-none focus:border-primary transition-colors"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-4 py-4 bg-white border-2 border-gray-100 rounded-2xl font-medium focus:outline-none focus:border-primary transition-colors"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full px-4 py-4 bg-white border-2 border-gray-100 rounded-2xl font-medium focus:outline-none focus:border-primary transition-colors"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-primary to-amber-400 text-white font-black text-lg rounded-2xl shadow-lg disabled:opacity-50 active:scale-95 transition-transform"
        >
          {loading ? '...' : mode === 'login' ? '🔑 Se connecter' : '🎮 Créer mon compte'}
        </button>
      </motion.form>

      {/* Toggle Mode */}
      <button
        onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); }}
        className="mt-6 text-foreground/50 text-sm hover:text-primary transition-colors"
      >
        {mode === 'login' ? "Pas encore de compte ? → Créer un compte" : "Déjà un compte ? → Se connecter"}
      </button>

      {/* Skip */}
      <button
        onClick={onSuccess}
        className="mt-3 text-foreground/30 text-xs hover:text-foreground/50 transition-colors"
      >
        Jouer sans compte (progression non sauvegardée)
      </button>
    </div>
  );
}
