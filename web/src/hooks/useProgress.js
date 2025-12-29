import { useState, useEffect } from 'react';
import progressService from '../services/progress';

const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000';

export function useProgress() {
  const [profile, setProfile] = useState(null);
  const [categoryProgress, setCategoryProgress] = useState([]);
  const [recentReflections, setRecentReflections] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = MOCK_USER_ID;

  const loadProfile = async () => {
    const data = await progressService.getOrCreateUserProfile(userId);
    setProfile(data);
    return data;
  };

  const loadCategoryProgress = async () => {
    const data = await progressService.getCategoryProgress(userId);
    setCategoryProgress(data);
    return data;
  };

  const loadRecentReflections = async () => {
    const data = await progressService.getRecentReflections(userId, 10);
    setRecentReflections(data);
    return data;
  };

  const loadAchievements = async () => {
    const data = await progressService.getAchievements(userId);
    setAchievements(data);
    return data;
  };

  const saveReflection = async (questionData, reflectionText) => {
    const reflection = await progressService.saveReflection(userId, questionData, reflectionText);

    await Promise.all([
      loadProfile(),
      loadCategoryProgress(),
      loadRecentReflections(),
    ]);

    await checkAndUnlockAchievements();

    return reflection;
  };

  const checkAndUnlockAchievements = async () => {
    const currentProfile = await progressService.getOrCreateUserProfile(userId);

    const achievementChecks = [
      {
        type: 'first_reflection',
        name: 'First Step',
        description: 'Completed your first reflection',
        condition: currentProfile.total_reflections >= 1,
      },
      {
        type: 'reflection_10',
        name: 'Building Awareness',
        description: 'Completed 10 reflections',
        condition: currentProfile.total_reflections >= 10,
      },
      {
        type: 'reflection_50',
        name: 'Deep Diver',
        description: 'Completed 50 reflections',
        condition: currentProfile.total_reflections >= 50,
      },
      {
        type: 'reflection_100',
        name: 'Self-Discovery Master',
        description: 'Completed 100 reflections',
        condition: currentProfile.total_reflections >= 100,
      },
      {
        type: 'streak_7',
        name: 'Week Warrior',
        description: 'Maintained a 7-day streak',
        condition: currentProfile.current_streak >= 7,
      },
      {
        type: 'streak_30',
        name: 'Monthly Mindfulness',
        description: 'Maintained a 30-day streak',
        condition: currentProfile.current_streak >= 30,
      },
    ];

    for (const achievement of achievementChecks) {
      if (achievement.condition) {
        await progressService.unlockAchievement(
          userId,
          achievement.type,
          achievement.name,
          achievement.description
        );
      }
    }

    await loadAchievements();
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([
        loadProfile(),
        loadCategoryProgress(),
        loadRecentReflections(),
        loadAchievements(),
      ]);
      setLoading(false);
    };

    init();
  }, []);

  return {
    profile,
    categoryProgress,
    recentReflections,
    achievements,
    loading,
    saveReflection,
    refreshProfile: loadProfile,
    refreshProgress: async () => {
      await Promise.all([
        loadProfile(),
        loadCategoryProgress(),
        loadRecentReflections(),
        loadAchievements(),
      ]);
    },
  };
}
