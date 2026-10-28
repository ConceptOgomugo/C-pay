import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Image from 'next/image'; 

// Initialize Poppins
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins", // Define a CSS variable for Tailwind use
});

export const metadata: Metadata = {
  title: "C-Pay | Simplfied Fintech Wallet",
  description: "A secure, modern virtual wallet by LOGICMIND COMPUTERS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        
        <nav className="sticky top-0 z-50 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="C-Pay Logo" width={40} height={40} />
              <span className="text-2xl font-semibold tracking-tight text-teal-600 dark:text-teal-400">C-Pay</span>
            </div>

            {/* Profile Area - Right */}
            <div className="flex items-center gap-4 border-l pl-4 border-zinc-200 dark:border-zinc-800">
              <span className="text-sm font-medium">Ari</span>
              <Image src="/svg/profile.svg" alt="Ari's Profile" width="20" height="20" className="h-10 w-10 rounded-full object-cover invert" />
            </div>
            
          </div>
        </nav>

        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {children}
        </main>
      </body>
    </html>
  );
}