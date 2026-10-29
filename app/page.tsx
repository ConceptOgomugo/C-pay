import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/mongodb";
import WalletCard from "@/components/WalletCard";

export default async function Home() {
  const cookieStore = await cookies();
  const session = cookieStore.get("cpay_session");

  if (!session) {
    redirect("/login")
  }

  // Fetch the logged-in user details to get their email and balance
  const db = await getDatabase();
  const user = await db.collection("users").findOne({ userId: session.value });

  if (!user) {
    redirect("/login");
  }

  // Fetch their balance from the separate balances collection
  const balanceDoc = await db.collection("balances").findOne({ userId: user.userId });
  const currentBalance = balanceDoc?.balance ?? 0.00;

  return (
    <main className="max-w-4xl mx-auto space-y-8">
      
      <WalletCard balance={currentBalance} userEmail={user.email} />

      {/*RECENT TRANSACTIONS*/}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-xl font-semibold mb-6 text-zinc-900 dark:text-zinc-100">
          Recent Transactions
        </h3>

        {/* Transactions Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 text-sm">
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm">
              
              {/* Row 1 */}
              <tr>
                <td className="py-4 font-medium text-zinc-900 dark:text-zinc-100">Paystack Deposit</td>
                <td className="py-4 text-zinc-500">Deposit</td>
                <td className="py-4 text-zinc-500">Oct 26</td>
                <td className="py-4 font-semibold text-right text-emerald-600 dark:text-emerald-400">+250.00</td>
              </tr>

              {/* Row 2 */}
              <tr>
                <td className="py-4 font-medium text-zinc-900 dark:text-zinc-100">Transfer from Sarah Connor</td>
                <td className="py-4 text-zinc-500">Transfer</td>
                <td className="py-4 text-zinc-500">Oct 26</td>
                <td className="py-4 font-semibold text-right text-emerald-600 dark:text-emerald-400">+13,000.00</td>
              </tr>

              {/* Row 3 */}
              <tr>
                <td className="py-4 font-medium text-zinc-900 dark:text-zinc-100">Transfer to David Chen</td>
                <td className="py-4 text-zinc-500">Transfer</td>
                <td className="py-4 text-zinc-500">Oct 26</td>
                <td className="py-4 font-semibold text-right text-rose-600 dark:text-rose-400">-12,000.00</td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>

    </main>
  );
}