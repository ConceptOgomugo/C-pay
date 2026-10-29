"use client";

import { useState } from "react";
import Image from "next/image";
import DepositModal from "./DepositModal";

interface WalletCardProps {
  balance: number;
  userEmail: string;
}

export default function WalletCard({ balance, userEmail }: WalletCardProps) {
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-zinc-500 dark:text-zinc-400 font-medium text-sm sm:text-base mb-2">
          Available Balance
        </h3>

        <div className="flex items-center gap-2 mb-8">
          <Image src="/svg/naira.svg" alt="Naira" width="24" height="24" className="dark:invert" />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Clicking this button opens the Deposit Modal */}
          <button 
            onClick={() => setIsDepositOpen(true)}
            className="w-full sm:w-1/2 cpay-btn-primary flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
            </svg>
            Deposit
          </button>

          <button className="w-full sm:w-1/2 h-12 px-6 rounded-xl font-medium font-sans text-base inline-flex items-center justify-center gap-2 transition-all duration-150 ease-in-out cursor-pointer border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            Transfer
          </button>
        </div>
      </div>

      {/* The Deposit Modal */}
      <DepositModal 
        isOpen={isDepositOpen} 
        onClose={() => setIsDepositOpen(false)} 
        userEmail={userEmail} 
      />
    </>
  );
}