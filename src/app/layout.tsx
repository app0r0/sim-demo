import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ORG_NAME } from "@/config";

export const metadata: Metadata = {
  title: `お仕事シミュレーション | ${ORG_NAME}`,
  description: "企業の仕事を選択式の9問で疑似体験できるシミュレーション。",
  robots: { index: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b2545",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
