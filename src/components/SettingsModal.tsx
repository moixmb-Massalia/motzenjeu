"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useAuth } from '@/context/AuthContext';
import { signInWithGoogle, signOut } from '@/lib/firebase/auth';

interface Props {
  onClose: () => void;
  onOpenLogin: () => void;
}

export default function SettingsModal({ onClose, onOpenLogin }: Props) {
  const { settings, updateSettings, currentLevel } = useGameStore();
  const { user } = useAuth();
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleGoogleSync = async () => {
    try {
      setSyncStatus('Connexion...');
      await signInWithGoogle();
      setSyncStatus('Progression synchronisée avec succès !');
      setTimeout(() => setSyncStatus(null), 3000);
    } catch {
      setSyncStatus('Échec de la connexion');
      setTimeout(() => setSyncStatus(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        className="w-full max-w-sm bg-gradient-to-b from-stone-900 to-stone-950 text-white rounded-3xl p-6 shadow-2xl border border-white/10 flex flex-col relative"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>⚙️</span>
            <span>Paramètres</span>
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-white/70"
          >
            ✕
          </button>
        </div>

        {/* Audio & Haptic Toggles */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-2xl">
            <span className="text-sm font-bold flex items-center gap-2">
              <span>🔊</span> Effets Sonores
            </span>
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                settings.soundEnabled ? 'bg-amber-500' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-2xl">
            <span className="text-sm font-bold flex items-center gap-2">
              <span>🎵</span> Musique Zen
            </span>
            <button
              onClick={() => updateSettings({ musicEnabled: !settings.musicEnabled })}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                settings.musicEnabled ? 'bg-amber-500' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-2xl">
            <span className="text-sm font-bold flex items-center gap-2">
              <span>📳</span> Vibrations
            </span>
            <button
              onClick={() => updateSettings({ hapticsEnabled: !settings.hapticsEnabled })}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                settings.hapticsEnabled ? 'bg-amber-500' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.hapticsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Cloud Save & Account Section */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-6">
          <p className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-1">
            Sauvegarde Cloud
          </p>
          {user ? (
            <div>
              <p className="text-sm font-semibold text-white">Connecté en tant que :</p>
              <p className="text-xs text-white/60 truncate mb-3">{user.email || 'Joueur Google'}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-emerald-400 font-bold">☁️ Progression synchronisée</span>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-white/70 mb-3">
                Joueur Invité (Niv {currentLevel}). Connectez-vous pour ne jamais perdre votre progression !
              </p>
              {syncStatus && (
                <p className="text-xs text-amber-300 font-bold mb-2">{syncStatus}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleGoogleSync}
                  className="flex-1 py-2.5 bg-white text-stone-900 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>G</span>
                  <span>Google</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenLogin();
                  }}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 active:scale-95"
                >
                  Email
                </button>
              </div>
            </div>
          )}
        </div>

        {/* App Info Footer */}
        <div className="text-center text-[11px] text-white/40 space-y-1">
          <p>MotZen – v1.0.0 (Build 100)</p>
          <p>Tous droits réservés © 2026</p>
        </div>
      </motion.div>
    </div>
  );
}
