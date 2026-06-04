-- Supabase Database Schema for Word Game

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Levels Table
CREATE TABLE public.levels (
    id SERIAL PRIMARY KEY,
    difficulty VARCHAR(50) NOT NULL, -- Beginner, Intermediate, Advanced, Expert
    letters JSONB NOT NULL, -- e.g. ["R", "O", "S", "E"]
    required_words JSONB NOT NULL, -- e.g. ["ROSE", "OSE", "OS"]
    bonus_words JSONB DEFAULT '[]'::jsonb, -- optional
    grid_layout JSONB NOT NULL, -- { "ROSE": { "x": 0, "y": 0, "direction": "horizontal" } }
    reward_coins INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Users Table (Extending Supabase Auth)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(255) UNIQUE NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    coins INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS) for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Trigger to create a user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Player Progress Table
CREATE TABLE public.player_progress (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    level_id INTEGER REFERENCES public.levels(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'InProgress', -- InProgress, Completed
    found_words JSONB DEFAULT '[]'::jsonb,
    score INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, level_id)
);

ALTER TABLE public.player_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own progress" ON public.player_progress 
  FOR ALL USING (auth.uid() = user_id);

-- 4. Bonus Words Table
CREATE TABLE public.bonus_words (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    word VARCHAR(50) NOT NULL,
    found_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.bonus_words ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own bonus words" ON public.bonus_words 
  FOR ALL USING (auth.uid() = user_id);

-- 5. Achievements Table
CREATE TABLE public.achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirement_type VARCHAR(50) NOT NULL, -- e.g. "total_words", "levels_completed"
    requirement_value INTEGER NOT NULL
);

-- 6. User Achievements Table
CREATE TABLE public.user_achievements (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own achievements" ON public.user_achievements 
  FOR SELECT USING (auth.uid() = user_id);

-- 7. Daily Puzzles Table
CREATE TABLE public.daily_puzzles (
    puzzle_date DATE PRIMARY KEY,
    level_id INTEGER REFERENCES public.levels(id) ON DELETE CASCADE
);

-- Allow reading public game data
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view levels" ON public.levels FOR SELECT USING (true);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

ALTER TABLE public.daily_puzzles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view daily puzzles" ON public.daily_puzzles FOR SELECT USING (true);
