"use client";

import type { DailyRanking } from "@/lib/supabase/types";
import Link from "next/link";
import { useLang } from "@/lib/i18n/context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface LeaderboardListProps {
  rankings: DailyRanking[];
  myUserId: string | null;
}

export default function LeaderboardList({ rankings, myUserId }: LeaderboardListProps) {
  const { t } = useLang();

  if (rankings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <p className="text-sm text-muted-foreground">{t.ranking.empty}</p>
      </div>
    );
  }

  const myEntry = rankings.find((r) => r.user_id === myUserId);

  return (
    <div className="relative">
      <ul>
        {rankings.map((entry, idx) => {
          const isMe = entry.user_id === myUserId;
          const isKing = entry.rank === 1;
          const isTop3 = (entry.rank ?? 99) <= 3;

          return (
            <li key={entry.user_id}>
              {idx > 0 && <Separator />}
              <Link
                href={`/profile/${entry.user_id}`}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40",
                  isMe && "bg-[var(--color-orange-muted)]",
                  isKing && !isMe && "bg-yellow-500/5"
                )}
              >
                <div className="w-10 shrink-0 text-center">
                  {isKing ? (
                    <span className="text-2xl">👑</span>
                  ) : (
                    <span className={cn(
                      "font-display font-bold text-lg",
                      isTop3 ? "text-[var(--color-orange)]" : "text-muted-foreground"
                    )}>
                      {entry.rank}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn(
                      "font-medium truncate",
                      isKing ? "text-[var(--color-yellow)]" : "text-foreground"
                    )}>
                      {entry.nickname}
                    </span>
                    {isKing && (
                      <Badge variant="orange" className="text-[10px] shrink-0">
                        {t.ranking.king}
                      </Badge>
                    )}
                    {isMe && (
                      <Badge variant="neon" className="text-[10px] shrink-0">
                        {t.ranking.me}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className={cn(
                    "font-display font-bold text-2xl",
                    isMe ? "text-[var(--color-neon)]" : isKing ? "text-[var(--color-yellow)]" : "text-foreground"
                  )}>
                    {entry.reps}
                  </span>
                  <span className="text-xs text-muted-foreground ml-0.5">{t.unit}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {myEntry && (
        <div className="sticky bottom-[72px] px-4 py-2 pointer-events-none">
          <Card className="border border-[var(--color-orange)]/40 bg-[var(--color-orange-muted)] pointer-events-auto shadow-lg">
            <CardContent className="px-5 py-3 flex items-center gap-4">
              <span className="font-display font-bold text-xl w-10 text-center shrink-0 text-[var(--color-orange)]">
                {myEntry.rank}
              </span>
              <span className="flex-1 font-medium truncate text-foreground flex items-center gap-2">
                {myEntry.nickname}
                <Badge variant="neon" className="text-[10px] shrink-0">{t.ranking.me}</Badge>
              </span>
              <span className="font-display font-bold text-2xl shrink-0 text-[var(--color-neon)]">
                {myEntry.reps}
                <span className="text-xs font-normal ml-0.5 text-muted-foreground">{t.unit}</span>
              </span>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
