import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Safari Group",
  description: "Explore the Universe Under Construction"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

