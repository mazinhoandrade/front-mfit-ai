import type { Metadata } from "next";

import "./globals.css";
import { Geist, Geist_Mono, Inter_Tight } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter_Tight({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "MFIT.AI",
  description: "O app que vai transformar a forma como você treina.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
        {children}
        </NuqsAdapter>
      </body>
    </html>
  );
}
