"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LeaderboardList from "@/components/ranking/LeaderboardList";
import BottomNav from "@/components/ui/BottomNav";
import { useLang } from "@/lib/i18n/context";
import type { DailyRanking } from "@/lib/supabase/types";
import { todayString } from "@/lib/utils/streak";
import { Badge } from "@/components/ui/badge";

export default function RankingPage() {
  const [rankings, setRankings] = useState<DailyRanking[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

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
      <header className="px-5 pt-12 pb-4 border-b border-border flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-display font-bold text-foreground leading-none">
            {t.ranking.title}
          </h1>
          <p className="text-[10px] font-semibold mt-1.5 tracking-[0.2em] uppercase text-muted-foreground">
            {t.ranking.realtimeFull}
          </p>
        </div>
        {rankings.length > 0 && (
          <Badge variant="realtime">
            {t.ranking.participants(rankings.length)}
          </Badge>
        )}
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <LeaderboardList rankings={rankings} myUserId={userId} />
      )}

      <BottomNav />
    </div>
  );
}
