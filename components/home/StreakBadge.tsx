"use client";

import { useLang } from "@/lib/i18n/context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StreakBadgeProps {
  streak: number;
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
  const { t } = useLang();

  return (
    <Card className="border">
      <CardContent className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center text-xl rounded-lg bg-muted">
            🔥
          </div>
          <div>
            {streak > 0 ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-[44px] leading-none font-display font-bold text-[var(--color-yellow)]">
                  {streak}
                </span>
                <span className="text-sm text-muted-foreground font-medium">
                  {t.streak.unit}
                </span>
              </div>
            ) : (
              <p className="font-semibold text-foreground">{t.streak.zero}</p>
            )}
          </div>
        </div>
        {streak > 0 && (
          <Badge variant="yellow" className="text-[10px] tracking-[0.2em] uppercase">
            STREAK
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
