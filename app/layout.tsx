import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-zinc-950 text-foreground">
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
