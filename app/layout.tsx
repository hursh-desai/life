import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memento: Personal Timeline",
  description: "Visualize biological and sociological milestones across your life.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

