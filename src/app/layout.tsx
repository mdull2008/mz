import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FicPulse — фанфики и соцсеть для писателей",
  description:
    "Пишите фанфики как на Фикбуке и ведите блог как в Twitter. Лента, подписки, главы, комментарии.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-6 text-center text-sm text-muted">
          FicPulse © 2026 — фанфики + соцсеть для авторов и читателей
        </footer>
      </body>
    </html>
  );
}
