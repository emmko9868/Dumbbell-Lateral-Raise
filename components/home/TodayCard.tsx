"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n/context";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TodayCardProps {
  reps: number | null;
  completed: boolean;
}

export default function TodayCard({ reps, completed }: TodayCardProps) {
  const { t } = useLang();

  return (
    <Card className={cn(
      "border transition-all",
      completed && "ring-1 ring-[var(--color-neon)]/20"
    )}>
      <CardContent className="p-5 space-y-4">
        <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-muted-foreground">
          {t.today.label}
        </p>

        {completed ? (
          <>
            <div className="flex items-end gap-2">
              <span className="text-[88px] leading-none font-display font-bold text-[var(--color-neon)]">
                {reps}
              </span>
              <span className="text-xl pb-3 text-muted-foreground">{t.unit}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-neon)] animate-pulse" />
              <p className="text-sm font-semibold text-[var(--color-neon)]">{t.today.done}</p>
            </div>
            <Link
              href="/ranking"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
            >
              {t.today.doneCta}
            </Link>
          </>
        ) : (
          <>
            <p className="text-foreground text-xl font-bold">{t.today.notDone}</p>
            <Link
              href="/exercise"
              className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full")}
            >
              {t.today.startCta}
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
