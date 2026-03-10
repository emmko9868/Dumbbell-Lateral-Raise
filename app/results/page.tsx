"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/i18n/context";
import { todayString } from "@/lib/utils/streak";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function ResultsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useLang();
  const reps = parseInt(params.get("reps") ?? "0", 10);
  const [rank, setRank] = useState<number | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  useEffect(() => {
    async function fetchRank() {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      const supabase = createClient();
      const today = todayString();
      const { data } = await supabase.from("daily_rankings").select("rank").eq("date", today).eq("user_id", userId).single();
      if (data) setRank(data.rank);
      const { data: prevLogs } = await supabase.from("workout_logs").select("reps").eq("user_id", userId).neq("date", today).order("reps", { ascending: false }).limit(1);
      setIsNewRecord(reps > (prevLogs?.[0]?.reps ?? 0));
    }
    fetchRank();
  }, [reps]);

  function handleShare() {
    const text = t.results.shareText(reps);
    if (navigator.share) navigator.share({ text });
    else navigator.clipboard.writeText(text);
  }

  const title = isNewRecord ? t.results.titleRecord : t.results.titleNormal;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-[320px] space-y-5">

          {/* Header */}
          <div className="text-center space-y-2">
            {isNewRecord && (
              <Badge variant="orange" className="text-xs px-3 py-1 h-auto">
                {t.results.newRecord}
              </Badge>
            )}
            <h1 className="text-2xl font-bold text-foreground leading-snug">
              {title}
            </h1>
          </div>

          {/* Big number */}
          <Card className="border ring-1 ring-[var(--color-neon)]/20">
            <CardContent className="py-8 text-center">
              <span className="text-[100px] leading-none font-display font-bold text-[var(--color-neon)]">
                {reps}
              </span>
              <span className="text-2xl font-display text-muted-foreground ml-2">
                {t.unit}
              </span>
            </CardContent>
          </Card>

          {/* Rank + motivation */}
          <Card className="border">
            <CardContent className="py-4 px-5 space-y-3">
              {rank !== null && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">오늘 순위</span>
                    <span className="font-display font-bold text-lg text-[var(--color-orange)]">
                      {t.results.rank(rank)}
                    </span>
                  </div>
                  <Separator />
                </>
              )}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.results.motivation(reps)}
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button variant="outline" size="lg" onClick={handleShare} className="w-full">
              {t.results.share}
            </Button>
            <Button size="lg" onClick={() => router.push("/")} className="w-full">
              {t.results.home}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ResultsContent />
    </Suspense>
  );
}
