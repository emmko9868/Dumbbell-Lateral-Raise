"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "홈", icon: HomeIcon },
  { href: "/ranking", label: "랭킹", icon: TrophyIcon },
  { href: "/calendar", label: "기록", icon: CalendarIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] md:max-w-[600px] z-50"
      style={{ background: "#0a1628", borderTop: "2px solid #1e3050", boxShadow: "0 -4px 20px rgba(0,0,0,0.5)" }}
    >
      <div className="flex items-center justify-around px-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 min-w-[72px] transition-all"
            >
              <div
                className="w-14 h-14 flex items-center justify-center transition-all"
                style={active ? {
                  background: "#e53935",
                  border: "2px solid #7f0000",
                  boxShadow: "0 0 12px rgba(229,57,53,0.4)",
                } : {
                  background: "#111e35",
                  border: "2px solid #1e3050",
                }}
              >
                <Icon active={active} />
              </div>
              <span
                className="text-[9px] font-bold tracking-wide"
                style={{ color: active ? "#ffffff" : "#6b82a8" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
        fill={active ? "#ffffff" : "none"}
        stroke={active ? "#ffffff" : "#6b82a8"}
        strokeWidth="1.5"
      />
    </svg>
  );
}

function TrophyIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 21H16M12 17V21M5 3H19V11C19 14.31 15.87 17 12 17C8.13 17 5 14.31 5 11V3Z"
        stroke={active ? "#ffffff" : "#6b82a8"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M5 6H2V9C2 11 3.5 12.5 5 12.8M19 6H22V9C22 11 20.5 12.5 19 12.8"
        stroke={active ? "#ffffff" : "#6b82a8"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="0"
        stroke={active ? "#ffffff" : "#6b82a8"}
        strokeWidth="1.5"
      />
      <path
        d="M3 9H21M8 2V6M16 2V6"
        stroke={active ? "#ffffff" : "#6b82a8"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
