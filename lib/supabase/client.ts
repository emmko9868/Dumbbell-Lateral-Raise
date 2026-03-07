"use client";

import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// env가 미설정이면 Supabase 클라이언트 생성 자체를 건너뜀
export const isSupabaseConfigured =
  url.startsWith("https://") && key.length > 20 && !url.includes("placeholder");

export function createClient() {
  return createBrowserClient(url, key);
}
