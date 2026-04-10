-- CodeQuest Pro Final : Complete Resilient Schema
-- Run this ONCE in the Supabase SQL Editor to guarantee perfect layout.

-- 1. Safely drop tables if you want a complete hard wipe (WARNING: DELETES ALL DATA)
-- DROP TABLE IF EXISTS public.levels CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users not null primary key,
  username text not null unique,
  score int4 default 0,
  role text default 'student',
  current_level int4 default 1
);
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 3. Automatic Profile Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, score, role, current_level)
  VALUES (new.id, new.raw_user_meta_data->>'username', 0, 'student', 1);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Levels Table for Stitched Campaign
CREATE TABLE IF NOT EXISTS public.levels (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  question text not null,
  expected_answer text not null,
  level_number int4 not null unique,
  xp_reward int4 default 10,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
ALTER TABLE public.levels DISABLE ROW LEVEL SECURITY;
