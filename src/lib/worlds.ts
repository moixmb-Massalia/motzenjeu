export interface WorldChapter {
  id: string;
  name: string;
  country: string;
  monument: string;
  flag: string;
  startLevel: number;
  endLevel: number;
  levelsCount: number;
  description: string;
  theme: {
    bgGradient: string;
    cardBg: string;
    accentColor: string;
    wheelColor: string;
  };
}

export const WORLDS: WorldChapter[] = [
  {
    id: 'france',
    name: 'Paris',
    country: 'France',
    monument: 'La Tour Eiffel',
    flag: '🇫🇷',
    startLevel: 1,
    endLevel: 6,
    levelsCount: 6,
    description: 'Capitale des lumières et de la poésie.',
    theme: {
      bgGradient: 'from-amber-900/40 via-stone-900/60 to-slate-950',
      cardBg: 'bg-amber-950/40 border-amber-500/20',
      accentColor: '#f59e0b',
      wheelColor: 'from-amber-500/20 to-amber-600/30',
    },
  },
  {
    id: 'italy',
    name: 'Rome',
    country: 'Italie',
    monument: 'Le Colisée',
    flag: '🇮🇹',
    startLevel: 7,
    endLevel: 14,
    levelsCount: 8,
    description: 'La cité éternelle et ses arènes antiques.',
    theme: {
      bgGradient: 'from-orange-950/40 via-stone-900/60 to-slate-950',
      cardBg: 'bg-orange-950/40 border-orange-500/20',
      accentColor: '#fb923c',
      wheelColor: 'from-orange-500/20 to-orange-600/30',
    },
  },
  {
    id: 'egypt',
    name: 'Gizeh',
    country: 'Égypte',
    monument: 'Les Grandes Pyramides',
    flag: '🇪🇬',
    startLevel: 15,
    endLevel: 24,
    levelsCount: 10,
    description: 'Les gardiens mystiques du désert millénaire.',
    theme: {
      bgGradient: 'from-yellow-950/40 via-stone-900/60 to-slate-950',
      cardBg: 'bg-yellow-950/40 border-yellow-500/20',
      accentColor: '#eab308',
      wheelColor: 'from-yellow-500/20 to-yellow-600/30',
    },
  },
  {
    id: 'japan',
    name: 'Kyoto',
    country: 'Japon',
    monument: 'Le Mont Fuji & Pagodes',
    flag: '🇯🇵',
    startLevel: 25,
    endLevel: 36,
    levelsCount: 12,
    description: 'Sérénité zen sous les cerisiers en fleur.',
    theme: {
      bgGradient: 'from-rose-950/40 via-stone-900/60 to-slate-950',
      cardBg: 'bg-rose-950/40 border-rose-500/20',
      accentColor: '#f43f5e',
      wheelColor: 'from-rose-500/20 to-rose-600/30',
    },
  },
  {
    id: 'india',
    name: 'Agra',
    country: 'Inde',
    monument: 'Le Taj Mahal',
    flag: '🇮🇳',
    startLevel: 37,
    endLevel: 50,
    levelsCount: 14,
    description: 'Le joyau de marbre blanc de l’amour éternel.',
    theme: {
      bgGradient: 'from-teal-950/40 via-stone-900/60 to-slate-950',
      cardBg: 'bg-teal-950/40 border-teal-500/20',
      accentColor: '#14b8a6',
      wheelColor: 'from-teal-500/20 to-teal-600/30',
    },
  },
  {
    id: 'brazil',
    name: 'Rio de Janeiro',
    country: 'Brésil',
    monument: 'Le Christ Rédempteur',
    flag: '🇧🇷',
    startLevel: 51,
    endLevel: 68,
    levelsCount: 18,
    description: 'Baie étincelante et montagnes tropicales.',
    theme: {
      bgGradient: 'from-emerald-950/40 via-stone-900/60 to-slate-950',
      cardBg: 'bg-emerald-950/40 border-emerald-500/20',
      accentColor: '#10b981',
      wheelColor: 'from-emerald-500/20 to-emerald-600/30',
    },
  },
];

export function getWorldForLevel(level: number): {
  world: WorldChapter;
  levelInWorld: number;
  progressPercent: number;
} {
  // If beyond pre-configured worlds, calculate cyclic progression with scaled difficulty
  const totalConfiguredLevels = WORLDS[WORLDS.length - 1].endLevel;
  const normalizedLevel = ((level - 1) % totalConfiguredLevels) + 1;

  for (const world of WORLDS) {
    if (normalizedLevel >= world.startLevel && normalizedLevel <= world.endLevel) {
      const levelInWorld = normalizedLevel - world.startLevel + 1;
      const progressPercent = Math.round((levelInWorld / world.levelsCount) * 100);
      return { world, levelInWorld, progressPercent };
    }
  }

  // Fallback
  const defaultWorld = WORLDS[0];
  return { world: defaultWorld, levelInWorld: 1, progressPercent: 16 };
}
