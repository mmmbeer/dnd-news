import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
