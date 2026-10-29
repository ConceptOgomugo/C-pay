"use client";

import { useState } from "react";
import { Deposit } from "@/app/actions/deposit";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export default function DepositModal({ isOpen, onClose, userEmail }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const loadPaystackScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Use (window as any) to bypass TS property check for external CDN scripts
      if ((window as any).PaystackPop) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Fixed form event type using React.FormEvent<HTMLFormElement>
  const handleDeposit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const isLoaded = await loadPaystackScript();
      if (!isLoaded) {
        throw new Error("Failed to load Paystack checkout. Check your internet connection.");
      }

      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error("Paystack Public Key is missing in environment variables.");
      }

      const amountInKobo = Math.round(numericAmount * 100);

      // Cast window to any to access PaystackPop safely
      const handler = (window as any).PaystackPop.setup({
        key: publicKey,
        email: userEmail,
        amount: amountInKobo,
        currency: "NGN",
        ref: `CPAY_${Math.floor((Math.random() + 1) * 1000000)}`,
        // Wrapped the async logic inside a standard synchronous function callback
        callback: function (response: { reference: string }) {
          const handleServerVerification = async () => {
            try {
              const result = await Deposit(response.reference, numericAmount);
              if (result.success) {
                // alert("Deposit successful! Your balance has been updated.");
                onClose();
                window.location.reload();
              } else {
                setError(result.message || "Verification failed");
              }
            } catch (err) {
              setError("Error communicating with server to update balance.");
            } finally {
              setLoading(false);
            }
          };

          handleServerVerification();
        },
        onClose: () => {
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Fund Wallet (Test Mode)</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 font-bold text-xl">&times;</button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="cpay-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cpay-btn-primary flex items-center justify-center"
          >
            {loading ? "Processing..." : "Pay with Paystack"}
          </button>
        </form>

      </div>
    </div>
  );
}