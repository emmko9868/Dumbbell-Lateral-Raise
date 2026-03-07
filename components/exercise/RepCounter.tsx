"use client";

interface RepCounterProps {
  count: number;
  isUp: boolean;
  hint: string;
}

export default function RepCounter({ count, isUp, hint }: RepCounterProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Count — takes up ~40% of screen height */}
      <div
        className={`text-[30vw] sm:text-[160px] leading-none font-[family-name:var(--font-oswald)] font-bold transition-colors duration-100 ${
          isUp ? "text-[#39ff14]" : "text-[#f5f0e8]"
        }`}
        style={{
          textShadow: isUp
            ? "0 0 40px rgba(57,255,20,0.6)"
            : "0 0 40px rgba(245,240,232,0.2)",
        }}
      >
        {count}
      </div>
      {/* Hint text */}
      <p
        className={`text-sm font-medium transition-colors mt-2 ${
          isUp ? "text-[#39ff14]" : "text-[#f5f0e8]/70"
        }`}
      >
        {hint}
      </p>
    </div>
  );
}
