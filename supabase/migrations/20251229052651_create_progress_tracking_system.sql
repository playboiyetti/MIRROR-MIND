/*
  # Progress Tracking System for Mirror Mind

  ## Overview
  Creates a comprehensive progress tracking system with streaks, reflections, and avatar evolution.

  ## New Tables
  
  ### `user_profiles`
  - `id` (uuid, primary key) - Links to auth.users
  - `username` (text) - Display name
  - `avatar_stage` (integer) - Current mirror evolution stage (0-4)
  - `total_reflections` (integer) - Total questions reflected on
  - `current_streak` (integer) - Current daily streak count
  - `longest_streak` (integer) - Best streak achieved
  - `last_activity_date` (date) - Last reflection date for streak calculation
  - `created_at` (timestamptz) - Account creation date
  - `updated_at` (timestamptz) - Last profile update

  ### `reflections`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References user_profiles
  - `question_id` (text) - Question identifier
  - `category_id` (text) - Category identifier
  - `question_text` (text) - The question asked
  - `reflection_text` (text) - User's written reflection
  - `intensity_level` (integer) - Question depth (1-30)
  - `reflection_duration` (integer) - Time spent reflecting in seconds
  - `created_at` (timestamptz) - When reflection was saved

  ### `category_progress`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References user_profiles
  - `category_id` (text) - Category identifier
  - `category_name` (text) - Category display name
  - `questions_completed` (integer) - Number of questions answered
  - `total_questions` (integer) - Total questions in category
  - `completion_percentage` (decimal) - Calculated completion %
  - `last_accessed` (timestamptz) - Last time category was accessed
  - `updated_at` (timestamptz) - Last update time

  ### `achievements`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References user_profiles
  - `achievement_type` (text) - Type of achievement
  - `achievement_name` (text) - Display name
  - `description` (text) - Achievement description
  - `unlocked_at` (timestamptz) - When achievement was earned

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Authenticated users required for all operations
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text DEFAULT 'Reflector',
  avatar_stage integer DEFAULT 0 CHECK (avatar_stage >= 0 AND avatar_stage <= 4),
  total_reflections integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_activity_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reflections table
CREATE TABLE IF NOT EXISTS reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  category_id text NOT NULL,
  question_text text NOT NULL,
  reflection_text text NOT NULL,
  intensity_level integer DEFAULT 1 CHECK (intensity_level >= 1 AND intensity_level <= 30),
  reflection_duration integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create category_progress table
CREATE TABLE IF NOT EXISTS category_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  category_id text NOT NULL,
  category_name text NOT NULL,
  questions_completed integer DEFAULT 0,
  total_questions integer DEFAULT 30,
  completion_percentage decimal DEFAULT 0,
  last_accessed timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category_id)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  achievement_name text NOT NULL,
  description text,
  unlocked_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for reflections
CREATE POLICY "Users can view own reflections"
  ON reflections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reflections"
  ON reflections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reflections"
  ON reflections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reflections"
  ON reflections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for category_progress
CREATE POLICY "Users can view own category progress"
  ON category_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own category progress"
  ON category_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own category progress"
  ON category_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for achievements
CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reflections_user_id ON reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_reflections_created_at ON reflections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_category_progress_user_id ON category_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);

-- Create function to update avatar stage based on total reflections
CREATE OR REPLACE FUNCTION update_avatar_stage()
RETURNS TRIGGER AS $$
BEGIN
  NEW.avatar_stage := CASE
    WHEN NEW.total_reflections >= 200 THEN 4
    WHEN NEW.total_reflections >= 100 THEN 3
    WHEN NEW.total_reflections >= 50 THEN 2
    WHEN NEW.total_reflections >= 20 THEN 1
    ELSE 0
  END;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for avatar stage updates
DROP TRIGGER IF EXISTS trigger_update_avatar_stage ON user_profiles;
CREATE TRIGGER trigger_update_avatar_stage
  BEFORE UPDATE OF total_reflections ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_avatar_stage();

-- Create function to update category completion percentage
CREATE OR REPLACE FUNCTION update_completion_percentage()
RETURNS TRIGGER AS $$
BEGIN
  NEW.completion_percentage := (NEW.questions_completed::decimal / NEW.total_questions::decimal) * 100;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for completion percentage updates
DROP TRIGGER IF EXISTS trigger_update_completion_percentage ON category_progress;
CREATE TRIGGER trigger_update_completion_percentage
  BEFORE INSERT OR UPDATE OF questions_completed, total_questions ON category_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_completion_percentage();