// Level Generator Algorithm
// Generates a connected crossword grid with scaling difficulty based on level tier

export interface GridWord {
  word: string;
  x: number;
  y: number;
  direction: 'horizontal' | 'vertical';
}

export interface GeneratedLevel {
  letters: string[];
  required_words: string[];
  bonus_words: string[];
  layout: GridWord[];
}

// Helper to check if a word can be formed from available letters
export function canFormWord(word: string, availableLetters: string[]): boolean {
  const letters = [...availableLetters];
  for (const char of word) {
    const index = letters.indexOf(char);
    if (index === -1) return false;
    letters.splice(index, 1);
  }
  return true;
}

// Find all sub-words from a master word
export function findSubWords(masterWord: string, dictionary: string[]): string[] {
  const letters = masterWord.split('');
  return Array.from(
    new Set(
      dictionary.filter(
        (word) =>
          word.length >= 2 &&
          word.length <= masterWord.length &&
          word !== masterWord &&
          canFormWord(word, letters)
      )
    )
  );
}

// Crossword generator logic
export function generateGrid(words: string[]): GridWord[] {
  const sortedWords = [...words].sort((a, b) => b.length - a.length);
  if (sortedWords.length === 0) return [];

  const layout: GridWord[] = [];

  // Place first (longest) word horizontally at (0, 0)
  layout.push({
    word: sortedWords[0],
    x: 0,
    y: 0,
    direction: 'horizontal',
  });

  // Iteratively try to intersect remaining words
  for (let i = 1; i < sortedWords.length; i++) {
    const currentWord = sortedWords[i];
    let placed = false;

    for (const placedWord of layout) {
      if (placed) break;

      for (let j = 0; j < currentWord.length; j++) {
        const charToMatch = currentWord[j];
        const matchIndex = placedWord.word.indexOf(charToMatch);

        if (matchIndex !== -1) {
          const isHorizontal = placedWord.direction === 'horizontal';
          const newDirection = isHorizontal ? 'vertical' : 'horizontal';

          const newX = isHorizontal ? placedWord.x + matchIndex : placedWord.x - j;
          const newY = isHorizontal ? placedWord.y - j : placedWord.y + matchIndex;

          if (!checkCollision(currentWord, newX, newY, newDirection, layout)) {
            layout.push({
              word: currentWord,
              x: newX,
              y: newY,
              direction: newDirection,
            });
            placed = true;
            break;
          }
        }
      }
    }

    // Fallback: if no intersection found, place parallel with safe offset
    if (!placed) {
      const last = layout[layout.length - 1];
      const fallbackY = last.y + (last.direction === 'vertical' ? last.word.length + 1 : 2);
      layout.push({
        word: currentWord,
        x: 0,
        y: fallbackY,
        direction: 'horizontal',
      });
    }
  }

  return layout;
}

// Check for collisions between cells
function checkCollision(
  word: string,
  x: number,
  y: number,
  direction: 'horizontal' | 'vertical',
  layout: GridWord[]
): boolean {
  const grid = new Map<string, string>();

  for (const w of layout) {
    for (let i = 0; i < w.word.length; i++) {
      const cx = w.direction === 'horizontal' ? w.x + i : w.x;
      const cy = w.direction === 'horizontal' ? w.y : w.y + i;
      grid.set(`${cx},${cy}`, w.word[i]);
    }
  }

  for (let i = 0; i < word.length; i++) {
    const cx = direction === 'horizontal' ? x + i : x;
    const cy = direction === 'horizontal' ? y : y + i;
    const cellKey = `${cx},${cy}`;

    if (grid.has(cellKey) && grid.get(cellKey) !== word[i]) {
      return true; // Letter mismatch collision
    }
  }

  return false;
}

// Main generation function with difficulty scaling
export function generateLevel(
  masterWord: string,
  dictionary: string[],
  targetWordCount: number = 5
): GeneratedLevel {
  const subWords = findSubWords(masterWord, dictionary);

  const gridWords: string[] = [masterWord];
  const shuffledSubWords = [...subWords].sort(() => 0.5 - Math.random());

  for (const w of shuffledSubWords) {
    if (gridWords.length >= targetWordCount) break;
    gridWords.push(w);
  }

  const layout = generateGrid(gridWords);
  const requiredWords = layout.map((l) => l.word);
  const bonusWords = subWords.filter((w) => !requiredWords.includes(w));

  // Scramble letters for the wheel
  const letters = masterWord.split('').sort(() => 0.5 - Math.random());

  return {
    letters,
    required_words: requiredWords,
    bonus_words: bonusWords,
    layout,
  };
}
