import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/mongodb";
import WalletCard from "@/components/WalletCard";

export const instant = false;

export default async function Home() {
  const cookieStore = await cookies();
  const session = cookieStore.get("cpay_session");

  if (!session) {
    redirect("/login");
  }

  // Fetch the logged-in user details
  const db = await getDatabase();
  const user = await db.collection("users").findOne({ userId: session.value });

  if (!user) {
    redirect("/login");
  }

  // Fetch balance from the balances collection
  const balanceDoc = await db.collection("balances").findOne({ userId: user.userId });
  const currentBalance = balanceDoc?.balance ?? 0.00;

  // Fetch real transaction history for this user, sorted newest first
  const transactions = await db.collection("transactions")
    .find({ userId: user.userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();

  return (
    <main className="max-w-4xl mx-auto space-y-8">
      
      {/*WALLET BALANCE CARD COMPONENT*/}
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
              
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-zinc-400">
                    No transactions yet. Deposit or transfer funds to see history!
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isPositive = tx.amount > 0;
                  return (
                    <tr key={tx._id.toString()}>
                      <td className="py-4 font-medium text-zinc-900 dark:text-zinc-100">
                        {tx.description}
                      </td>
                      <td className="py-4 text-zinc-500">{tx.type}</td>
                      <td className="py-4 text-zinc-500">
                        {new Date(tx.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric' 
                        })}
                      </td>
                      <td className={`py-4 font-semibold text-right ${
                        isPositive 
                          ? "text-emerald-600 dark:text-emerald-400" 
                          : "text-rose-600 dark:text-rose-400"
                      }`}>
                        {isPositive ? "+" : ""}₦{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })
              )}

            </tbody>
          </table>
        </div>

      </div>

    </main>
  );
}