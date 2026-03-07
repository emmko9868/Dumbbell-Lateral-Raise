"use client";

import { useEffect, useRef } from "react";

const CW = 600, CH = 220;
const TW = 50, TH = 25, BD = 20;
const OX = 275, OY = 65;

// 5×5 heightmap — pyramid shape
const MAP = [
  [1, 1, 2, 1, 1],
  [1, 2, 2, 2, 1],
  [2, 2, 3, 2, 2],
  [1, 2, 2, 2, 1],
  [1, 1, 2, 1, 1],
];
const ROWS = MAP.length, COLS = MAP[0].length;

function iso(col: number, row: number, h = 0) {
  return {
    x: OX + (col - row) * (TW / 2),
    y: OY + (col + row) * (TH / 2) - h * BD,
  };
}

function drawBlock(ctx: CanvasRenderingContext2D, col: number, row: number, h: number) {
  const { x, y } = iso(col, row, h);
  const sh = h * BD;

  // Left face (lighter dirt)
  ctx.beginPath();
  ctx.moveTo(x, y + TH / 2); ctx.lineTo(x + TW / 2, y + TH);
  ctx.lineTo(x + TW / 2, y + TH + sh); ctx.lineTo(x, y + TH / 2 + sh);
  ctx.closePath(); ctx.fillStyle = "#7a4f2a"; ctx.fill();
  ctx.strokeStyle = "#1a0800"; ctx.lineWidth = 0.6; ctx.stroke();

  // Right face (darker dirt)
  ctx.beginPath();
  ctx.moveTo(x + TW / 2, y + TH); ctx.lineTo(x + TW, y + TH / 2);
  ctx.lineTo(x + TW, y + TH / 2 + sh); ctx.lineTo(x + TW / 2, y + TH + sh);
  ctx.closePath(); ctx.fillStyle = "#5d3a1a"; ctx.fill();
  ctx.strokeStyle = "#1a0800"; ctx.lineWidth = 0.6; ctx.stroke();

  // Top face (grass)
  ctx.beginPath();
  ctx.moveTo(x, y + TH / 2); ctx.lineTo(x + TW / 2, y);
  ctx.lineTo(x + TW, y + TH / 2); ctx.lineTo(x + TW / 2, y + TH);
  ctx.closePath(); ctx.fillStyle = "#5aad35"; ctx.fill();
  // Grass detail
  ctx.fillStyle = "#6ec440";
  ctx.fillRect(x + TW / 2 - 8, y + TH / 4 - 2, 3, 2);
  ctx.fillRect(x + TW / 2 + 5, y + TH / 4, 3, 2);
  ctx.strokeStyle = "#1a0800"; ctx.lineWidth = 0.6; ctx.stroke();
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, sc: number) {
  const w = Math.floor(52 * sc), h = Math.floor(12 * sc), bh = Math.floor(9 * sc);
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.fillRect(x, y, w, h);
  ctx.fillRect(x + Math.floor(8 * sc), y - bh, Math.floor(16 * sc), bh);
  ctx.fillRect(x + Math.floor(28 * sc), y - Math.floor(6 * sc), Math.floor(12 * sc), Math.floor(6 * sc));
}

function drawSteve(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  const S = 3, x = Math.floor(cx - 4 * S), y = Math.floor(cy - 11 * S);
  // Head
  ctx.fillStyle = "#D4A76A"; ctx.fillRect(x + S, y, 6 * S, 5 * S);
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(x + 2 * S, y + 2 * S, S, S);
  ctx.fillRect(x + 5 * S, y + 2 * S, S, S);
  ctx.fillStyle = "#8B4513"; ctx.fillRect(x + 2 * S, y + 4 * S, 4 * S, S);
  // Body
  ctx.fillStyle = "#3A7BC8"; ctx.fillRect(x + S, y + 5 * S, 6 * S, 5 * S);
  // Legs
  ctx.fillStyle = "#6B3FA0";
  ctx.fillRect(x + S, y + 10 * S, 2 * S, 4 * S);
  ctx.fillRect(x + 5 * S, y + 10 * S, 2 * S, 4 * S);
  // Arms
  ctx.fillStyle = "#3A7BC8";
  ctx.fillRect(x, y + 5 * S, S, 4 * S);
  ctx.fillRect(x + 7 * S, y + 5 * S, S, 4 * S);
  // Outline
  ctx.strokeStyle = "#1a0a00"; ctx.lineWidth = 0.5;
  ctx.strokeRect(x + S, y, 6 * S, 5 * S);
  ctx.strokeRect(x + S, y + 5 * S, 6 * S, 5 * S);
}

export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const frameRef = useRef(0);
  const cloudsRef = useRef([40, 220, 430]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    function render() {
      const f = ++frameRef.current;

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, CH);
      sky.addColorStop(0, "#87CEEB"); sky.addColorStop(1, "#B8E4F9");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, CW, CH);

      // Sun
      ctx.fillStyle = "#FFD700"; ctx.fillRect(CW - 55, 12, 26, 26);
      ctx.fillStyle = "#FFEC5A"; ctx.fillRect(CW - 55, 12, 26, 3); ctx.fillRect(CW - 55, 12, 3, 26);
      ctx.fillStyle = "#E8A000"; ctx.fillRect(CW - 55, 36, 26, 2); ctx.fillRect(CW - 31, 12, 2, 26);

      // Clouds
      cloudsRef.current = cloudsRef.current.map((cx, i) => {
        const nx = cx - [0.4, 0.6, 0.25][i];
        return nx < -120 ? CW + 60 : nx;
      });
      cloudsRef.current.forEach((cx, i) =>
        drawCloud(ctx, cx, [25, 50, 15][i], [1.1, 0.8, 0.95][i])
      );

      // Tiles back→front (painter's algorithm)
      const tiles: { c: number; r: number; h: number }[] = [];
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
          tiles.push({ c, r, h: MAP[r][c] });
      tiles.sort((a, b) => (a.c + a.r) - (b.c + b.r));
      tiles.forEach(({ c, r, h }) => drawBlock(ctx, c, r, h));

      // Steve on the peak with bob animation
      const { x: px, y: py } = iso(2, 2, MAP[2][2]);
      const bob = Math.sin(f * 0.07) * 2;
      drawSteve(ctx, px + TW / 2, py + TH / 2 + bob);

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        style={{ width: "100%", imageRendering: "pixelated", display: "block" }}
      />
    </div>
  );
}
