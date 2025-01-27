import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

// Font Configuration
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata Configuration
export const metadata: Metadata = {
  title: "Haroon Rasheed Blog",
  description: "A blog by Haroon Rasheed",
};

// Root Layout
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
        {/* Header */}
        <header
          className="bg-slate-600 shadow-lg"
          aria-label="Main navigation"
        >
          <nav className="max-w-screen-xl mx-auto px-4 py-5">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-white">
                Haroon Rasheed Blog
              </Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        {children}

        {/* Footer */}
        <footer className="bg-slate-600 py-6 mt-12">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Haroon Rasheed Blog. All rights
            reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
