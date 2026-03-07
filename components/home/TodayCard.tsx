"use client";

import Link from "next/link";

interface TodayCardProps {
  reps: number | null;
  completed: boolean;
}

const PANEL = {
  background: "#111e35",
  border: "2px solid #1e3a60",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 20px rgba(0,0,0,0.5)",
} as const;

const PANEL_GREEN = {
  background: "#0a1f0a",
  border: "2px solid #2e7d32",
  boxShadow: "inset 0 1px 0 rgba(76,175,80,0.15), 0 4px 20px rgba(0,0,0,0.5)",
} as const;

export default function TodayCard({ reps, completed }: TodayCardProps) {
  return (
    <div className="p-5" style={completed ? PANEL_GREEN : PANEL}>
      <p className="text-[10px] tracking-[0.25em] uppercase font-bold mb-4"
        style={{ color: "#6b82a8" }}>
        오늘의 기록
      </p>

      {completed ? (
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <span className="text-[88px] leading-none font-[family-name:var(--font-oswald)] font-bold"
              style={{ color: "#4caf50", textShadow: "3px 3px 0 rgba(0,60,0,0.6), 0 0 40px rgba(76,175,80,0.4)" }}>
              {reps}
            </span>
            <span className="text-xl pb-3" style={{ color: "#6b82a8" }}>회</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: "#4caf50", boxShadow: "0 0 8px rgba(76,175,80,0.8)" }} />
            <p className="text-sm font-bold" style={{ color: "#4caf50" }}>
              오늘 완료!
            </p>
          </div>
          <Link href="/ranking" className="mc-btn block text-center py-3 text-sm">
            내일 또 봐요
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-white text-xl font-bold">
            오늘 아직 안 했어요
          </p>
          <Link href="/exercise" className="mc-btn-orange block text-center py-4 text-[17px]">
            지금 바로 하기
          </Link>
        </div>
      )}
    </div>
  );
}
