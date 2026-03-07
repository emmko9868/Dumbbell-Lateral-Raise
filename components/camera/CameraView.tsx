"use client";

import { useEffect, useRef } from "react";

interface CameraViewProps {
  onStream: (stream: MediaStream) => void;
  onError: () => void;
  facingMode?: "user" | "environment";
}

export default function CameraView({ onStream, onError, facingMode = "user" }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        onStream(stream);
      } catch {
        onError();
      }
    }

    startCamera();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [onStream, onError, facingMode]);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      playsInline
      muted
      // 전면 카메라만 좌우 반전 (셀피 미러)
      style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
    />
  );
}
