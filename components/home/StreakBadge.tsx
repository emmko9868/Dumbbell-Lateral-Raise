"use client";

import { useLang } from "@/lib/i18n/context";

interface StreakBadgeProps {
  streak: number;
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
  const { t } = useLang();

  return (
    <div className="px-5 py-4 flex items-center justify-between"
      style={{
        background: "#111e35",
        border: "2px solid #1e3a60",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 20px rgba(0,0,0,0.5)",
      }}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center text-xl"
          style={{ background: "#1e3050", border: "2px solid #2a4470" }}>
          🔥
        </div>
        <div>
          {streak > 0 ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-[44px] leading-none font-[family-name:var(--font-oswald)] font-bold"
                style={{ color: "#ffc107", textShadow: "2px 2px 0 rgba(100,50,0,0.6)" }}>
                {streak}
              </span>
              <span className="text-sm font-bold" style={{ color: "#6b82a8" }}>
                {t.streak.unit}
              </span>
            </div>
          ) : (
            <p className="font-bold text-white">
              {t.streak.zero}
            </p>
          )}
        </div>
      </div>
      {streak > 0 && (
        <div className="text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-1"
          style={{ color: "#ffc107", background: "#1e3050", border: "1px solid #2a4470" }}>
          STREAK
        </div>
      )}
    </div>
  );
}
