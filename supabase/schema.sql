-- 어깨깡패 Supabase Schema
-- Run this in the Supabase SQL Editor

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Workout logs (one per user per day, upsert on conflict)
CREATE TABLE IF NOT EXISTS workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  reps INTEGER NOT NULL CHECK (reps > 0),
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Index for ranking queries
CREATE INDEX IF NOT EXISTS idx_workout_logs_date ON workout_logs(date);
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_date ON workout_logs(user_id, date);

-- Daily rankings view (streak requires separate calculation in client)
CREATE OR REPLACE VIEW daily_rankings AS
SELECT
  wl.date,
  RANK() OVER (
    PARTITION BY wl.date
    ORDER BY wl.reps DESC, wl.completed_at ASC
  ) AS rank,
  wl.user_id,
  u.nickname,
  wl.reps,
  wl.completed_at
FROM workout_logs wl
JOIN users u ON u.id = wl.user_id;

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

-- Users: public read, insert only (no update)
CREATE POLICY "Users are publicly readable" ON users
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create a user" ON users
  FOR INSERT WITH CHECK (true);

-- Workout logs: public read, anyone can insert/update their own
CREATE POLICY "Workout logs are publicly readable" ON workout_logs
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert workout logs" ON workout_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update workout logs" ON workout_logs
  FOR UPDATE USING (true);
