"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { sound } from '@/lib/audio';

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
  const radius = 95;
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
      sound.playLetterTone(0);
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
        sound.playLetterDeselect();
        setSelectedIndices((prev) => prev.slice(0, -1));
      } else if (!selectedIndices.includes(index)) {
        // New letter added
        sound.playLetterTone(selectedIndices.length);
        setSelectedIndices((prev) => [...prev, index]);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (selectedIndices.length > 0) {
      const word = selectedIndices.map((i) => letters[i]).join('');
      onWordComplete(word);
      setSelectedIndices([]);
      setCurrentPos(null);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const currentWordPreview = selectedIndices.map((i) => letters[i]).join('');

  return (
    <div className="relative flex flex-col items-center">
      {/* Floating Word Preview (Words of Wonders style) */}
      <div className="h-9 mb-2 flex items-center justify-center">
        {currentWordPreview ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-300 text-stone-950 font-black text-lg tracking-widest rounded-full shadow-lg shadow-amber-400/30 border border-amber-200"
          >
            {currentWordPreview}
          </motion.div>
        ) : (
          <div className="text-[11px] font-bold text-white/40 tracking-wider uppercase">
            Glissez pour relier les lettres
          </div>
        )}
      </div>

      <div
        className="relative w-64 h-64 flex items-center justify-center touch-none select-none"
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Ambient Ring Tray */}
        <div className="absolute w-56 h-56 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-inner pointer-events-none" />

        {/* Draw connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
          {selectedIndices.length > 0 && containerRef.current && (
            <path
              d={`M ${selectedIndices
                .map((idx, i) => {
                  const el = letterRefs.current[idx];
                  if (!el) return '';
                  const rect = el.getBoundingClientRect();
                  const containerRect = containerRef.current!.getBoundingClientRect();
                  const x = rect.left + rect.width / 2 - containerRect.left;
                  const y = rect.top + rect.height / 2 - containerRect.top;
                  return `${i === 0 ? '' : 'L'} ${x} ${y}`;
                })
                .join(' ')} ${
                currentPos
                  ? `L ${currentPos.x - containerRef.current.getBoundingClientRect().left} ${
                      currentPos.y - containerRef.current.getBoundingClientRect().top
                    }`
                  : ''
              }`}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-90 drop-shadow-md"
            />
          )}
        </svg>

        {/* Draw circular letters */}
        {letters.map((letter, i) => {
          const isSelected = selectedIndices.includes(i);
          const isLastSelected = selectedIndices[selectedIndices.length - 1] === i;

          return (
            <motion.div
              key={i}
              ref={(el) => {
                letterRefs.current[i] = el;
              }}
              className={`absolute w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black cursor-pointer transition-all shadow-xl ${
                isSelected
                  ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-stone-950 scale-110 shadow-amber-500/50 ring-4 ring-amber-300/50'
                  : 'bg-white/95 text-stone-900 border border-white hover:bg-white shadow-black/20'
              } ${isLastSelected ? 'animate-pulse' : ''}`}
              style={{
                x: positions[i].x,
                y: positions[i].y,
                zIndex: 20,
              }}
              whileHover={{ scale: isSelected ? 1.15 : 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {letter}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
