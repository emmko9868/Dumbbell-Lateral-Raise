"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
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
          setError("이미 사용 중인 닉네임이에요.");
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
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a1628 0%, #061020 100%)",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      <div className="w-full max-w-[320px] relative z-10">
        {/* Title panel */}
        <div
          className="text-center mb-6 px-8 py-6"
          style={{
            background: "#0d1c35",
            border: "2px solid #1e3a60",
            boxShadow: "0 0 60px rgba(229,57,53,0.15), 0 20px 40px rgba(0,0,0,0.6)",
          }}
        >
          <p className="text-[10px] tracking-[0.3em] uppercase mb-4 font-bold" style={{ color: "#6b82a8" }}>
            어깨 운동 챌린지
          </p>
          <div className="leading-[0.85] mb-4">
            <div
              className="text-[88px] font-[family-name:var(--font-oswald)] font-bold tracking-tight"
              style={{ color: "#e53935", textShadow: "4px 4px 0 rgba(100,0,0,0.7), 0 0 60px rgba(229,57,53,0.4)" }}
            >
              어깨
            </div>
            <div
              className="text-[88px] font-[family-name:var(--font-oswald)] font-bold tracking-tight"
              style={{ color: "#ffc107", textShadow: "4px 4px 0 rgba(100,50,0,0.7)" }}
            >
              깡패
            </div>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#6b82a8" }}>
            하루 한 번, 어깨를 깡패로 만든다
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="나만의 닉네임 (ex. 어깨왕, 헬창99)"
            maxLength={20}
            autoFocus
            className="mc-input w-full px-4 py-4 text-[#f5f0e8] placeholder-[#555555] text-sm"
          />
          {error && (
            <p className="text-[#ff6b2b] text-xs px-1" style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.8)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!nickname.trim() || loading}
            className="mc-btn-orange w-full py-4 text-base disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? "잠깐만..." : "깡패 되러 가기"}
          </button>
        </form>
      </div>
    </div>
  );
}
