"use client";

interface ManualFallbackProps {
  count: number;
  onTap: () => void;
  onReset: () => void;
}

export default function ManualFallback({
  count,
  onTap,
  onReset,
}: ManualFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 px-6">
      <p className="text-[#555555] text-sm text-center">
        카메라 없이도 괜찮아요. 손으로 탭해서 세세요.
      </p>

      {/* Giant tap button */}
      <button
        onClick={onTap}
        className="w-56 h-56 rounded-full bg-[#1a1a1a] border-4 border-[#ff6b2b] flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform active:bg-[#2a1a0d]"
        aria-label="탭해서 카운트"
      >
        <span
          className="text-[72px] leading-none font-[family-name:var(--font-oswald)] font-bold text-[#f5f0e8]"
        >
          {count}
        </span>
        <span className="text-[#555555] text-xs">탭해서 카운트</span>
      </button>

      <button
        onClick={onReset}
        className="text-[#555555] text-sm hover:text-[#f5f0e8] transition-colors"
      >
        다시 세기
      </button>
    </div>
  );
}
