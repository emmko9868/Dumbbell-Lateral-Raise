"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import MonthCalendar from "@/components/calendar/MonthCalendar";
import BottomNav from "@/components/ui/BottomNav";
import { calcStreak } from "@/lib/utils/streak";
import { useLang } from "@/lib/i18n/context";

export default function CalendarPage() {
  const [logDates, setLogDates] = useState<string[]>([]);
  const [totalDays, setTotalDays] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    async function load() {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      const supabase = createClient();
      const { data } = await supabase.from("workout_logs").select("date").eq("user_id", userId).order("date", { ascending: false });
      if (data) {
        const dates = data.map((l) => l.date);
        setLogDates(dates);
        setTotalDays(dates.length);
        setStreak(calcStreak(dates));
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen pb-28">
      <header className="px-5 pt-14 pb-5" style={{ borderBottom: "2px solid #3a3a3a" }}>
        <h1 className="text-[28px] font-[family-name:var(--font-oswald)] font-bold text-[#f5f0e8] leading-none"
          style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.8)" }}>
          {t.calendar.title}
        </h1>
        <div className="flex gap-3 mt-4">
          <div className="px-4 py-3 flex items-baseline gap-2"
            style={{ background: "#5a5a5a", border: "2px solid #2a2a2a",
              boxShadow: "inset 3px 3px 0 rgba(255,255,255,0.25), inset -3px -3px 0 rgba(0,0,0,0.55)" }}>
            <span className="text-[32px] leading-none font-[family-name:var(--font-oswald)] font-bold text-[#f5f0e8]"
              style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.8)" }}>
              {totalDays}
            </span>
            <span className="text-xs font-bold" style={{ color: "#cccccc", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>{t.calendar.totalDays}</span>
          </div>
          <div className="px-4 py-3 flex items-baseline gap-2"
            style={{ background: "#2a1a0a", border: "2px solid #7a2800",
              boxShadow: "inset 3px 3px 0 rgba(255,107,43,0.2), inset -3px -3px 0 rgba(0,0,0,0.55)" }}>
            <span className="text-[32px] leading-none font-[family-name:var(--font-oswald)] font-bold text-[#ff6b2b]"
              style={{ textShadow: "2px 2px 0 rgba(100,30,0,0.8)" }}>
              {streak}
            </span>
            <span className="text-xs font-bold" style={{ color: "#cccccc", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>{t.calendar.streakUnit}</span>
          </div>
        </div>
      </header>

      <div className="px-5 pt-4">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-5 h-5 border-2 border-[#ff6b2b] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <MonthCalendar logDates={logDates} />
        )}
      </div>

      <BottomNav />
    </div>
  );
}
