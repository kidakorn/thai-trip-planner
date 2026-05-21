import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/src/lib/useLanguage";
import Navbar from "@/src/components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "Thai Trip Planner — แพลนทริปไทยด้วย AI",
    template: "%s | Thai Trip Planner",
  },
  description:
    "วางแผนทริปไทยอัจฉริยะด้วย Gemini AI รับแผนทริปส่วนตัวพร้อมแผนที่ทันที ฟรีทั้งหมด",
  keywords: ["trip planner", "thailand travel", "ai travel", "แพลนทริป", "ท่องเที่ยวไทย"],
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "Thai Trip Planner",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="th">
      <body>
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
