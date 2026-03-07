import { createClient } from "@/lib/supabase/server";
import TodayCard from "@/components/home/TodayCard";
import StreakBadge from "@/components/home/StreakBadge";
import RankingFeed from "@/components/home/RankingFeed";
import BottomNav from "@/components/ui/BottomNav";
import HomeClientShell from "./HomeClientShell";

export const revalidate = 60;

export default async function HomePage() {
  let rankings = null;
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("daily_rankings")
      .select("*")
      .eq("date", today)
      .order("rank", { ascending: true });
    rankings = data;
  } catch {
    // Supabase 미설정 또는 네트워크 오류 — 빈 랭킹으로 fallback
  }

  return <HomeClientShell todayRankings={rankings ?? []} />;
}
