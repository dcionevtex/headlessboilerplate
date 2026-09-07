import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import pwaContent from "@/pwa-content.json";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: pwaContent.name,
  description: pwaContent.description,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: pwaContent.shortName,
  },
};

export const viewport: Viewport = {
  themeColor: pwaContent.themeColor,
};

import { CartProvider } from "@/context/CartContext";
import { LocationProvider } from "@/context/LocationContext";
import { AuthProvider } from "@/context/AuthContext";
import GoogleTagManager from "@/components/GoogleTagManager";
import PWARegister from "@/components/PWARegister";

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
        <GoogleTagManager />
        <PWARegister />
        <AuthProvider>
          <CartProvider>
            <LocationProvider>
              {children}
            </LocationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
