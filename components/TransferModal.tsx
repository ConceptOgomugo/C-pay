"use client";

import { useState } from "react";
import { transfer } from "@/app/actions/transfer";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransferModal({ isOpen, onClose }: TransferModalProps) {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!pin) {
      setError("Please enter your transaction PIN.");
      return;
    }

    setLoading(true);

    try {
      const result = await transfer(email, numericAmount, pin);
      if (result.success) {
        alert("Transfer successful!");
        onClose();
        window.location.reload();
      } else {
        setError(result.message || "Transfer failed.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Send Money</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 font-bold text-xl">&times;</button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Recipient Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="friend@example.com"
              className="cpay-input w-full p-2 border rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 2000"
              className="cpay-input w-full p-2 border rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Transaction PIN</label>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="****"
              className="cpay-input w-full p-2 border rounded-xl tracking-widest"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cpay-btn-primary py-3 rounded-xl font-semibold flex items-center justify-center"
          >
            {loading ? "Processing Transfer..." : "Send Transfer"}
          </button>
        </form>

      </div>
    </div>
  );
}