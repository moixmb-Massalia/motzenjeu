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
  const cellSize = 40; // px
  const gap = 4; // px

  // Build a matrix for the grid
  const cells = Array.from({ length: height }, () => 
    Array.from({ length: width }, () => ({
      letter: '',
      isPartOfWord: false,
      isRevealed: false
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
      className="flex flex-col p-4 bg-game-board/50 backdrop-blur-md rounded-2xl shadow-inner border border-white/20"
      style={{ gap: `${gap}px` }}
    >
      {cells.map((row, y) => (
        <div key={y} className="flex" style={{ gap: `${gap}px` }}>
          {row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
              className={`
                flex items-center justify-center font-bold text-xl rounded-md
                ${cell.isPartOfWord 
                  ? (cell.isRevealed ? 'bg-primary text-white shadow-md' : 'bg-white/80 shadow-sm') 
                  : 'bg-transparent'}
              `}
            >
              {cell.isRevealed && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
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
