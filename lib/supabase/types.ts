// App-level types (not tied to Supabase generic types)
// Use `supabase gen types typescript` to generate full DB types after connecting.

export interface User {
  id: string;
  nickname: string;
  created_at: string;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  date: string;
  reps: number;
  completed_at: string;
}

export interface DailyRanking {
  date: string | null;
  rank: number | null;
  user_id: string | null;
  nickname: string | null;
  reps: number | null;
  completed_at: string | null;
}
