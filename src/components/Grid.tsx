"use client";

import React from 'react';
import { motion } from 'framer-motion';

export interface GridWord {
  word: string;
  x: number;
  y: number;
  direction: 'horizontal' | 'vertical';
}

interface GridProps {
  layout: GridWord[];
  foundWords: string[];
}

export default function Grid({ layout, foundWords }: GridProps) {
  // Determine grid dimensions
  let minX = 0, maxX = 0, minY = 0, maxY = 0;

  layout.forEach(({ word, x, y, direction }) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    if (direction === 'horizontal') {
      maxX = Math.max(maxX, x + word.length - 1);
      maxY = Math.max(maxY, y);
    } else {
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y + word.length - 1);
    }
  });

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  // Responsive cell size calculation so grids fit neatly
  const maxDim = Math.max(width, height);
  const cellSize = maxDim > 6 ? 34 : maxDim > 5 ? 38 : 42; // px
  const gap = 5; // px

  // Build matrix for grid
  const cells = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      letter: '',
      isPartOfWord: false,
      isRevealed: false,
    }))
  );

  layout.forEach(({ word, x, y, direction }) => {
    const isFound = foundWords.includes(word);
    for (let i = 0; i < word.length; i++) {
      const cx = direction === 'horizontal' ? x + i - minX : x - minX;
      const cy = direction === 'horizontal' ? y - minY : y + i - minY;

      cells[cy][cx].isPartOfWord = true;
      if (isFound) {
        cells[cy][cx].letter = word[i];
        cells[cy][cx].isRevealed = true;
      }
    }
  });

  return (
    <div
      className="flex flex-col p-4 bg-black/30 backdrop-blur-md rounded-3xl shadow-2xl border border-white/10"
      style={{ gap: `${gap}px` }}
    >
      {cells.map((row, y) => (
        <div key={y} className="flex" style={{ gap: `${gap}px` }}>
          {row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
              className={`
                flex items-center justify-center font-black rounded-xl transition-all duration-300
                ${
                  cell.isPartOfWord
                    ? cell.isRevealed
                      ? 'bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-stone-950 shadow-md shadow-amber-500/30 scale-100 text-lg border border-amber-200'
                      : 'bg-white/15 border border-white/20 text-transparent shadow-inner'
                    : 'bg-transparent border-transparent'
                }
              `}
            >
              {cell.isRevealed && (
                <motion.span
                  initial={{ scale: 0, rotate: -20, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {cell.letter}
                </motion.span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
