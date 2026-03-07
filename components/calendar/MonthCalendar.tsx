"use client";

import { useState } from "react";

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
    <div className="p-4" style={{
      background: "#5a5a5a",
      border: "2px solid #2a2a2a",
      boxShadow: "inset 3px 3px 0 rgba(255,255,255,0.25), inset -3px -3px 0 rgba(0,0,0,0.55)",
    }}>
      {/* Nav */}
      <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: "2px solid #2a2a2a" }}>
        <button onClick={prev} className="w-9 h-9 flex items-center justify-center text-xl font-bold"
          style={{ background: "#636363", border: "2px solid #2a2a2a",
            boxShadow: "inset 2px 2px 0 rgba(255,255,255,0.3), inset -2px -2px 0 rgba(0,0,0,0.5)",
            color: "#f5f0e8", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>
          ‹
        </button>
        <div className="text-center">
          <p className="font-bold font-[family-name:var(--font-oswald)] text-lg"
            style={{ color: "#f5f0e8", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>
            {year}. {String(month + 1).padStart(2, "0")}
          </p>
          {achievedDays > 0 && (
            <p className="text-[9px] font-bold mt-0.5 tracking-wide"
              style={{ color: "#39ff14", textShadow: "1px 1px 0 rgba(0,40,0,0.8)" }}>
              {achievedDays}일 달성
            </p>
          )}
        </div>
        <button onClick={next} className="w-9 h-9 flex items-center justify-center text-xl font-bold"
          style={{ background: "#636363", border: "2px solid #2a2a2a",
            boxShadow: "inset 2px 2px 0 rgba(255,255,255,0.3), inset -2px -2px 0 rgba(0,0,0,0.5)",
            color: "#f5f0e8", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>
          ›
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] py-1.5 font-bold"
            style={{ color: "#cccccc", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} className="aspect-square" />;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const achieved = dateSet.has(dateStr);
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

          return (
            <div key={day} className="aspect-square flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center text-sm font-bold"
                style={achieved ? {
                  background: "#1a4a1a", border: "2px solid #39ff14",
                  color: "#39ff14", textShadow: "1px 1px 0 rgba(0,40,0,0.8)",
                  boxShadow: "inset 1px 1px 0 rgba(57,255,20,0.2)",
                } : isToday ? {
                  background: "#2a1000", border: "2px solid #ff6b2b",
                  color: "#ff6b2b", textShadow: "1px 1px 0 rgba(100,30,0,0.8)",
                } : {
                  background: "#444444", border: "1px solid #2a2a2a", color: "#cccccc",
                }}>
                {day}
              </div>
            </div>
          );
        })}
      </div>

      {achievedDays === 0 && (
        <p className="text-center text-xs font-bold mt-4 pb-1"
          style={{ color: "#aaaaaa", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>
          이번 달 기록 없음
        </p>
      )}
    </div>
  );
}
