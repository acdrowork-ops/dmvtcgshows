import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DMV TCG Shows | Trading Card Game Shows in DC, Maryland & Virginia",
  description:
    "Find upcoming Trading Card Game shows, conventions, and vendor events in the DMV area. Pokemon, Magic, One Piece, Lorcana and more.",
  openGraph: {
    title: "DMV TCG Shows | Trading Card Game Shows in DC, Maryland & Virginia",
    description:
      "Find upcoming Trading Card Game shows, conventions, and vendor events in the DMV area. Pokemon, Magic, One Piece, Lorcana and more.",
    url: "https://www.dmvtcgshows.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
