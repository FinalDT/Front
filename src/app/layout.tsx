import type { Metadata } from "next";
import "./globals.css";
import { Layout } from "@/components/layout";
import { WebVitals } from "@/components/features/WebVitals";

export const metadata: Metadata = {
  title: "튜터 - 정직한 개인화 학습",
  description: "Neo-Brutalism 스타일의 개인화 튜터링 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Layout>{children}</Layout>
        <WebVitals />
      </body>
    </html>
  );
}
