"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface MonthCalendarProps {
  logDates: string[];
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function MonthCalendar({ logDates }: MonthCalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const dateSet = new Set(logDates);
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
  const achievedDays = logDates.filter((d) => d.startsWith(monthStr)).length;

  function prev() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }
  function next() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <Card className="border overflow-hidden">
      {/* Nav */}
      <div className="flex items-center justify-between px-4 py-3">
        <Button variant="ghost" size="icon-sm" onClick={prev} className="text-lg">
          ‹
        </Button>
        <div className="text-center">
          <p className="font-display font-bold text-base text-foreground">
            {year}. {String(month + 1).padStart(2, "0")}
          </p>
          {achievedDays > 0 && (
            <p className="text-[10px] font-semibold mt-0.5 text-[var(--color-neon)]">
              {achievedDays}일 달성
            </p>
          )}
        </div>
        <Button variant="ghost" size="icon-sm" onClick={next} className="text-lg">
          ›
        </Button>
      </div>

      <Separator />

      <CardContent className="p-4 pt-3">
        {/* Day labels */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] py-1 font-semibold text-muted-foreground">
              {d}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={`e-${i}`} className="aspect-square" />;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const achieved = dateSet.has(dateStr);
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

            return (
              <div key={day} className="aspect-square flex items-center justify-center">
                <div className={cn(
                  "w-full h-full flex items-center justify-center text-xs font-semibold rounded-md transition-colors",
                  achieved
                    ? "bg-[var(--color-neon-muted)] text-[var(--color-neon)] ring-1 ring-[var(--color-neon)]/30"
                    : isToday
                    ? "bg-[var(--color-orange-muted)] text-[var(--color-orange)] ring-1 ring-[var(--color-orange)]/30"
                    : "text-muted-foreground hover:bg-muted"
                )}>
                  {day}
                </div>
              </div>
            );
          })}
        </div>

        {achievedDays === 0 && (
          <p className="text-center text-xs text-muted-foreground mt-4 pb-1">
            이번 달 기록 없음
          </p>
        )}
      </CardContent>
    </Card>
  );
}
