import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const session = cookieStore.get("cpay_session");

  if (!session) {
    redirect("/login")
  }
  return (
    <main className="max-w-4xl mx-auto space-y-8">
      
      {/*WALLET BALANCE*/}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        <h3 className="text-zinc-500 dark:text-zinc-400 font-medium text-sm sm:text-base mb-2">
          Available Balance
        </h3>

        <div className="flex items-center gap-2 mb-8">
          <Image src="/svg/naira.svg" alt="Naira" width="45" height="45" className="dark:invert" />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            5,000.00
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button className="w-full sm:w-1/2 cpay-btn-primary flex items-center justify-center gap-2">
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