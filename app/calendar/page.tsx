"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import MonthCalendar from "@/components/calendar/MonthCalendar";
import BottomNav from "@/components/ui/BottomNav";
import { calcStreak } from "@/lib/utils/streak";
import { useLang } from "@/lib/i18n/context";
import { Card, CardContent } from "@/components/ui/card";

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
      <header className="px-5 pt-12 pb-5 border-b border-border">
        <h1 className="text-[28px] font-display font-bold text-foreground leading-none">
          {t.calendar.title}
        </h1>
        <div className="flex gap-3 mt-4">
          <Card className="border flex-1">
            <CardContent className="px-4 py-3 flex items-baseline gap-2">
              <span className="text-[32px] leading-none font-display font-bold text-foreground">
                {totalDays}
              </span>
              <span className="text-xs text-muted-foreground font-medium">{t.calendar.totalDays}</span>
            </CardContent>
          </Card>
          <Card className="border flex-1 ring-1 ring-[var(--color-orange)]/20">
            <CardContent className="px-4 py-3 flex items-baseline gap-2">
              <span className="text-[32px] leading-none font-display font-bold text-[var(--color-orange)]">
                {streak}
              </span>
              <span className="text-xs text-muted-foreground font-medium">{t.calendar.streakUnit}</span>
            </CardContent>
          </Card>
        </div>
      </header>

      <div className="px-5 pt-4">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <MonthCalendar logDates={logDates} />
        )}
      </div>

      <BottomNav />
    </div>
  );
}
