import React from 'react';
import { motion } from 'framer-motion';

const AVATAR_STAGES = [
  {
    stage: 0,
    name: 'Neutral Clay',
    description: 'Your journey begins',
    color: '#6B7280',
    glow: 'rgba(107, 114, 128, 0.3)',
    reflectionsNeeded: 0,
  },
  {
    stage: 1,
    name: 'First Light',
    description: 'Subtle awareness emerges',
    color: '#3AFFD8',
    glow: 'rgba(58, 255, 216, 0.4)',
    reflectionsNeeded: 20,
  },
  {
    stage: 2,
    name: 'Inner Wisdom',
    description: 'Colors of understanding',
    color: '#9B5CFF',
    glow: 'rgba(155, 92, 255, 0.5)',
    reflectionsNeeded: 50,
  },
  {
    stage: 3,
    name: 'Deep Insight',
    description: 'Wisdom glows within',
    color: '#FFC857',
    glow: 'rgba(255, 200, 87, 0.6)',
    reflectionsNeeded: 100,
  },
  {
    stage: 4,
    name: 'Transformation Complete',
    description: 'Full self-awareness achieved',
    color: '#FF3B5C',
    glow: 'rgba(255, 59, 92, 0.7)',
    reflectionsNeeded: 200,
  },
];

export default function MirrorAvatar({ stage = 0, size = 'large', showInfo = true }) {
  const avatarData = AVATAR_STAGES[stage] || AVATAR_STAGES[0];
  const nextStage = AVATAR_STAGES[stage + 1];

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
    xlarge: 'w-40 h-40',
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`${sizeClasses[size]} relative`}
        >
          <motion.div
            animate={{
              boxShadow: [
                `0 0 20px ${avatarData.glow}`,
                `0 0 40px ${avatarData.glow}`,
                `0 0 20px ${avatarData.glow}`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: avatarData.color }}
          />

          <div
            className="absolute inset-0 rounded-full backdrop-blur-xl"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${avatarData.color}dd, ${avatarData.color}44)`,
            }}
          />

          {stage >= 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute inset-4 rounded-full border-2 border-white/20"
            />
          )}

          {stage >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-2 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, transparent, ${avatarData.color}aa, transparent)`,
              }}
            />
          )}

          {stage >= 3 && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="absolute inset-0 rounded-full border border-white/10"
                  style={{
                    transform: `rotate(${i * 45}deg)`,
                  }}
                />
              ))}
            </>
          )}

          {stage >= 4 && (
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-4"
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: avatarData.color,
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${i * 30}deg) translateY(-40px)`,
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {showInfo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h3 className="text-sm font-semibold tracking-tight" style={{ color: avatarData.color }}>
            {avatarData.name}
          </h3>
          <p className="text-xs text-textMuted mt-1">{avatarData.description}</p>

          {nextStage && (
            <p className="text-[10px] text-textMuted mt-2 uppercase tracking-widest">
              {nextStage.reflectionsNeeded} reflections until {nextStage.name}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
