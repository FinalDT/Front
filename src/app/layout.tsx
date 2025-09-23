import type { Metadata } from "next";
import "./globals.css";
import { Layout } from "@/components/layout";
import { WebVitals } from "@/components/features/WebVitals";

export const metadata: Metadata = {
  title: "튜터 - 정직한 개인화 학습",
  description: "Neo-Brutalism 스타일의 개인화 튜터링 플랫폼",
  other: {
    'color-scheme': 'light only',
  },
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
