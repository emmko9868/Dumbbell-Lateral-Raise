"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import MonthCalendar from "@/components/calendar/MonthCalendar";
import { calcStreak } from "@/lib/utils/streak";
import { useLang } from "@/lib/i18n/context";
import type { User } from "@/lib/supabase/types";

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const { t } = useLang();
  const [user, setUser] = useState<User | null>(null);
  const [logDates, setLogDates] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: userData }, { data: logs }] = await Promise.all([
        supabase.from("users").select("*").eq("id", userId).single(),
        supabase.from("workout_logs").select("date").eq("user_id", userId).order("date", { ascending: false }),
      ]);
      if (userData) setUser(userData);
      if (logs) {
        const dates = logs.map((l) => l.date);
        setLogDates(dates);
        setStreak(calcStreak(dates));
      }
      setLoading(false);
    }
    load();
  }, [userId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-[#ff6b2b] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm font-bold" style={{ color: "#cccccc" }}>{t.profile.notFound}</p>
    </div>
  );

  return (
    <div className="min-h-screen pb-10">
      <header className="px-5 pt-14 pb-5" style={{ borderBottom: "2px solid #3a3a3a" }}>
        <button onClick={() => router.back()} className="mc-btn text-sm px-3 py-2 mb-5 flex items-center gap-1">
          {t.profile.back}
        </button>

        <h1 className="text-[28px] font-[family-name:var(--font-oswald)] font-bold text-[#f5f0e8] leading-none"
          style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.8)" }}>
          {user.nickname}
        </h1>

        <div className="flex gap-3 mt-4">
          <div className="px-4 py-3 flex items-baseline gap-2"
            style={{ background: "#5a5a5a", border: "2px solid #2a2a2a",
              boxShadow: "inset 3px 3px 0 rgba(255,255,255,0.25), inset -3px -3px 0 rgba(0,0,0,0.55)" }}>
            <span className="text-[32px] leading-none font-[family-name:var(--font-oswald)] font-bold text-[#f5f0e8]"
              style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.8)" }}>
              {logDates.length}
            </span>
            <span className="text-xs font-bold" style={{ color: "#cccccc", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>{t.profile.totalDays}</span>
          </div>
          <div className="px-4 py-3 flex items-baseline gap-2"
            style={{ background: "#2a1a0a", border: "2px solid #7a2800",
              boxShadow: "inset 3px 3px 0 rgba(255,107,43,0.2), inset -3px -3px 0 rgba(0,0,0,0.55)" }}>
            <span className="text-[32px] leading-none font-[family-name:var(--font-oswald)] font-bold text-[#ff6b2b]"
              style={{ textShadow: "2px 2px 0 rgba(100,30,0,0.8)" }}>
              {streak}
            </span>
            <span className="text-xs font-bold" style={{ color: "#cccccc", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>{t.profile.streakUnit}</span>
          </div>
        </div>
      </header>

      <div className="px-5 pt-4">
        {logDates.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm font-bold" style={{ color: "#aaaaaa" }}>{t.profile.noRecord}</p>
          </div>
        ) : (
          <MonthCalendar logDates={logDates} />
        )}
      </div>
    </div>
  );
}
