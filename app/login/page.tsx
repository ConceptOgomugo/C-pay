"use client";

import Link from "next/link";
import { Login } from "@/app/actions/auth";
import Image from "next/image";
import { useState } from "react";

export default function LogIn() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await Login(formData);
      // If the server action returns a failure object, display the error message
      if (result && !result.success) {
        setError(result.message ?? "An error ocurred");
        setLoading(false);
      }
    } catch (err: any) {
      // Allow Next.js redirect to pass through successfully on success
      if (err?.message?.includes("NEXT_REDIRECT") || err?.digest?.includes("NEXT_REDIRECT")) {
        throw err;
      }
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
        <div className="text-center space-y-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width="60"
            height="60"
            className="inline-flex h-12 w-12 items-center justify-center"
          />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            C-Pay
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Welcome Back
          </p>
        </div>

        {/* Error message banner using ternary/conditional rendering */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg dark:bg-rose-950/50 dark:border-rose-900 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                placeholder="name@gmail.com"
                className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="pin"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1"
              >
                Transfer Pin (4 digits)
              </label>
              <input
                id="pin"
                type="number"
                name="pin"
                required
                placeholder="••••"
                className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold bg-white text-slate-900 shadow-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-slate-500 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}