import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import TopNavbar from "@/components/layout/TopNavbar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pivot Digital Publishing Platform",
  description: "Track B: Diversity Discovery and Contrarian Routing Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased font-sans bg-background text-foreground flex flex-col`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <TopNavbar />
            <div className="flex-1 w-full relative">
              {children}
            </div>
          </div>
          <Toaster position="top-right" closeButton richColors theme="system" />
        </AuthProvider>
      </body>
    </html>
  );
}
