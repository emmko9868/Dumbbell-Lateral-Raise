"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/i18n/context";
import LangToggle from "@/components/ui/LangToggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OnboardingPage() {
  const router = useRouter();
  const { t } = useLang();
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (!trimmed) return;
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error: insertError } = await supabase
        .from("users")
        .insert({ nickname: trimmed })
        .select("id")
        .single();

      if (insertError) {
        if (insertError.code === "23505") {
          setError(t.onboarding.dupError);
          setLoading(false);
          return;
        }
        throw insertError;
      }
      localStorage.setItem("userId", data.id);
    } catch {
      const localId = typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
          });
      localStorage.setItem("userId", localId);
    }

    localStorage.setItem("nickname", trimmed);
    router.push("/");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-[320px] space-y-4">
        {/* Lang toggle */}
        <div className="flex justify-end">
          <LangToggle />
        </div>

        {/* Title card */}
        <Card className="border text-center">
          <CardContent className="px-8 py-8 space-y-3">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-muted-foreground">
              {t.onboarding.badge}
            </p>
            <div className="leading-[0.85]">
              <div className="text-[80px] font-display font-bold tracking-tight text-primary">
                {t.appName.split(" ")[0]}
              </div>
              <div className="text-[80px] font-display font-bold tracking-tight text-[var(--color-yellow)]">
                {t.appName.split(" ")[1] ?? ""}
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              {t.appSub}
            </p>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={t.onboarding.placeholder}
            maxLength={20}
            autoFocus
            className="h-12 text-sm bg-card border-border focus-visible:ring-primary"
          />
          {error && (
            <p className="text-primary text-xs px-1">{error}</p>
          )}
          <Button
            type="submit"
            size="lg"
            disabled={!nickname.trim() || loading}
            className="w-full"
          >
            {loading ? t.onboarding.loading : t.onboarding.cta}
          </Button>
        </form>
      </div>
    </div>
  );
}
