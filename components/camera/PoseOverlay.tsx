"use client";

import { useEffect, useRef } from "react";
import type { PoseLandmarkerResult } from "@mediapipe/tasks-vision";

interface PoseOverlayProps {
  result: PoseLandmarkerResult | null;
  isUp: boolean;
}

// Key connections to draw (subset of full skeleton)
const CONNECTIONS = [
  [11, 12], // shoulders
  [11, 13], [13, 15], // left arm
  [12, 14], [14, 16], // right arm
  [11, 23], [12, 24], // torso sides
];

export default function PoseOverlay({ result, isUp }: PoseOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!result || !result.landmarks || result.landmarks.length === 0) return;

    const landmarks = result.landmarks[0];
    const w = canvas.width;
    const h = canvas.height;
    const color = isUp ? "#39ff14" : "#ff6b2b";

    // Draw connections
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.8;

    for (const [a, b] of CONNECTIONS) {
      const pa = landmarks[a];
      const pb = landmarks[b];
      if (!pa || !pb) continue;
      ctx.beginPath();
      // Mirror x to match video transform
      ctx.moveTo((1 - pa.x) * w, pa.y * h);
      ctx.lineTo((1 - pb.x) * w, pb.y * h);
      ctx.stroke();
    }

    // Draw key points
    ctx.fillStyle = color;
    ctx.globalAlpha = 1;
    for (const lm of landmarks) {
      ctx.beginPath();
      ctx.arc((1 - lm.x) * w, lm.y * h, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [result, isUp]);

  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={480}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
