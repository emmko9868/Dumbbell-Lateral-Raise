"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/i18n/context";
import { todayString } from "@/lib/utils/streak";

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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-full max-w-[320px]">
          {isNewRecord && (
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-6 font-bold text-xs tracking-wide"
              style={{ background: "#2a1000", border: "2px solid #ff6b2b", color: "#ff6b2b",
                boxShadow: "inset 2px 2px 0 rgba(255,255,255,0.1), inset -2px -2px 0 rgba(0,0,0,0.4)" }}>
              {t.results.newRecord}
            </div>
          )}

          <h1 className="text-2xl font-bold text-[#f5f0e8] mb-8 leading-snug"
            style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.8)" }}>
            {title}
          </h1>

          {/* Big number panel */}
          <div className="mb-6 py-6"
            style={{ background: "#1a3a1a", border: "2px solid #2a5a2a",
              boxShadow: "inset 3px 3px 0 rgba(57,255,20,0.1), inset -3px -3px 0 rgba(0,0,0,0.6)" }}>
            <span className="text-[110px] leading-none font-[family-name:var(--font-oswald)] font-bold text-[#39ff14]"
              style={{ textShadow: "4px 4px 0 rgba(0,60,0,0.8), 0 0 60px rgba(57,255,20,0.25)" }}>
              {reps}
            </span>
            <span className="text-3xl font-[family-name:var(--font-oswald)] ml-2"
              style={{ color: "#aaaaaa", textShadow: "1px 1px 0 rgba(0,0,0,0.8)" }}>
              {t.unit}
            </span>
          </div>

          {rank !== null && (
            <p className="font-bold mb-6" style={{ color: "#ff6b2b", textShadow: "2px 2px 0 rgba(100,30,0,0.8)" }}>
              {t.results.rank(rank)}
            </p>
          )}
          {rank === null && <div className="mb-6" />}

          <p className="text-sm leading-relaxed mb-8" style={{ color: "#cccccc", textShadow: "1px 1px 0 rgba(0,0,0,0.8)" }}>
            {t.results.motivation(reps)}
          </p>

          <div className="space-y-2">
            <button onClick={handleShare} className="mc-btn w-full py-4 text-sm">
              {t.results.share}
            </button>
            <button onClick={() => router.push("/")} className="mc-btn-orange w-full py-4 text-[17px]">
              {t.results.home}
            </button>
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
