// ✅ No 'use client' needed — stays server-safe
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
    title: 'login - SecureDocs',
  };

  
  export default function LoginLayout({ children }: { children: React.ReactNode }) {
    console.log("💡 LOGIN LAYOUT LOADED");
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gray-50 text-gray-800`}>
        <div className="flex-1 flex flex-col justify-center items-center">{children}</div>
        </body>
      </html>
    );
  }
  