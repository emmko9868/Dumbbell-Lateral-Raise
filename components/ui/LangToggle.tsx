"use client";

import { useLang } from "@/lib/i18n/context";

export default function LangToggle() {
  const { locale, setLocale } = useLang();

  return (
    <div className="flex items-center"
      style={{ background: "#111e35", border: "1px solid #2a4470" }}>
      <button
        onClick={() => setLocale("ko")}
        className="px-2.5 py-1 text-[10px] font-bold transition-all"
        style={locale === "ko"
          ? { background: "#e53935", color: "#ffffff" }
          : { color: "#6b82a8" }}
      >
        한국어
      </button>
      <div style={{ width: "1px", height: "14px", background: "#2a4470" }} />
      <button
        onClick={() => setLocale("zh-TW")}
        className="px-2.5 py-1 text-[10px] font-bold transition-all"
        style={locale === "zh-TW"
          ? { background: "#e53935", color: "#ffffff" }
          : { color: "#6b82a8" }}
      >
        繁中
      </button>
    </div>
  );
}
