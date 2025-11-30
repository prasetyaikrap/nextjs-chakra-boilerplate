import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { getLocale, getMessages } from "next-intl/server";
import type { ReactNode } from "react";
import AppProviders from "@/src/components/layouts/app-providers";
import { baseMetadata } from "@/src/configs/metadata";

const sans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const sandMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...baseMetadata,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const currentLocale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={currentLocale} suppressHydrationWarning>
      <body
        className={`${sans.variable} ${sandMono.variable} ${inter.variable} antialiased`}
      >
        <AppProviders i18n={{ currentLocale, messages }}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
