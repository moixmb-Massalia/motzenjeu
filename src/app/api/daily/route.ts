import { NextResponse } from 'next/server';
import { generateLevel } from '@/lib/level-generator';

const DAILY_WORDS = [
  "SOLEIL", "JARDIN", "NATURE", "FLEUR", "ARBRE",
  "PLANTE", "FORET", "MONDE", "LUMIERE", "PRINTEMPS",
  "RIVIERE", "MONTAGNE", "OISEAU", "PAPILLON", "NUAGE",
  "CHANSON", "COULEUR", "VOYAGE", "HORIZON", "SILENCE"
];

const FALLBACK_DICTIONARY = [
  "SOLEIL","SOL","IL","OIE","SEL","LOI","SOLE","LIEU","SOLI",
  "JARDIN","JAR","DIN","ARD","JARD","RAND",
  "NATURE","NUE","RAT","TUE","UNE","ART","RATE","RATURE","TARE","RANT",
  "FLEUR","LEUR","FEU","LUE","FEL",
  "ARBRE","ARB","BARE","RABE","BREA",
  "PLANTE","PLAN","ANT","ANTE","LAN","PLANE","PLATE",
  "FORET","FOR","ORE","FORE","FORTE","ROTE","TORE","FORT",
  "MONDE","MON","DOME","ONDE","NODE","NOME",
];

export async function GET() {
  // Use the day of the year as a seed to pick a consistent daily word
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  const masterWord = DAILY_WORDS[dayOfYear % DAILY_WORDS.length];
  const level = generateLevel(masterWord, FALLBACK_DICTIONARY);

  return NextResponse.json({
    date: now.toISOString().split('T')[0],
    masterWord,
    ...level,
  });
}
