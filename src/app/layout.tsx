import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notably — AI meeting notetaker",
  description:
    "Record, transcribe, and get AI summaries, action items, and highlights from every meeting.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
