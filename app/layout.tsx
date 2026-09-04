import type { Metadata } from "next";
import { googleFontStylesheetHref } from "@/lib/news/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Broadsheet — Fantasy Newspaper Studio",
  description: "Create printable fantasy newspapers with your campaign stories and procedural local news.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={googleFontStylesheetHref} />
      </head>
      <body>{children}</body>
    </html>
  );
}
