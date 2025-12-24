import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "GhostWriter - Collaborative Screenwriting",
  description:
    "A real-time, collaborative screenwriting engine with professional formatting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: Wrap with ConvexProvider after installing convex/react
  // import { ConvexProvider, ConvexReactClient } from "convex/react";
  // const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* TODO: <ConvexProvider client={convex}> */}
        {children}
        {/* TODO: </ConvexProvider> */}
      </body>
    </html>
  );
}
