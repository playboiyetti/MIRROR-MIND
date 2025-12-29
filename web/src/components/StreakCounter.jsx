import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy } from 'lucide-react';

export default function StreakCounter({ currentStreak = 0, longestStreak = 0, compact = false }) {
  const getStreakColor = (streak) => {
    if (streak >= 30) return '#FF3B5C';
    if (streak >= 14) return '#FFC857';
    if (streak >= 7) return '#9B5CFF';
    if (streak >= 3) return '#3AFFD8';
    return '#6B7280';
  };

  const streakColor = getStreakColor(currentStreak);

  if (compact) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full clay-button"
      >
        <Flame className="w-4 h-4" style={{ color: streakColor }} />
        <span className="text-sm font-semibold">{currentStreak}</span>
        <span className="text-xs text-textMuted">day streak</span>
      </motion.div>
    );
  }

  return (
    <div className="clay-card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm uppercase tracking-widest text-textMuted font-medium">
          Reflection Streak
        </h3>
        <motion.div
          animate={{
            scale: currentStreak > 0 ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Flame className="w-6 h-6" style={{ color: streakColor }} />
        </motion.div>
      </div>

      <div className="flex items-baseline gap-2">
        <motion.span
          key={currentStreak}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-semibold"
          style={{ color: streakColor }}
        >
          {currentStreak}
        </motion.span>
        <span className="text-textMuted text-sm">
          {currentStreak === 1 ? 'day' : 'days'}
        </span>
      </div>

      <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((currentStreak / 30) * 100, 100)}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{
            backgroundColor: streakColor,
            boxShadow: `0 0 10px ${streakColor}88`,
          }}
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-textMuted" />
          <span className="text-xs text-textMuted">Best Streak</span>
        </div>
        <span className="text-sm font-medium">{longestStreak} days</span>
      </div>

      {currentStreak >= 7 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-3 rounded-xl bg-white/5 text-center"
        >
          <p className="text-xs text-textSecondary">
            {currentStreak >= 30
              ? "Incredible dedication! You're a reflection master!"
              : currentStreak >= 14
              ? 'Amazing consistency! Keep the momentum going!'
              : 'Great job! One week of daily reflection!'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
