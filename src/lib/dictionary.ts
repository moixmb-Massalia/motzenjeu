// Tiered Master Words by Difficulty & Length (Words of Wonders scale)

export interface LevelTierConfig {
  minLevel: number;
  maxLevel: number;
  letterCount: number;
  targetWordCount: number;
  words: string[];
}

export const LEVEL_TIERS: LevelTierConfig[] = [
  // 🟢 PALIERS DÉBUTANT (Niveaux 1 à 4) — 3 lettres (2 à 3 mots simples)
  {
    minLevel: 1,
    maxLevel: 4,
    letterCount: 3,
    targetWordCount: 3,
    words: ["LAC", "EAU", "CAR", "SOL", "NID", "BAL", "VIE", "AIR", "RUE", "RAT"]
  },

  // 🟡 PALIER FACILE (Niveaux 5 à 14) — 4 lettres (3 à 4 mots)
  {
    minLevel: 5,
    maxLevel: 14,
    letterCount: 4,
    targetWordCount: 4,
    words: ["RIVE", "VENT", "ROSE", "LION", "CHAT", "PAIN", "PONT", "LUNE", "ROUE", "VOIE", "ACTE", "PAGE"]
  },

  // 🟠 PALIER INTERMÉDIAIRE (Niveaux 15 à 35) — 5 lettres (4 à 5 mots)
  {
    minLevel: 15,
    maxLevel: 35,
    letterCount: 5,
    targetWordCount: 5,
    words: ["FLEUR", "TABLE", "ARBRE", "FORET", "MONDE", "BRAVE", "CHANT", "SOLDE", "BRISE", "GLACE", "MELON", "VOILE", "RONDE", "PRISE", "BALAI", "DROIT", "TREVE", "PLOMB"]
  },

  // 🔴 PALIER AVANCÉ (Niveaux 36 à 75) — 6 lettres (5 à 6 mots)
  {
    minLevel: 36,
    maxLevel: 75,
    letterCount: 6,
    targetWordCount: 6,
    words: ["SOLEIL", "JARDIN", "NATURE", "PLANTE", "VOYAGE", "SOURCE", "TEMPLE", "TRESOR", "SECRET", "HEROS", "PALAIS", "PARFUM", "SAMBA", "LAGUNE"]
  },

  // 🟣 PALIER EXPERT (Niveaux 76 à 140) — 7 lettres (6 à 7 mots)
  {
    minLevel: 76,
    maxLevel: 140,
    letterCount: 7,
    targetWordCount: 7,
    words: ["SILENCE", "LUMIERE", "RIVIERE", "HORIZON", "PAPILLON", "MEMOIRE", "VALEUR", "DESTIN", "FORTUNE", "COURAGE", "VICTOIRE", "SAGESSE", "CARNAVAL", "MUSIQUE", "CHALEUR", "PASSION", "LIBERTE", "BONHEUR", "ENERGIE"]
  },

  // 👑 PALIER MAÎTRE & INFINI (Niveaux 141+) — 8 à 9 lettres (7 à 8 mots)
  {
    minLevel: 141,
    maxLevel: 999999,
    letterCount: 8,
    targetWordCount: 8,
    words: ["PRINTEMPS", "AVENTURE", "HORIZONS", "MYSTERES", "CASCADES", "TROPICAL", "HARMONIE", "SYMPHONIE", "FANTAISIE"]
  }
];

export function getTierForLevel(level: number): LevelTierConfig {
  for (const tier of LEVEL_TIERS) {
    if (level >= tier.minLevel && level <= tier.maxLevel) {
      return tier;
    }
  }
  return LEVEL_TIERS[LEVEL_TIERS.length - 1];
}

export function getMasterWordForLevel(level: number): { masterWord: string; targetWordCount: number } {
  const tier = getTierForLevel(level);
  // Pick deterministic word based on level number
  const index = (level - tier.minLevel) % tier.words.length;
  const masterWord = tier.words[index];
  return {
    masterWord,
    targetWordCount: tier.targetWordCount
  };
}

