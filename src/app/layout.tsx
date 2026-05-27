import type { Metadata, Viewport } from "next";
import { Noto_Serif_Thai, Sarabun, Inter } from "next/font/google";
import "./globals.css";

// Noto Serif Thai: full Thai + Latin script support for headings
const notoSerifThai = Noto_Serif_Thai({
  weight: ["400", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-serif",
  display: "swap",
});

// Sarabun: clean Thai + Latin sans-serif for body/UI
const sarabun = Sarabun({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-sans",
  display: "swap",
});

// Inter: Default latin font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#D90429",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Thai Trip Planner — AI-Powered Itineraries for Thailand",
    template: "%s | Thai Trip Planner",
  },
  description:
    "Plan your perfect Thailand trip with AI. Get a personalized day-by-day itinerary with an interactive map — completely free.",
  keywords: ["trip planner", "thailand travel", "ai travel", "itinerary", "bangkok", "chiang mai", "phuket"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Thai Trip Planner",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${notoSerifThai.variable} ${sarabun.variable} ${inter.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
