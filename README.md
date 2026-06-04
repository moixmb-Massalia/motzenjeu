# MotZen 🎮

Un jeu de mots inspiré de Wordscapes, Pro des Mots et Jardin des Mots.

## 🚀 Installation

```bash
# 1. Cloner le projet
cd word-game

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement
# Éditer .env.local avec vos clés Supabase

# 4. Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3001](http://localhost:3001)

---

## 🗄️ Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Dans **SQL Editor**, coller le contenu de `supabase/schema.sql`
3. Copier l'URL et la clé Anon dans `.env.local` :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJ...
```

---

## 📱 Déploiement Mobile (Capacitor)

### Android
```bash
npm run mobile:android
# Ouvre Android Studio → Build → Generate Signed APK
```

### iOS (macOS uniquement)
```bash
npm run mobile:ios
# Ouvre Xcode → Product → Archive
```

---

## 🌐 Déploiement Web (Vercel)

```bash
# Connecter le dépôt GitHub à Vercel
# Ajouter les variables d'environnement dans le dashboard Vercel
# Chaque push sur main déploie automatiquement
```

---

## 📁 Structure du Projet

```
src/
├── app/
│   ├── api/
│   │   ├── levels/route.ts      # Générateur de niveaux
│   │   ├── daily/route.ts       # Puzzle quotidien
│   │   └── leaderboard/route.ts # Classements
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── App.tsx                  # Routeur d'écrans
│   ├── HomeScreen.tsx           # Écran d'accueil
│   ├── GameBoard.tsx            # Plateau de jeu
│   ├── LetterWheel.tsx          # Roue des lettres
│   ├── Grid.tsx                 # Grille de mots croisés
│   ├── Leaderboard.tsx          # Classements
│   └── DailyReward.tsx          # Récompenses et succès
├── lib/
│   ├── level-generator.ts       # Algorithme de génération
│   └── supabase/client.ts       # Client Supabase
└── store/
    └── gameStore.ts             # État global (Zustand)

supabase/
└── schema.sql                   # Schéma complet PostgreSQL
```

---

## 🎮 Fonctionnalités

- ✅ Roue des lettres interactive (drag & swipe)
- ✅ Grille de mots croisés auto-générée
- ✅ Validation des mots en temps réel
- ✅ Mots bonus
- ✅ Système de pièces et XP persistant
- ✅ Indices (révèle un mot, -25 pièces)
- ✅ Mélange des lettres
- ✅ Animations et confettis de victoire
- ✅ Écran d'accueil avec profil joueur
- ✅ Classements (Mondial / Hebdo / Amis)
- ✅ Récompenses quotidiennes & série de jours
- ✅ Système de succès (9 badges)
- ✅ Puzzle quotidien (API /api/daily)
- ✅ Configuration Capacitor (iOS & Android)
- ✅ Schéma base de données Supabase complet
