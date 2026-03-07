/**
 * Calculates streak from an array of workout log dates (YYYY-MM-DD).
 * Streak = consecutive days ending at today or yesterday.
 */
export function calcStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const sorted = [...new Set(dates)].sort().reverse();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let cursor = new Date(today);

  for (const dateStr of sorted) {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);

    const diffDays = Math.round(
      (cursor.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0 || diffDays === 1) {
      streak++;
      cursor = d;
    } else {
      break;
    }
  }

  return streak;
}

export function todayString(): string {
  return new Date().toISOString().split("T")[0];
}
