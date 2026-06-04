import { NextResponse } from 'next/server';
import { generateLevel } from '@/lib/level-generator';
import { readFileSync } from 'fs';
import path from 'path';

let cachedDictionary: string[] | null = null;

function loadDictionary(): string[] {
  if (cachedDictionary) return cachedDictionary;
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'dictionary_fr.txt');
    const content = readFileSync(filePath, 'utf-8');
    cachedDictionary = content
      .split('\n')
      .map(w => w.trim().toUpperCase())
      .filter(w => w.length >= 2 && /^[A-Z]+$/.test(w));
    return cachedDictionary;
  } catch {
    // Fallback dictionary if file not found
    return [
      "ROSE","OSE","OR","ORE","SOT","SOI","SOL","IL","OIE","SEL","LOI",
      "SOLEIL","SOIE","LOIS","SOLI","SOLE","LIEU","LIOU","ISLE","ELLE",
      "NATURE","NUE","RAT","TUE","UNE","ART","RATE","RATURE","ATURE","RANT","RANE","TARE","NATU",
      "JARDIN","JAR","JARD","ARD","DIN","RAND","JARD",
      "FLEUR","FLEURE","LEUR","FEU","FEU","LUE","FLEURI",
      "ARBRE","ARB","BARE","RABE","BREA","RABLE","ARBRE",
      "PLANTE","PLAN","ANT","ANTE","LAN","LANT","PLANE","PLATE","TALE",
      "MONDE","MON","NOME","DOME","DENOM","ONDE","NORME","MONDE",
      "FORET","FOR","ORE","FORE","FORTE","FROE","ROTE","TORE",
      "CARTE","CAR","RAT","ART","CARE","TARE","ECART","TRACE","CRATE",
      "BRAVE","BRA","BAR","BARE","RAVE","VERA","VERB","REVA","ARBE",
      "TABLE","BLE","ABL","BALE","ETAL","TALE","LABE","LABEL",
      "PIANO","IAN","ANE","PIN","PAIN","PIAN","NAPO","PANO","OPINA",
      "CHANT","CHA","HAN","ANT","CHAT","HANT","CANTH","TANCH","NATCH",
      "SOLDE","SOL","OLD","SOLE","ODES","DOLE","OLES","DOES","LODES",
      "BRISE","BRI","RIS","ISE","BRIE","RISE","RIBE","RIBE","IBIS",
      "CLAME","CAL","MAL","ALE","LAME","MALE","ALME","CAME","CALM",
      "GLAND","GLA","LAN","AND","GALE","LAND","DANG","LONG","GANG",
      "MELON","MEL","LON","ONE","MOLE","NOME","LONE","LEON","NOME",
      "VOILE","VOI","OIL","ILE","VOLE","OILE","LIVE","VIOL","VILE",
      "PLOMB","PLO","LOB","OMB","BLOB","LOBE","PLOB","BOLO","POLO",
      "RONDE","RON","OND","ONDE","NODE","DORE","DRONE","REND","NERD",
      "COMTE","COM","OTE","OME","MOTE","TOME","COME","TCOM","COMET",
      "PRISE","PRI","RIS","ISE","RIPE","PIER","IRES","PERI","ERIS",
      "BALAI","BAL","ALA","LAI","BAIL","BALI","ALIA","ALBA","BALE",
      "FAUVE","FAU","AUV","UVE","FAVE","VEAU","FEAU","VEUF","AVEU",
      "DROIT","DRO","ROI","OIT","DORI","TROD","TORI","TRIO","DROIT",
      "GLACE","GLA","LAC","ACE","CAGE","GALE","LACE","ECLA","EGAL",
      "TREVE","TRE","REV","EVE","EVER","TREE","VEER","VERT","REVE"
    ];
  }
}

const LEVEL_WORDS = [
  "SOLEIL", "NATURE", "FLEUR", "JARDIN", "ARBRE",
  "PLANTE", "MONDE", "FORET", "CARTE", "BRAVE",
  "TABLE", "PIANO", "CHANT", "SOLDE", "BRISE",
  "GLACE", "MELON", "VOILE", "RONDE", "PRISE",
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const levelParam = searchParams.get('level');
  const wordParam = searchParams.get('word');

  const dictionary = loadDictionary();

  let masterWord: string;
  if (wordParam) {
    masterWord = wordParam.toUpperCase();
  } else if (levelParam) {
    const levelIndex = (parseInt(levelParam) - 1) % LEVEL_WORDS.length;
    masterWord = LEVEL_WORDS[levelIndex];
  } else {
    masterWord = LEVEL_WORDS[0];
  }

  const level = generateLevel(masterWord, dictionary);

  return NextResponse.json({
    level: levelParam ? parseInt(levelParam) : 1,
    masterWord,
    ...level,
  });
}
