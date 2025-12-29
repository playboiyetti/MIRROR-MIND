import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Settings, Sparkles, LayoutGrid, TrendingUp, Flame } from 'lucide-react';
import { getCategories, getQuestionsByCategory } from './services/api';
import { useProgress } from './hooks/useProgress';
import ProgressDashboard from './components/ProgressDashboard';
import MilestoneCelebration from './components/MilestoneCelebration';
import MirrorAvatar from './components/MirrorAvatar';

function App() {
  const [categories, setCategories] = useState([]);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCategories, setShowCategories] = useState(false);
  const [reflection, setReflection] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const [celebrationAchievement, setCelebrationAchievement] = useState(null);

  const {
    profile,
    categoryProgress,
    achievements,
    loading: progressLoading,
    saveReflection: saveProgressReflection,
  } = useProgress();

  useEffect(() => {
    const init = async () => {
      const cats = await getCategories();
      setCategories(cats);
      if (cats.length > 0) {
        const questions = await getQuestionsByCategory(cats[0].id);
        setCurrentQuestions(questions);
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleCategorySelect = async (catId) => {
    setLoading(true);
    setShowCategories(false);
    const questions = await getQuestionsByCategory(catId);
    setCurrentQuestions(questions);
    setCurrentIndex(0);
    setLoading(false);
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % currentQuestions.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + currentQuestions.length) % currentQuestions.length);
  };

  const currentQuestion = currentQuestions[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 rounded-full clay-button flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-accentPrimary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${currentQuestion?.themeColor || '#9B5CFF'}11 0%, transparent 70%)`
          }}
        />
        <div className="absolute inset-0 bg-background/40 backdrop-blur-3xl" />
        <div className="noise-overlay" />
      </div>

      {/* Header */}
      <header className="absolute top-0 w-full p-8 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl clay-button flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-accentPrimary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Mirror Mind</h1>
            <p className="text-[10px] text-textMuted uppercase tracking-widest font-medium">Digital Introspection</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          {profile && profile.current_streak > 0 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setShowProgress(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl clay-button"
            >
              <Flame className="w-4 h-4 text-accentPrimary" />
              <span className="text-sm font-semibold">{profile.current_streak}</span>
            </motion.button>
          )}

          <button
            onClick={() => setShowProgress(true)}
            className="w-12 h-12 rounded-2xl clay-button flex items-center justify-center"
          >
            <TrendingUp className="w-5 h-5 text-textSecondary" />
          </button>

          <button
            onClick={() => setShowCategories(true)}
            className="w-12 h-12 rounded-2xl clay-button flex items-center justify-center"
          >
            <LayoutGrid className="w-5 h-5 text-textSecondary" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center">
        {currentQuestion ? (
          <div className="w-full flex flex-col items-center gap-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, y: -20 }}
                transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex justify-center"
              >
                <Card
                  question={currentQuestion.front}
                  psychology={currentQuestion.back}
                  category={categories.find(c => c.id === currentQuestion.categoryId)?.name || 'Reflection'}
                  themeColor={currentQuestion.themeColor || '#9B5CFF'}
                />
              </motion.div>
            </AnimatePresence>

            {/* Reflection Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-[320px] clay-card p-6 flex flex-col gap-4"
            >
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Write your reflection..."
                className="w-full h-24 bg-transparent border-none outline-none text-textSecondary text-sm font-light resize-none placeholder:text-textMuted"
              />
              <button
                className="w-full py-3 rounded-xl clay-button text-[12px] uppercase tracking-widest font-medium text-accentPrimary"
                onClick={async () => {
                  if (!reflection.trim()) return;

                  const questionData = {
                    id: currentQuestion.id,
                    categoryId: currentQuestion.categoryId,
                    categoryName: categories.find(c => c.id === currentQuestion.categoryId)?.name || 'Reflection',
                    front: currentQuestion.front,
                    intensityLevel: currentQuestion.intensityLevel || 1,
                  };

                  const savedReflection = await saveProgressReflection(questionData, reflection);

                  if (savedReflection) {
                    const previousAchievementCount = achievements.length;

                    setTimeout(async () => {
                      const newAchievements = achievements.slice(previousAchievementCount);
                      if (newAchievements.length > 0) {
                        setCelebrationAchievement(newAchievements[0]);
                      }
                    }, 500);

                    setReflection('');
                  }
                }}
              >
                Save Insight
              </button>
            </motion.div>
          </div>
        ) : (
          <div className="clay-card p-12 text-center max-w-md">
            <p className="text-textSecondary font-light">Choose a category to begin your reflection journey.</p>
          </div>
        )}

        {/* Navigation */}
        {currentQuestions.length > 0 && (
          <div className="mt-16 flex items-center gap-10">
            <button
              onClick={prevCard}
              className="w-14 h-14 rounded-full clay-button flex items-center justify-center active:scale-95"
            >
              <ChevronLeft className="w-7 h-7 text-textSecondary" />
            </button>

            <div className="flex gap-3 px-6 py-3 rounded-full bg-black/20 backdrop-blur-sm border border-white/5">
              {currentQuestions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-10' : 'w-2 bg-white/5'}`}
                  style={{
                    backgroundColor: idx === currentIndex ? currentQuestion.themeColor : undefined,
                    boxShadow: idx === currentIndex ? `0 0 12px ${currentQuestion.themeColor}88` : 'none'
                  }}
                />
              ))}
            </div>

            <button
              onClick={nextCard}
              className="w-14 h-14 rounded-full clay-button flex items-center justify-center active:scale-95"
            >
              <ChevronRight className="w-7 h-7 text-textSecondary" />
            </button>
          </div>
        )}
      </main>

      {/* Footer Hint */}
      <footer className="absolute bottom-8 z-10 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-[12px] text-textMuted uppercase tracking-[0.2em] font-light"
        >
          {currentQuestion ? "Swipe or hold to reveal" : "Select a category"}
        </motion.p>
      </footer>

      {/* Category Modal */}
      <AnimatePresence>
        {showCategories && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setShowCategories(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-2xl grid grid-cols-2 md:grid-cols-3 gap-4"
              onClick={e => e.stopPropagation()}
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="clay-card p-6 flex flex-col items-center gap-3 group active:scale-95 transition-transform"
                >
                  <div
                    className="w-4 h-4 rounded-full shadow-lg transition-transform group-hover:scale-125"
                    style={{ backgroundColor: cat.themeColor, boxShadow: `0 0 15px ${cat.themeColor}aa` }}
                  />
                  <span className="text-xs font-medium tracking-tight text-center">{cat.name}</span>
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Dashboard */}
      {showProgress && (
        <ProgressDashboard
          profile={profile}
          categoryProgress={categoryProgress}
          achievements={achievements}
          onClose={() => setShowProgress(false)}
        />
      )}

      {/* Milestone Celebration */}
      <MilestoneCelebration
        achievement={celebrationAchievement}
        onClose={() => setCelebrationAchievement(null)}
      />
    </div>
  );
}

export default App;
