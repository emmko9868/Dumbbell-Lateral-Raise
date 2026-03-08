"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TodayCard from "@/components/home/TodayCard";
import StreakBadge from "@/components/home/StreakBadge";
import RankingFeed from "@/components/home/RankingFeed";
import HeroScene from "@/components/home/HeroScene";
import BottomNav from "@/components/ui/BottomNav";
import LangToggle from "@/components/ui/LangToggle";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { calcStreak, todayString } from "@/lib/utils/streak";
import { useLang } from "@/lib/i18n/context";
import type { DailyRanking } from "@/lib/supabase/types";

interface HomeClientShellProps {
  todayRankings: DailyRanking[];
}

export default function HomeClientShell({ todayRankings }: HomeClientShellProps) {
  const router = useRouter();
  const { t } = useLang();
  const [userId, setUserId] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [todayReps, setTodayReps] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [rankings, setRankings] = useState<DailyRanking[]>(todayRankings);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (!storedId) { router.push("/onboarding"); return; }
    setUserId(storedId);
    setNickname(localStorage.getItem("nickname"));
    loadUserData(storedId);
  }, [router]);

  useEffect(() => {
    if (!userId || !isSupabaseConfigured) return;
    try {
      const supabase = createClient();
      const today = todayString();
      const channel = supabase.channel("daily_rankings_realtime")
        .on("postgres_changes", { event: "*", schema: "public", table: "workout_logs" }, async () => {
          const { data } = await supabase.from("daily_rankings").select("*").eq("date", today).order("rank", { ascending: true });
          if (data) setRankings(data);
        })
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    } catch { /* Supabase 미설정 */ }
  }, [userId]);

  async function loadUserData(uid: string) {
    const today = todayString();
    const localReps = localStorage.getItem(`reps_${today}`);
    if (localReps) setTodayReps(parseInt(localReps, 10));
    if (!isSupabaseConfigured) return;
    try {
      const supabase = createClient();
      const { data: logs } = await supabase.from("workout_logs").select("date, reps").eq("user_id", uid).order("date", { ascending: false });
      if (logs && logs.length > 0) {
        const todayLog = logs.find((l: { date: string }) => l.date === today);
        setTodayReps(todayLog?.reps ?? null);
        setStreak(calcStreak(logs.map((l: { date: string }) => l.date)));
      }
    } catch { /* offline */ }
  }

  return (
    <div className="min-h-screen pb-28">
      <header className="px-10 pt-14 pb-5 flex items-end justify-between"
        style={{ borderBottom: "2px solid #1e3050" }}>
        <div>
          <h1 className="text-[36px] font-[family-name:var(--font-oswald)] font-bold leading-none tracking-tight"
            style={{ color: "#e53935", textShadow: "3px 3px 0 rgba(100,0,0,0.6), 0 0 30px rgba(229,57,53,0.3)" }}>
            {t.appName}
          </h1>
          {nickname && (
            <p className="text-xs mt-1.5 font-bold" style={{ color: "#6b82a8" }}>
              {t.home.greeting} <span style={{ color: "#ffc107" }}>{nickname}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <LangToggle />
          <div className="text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-1"
            style={{ color: "#ffc107", background: "#1e3050", border: "1px solid #2a4470" }}>
            DAILY
          </div>
        </div>
      </header>

      <main className="px-10 pt-4 space-y-2">
        <TodayCard reps={todayReps} completed={todayReps !== null} />
        <HeroScene />
        <StreakBadge streak={streak} />
        <RankingFeed rankings={rankings} myUserId={userId} />
      </main>

      <BottomNav />
    </div>
  );
}
