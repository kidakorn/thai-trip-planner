import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

/**
 * Inter — primary Latin font
 * Clean, modern, highly legible for UI text.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

/**
 * IBM Plex Sans Thai — primary Thai font
 * IBM's professional, well-hinted Thai typeface. Excellent for
 * both heading and body text. Pairs beautifully with Inter.
 */
const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-thai",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#D90429",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Thai Trip Planner — AI-Powered Itineraries for Thailand",
    template: "%s | Thai Trip Planner",
  },
  description:
    "Plan your perfect Thailand trip with AI. Get a personalized day-by-day itinerary with an interactive map — completely free.",
  keywords: ["trip planner", "thailand travel", "ai travel", "itinerary", "bangkok", "chiang mai", "phuket", "travel tech"],
  openGraph: {
    title: "Thai Trip Planner — AI-Powered Itineraries",
    description: "Plan your perfect Thailand trip with AI. Get a personalized day-by-day itinerary with an interactive map — completely free.",
    type: "website",
    locale: "en_US",
    siteName: "Thai Trip Planner",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thai Trip Planner — AI-Powered Itineraries",
    description: "Generate your dream Thailand vacation instantly with AI.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexSansThai.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
