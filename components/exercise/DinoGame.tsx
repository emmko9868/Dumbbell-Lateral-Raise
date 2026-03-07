"use client";

import { useEffect, useRef, useCallback } from "react";

const CW = 600;
const CH = 300;
const GROUND_Y = 252;

const BIRD_X = 110;
const BIRD_W = 34;
const BIRD_H = 26;

// Physics: proportional lift from arm angle, gravity when arm is down
const GRAVITY_DOWN = 0.05;
const MAX_FALL_SPEED = 3.0;
const FLAP_VEL_MAX = -8.0;  // velocity at full arm raise (liftAmount=1)
const LIFT_SMOOTH = 0.12;    // how fast birdVY tracks target
// Tap mode: single impulse
const TAP_FLAP_VEL = -10.0;
const DANGER_DIST = 85;

// Minecraft pixel scale
const S = 3;
const B = 20;

// Pre-baked cloud shapes (deterministic)
const CLOUDS = [
  { x: 380, y: 44, scale: 1.0, speed: 0.7 },
  { x: 160, y: 72, scale: 0.78, speed: 0.4 },
  { x: 530, y: 30, scale: 1.1, speed: 1.0 },
];

export type GamePhase = "idle" | "playing" | "dead";

interface GameState {
  phase: GamePhase;
  birdY: number;
  birdVY: number;
  score: number;
  frame: number;
  lastFlapFrame: number;
  liftAmount: number;
}

export interface DinoGameProps {
  liftAmount: number; // 0 = arm down, 0~1 = proportional raise
  onPhaseChange?: (phase: GamePhase) => void;
  onScoreChange?: (score: number) => void;
  onJump?: () => void;
}

