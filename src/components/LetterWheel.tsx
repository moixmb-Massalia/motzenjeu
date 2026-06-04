"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LetterWheelProps {
  letters: string[];
  onWordComplete: (word: string) => void;
}

interface Point {
  x: number;
  y: number;
}

export default function LetterWheel({ letters, onWordComplete }: LetterWheelProps) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentPos, setCurrentPos] = useState<Point | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Calculate positions in a circle
  const radius = 100;
  const positions = letters.map((_, i) => {
    const angle = (i * 2 * Math.PI) / letters.length - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });

  const getLetterAtPoint = (x: number, y: number): number => {
    for (let i = 0; i < letters.length; i++) {
      const el = letterRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        return i;
      }
    }
    return -1;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const index = getLetterAtPoint(e.clientX, e.clientY);
    if (index !== -1) {
      setSelectedIndices([index]);
      setCurrentPos({ x: e.clientX, y: e.clientY });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (selectedIndices.length === 0) return;
    setCurrentPos({ x: e.clientX, y: e.clientY });

    const index = getLetterAtPoint(e.clientX, e.clientY);
    if (index !== -1) {
      if (selectedIndices[selectedIndices.length - 2] === index) {
        // Backtracking
        setSelectedIndices(prev => prev.slice(0, -1));
      } else if (!selectedIndices.includes(index)) {
        // New letter
        setSelectedIndices(prev => [...prev, index]);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (selectedIndices.length > 0) {
      const word = selectedIndices.map(i => letters[i]).join('');
      onWordComplete(word);
      setSelectedIndices([]);
      setCurrentPos(null);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div 
      className="relative w-64 h-64 flex items-center justify-center touch-none select-none"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Draw lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
        {selectedIndices.length > 0 && containerRef.current && (
          <path
            d={`M ${selectedIndices.map((idx, i) => {
              const el = letterRefs.current[idx];
              if (!el) return '';
              const rect = el.getBoundingClientRect();
              const containerRect = containerRef.current!.getBoundingClientRect();
              const x = rect.left + rect.width / 2 - containerRect.left;
              const y = rect.top + rect.height / 2 - containerRect.top;
              return `${i === 0 ? '' : 'L'} ${x} ${y}`;
            }).join(' ')} ${currentPos ? `L ${currentPos.x - containerRef.current.getBoundingClientRect().left} ${currentPos.y - containerRef.current.getBoundingClientRect().top}` : ''}`}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-60 drop-shadow-md"
          />
        )}
      </svg>

      {/* Draw letters */}
      {letters.map((letter, i) => {
        const isSelected = selectedIndices.includes(i);
        const isLastSelected = selectedIndices[selectedIndices.length - 1] === i;
        
        return (
          <motion.div
            key={i}
            ref={el => {
                letterRefs.current[i] = el;
            }}
            className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold cursor-pointer transition-colors shadow-lg
              ${isSelected ? 'bg-primary text-white scale-110 shadow-primary/50' : 'bg-white text-foreground'}
              ${isLastSelected ? 'ring-4 ring-primary/30' : ''}
            `}
            style={{
              x: positions[i].x,
              y: positions[i].y,
              zIndex: 20
            }}
            whileHover={{ scale: isSelected ? 1.1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {letter}
          </motion.div>
        );
      })}
    </div>
  );
}
