import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import ViewportProvider from "@/components/ViewportProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aeterna",
  description: "Shaping identities that resonate.",
  icons: {
    icon: "/slideshow/4.webp",
    shortcut: "/slideshow/4.webp",
    apple: "/slideshow/4.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ViewportProvider>{children}</ViewportProvider>
      </body>
    </html>
  );
}
