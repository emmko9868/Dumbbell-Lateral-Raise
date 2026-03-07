"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CameraView from "@/components/camera/CameraView";
import PoseOverlay from "@/components/camera/PoseOverlay";
import DinoGame, { type GamePhase } from "@/components/exercise/DinoGame";
import { initPoseLandmarker, type PoseLandmarkerResult } from "@/lib/pose/detector";
import { createRepCounter, processPoseResult, type RepCounterState } from "@/lib/pose/repCounter";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { todayString } from "@/lib/utils/streak";

export default function ExercisePage() {
  const router = useRouter();

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraAllowed, setCameraAllowed] = useState<boolean | null>(null);
  const [poseResult, setPoseResult] = useState<PoseLandmarkerResult | null>(null);
  const [repState, setRepState] = useState<RepCounterState>(createRepCounter());

  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [gamePhase, setGamePhase] = useState<GamePhase>("idle");
  const [score, setScore] = useState(0);
  const [jumpCount, setJumpCount] = useState(0);
  const [saving, setSaving] = useState(false);

  const bestScoreRef = useRef(0);
  const animFrameRef = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);

  const handleStream = useCallback((s: MediaStream) => {
    streamRef.current = s;
    setCameraAllowed(true);
    setCameraReady(true);
  }, []);

  const handleCameraError = useCallback(() => {
    setCameraAllowed(false);
  }, []);

  useEffect(() => {
    if (!cameraReady) return;
    let cancelled = false;
    let landmarker: Awaited<ReturnType<typeof initPoseLandmarker>> | null = null;

    async function startLoop() {
      try { landmarker = await initPoseLandmarker(); } catch { return; }
      const video = document.querySelector("video") as HTMLVideoElement | null;
      if (!video) return;
      function loop() {
        if (cancelled) return;
        if (video!.readyState >= 2) {
          const result = landmarker!.detectForVideo(video!, performance.now());
          setPoseResult(result);
          setRepState((prev) => processPoseResult(prev, result));
        }
        animFrameRef.current = requestAnimationFrame(loop);
      }
      animFrameRef.current = requestAnimationFrame(loop);
    }

    startLoop();
    return () => { cancelled = true; cancelAnimationFrame(animFrameRef.current); };
  }, [cameraReady]);

  useEffect(() => {
    if (score > bestScoreRef.current) bestScoreRef.current = score;
  }, [score]);

  const handlePhaseChange = useCallback((phase: GamePhase) => setGamePhase(phase), []);
  const handleScoreChange = useCallback((s: number) => setScore(s), []);
  const handleJump = useCallback(() => setJumpCount((n) => n + 1), []);

  async function handleSave() {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    setSaving(true);
    const today = todayString();
    const finalScore = bestScoreRef.current;
    localStorage.setItem(`reps_${today}`, String(finalScore));
    try {
      if (isSupabaseConfigured) {
        const supabase = createClient();
        await supabase.from("workout_logs").upsert(
          { user_id: userId, date: today, reps: finalScore, completed_at: new Date().toISOString() },
          { onConflict: "user_id,date", ignoreDuplicates: false }
        );
      }
    } catch { /* offline fallback */ }
    router.push(`/results?reps=${finalScore}`);
  }

  const isUp = cameraAllowed === true ? repState.isUp : false;
  const isTapMode = cameraAllowed === false;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-5 pt-12 pb-3 shrink-0"
        style={{ borderBottom: "2px solid #1e3050" }}>
        <button onClick={() => router.back()} className="mc-btn text-sm px-3 py-1.5">
          ← 뒤로
        </button>
        {gamePhase === "playing" && (
          <div className="flex items-center gap-2 px-3 py-1"
            style={{ background: "#1e3050", border: "1px solid #2a4470" }}>
            <span className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#4caf50", boxShadow: "0 0 6px rgba(76,175,80,0.8)" }} />
            <p className="text-xs font-bold" style={{ color: "#ffc107" }}>
              퍼덕 {jumpCount}회
            </p>
          </div>
        )}
      </header>

      <main className="flex-1 grid grid-rows-2 overflow-hidden">
        {/* TOP HALF — Camera */}
        <div className="relative overflow-hidden" style={{ borderBottom: "2px solid #3a3a3a" }}>
          {cameraAllowed !== false && (
            <div className={`absolute inset-0 ${cameraAllowed === true && cameraReady ? "block" : "hidden"}`}>
              <CameraView
                key={facingMode}
                onStream={handleStream}
                onError={handleCameraError}
                facingMode={facingMode}
              />
              {poseResult && <PoseOverlay result={poseResult} isUp={repState.isUp} />}
              <div className="absolute inset-0 bg-black/25" />
            </div>
          )}

          {/* 카메라 전환 버튼 */}
          {cameraAllowed === true && cameraReady && (
            <button
              onClick={() => setFacingMode((m) => m === "user" ? "environment" : "user")}
              className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center"
              style={{
                background: "rgba(10,22,40,0.7)",
                border: "1px solid #2a4470",
              }}
              aria-label="카메라 전환"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 16v4h-4" />
                <path d="M4 8V4h4" />
                <path d="M4 8a9 9 0 0 1 15.8-1.5" />
                <path d="M20 16a9 9 0 0 1-15.8 1.5" />
              </svg>
            </button>
          )}

          {/* 카메라 대기 중 */}
          {cameraAllowed === null && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: "#111" }}>
              <p className="text-xs font-bold" style={{ color: "#555" }}>카메라 연결 중...</p>
            </div>
          )}

          {/* 탭 모드 */}
          {isTapMode && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: "#111" }}>
              <p className="text-sm font-bold" style={{ color: "#cccccc" }}>탭해서 카운트</p>
            </div>
          )}

          {/* 팔 상태 표시 (하단 오버레이) */}
          {cameraAllowed === true && (
            <div className="absolute bottom-2 left-3 flex items-center gap-2 px-2 py-1"
              style={{ background: "rgba(10,22,40,0.75)" }}>
              <div className="w-2 h-2 rounded-full transition-all"
                style={repState.isUp
                  ? { background: "#4caf50", boxShadow: "0 0 8px rgba(76,175,80,0.9)" }
                  : { background: "#1e3050", border: "1px solid #2a4470" }} />
              <p className="text-[10px] font-bold" style={{ color: repState.isUp ? "#4caf50" : "#6b82a8" }}>
                {repState.isUp ? "팔 올라감 — 퍼덕!" : "팔을 어깨 위로 들어올리세요"}
              </p>
            </div>
          )}
        </div>

        {/* BOTTOM HALF — Game */}
        <div className="flex flex-col overflow-hidden">
          <DinoGame isUp={isUp} onPhaseChange={handlePhaseChange} onScoreChange={handleScoreChange} onJump={handleJump} />

          {gamePhase === "idle" && (
            <p className="px-4 pt-2 text-center text-sm font-bold" style={{ color: "#6b82a8" }}>
              {isTapMode ? "화면을 탭해서 시작" : "팔을 들어올려 시작"}
            </p>
          )}

          {gamePhase === "dead" && (
            <div className="mt-2 p-4 text-center"
              style={{
                background: "#111e35",
                border: "2px solid #1e3a60",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2"
                style={{ color: "#6b82a8" }}>
                오늘 최고 횟수
              </p>
              <span className="text-[48px] leading-none font-[family-name:var(--font-oswald)] font-bold"
                style={{ color: "#e53935", textShadow: "3px 3px 0 rgba(100,0,0,0.5)" }}>
                {bestScoreRef.current}
              </span>
              <p className="text-sm mt-1 mb-3 font-bold" style={{ color: "#6b82a8" }}>회</p>

              <div className="flex gap-2">
                <button onClick={() => { setScore(0); setJumpCount(0); setGamePhase("idle"); }}
                  className="mc-btn flex-1 py-2.5 text-sm">
                  다시 하기
                </button>
                <button onClick={handleSave} disabled={saving || bestScoreRef.current === 0}
                  className="mc-btn-orange flex-1 py-2.5 text-sm disabled:opacity-30">
                  {saving ? "저장 중..." : "기록 저장"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
