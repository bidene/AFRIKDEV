import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AfrikdevLogo } from './AfrikdevLogo.tsx';
import { EASE_OUT_EXPO } from './MotionPrimitives.tsx';

export const SplashScreen: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 3000; // 3 seconds exact

    let rafId: number;
    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (elapsed < duration) {
        rafId = requestAnimationFrame(updateProgress);
      } else {
        setVisible(false);
        if (onComplete) onComplete();
      }
    };

    rafId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="afrikdev-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center px-6 select-none overflow-hidden"
        >
          {/* Ambient radial blue glow */}
          <div
            className="pointer-events-none absolute w-[480px] h-[480px] rounded-full bg-blue-600/15 blur-[110px]"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full space-y-6">
            {/* Animated Logo Emblem */}
            <motion.div
              initial={{ opacity: 0, scale: 0.82, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
              className="relative flex items-center justify-center"
            >
              <span className="absolute -inset-3 rounded-3xl bg-blue-500/20 blur-xl animate-pulse" />
              <AfrikdevLogo size="xl" showWordmark={false} />
            </motion.div>

            {/* Brand Name & Official Slogan */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT_EXPO }}
              className="space-y-2"
            >
              <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
                AFRIK<span className="text-blue-500">DEV</span>
              </h1>
              <p className="text-xs sm:text-sm font-mono text-amber-400">
                « Construire l’Afrique numérique, un projet à la fois. »
              </p>
              <p className="text-xs text-slate-400">
                La communauté des développeurs et talents tech africains
              </p>
            </motion.div>

            {/* 3-Second Progress Bar & Percentage Counter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: EASE_OUT_EXPO }}
              className="w-full max-w-xs space-y-2 pt-2"
            >
              <div className="h-1.5 w-full rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-amber-400 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Initialisation de la plateforme...</span>
                <span className="text-blue-400 font-semibold tabular-nums">{progress}%</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
