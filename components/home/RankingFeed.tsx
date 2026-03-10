"use client";

import type { DailyRanking } from "@/lib/supabase/types";
import Link from "next/link";
import { useLang } from "@/lib/i18n/context";
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface RankingFeedProps {
  rankings: DailyRanking[];
  myUserId: string | null;
}

export default function RankingFeed({ rankings, myUserId }: RankingFeedProps) {
  const { t } = useLang();

  if (rankings.length === 0) {
    return (
      <Card className="border">
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">{t.ranking.empty}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border overflow-hidden">
      <CardHeader className="px-5 py-3 border-b border-border">
        <CardTitle className="text-sm font-semibold text-foreground">
          {t.ranking.title}
        </CardTitle>
        <CardAction>
          <Badge variant="realtime" className="text-[10px]">
            {t.ranking.realtime}
          </Badge>
        </CardAction>
      </CardHeader>

      <ul>
        {rankings.slice(0, 10).map((entry, idx) => {
          const isMe = entry.user_id === myUserId;
          const isFirst = entry.rank === 1;
          const isTop3 = (entry.rank ?? 99) <= 3;

          return (
            <li key={entry.user_id}>
              {idx > 0 && <Separator />}
              <Link
                href={`/profile/${entry.user_id}`}
                className={cn(
                  "flex items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/40",
                  isMe && "bg-[var(--color-orange-muted)]"
                )}
              >
                <div className="w-7 text-center shrink-0">
                  {isFirst ? (
                    <span className="text-base">👑</span>
                  ) : (
                    <span className={cn(
                      "font-display font-bold text-sm",
                      isTop3 ? "text-[var(--color-orange)]" : "text-muted-foreground"
                    )}>
                      {entry.rank}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {entry.nickname}
                  </span>
                  {isFirst && (
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

                <div className="shrink-0 text-right">
                  <span className={cn(
                    "font-display font-bold text-lg",
                    isMe ? "text-[var(--color-neon)]" : "text-foreground"
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

      {rankings.length > 10 && (
        <div className="border-t border-border">
          <Link href="/ranking" className="block text-center py-3 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
            {t.ranking.viewAll}
          </Link>
        </div>
      )}
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
