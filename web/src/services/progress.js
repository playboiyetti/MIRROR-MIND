import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY
);

export const progressService = {
  async getOrCreateUserProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user profile:', error);
      return null;
    }

    if (!data) {
      const { data: newProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert([{ id: userId }])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        return null;
      }

      return newProfile;
    }

    return data;
  },

  async updateStreak(userId) {
    const profile = await this.getOrCreateUserProfile(userId);
    if (!profile) return null;

    const today = new Date().toISOString().split('T')[0];
    const lastActivity = profile.last_activity_date;

    let newStreak = profile.current_streak;
    let longestStreak = profile.longest_streak;

    if (!lastActivity) {
      newStreak = 1;
    } else {
      const lastDate = new Date(lastActivity);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return profile;
      } else if (diffDays === 1) {
        newStreak = profile.current_streak + 1;
      } else {
        newStreak = 1;
      }
    }

    if (newStreak > longestStreak) {
      longestStreak = newStreak;
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_activity_date: today,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating streak:', error);
      return null;
    }

    return data;
  },

  async saveReflection(userId, questionData, reflectionText) {
    const { data, error } = await supabase
      .from('reflections')
      .insert([{
        user_id: userId,
        question_id: questionData.id,
        category_id: questionData.categoryId,
        question_text: questionData.front,
        reflection_text: reflectionText,
        intensity_level: questionData.intensityLevel || 1,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving reflection:', error);
      return null;
    }

    await this.incrementTotalReflections(userId);
    await this.updateCategoryProgress(userId, questionData.categoryId, questionData.categoryName);
    await this.updateStreak(userId);

    return data;
  },

  async incrementTotalReflections(userId) {
    const { data, error } = await supabase.rpc('increment', {
      row_id: userId,
      table_name: 'user_profiles',
      column_name: 'total_reflections',
    });

    if (error) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('total_reflections')
        .eq('id', userId)
        .single();

      if (profile) {
        await supabase
          .from('user_profiles')
          .update({ total_reflections: profile.total_reflections + 1 })
          .eq('id', userId);
      }
    }

    return data;
  },

  async updateCategoryProgress(userId, categoryId, categoryName) {
    const { data: existing } = await supabase
      .from('category_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('category_id', categoryId)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('category_progress')
        .update({
          questions_completed: existing.questions_completed + 1,
          last_accessed: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating category progress:', error);
      }

      return data;
    } else {
      const { data, error } = await supabase
        .from('category_progress')
        .insert([{
          user_id: userId,
          category_id: categoryId,
          category_name: categoryName,
          questions_completed: 1,
          total_questions: 30,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating category progress:', error);
      }

      return data;
    }
  },

  async getCategoryProgress(userId) {
    const { data, error } = await supabase
      .from('category_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_accessed', { ascending: false });

    if (error) {
      console.error('Error fetching category progress:', error);
      return [];
    }

    return data || [];
  },

  async getRecentReflections(userId, limit = 10) {
    const { data, error } = await supabase
      .from('reflections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching reflections:', error);
      return [];
    }

    return data || [];
  },

  async unlockAchievement(userId, achievementType, achievementName, description) {
    const { data: existing } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_type', achievementType)
      .maybeSingle();

    if (existing) {
      return existing;
    }

    const { data, error } = await supabase
      .from('achievements')
      .insert([{
        user_id: userId,
        achievement_type: achievementType,
        achievement_name: achievementName,
        description: description,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error unlocking achievement:', error);
      return null;
    }

    return data;
  },

  async getAchievements(userId) {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }

    return data || [];
  },
};

export default progressService;
