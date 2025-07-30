import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LiffGuard from "@/components/liffGuard"; // <-- import your client guard
import Header from "@/components/header"; // Import your header component
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your App Title",
  description: "Your app description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap all pages in your LIFF guard */}
        <div className="min-h-screen flex flex-col bg-gray-100">
          <Header />
          <Suspense
            fallback={
              <div className="flex-1 flex items-center justify-center">
                Loading...
              </div>
            }
          >
            <LiffGuard>
              <main className="flex-1 flex flex-col">{children}</main>
            </LiffGuard>
          </Suspense>
        </div>
      </body>
    </html>
  );
}
