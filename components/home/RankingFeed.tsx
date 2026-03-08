"use client";

import type { DailyRanking } from "@/lib/supabase/types";
import Link from "next/link";
import { useLang } from "@/lib/i18n/context";

interface RankingFeedProps {
  rankings: DailyRanking[];
  myUserId: string | null;
}

const PANEL: React.CSSProperties = {
  background: "#5a5a5a",
  border: "2px solid #2a2a2a",
  boxShadow: "inset 3px 3px 0 rgba(255,255,255,0.25), inset -3px -3px 0 rgba(0,0,0,0.55)",
};

export default function RankingFeed({ rankings, myUserId }: RankingFeedProps) {
  const { t } = useLang();

  if (rankings.length === 0) {
    return (
      <div className="p-10 text-center" style={PANEL}>
        <p className="text-sm font-bold" style={{ color: "#cccccc", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>
          {t.ranking.empty}
        </p>
      </div>
    );
  }

  return (
    <div style={PANEL}>
      <div className="px-5 py-3 flex items-center justify-between"
        style={{ borderBottom: "2px solid #2a2a2a", background: "#444444" }}>
        <h2 className="text-sm font-bold" style={{ color: "#f5f0e8", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>
          {t.ranking.title}
        </h2>
        <span className="text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5"
          style={{ color: "#cccccc", background: "#2a2a2a", border: "1px solid #5a5a5a" }}>
          {t.ranking.realtime}
        </span>
      </div>

      <ul>
        {rankings.slice(0, 10).map((entry) => {
          const isMe = entry.user_id === myUserId;
          const isFirst = entry.rank === 1;

          return (
            <li key={entry.user_id}>
              <Link href={`/profile/${entry.user_id}`}
                className="flex items-center gap-4 px-5 py-3 transition-all"
                style={{
                  borderBottom: "1px solid #3a3a3a",
                  background: isMe ? "#1c1408" : isFirst ? "#131008" : "transparent",
                }}>
                <div className="w-8 text-center shrink-0">
                  {isFirst ? (
                    <span className="text-lg">👑</span>
                  ) : (
                    <span className="font-[family-name:var(--font-oswald)] font-bold text-base"
                      style={{ color: (entry.rank ?? 99) <= 3 ? "#ff6b2b" : "#cccccc", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>
                      {entry.rank}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <span className="text-sm font-medium truncate"
                    style={{ color: "#f5f0e8", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>
                    {entry.nickname}
                  </span>
                  {isFirst && (
                    <span className="text-[9px] font-bold tracking-wide shrink-0 px-1.5 py-0.5"
                      style={{ color: "#ff6b2b", background: "#2a1000", border: "1px solid #7a2800" }}>
                      {t.ranking.king}
                    </span>
                  )}
                  {isMe && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 shrink-0"
                      style={{ color: "#39ff14", background: "#001800", border: "1px solid #1a6600" }}>
                      {t.ranking.me}
                    </span>
                  )}
                </div>

                <div className="shrink-0">
                  <span className="font-[family-name:var(--font-oswald)] font-bold text-xl"
                    style={{ color: isMe ? "#39ff14" : "#f5f0e8", textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}>
                    {entry.reps}
                  </span>
                  <span className="text-xs ml-0.5" style={{ color: "#aaaaaa" }}>{t.unit}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {rankings.length > 10 && (
        <Link href="/ranking" className="block text-center py-3 text-xs font-bold"
          style={{ borderTop: "2px solid #2a2a2a", color: "#cccccc", background: "#444444" }}>
          {t.ranking.viewAll}
        </Link>
      )}
    </div>
  );
}
