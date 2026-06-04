// Level Generator Algorithm
// This script contains the logic to generate a crossword grid from a master word.

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

// Helper to check if a word can be made from the available letters
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
  return dictionary.filter(
    word => word.length >= 2 && word.length <= masterWord.length && word !== masterWord && canFormWord(word, letters)
  );
}

// A simple crossword generator logic
export function generateGrid(words: string[]): GridWord[] | null {
  // Sort words by length descending
  const sortedWords = [...words].sort((a, b) => b.length - a.length);
  
  if (sortedWords.length === 0) return null;

  const layout: GridWord[] = [];
  
  // Place the first (longest) word horizontally at 0,0
  layout.push({
    word: sortedWords[0],
    x: 0,
    y: 0,
    direction: 'horizontal'
  });

  // Iteratively try to place remaining words
  for (let i = 1; i < sortedWords.length; i++) {
    const currentWord = sortedWords[i];
    let placed = false;

    // Try to intersect with already placed words
    for (const placedWord of layout) {
      if (placed) break;

      // Find common letters
      for (let j = 0; j < currentWord.length; j++) {
        const charToMatch = currentWord[j];
        const matchIndex = placedWord.word.indexOf(charToMatch);

        if (matchIndex !== -1) {
          // Found an intersection point. Calculate new coordinates.
          const isHorizontal = placedWord.direction === 'horizontal';
          const newDirection = isHorizontal ? 'vertical' : 'horizontal';
          
          let newX = isHorizontal ? placedWord.x + matchIndex : placedWord.x - j;
          let newY = isHorizontal ? placedWord.y - j : placedWord.y + matchIndex;

          // Check for collisions
          if (!checkCollision(currentWord, newX, newY, newDirection, layout)) {
            layout.push({
              word: currentWord,
              x: newX,
              y: newY,
              direction: newDirection
            });
            placed = true;
            break;
          }
        }
      }
    }
  }

  return layout;
}

// Check if placing a word at x,y collides with existing words
function checkCollision(
  word: string, 
  x: number, 
  y: number, 
  direction: 'horizontal' | 'vertical', 
  layout: GridWord[]
): boolean {
  // Create a map of filled cells
  const grid = new Map<string, string>();
  
  for (const w of layout) {
    for (let i = 0; i < w.word.length; i++) {
      const cx = w.direction === 'horizontal' ? w.x + i : w.x;
      const cy = w.direction === 'horizontal' ? w.y : w.y + i;
      grid.set(`${cx},${cy}`, w.word[i]);
    }
  }

  // Check the new word
  for (let i = 0; i < word.length; i++) {
    const cx = direction === 'horizontal' ? x + i : x;
    const cy = direction === 'horizontal' ? y : y + i;
    const cellKey = `${cx},${cy}`;

    if (grid.has(cellKey) && grid.get(cellKey) !== word[i]) {
      return true; // Collision!
    }
    
    // We should also ensure words don't directly touch side-by-side incorrectly, 
    // but for MVP, basic intersection checking is okay.
  }

  return false;
}

// Main generation function
export function generateLevel(masterWord: string, dictionary: string[]): GeneratedLevel {
  const subWords = findSubWords(masterWord, dictionary);
  
  // Pick a subset of words for the grid (e.g., up to 6 words)
  // In a real app, you'd filter out obscure words and select a good mix of lengths
  const targetWordCount = Math.min(6, subWords.length + 1);
  
  // Try to generate a valid grid
  let gridWords = [masterWord];
  let remainingWords = [...subWords].sort(() => 0.5 - Math.random());
  
  // Add subwords until we hit target or run out
  for (const word of remainingWords) {
    if (gridWords.length >= targetWordCount) break;
    gridWords.push(word);
  }

  const layout = generateGrid(gridWords);

  // The rest are bonus words
  const requiredWords = layout ? layout.map(l => l.word) : gridWords;
  const bonusWords = subWords.filter(w => !requiredWords.includes(w));

  // Scramble letters for the wheel
  const letters = masterWord.split('').sort(() => 0.5 - Math.random());

  return {
    letters,
    required_words: requiredWords,
    bonus_words: bonusWords,
    layout: layout || []
  };
}
