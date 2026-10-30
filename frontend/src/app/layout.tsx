import type { Metadata } from "next";
import "./globals.css";
import { VisualJourney } from "../components/motion/journey";
import "./journey.css";
import { Providers } from "../components/providers";
export const metadata: Metadata = {
  icons: { icon: "/icon.svg" },
  title: "疏影 · 灵感素材工作室",
  description: "选择模板，上传图片，让灵感成为作品。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Providers><VisualJourney />{children}</Providers>
      </body>
    </html>
  );
}