export default function DinoGame({
  liftAmount,
  onPhaseChange,
  onScoreChange,
  onJump,
}: DinoGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevIsUpRef = useRef(false);

  const gs = useRef<GameState>({
    phase: "idle",
    birdY: CH / 2 - BIRD_H / 2,
    birdVY: 0,
    score: 0,
    frame: 0,
    lastFlapFrame: -99,
    liftAmount: 0,
  });

  const cloudXRef = useRef([380, 160, 530]);
  const groundXRef = useRef(0);
  const rafRef = useRef(0);

  const resetGame = useCallback(() => {
    const s = gs.current;
    s.phase = "idle";
    s.birdY = CH / 2 - BIRD_H / 2;
    s.birdVY = 0;
    s.score = 0;
    s.frame = 0;
    s.lastFlapFrame = -99;
    onPhaseChange?.("idle");
    onScoreChange?.(0);
  }, [onPhaseChange, onScoreChange]);

  // Tap mode: single impulse flap
  const flap = useCallback(() => {
    const s = gs.current;
    if (s.phase === "dead") { resetGame(); return; }
    if (s.phase === "idle") { s.phase = "playing"; onPhaseChange?.("playing"); }
    s.birdVY = TAP_FLAP_VEL;
    s.score++;
    s.lastFlapFrame = s.frame;
    onScoreChange?.(s.score);
    onJump?.();
  }, [onPhaseChange, onScoreChange, onJump, resetGame]);

  // Arm tracking: update liftAmount and count reps on rising edge
  useEffect(() => {
    const s = gs.current;
    const wasUp = prevIsUpRef.current;
    const isUp = liftAmount > 0;
    s.liftAmount = liftAmount;

    if (isUp && !wasUp) {
      // Rising edge: start game / count rep
      if (s.phase === "dead") { resetGame(); return; }
      if (s.phase === "idle") { s.phase = "playing"; onPhaseChange?.("playing"); }
      s.score++;
      s.lastFlapFrame = s.frame;
      onScoreChange?.(s.score);
      onJump?.();
    }
    prevIsUpRef.current = isUp;
  }, [liftAmount, onPhaseChange, onScoreChange, onJump, resetGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Daytime sky ────────────────────────────────────────────
    function drawSky() {
      // Sky gradient: bright blue Minecraft day
      const grad = ctx!.createLinearGradient(0, 0, 0, GROUND_Y);
      grad.addColorStop(0, "#5BC8F5");
      grad.addColorStop(0.6, "#87CEEB");
      grad.addColorStop(1, "#B8E4F9");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, CW, GROUND_Y);

      // Horizon haze strip
      ctx!.fillStyle = "rgba(200,235,255,0.35)";
      ctx!.fillRect(0, GROUND_Y - 28, CW, 28);

      // Sun — top right, pixelated MC sun
      const sx = CW - 58, sy = 10, ss = 28;
      ctx!.fillStyle = "#FFD700";
      ctx!.fillRect(sx, sy, ss, ss);
      // Sun highlight (top-left bevel)
      ctx!.fillStyle = "#FFEC5A";
      ctx!.fillRect(sx, sy, ss, 3);
      ctx!.fillRect(sx, sy, 3, ss);
      // Sun shadow (bottom-right)
      ctx!.fillStyle = "#E8A000";
      ctx!.fillRect(sx, sy + ss - 2, ss, 2);
      ctx!.fillRect(sx + ss - 2, sy, 2, ss);
      // Sun pixel detail
      ctx!.fillStyle = "#FFB800";
      ctx!.fillRect(sx + 8, sy + 8, 12, 12);
    }

    // ── MC cloud ──────────────────────────────────────────────
    function drawCloud(x: number, y: number, sc: number) {
      const w = Math.floor(52 * sc);
      const h = Math.floor(12 * sc);
      const bh = Math.floor(9 * sc);
      // Main body
      ctx!.fillStyle = "#FFFFFF";
      ctx!.fillRect(x, y, w, h);
      ctx!.fillRect(x + Math.floor(8 * sc), y - bh, Math.floor(16 * sc), bh);
      ctx!.fillRect(x + Math.floor(28 * sc), y - Math.floor(6 * sc), Math.floor(12 * sc), Math.floor(6 * sc));
      // Top highlight
      ctx!.fillStyle = "#F0F0F0";
      ctx!.fillRect(x, y, w, 1);
      ctx!.fillRect(x, y, 1, h);
      // Bottom shadow
      ctx!.fillStyle = "#D0D0D0";
      ctx!.fillRect(x, y + h - 1, w, 1);
      ctx!.fillRect(x + Math.floor(8 * sc), y - bh, Math.floor(16 * sc), 1);
    }

    // ── Ground blocks ─────────────────────────────────────────
    function drawGrassBlock(bx: number, by: number) {
      // Grass top — bright MC green
      ctx!.fillStyle = "#4CAF50";
      ctx!.fillRect(bx, by, B, 4);
      // Grass variation pixels
      ctx!.fillStyle = "#3D8B37";
      ctx!.fillRect(bx + 2, by, 2, 2);
      ctx!.fillRect(bx + 9, by + 1, 2, 2);
      ctx!.fillRect(bx + 15, by, 2, 2);
      ctx!.fillStyle = "#66BB6A";
      ctx!.fillRect(bx + 5, by, 2, 2);
      ctx!.fillRect(bx + 12, by + 1, 2, 2);
      // Dirt body — classic MC dirt brown
      ctx!.fillStyle = "#866043";
      ctx!.fillRect(bx, by + 4, B, B - 4);
      ctx!.fillStyle = "#6B4C34";
      ctx!.fillRect(bx + 3, by + 6, 3, 3);
      ctx!.fillRect(bx + 12, by + 10, 3, 3);
      ctx!.fillRect(bx + 7, by + 14, 2, 2);
      ctx!.fillStyle = "#A0795A";
      ctx!.fillRect(bx + 15, by + 7, 2, 2);
      // Block border
      ctx!.fillStyle = "#1a0800";
      ctx!.fillRect(bx, by, B, 1);
      ctx!.fillRect(bx, by, 1, B);
      ctx!.fillRect(bx + B - 1, by, 1, B);
    }

    function drawDirtBlock(bx: number, by: number) {
      ctx!.fillStyle = "#866043";
      ctx!.fillRect(bx, by, B, B);
      ctx!.fillStyle = "#6B4C34";
      ctx!.fillRect(bx + 2, by + 3, 3, 3);
      ctx!.fillRect(bx + 11, by + 9, 3, 3);
      ctx!.fillRect(bx + 6, by + 14, 2, 2);
      ctx!.fillStyle = "#A0795A";
      ctx!.fillRect(bx + 15, by + 6, 2, 2);
      ctx!.fillStyle = "#1a0800";
      ctx!.fillRect(bx, by, B, 1);
      ctx!.fillRect(bx, by, 1, B);
      ctx!.fillRect(bx + B - 1, by, 1, B);
    }

    function drawGround(scrollX: number) {
      const n = Math.ceil(CW / B) + 2;
      const off = Math.floor(((scrollX % B) + B) % B);
      for (let i = 0; i < n; i++) {
        const bx = i * B - off;
        drawGrassBlock(bx, GROUND_Y);
        drawDirtBlock(bx, GROUND_Y + B);
        drawDirtBlock(bx, GROUND_Y + B * 2);
      }
    }

    // ── Creeper character ─────────────────────────────────────
    function drawCreeper(
      x: number,
      y: number,
      vy: number,
      lastFlap: number,
      frame: number,
      dead: boolean
    ) {
      const flapAge = frame - lastFlap;
      const isFlapping = flapAge < 10;

      const cx = x + Math.floor((BIRD_W - 8 * S) / 2);
      const cy = y + Math.floor((BIRD_H - 8 * S) / 2);
      const nudge = dead ? 1 : Math.floor(Math.max(-1, Math.min(1, vy * 0.25)));

      // Danger glow
      if (!dead) {
        const dist = GROUND_Y - (y + BIRD_H);
        const danger = Math.max(0, 1 - dist / DANGER_DIST);
        if (danger > 0.15) {
          ctx!.fillStyle = `rgba(255,80,0,${0.15 * danger})`;
          ctx!.fillRect(cx - 4, cy + nudge - 4, 8 * S + 8, 8 * S + 8);
        }
      }

      const faceColor = dead ? "#7A2000" : isFlapping ? "#66CC44" : "#4A9A1A";

      // Creeper face 8×8
      ctx!.fillStyle = faceColor;
      ctx!.fillRect(cx, cy + nudge, 8 * S, 8 * S);

      // Eyes
      ctx!.fillStyle = dead ? "#FF3300" : "#0a0a0a";
      ctx!.fillRect(cx + 1 * S, cy + nudge + 2 * S, 2 * S, 2 * S);
      ctx!.fillRect(cx + 5 * S, cy + nudge + 2 * S, 2 * S, 2 * S);

      // Nose / mouth
      ctx!.fillStyle = dead ? "#CC2200" : "#0a0a0a";
      ctx!.fillRect(cx + 3 * S, cy + nudge + 4 * S, 2 * S, S);
      ctx!.fillRect(cx + 2 * S, cy + nudge + 5 * S, 4 * S, S);
      ctx!.fillRect(cx + 2 * S, cy + nudge + 6 * S, S, S);
      ctx!.fillRect(cx + 5 * S, cy + nudge + 6 * S, S, S);

      // Border
      ctx!.fillStyle = "#1a0a00";
      ctx!.fillRect(cx - 1, cy + nudge - 1, 8 * S + 2, 1);
      ctx!.fillRect(cx - 1, cy + nudge + 8 * S, 8 * S + 2, 1);
      ctx!.fillRect(cx - 1, cy + nudge - 1, 1, 8 * S + 2);
      ctx!.fillRect(cx + 8 * S, cy + nudge - 1, 1, 8 * S + 2);

      // Flap spark (orange/yellow in daytime)
      if (isFlapping && !dead) {
        const alpha = (1 - flapAge / 10) * 0.9;
        ctx!.fillStyle = `rgba(255,200,0,${alpha})`;
        ctx!.fillRect(cx - 5, cy + nudge + 3 * S, 4, 4);
        ctx!.fillStyle = `rgba(255,160,0,${alpha * 0.5})`;
        ctx!.fillRect(cx - 9, cy + nudge + 4 * S, 3, 3);
      }
    }

    // ── HUD ───────────────────────────────────────────────────
    function drawHUD(score: number) {
      const bw = 90, bh = 38, bx = CW - bw - 6, by = 6;
      ctx!.fillStyle = "#373737";
      ctx!.fillRect(bx, by, bw, bh);
      ctx!.fillStyle = "#8b8b8b";
      ctx!.fillRect(bx, by, bw, 1);
      ctx!.fillRect(bx, by, 1, bh);
      ctx!.fillStyle = "#1f1f1f";
      ctx!.fillRect(bx, by + bh - 1, bw, 1);
      ctx!.fillRect(bx + bw - 1, by, 1, bh);

      ctx!.fillStyle = "#ffffff";
      ctx!.font = "bold 24px monospace";
      ctx!.textAlign = "right";
      ctx!.fillText(`${score}회`, bx + bw - 8, by + 28);
      ctx!.textAlign = "left";
    }

    // ── Game loop ─────────────────────────────────────────────
    function loop() {
      const s = gs.current;
      const cloudX = cloudXRef.current;

      if (s.phase === "playing") {
        if (s.liftAmount > 0) {
          // Arm is raised: apply upward force proportional to lift angle
          const targetVY = FLAP_VEL_MAX * s.liftAmount;
          s.birdVY += (targetVY - s.birdVY) * LIFT_SMOOTH;
        } else {
          // Arm down: gravity
          s.birdVY += GRAVITY_DOWN;
          if (s.birdVY > MAX_FALL_SPEED) s.birdVY = MAX_FALL_SPEED;
        }
        s.birdY += s.birdVY;

        if (s.birdY < 8) {
          s.birdY = 8;
          s.birdVY = Math.abs(s.birdVY) * 0.25;
        }

        if (s.birdY + BIRD_H >= GROUND_Y) {
          s.birdY = GROUND_Y - BIRD_H;
          s.birdVY = 0;
          s.phase = "dead";
          onPhaseChange?.("dead");
          onScoreChange?.(s.score);
        }

        groundXRef.current -= 3;
        CLOUDS.forEach((c, i) => {
          cloudX[i] -= c.speed;
          if (cloudX[i] < -80) cloudX[i] = CW + 50;
        });

        s.frame++;
      }

      // ── Render ───────────────────────────────────────────────
      drawSky();
      CLOUDS.forEach((c, i) => drawCloud(cloudX[i], c.y, c.scale));
      drawGround(groundXRef.current);
      drawCreeper(BIRD_X, s.birdY, s.birdVY, s.lastFlapFrame, s.frame, s.phase === "dead");
      drawHUD(s.score);

      // TNT warning when near ground
      if (s.phase === "playing" && s.birdVY > 0) {
        const dist = GROUND_Y - (s.birdY + BIRD_H);
        if (dist < DANGER_DIST) {
          const urgency = 1 - dist / DANGER_DIST;
          const blink = Math.floor(s.frame / 5) % 2 === 0;

          if (blink || urgency > 0.6) {
            const wx = BIRD_X + BIRD_W / 2 - 18;
            const wy = s.birdY - 34;
            ctx!.fillStyle = urgency > 0.7 ? "#CC0000" : "#881800";
            ctx!.fillRect(wx, wy, 36, 22);
            ctx!.fillStyle = "#f5f0e8";
            ctx!.fillRect(wx + 6, wy, 24, 22);
            ctx!.fillRect(wx + 6, wy, 24, 1);
            ctx!.fillRect(wx + 6, wy + 21, 24, 1);
            ctx!.fillRect(wx + 6, wy, 1, 22);
            ctx!.fillRect(wx + 29, wy, 1, 22);
            ctx!.fillStyle = "#CC0000";
            ctx!.font = "bold 9px monospace";
            ctx!.textAlign = "center";
            ctx!.fillText("TNT", wx + 18, wy + 14);
            ctx!.textAlign = "left";
            ctx!.fillStyle = "#1a0000";
            ctx!.fillRect(wx, wy, 36, 1);
            ctx!.fillRect(wx, wy, 1, 22);
            ctx!.fillRect(wx + 35, wy, 1, 22);
            ctx!.fillRect(wx, wy + 21, 36, 1);
          }
        }
      }

      // Idle overlay
      if (s.phase === "idle") {
        ctx!.fillStyle = "rgba(0,0,0,0.45)";
        ctx!.fillRect(0, 0, CW, CH);

        const bw = 320, bh = 48;
        const bx = (CW - bw) / 2, by = CH / 2 - bh / 2;
        ctx!.fillStyle = "#373737";
        ctx!.fillRect(bx, by, bw, bh);
        ctx!.fillStyle = "#8b8b8b";
        ctx!.fillRect(bx, by, bw, 1);
        ctx!.fillRect(bx, by, 1, bh);
        ctx!.fillStyle = "#1f1f1f";
        ctx!.fillRect(bx, by + bh - 1, bw, 1);
        ctx!.fillRect(bx + bw - 1, by, 1, bh);

        ctx!.fillStyle = "#ffffff";
        ctx!.font = "bold 20px monospace";
        ctx!.textAlign = "center";
        ctx!.fillText("팔을 들어올려 시작!", CW / 2, by + bh / 2 + 7);
        ctx!.textAlign = "left";
      }

      // YOU DIED overlay
      if (s.phase === "dead") {
        ctx!.fillStyle = "rgba(80,0,0,0.45)";
        ctx!.fillRect(0, 0, CW, CH);
        ctx!.fillStyle = "rgba(0,0,0,0.35)";
        ctx!.fillRect(0, 0, CW, CH);

        ctx!.fillStyle = "#FF0000";
        ctx!.font = "bold 28px monospace";
        ctx!.textAlign = "center";
        ctx!.fillText("YOU DIED", CW / 2, CH / 2 - 28);

        ctx!.fillStyle = "#ff6b2b";
        ctx!.font = "bold 26px monospace";
        ctx!.fillText(`${s.score}회`, CW / 2, CH / 2 + 8);

        ctx!.fillStyle = "#aaaaaa";
        ctx!.font = "11px monospace";
        ctx!.fillText("팔 올려서 재시작", CW / 2, CH / 2 + 34);
        ctx!.textAlign = "left";
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onPhaseChange, onScoreChange]);

  return (
    <div className="relative w-full">
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        className="w-full"
        style={{ imageRendering: "pixelated", border: "3px solid #555555", boxShadow: "inset 2px 2px 0 rgba(255,255,255,0.1), inset -2px -2px 0 rgba(0,0,0,0.4)" }}
        onClick={flap}
      />
    </div>
  );
}