// Complete dictionary with all valid sub-words
export const DICTIONARY: string[] = [
  // 3-letter roots
  "LAC","CAL","A","LA",
  "EAU","A","EU",
  "CAR","ARC","ART","RA",
  "SOL","OS","LO","LOI",
  "NID","ID","IN",
  "BAL","LA","BA",
  "VIE","VI","VE",
  "AIR","RA","AI",
  "RUE","RE","EU",
  "RAT","TA","RA","ART",

  // 4-letter roots
  "RIVE","RIV","VIE","IRE","RI","RE",
  "VENT","NET","VEN","ET","EN",
  "ROSE","ORE","OSE","SORE","EROS","OS","RE",
  "LION","LOI","ION","OIL","NOI","IL","ON",
  "CHAT","TACH","ACT","HA","AH",
  "PAIN","PIN","PAI","ANI","PI","IN",
  "PONT","TON","POT","TOP","ON",
  "LUNE","NUE","LUE","UN","LE",
  "ROUE","ORE","ROU","EU","RE",
  "VOIE","VOI","VIE","OIE","VE",
  "ACTE","TAC","ACE","CET","TE",
  "PAGE","AGE","GAP","GA","PE",

  // 5-letter roots
  "FLEUR","LEUR","FEU","LUE","FEL","FER","RU",
  "TABLE","BLE","BALE","ETAL","LABE","PLAT","BATE",
  "ARBRE","ARB","BARE","RABE","RARE","BARRE","BAR",
  "FORET","FOR","ORE","FORTE","ROTE","TORE","FORT","FER",
  "MONDE","MON","DOME","ONDE","NODE","NOME","MODE","NOM",
  "BRAVE","BRA","BAR","RAVE","VERA","VERB","BAVE",
  "CHANT","CHA","HAN","CHAT","HANT","TACH",
  "SOLDE","OLD","ODES","DOLE","DOES","DOSE","SOLE","SOL",
  "BRISE","BRI","RIS","ISE","BRIE","RISE","SIRE","BIS",
  "GLACE","LAC","ACE","CAGE","GALE","LACE","CALE","AIL",
  "MELON","MEL","LON","ONE","MOLE","LEON","NOM",
  "VOILE","VOI","OIL","ILE","VOLE","LIVE","VIOL","VILE","LOI","VIE",
  "RONDE","RON","OND","DORE","DRONE","REND","NERD","RODE",
  "PRISE","PRI","RIPE","PIER","IRES","PERI","PIS","PRE","PIE",
  "BALAI","BAL","ALA","LAI","BAIL","BALI","ALBA","BALE",
  "DROIT","DRO","ROI","OIT","TORI","TRIO","TOI","DIT","TIR",
  "TREVE","TRE","REV","EVE","EVER","TREE","VEER","VERT","REVE",
  "PLOMB","PLO","LOB","BLOB","LOBE","POLO",

  // 6-letter roots
  "SOLEIL","SOL","IL","OIE","SEL","LOI","SOLE","LIEU","SOIE","LOIS","ELLE",
  "JARDIN","JAR","DIN","ARD","RAND","RADIN","AIR","NID",
  "NATURE","NUE","RAT","TUE","UNE","ART","RATE","TARE","EAU","RUE",
  "PLANTE","PLAN","ANT","ANTE","LAN","PLANE","PLATE","PLAT",
  "VOYAGE","VOIE","GAVE","YOGA","PAGE","AGE","AVE","GAIE",
  "SOURCE","COUR","OURS","ROUE","CROC","CURE","SUCE","COEUR",
  "TEMPLE","PELE","MELE","TELE","PETE","MLET",
  "TRESOR","ROSE","SORE","ROTE","TORE","SORT","EROS","REST",
  "SECRET","CRETE","SERE","CREE","STER","CERE",
  "HEROS","HOR","OSE","SORE","EROS","HERO",
  "PALAIS","PAIS","AILE","PALE","SALI","PLAI","AILS","LAIS",
  "PARFUM","PAR","FAP","RAMP","PURA",
  "SAMBA","BAM","MAS","BAS","ABA",
  "LAGUNE","LUNE","LUE","NUE","GAU","GLU","ALU",

  // 7-letter roots
  "SILENCE","CIEL","LIES","CLIN","LINE","SCIE","NILS","CILS","LICE","SEIN","LIEN",
  "LUMIERE","MIE","LIRE","MURE","LEUR","RELU","RIME","LIME","MIER","MULE",
  "RIVIERE","RIVE","VIRE","RIER","IRIE","VRAI","REVIR",
  "HORIZON","HOR","ZON","NOIR","RHIN","ZINC","COIN","HORN",
  "PAPILLON","PAIN","PION","POIL","LION","PLAN","PAON","LINO","PILA",
  "MEMOIRE","MIME","MOIRE","RIME","ORME","MORE","EMIR",
  "VALEUR","LAVE","VEAU","VRAI","RAVE","LEUR","LARE",
  "DESTIN","DENT","SIED","TEND","NIDS","TINE","DEST",
  "FORTUNE","NOTE","FONT","TOUR","FOND","ROUE","FROT","TUNE",
  "COURAGE","CAGE","ORAGE","GARE","ROUE","COUR","ORAL","PAGE",
  "VICTOIRE","VOIR","CITE","CROT","ROTE","TIRE","ECRIT",
  "SAGESSE","SAGE","ASSE","SASS","AGES",
  "CARNAVAL","CRAVAN","VAL","CANA","LAVA","RANA","ARAC",
  "MUSIQUE","MUSE","QUI","SUE","MEU","SMI","SEUM",
  "CHALEUR","HURE","HALE","LACE","LEUR","RUE","EAU","ARC",
  "PASSION","PAIS","POIS","SOIN","PAON","SIAP","SION",
  "LIBERTE","BRIE","TIRE","LITE","BIRE","ELIT","TIR","BLE",
  "BONHEUR","NOUR","ROBE","BRUN","BOEU","ROUE","HUE",
  "ENERGIE","REIN","GENE","GRIN","GRIE","GIRE","RENE",

  // 8-9 letter roots
  "PRINTEMPS","PRINT","TEMPS","PRISE","MINES","PISTE","PRIME","REMIS","SIRE","PINS",
  "AVENTURE","VENT","RUE","EAU","RATE","REVA","RAVE","TUE","VERT","NEVE",
  "HORIZONS","HORIZON","SOIR","RHIN","NOIR","ZINC","SOIN","ROSH",
  "MYSTERES","MYSTE","RESTE","SERRE","STER","TERRE","METS","MERE",
  "CASCADES","CADE","CASA","CASE","SACA","SACS","DACE","SECA",
  "TROPICAL","PORT","CLAP","PLOT","COAL","TROP","TARI","PAIL",
  "HARMONIE","MAIN","RAMI","HORN","MIEN","NOIR","HERO","MORA",
  "SYMPHONIE","SHIN","SPIN","POIS","PION","MINS","PINE","MOIS",
  "FANTAISIE","FAIT","NAIT","TASI","SAIN","TANI","FASI","SAIE"
];
