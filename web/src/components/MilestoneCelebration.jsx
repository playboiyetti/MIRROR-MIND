import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, Star, Zap } from 'lucide-react';

export default function MilestoneCelebration({ achievement, onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (achievement) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(() => onClose?.(), 500);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const getIcon = () => {
    if (achievement.achievement_type.includes('streak')) return Zap;
    if (achievement.achievement_type.includes('reflection')) return Star;
    return Award;
  };

  const Icon = getIcon();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="relative pointer-events-auto"
          >
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 1,
                    scale: 0,
                    x: 0,
                    y: 0,
                  }}
                  animate={{
                    opacity: [1, 0],
                    scale: [0, 1.5],
                    x: Math.cos((i / 20) * Math.PI * 2) * 150,
                    y: Math.sin((i / 20) * Math.PI * 2) * 150,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.03,
                    ease: 'easeOut',
                  }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: '#9B5CFF',
                    boxShadow: '0 0 10px #9B5CFF',
                  }}
                />
              ))}
            </div>

            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(155, 92, 255, 0.5)',
                  '0 0 40px rgba(155, 92, 255, 0.8)',
                  '0 0 20px rgba(155, 92, 255, 0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="clay-card p-8 min-w-[320px] max-w-md text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-accentPrimary/10 to-transparent" />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                className="relative w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-accentPrimary to-accentMind flex items-center justify-center"
              >
                <Icon className="w-10 h-10 text-white" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-accentPrimary" />
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {achievement.achievement_name}
                  </h2>
                  <Sparkles className="w-5 h-5 text-accentPrimary" />
                </div>

                <p className="text-textSecondary font-light leading-relaxed">
                  {achievement.description}
                </p>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 pt-6 border-t border-white/10"
                >
                  <p className="text-xs uppercase tracking-widest text-accentPrimary font-medium">
                    Achievement Unlocked
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm -z-10"
            onClick={() => setShow(false)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
