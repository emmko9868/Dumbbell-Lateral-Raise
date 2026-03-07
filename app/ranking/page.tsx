"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LeaderboardList from "@/components/ranking/LeaderboardList";
import BottomNav from "@/components/ui/BottomNav";
import type { DailyRanking } from "@/lib/supabase/types";
import { todayString } from "@/lib/utils/streak";

export default function RankingPage() {
  const [rankings, setRankings] = useState<DailyRanking[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    setUserId(uid);
    loadRankings();

    const supabase = createClient();
    const channel = supabase.channel("ranking_page")
      .on("postgres_changes", { event: "*", schema: "public", table: "workout_logs" }, () => loadRankings())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function loadRankings() {
    const supabase = createClient();
    const { data } = await supabase.from("daily_rankings").select("*").eq("date", todayString()).order("rank", { ascending: true });
    if (data) setRankings(data);
    setLoading(false);
  }

  return (
    <div className="min-h-screen pb-28">
      <header className="px-5 pt-14 pb-4" style={{ borderBottom: "2px solid #3a3a3a" }}>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[28px] font-[family-name:var(--font-oswald)] font-bold text-[#f5f0e8] leading-none"
              style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.8)" }}>
              오늘 랭킹
            </h1>
            <p className="text-[9px] font-bold mt-1.5 tracking-[0.2em] uppercase"
              style={{ color: "#cccccc", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>
              실시간 업데이트
            </p>
          </div>
          {rankings.length > 0 && (
            <div className="text-xs font-bold px-2 py-1"
              style={{ color: "#cccccc", background: "#3a3a3a", border: "1px solid #5a5a5a", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>
              {rankings.length}명 참여
            </div>
          )}
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-5 h-5 border-2 border-[#ff6b2b] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <LeaderboardList rankings={rankings} myUserId={userId} />
      )}

      <BottomNav />
    </div>
  );
}
