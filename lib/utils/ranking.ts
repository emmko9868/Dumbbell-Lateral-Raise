import type { WorkoutLog } from "@/lib/supabase/types";

export interface RankedEntry {
  rank: number;
  userId: string;
  nickname: string;
  reps: number;
  completedAt: string;
  streak: number;
}

/**
 * Sorts workout logs by reps DESC, then completedAt ASC (ties broken by earlier completion).
 */
export function sortForRanking(logs: WorkoutLog[]): WorkoutLog[] {
  return [...logs].sort((a, b) => {
    if (b.reps !== a.reps) return b.reps - a.reps;
    return new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime();
  });
}
