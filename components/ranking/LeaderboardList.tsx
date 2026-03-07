"use client";

import type { DailyRanking } from "@/lib/supabase/types";
import Link from "next/link";

interface LeaderboardListProps {
  rankings: DailyRanking[];
  myUserId: string | null;
}

export default function LeaderboardList({ rankings, myUserId }: LeaderboardListProps) {
  if (rankings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <p className="text-sm font-bold" style={{ color: "#cccccc", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>
          오늘 첫 번째 깡패가 되어보세요
        </p>
      </div>
    );
  }

  const myEntry = rankings.find((r) => r.user_id === myUserId);

  return (
    <div className="relative">
      <ul>
        {rankings.map((entry) => {
          const isMe = entry.user_id === myUserId;
          const isKing = entry.rank === 1;
          const isTop3 = (entry.rank ?? 99) <= 3;

          return (
            <li key={entry.user_id}>
              <Link href={`/profile/${entry.user_id}`}
                className="flex items-center gap-4 px-5 py-4 transition-all"
                style={{ borderBottom: "1px solid #3a3a3a", background: isMe ? "#1c1408" : isKing ? "#131008" : "transparent" }}>
                <div className="w-10 shrink-0 text-center">
                  {isKing ? <span className="text-2xl">👑</span> : (
                    <span className="font-[family-name:var(--font-oswald)] font-bold text-lg"
                      style={{ color: isTop3 ? "#ff6b2b" : "#cccccc", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>
                      {entry.rank}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium truncate"
                      style={{ color: isKing ? "#f5c842" : "#f5f0e8", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>
                      {entry.nickname}
                    </span>
                    {isKing && (
                      <span className="text-[9px] font-bold tracking-wide shrink-0 px-1.5 py-0.5"
                        style={{ color: "#ff6b2b", background: "#2a1000", border: "1px solid #7a2800" }}>
                        오늘의 깡패
                      </span>
                    )}
                    {isMe && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 shrink-0"
                        style={{ color: "#39ff14", background: "#001800", border: "1px solid #1a6600" }}>
                        나
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="font-[family-name:var(--font-oswald)] font-bold text-2xl"
                    style={{ color: isMe ? "#39ff14" : isKing ? "#f5c842" : "#f5f0e8", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>
                    {entry.reps}
                  </span>
                  <span className="text-xs ml-0.5" style={{ color: "#aaaaaa" }}>회</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {myEntry && (
        <div className="sticky bottom-[72px] px-4 py-2 pointer-events-none">
          <div className="px-5 py-3 flex items-center gap-4 pointer-events-auto"
            style={{ background: "#1c1408", border: "2px solid #ff6b2b",
              boxShadow: "inset 2px 2px 0 rgba(255,107,43,0.2), inset -2px -2px 0 rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.8)" }}>
            <span className="font-[family-name:var(--font-oswald)] font-bold text-xl w-10 text-center shrink-0"
              style={{ color: "#ff6b2b", textShadow: "1px 1px 0 rgba(100,30,0,0.8)" }}>
              {myEntry.rank}
            </span>
            <span className="flex-1 font-medium truncate" style={{ color: "#f5f0e8", textShadow: "1px 1px 0 rgba(0,0,0,0.8)" }}>
              {myEntry.nickname}
              <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5"
                style={{ color: "#39ff14", background: "#001800", border: "1px solid #1a6600" }}>
                나
              </span>
            </span>
            <span className="font-[family-name:var(--font-oswald)] font-bold text-2xl shrink-0"
              style={{ color: "#39ff14", textShadow: "1px 1px 0 rgba(0,40,0,0.8)" }}>
              {myEntry.reps}
              <span className="text-xs font-normal ml-0.5" style={{ color: "#aaaaaa" }}>회</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
