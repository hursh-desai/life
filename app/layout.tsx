import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memento: Personal Timeline",
  description: "Visualize biological and sociological milestones across your life.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="antialiased text-slate-900 bg-white">{children}</body>
    </html>
  );
}

