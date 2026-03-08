import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR, Noto_Sans_TC, Oswald } from "next/font/google";
import { LangProvider } from "@/lib/i18n/context";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "어깨 깡패",
  description: "하루 한 번, 어깨를 깡패로 만든다",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0d0d0d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} ${notoSansTC.variable} ${oswald.variable}`}>
      <body className="antialiased min-h-screen text-[#f5f0e8]">
        <LangProvider>
          <div className="mx-auto max-w-[480px] md:max-w-[600px] relative min-h-screen">
            {children}
          </div>
        </LangProvider>
      </body>
    </html>
  );
}
