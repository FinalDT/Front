import type { Metadata } from "next";
import "./globals.css";
import { Layout } from "@/components/layout";
import { WebVitals } from "@/components/features/WebVitals";

export const metadata: Metadata = {
  title: "STUDIYA - AI 수학 튜터",
  description: "중학생을 위한 개인화 AI 수학 학습 플랫폼. 사전평가부터 맞춤형 튜터링까지.",
  keywords: ["수학 튜터", "AI 학습", "중학생", "개인화 교육", "수학 문제", "온라인 교육"],
  authors: [{ name: "STUDIYA Team" }],
  creator: "STUDIYA",
  publisher: "STUDIYA",
  icons: {
    icon: '/icon',
    apple: '/icon',
    shortcut: '/icon',
  },
  manifest: "/manifest.json",
  other: {
    'color-scheme': 'light only',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: "#FF90E8",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" style={{backgroundColor: '#F4F4F0'}}>
      <body className="antialiased" style={{backgroundColor: '#F4F4F0', color: '#0B0B0B'}}>
        <Layout>{children}</Layout>
        <WebVitals />
      </body>
    </html>
  );
}
