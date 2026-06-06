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
  title: "AufgabenMeister",
  description: "Dein smarter Lern- und Prüfungsplaner",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "AufgabenMeister",
    description: "Dein smarter Lern- und Prüfungsplaner",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AufgabenMeister",
    description: "Dein smarter Lern- und Prüfungsplaner",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
