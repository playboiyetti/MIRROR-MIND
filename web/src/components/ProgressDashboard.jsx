import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Award, BookOpen, Target } from 'lucide-react';
import MirrorAvatar from './MirrorAvatar';
import StreakCounter from './StreakCounter';

export default function ProgressDashboard({ profile, categoryProgress, achievements, onClose }) {
  if (!profile) return null;

  const totalCategories = 12;
  const completedCategories = categoryProgress.filter((c) => c.completion_percentage >= 100).length;

  const stats = [
    {
      icon: BookOpen,
      label: 'Total Reflections',
      value: profile.total_reflections,
      color: '#3AFFD8',
    },
    {
      icon: Target,
      label: 'Categories Explored',
      value: `${categoryProgress.length}/${totalCategories}`,
      color: '#9B5CFF',
    },
    {
      icon: Award,
      label: 'Achievements',
      value: achievements.length,
      color: '#FFC857',
    },
    {
      icon: TrendingUp,
      label: 'Avatar Stage',
      value: `${profile.avatar_stage + 1}/5`,
      color: '#FF3B5C',
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl relative"
        >
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 w-12 h-12 rounded-full clay-button flex items-center justify-center z-10"
          >
            <X className="w-6 h-6 text-textSecondary" />
          </button>

          <div className="clay-card p-8 max-h-[85vh] overflow-y-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold mb-2">Your Journey</h2>
              <p className="text-textMuted text-sm">Track your path of self-discovery</p>
            </div>

            <div className="flex justify-center mb-8">
              <MirrorAvatar stage={profile.avatar_stage} size="xlarge" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="clay-card p-4 flex flex-col items-center text-center"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                      style={{
                        backgroundColor: `${stat.color}22`,
                        boxShadow: `0 0 15px ${stat.color}33`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <span className="text-2xl font-semibold mb-1">{stat.value}</span>
                    <span className="text-[10px] text-textMuted uppercase tracking-widest">
                      {stat.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="mb-8">
              <StreakCounter
                currentStreak={profile.current_streak}
                longestStreak={profile.longest_streak}
              />
            </div>

            {categoryProgress.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm uppercase tracking-widest text-textMuted font-medium mb-4">
                  Category Progress
                </h3>
                <div className="space-y-3">
                  {categoryProgress.map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="clay-card p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{category.category_name}</span>
                        <span className="text-xs text-textMuted">
                          {category.questions_completed}/{category.total_questions}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${category.completion_percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.05 }}
                          className="h-full rounded-full bg-gradient-to-r from-accentPrimary to-accentMind"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {achievements.length > 0 && (
              <div>
                <h3 className="text-sm uppercase tracking-widest text-textMuted font-medium mb-4">
                  Achievements Unlocked
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="clay-card p-4 flex items-start gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accentPrimary to-accentMind flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold mb-1 truncate">
                          {achievement.achievement_name}
                        </h4>
                        <p className="text-xs text-textMuted line-clamp-2">
                          {achievement.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {achievements.length === 0 && categoryProgress.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-textMuted">
                  Start your reflection journey to unlock achievements and track progress!
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
