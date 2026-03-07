import { createClient } from "@/lib/supabase/server";
import TodayCard from "@/components/home/TodayCard";
import StreakBadge from "@/components/home/StreakBadge";
import RankingFeed from "@/components/home/RankingFeed";
import BottomNav from "@/components/ui/BottomNav";
import HomeClientShell from "./HomeClientShell";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  // Fetch today's rankings
  const { data: rankings } = await supabase
    .from("daily_rankings")
    .select("*")
    .eq("date", today)
    .order("rank", { ascending: true });

  return (
    <HomeClientShell
      todayRankings={rankings ?? []}
    />
  );
}
