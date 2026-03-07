"use client";

interface CompletionButtonProps {
  count: number;
  onComplete: () => void;
  disabled?: boolean;
}

export default function CompletionButton({
  count,
  onComplete,
  disabled,
}: CompletionButtonProps) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] md:max-w-[600px] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-[#0d0d0d] to-transparent">
      <button
        onClick={onComplete}
        disabled={disabled || count === 0}
        className="w-full py-5 rounded-2xl bg-[#ff6b2b] text-white font-bold text-xl disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
      >
        오늘 운동 완료 — {count}회
      </button>
    </div>
  );
}
