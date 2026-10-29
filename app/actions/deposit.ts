"use server";

import { cookies } from "next/headers";
import { getDatabase } from "@/lib/mongodb";

export async function Deposit(reference: string, amount: number) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("cpay_session")?.value;

    if (!userId) {
      return { success: false, message: "Unauthorized user session." };
    }

    // 1. Verify the transaction with Paystack's API server-side using your Secret Key
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      throw new Error("Paystack Secret Key is missing.");
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // 2. Check if Paystack confirms the transaction was successful
    if (!data.status || data.data.status !== "success") {
      return { success: false, message: "Payment verification failed by Paystack." };
    }

    // 3. Update MongoDB balances collection
    const db = await getDatabase();
    const balancesCollection = db.collection("balances");

    // Use $inc to atomically add the deposited amount to the user's existing balance
    await balancesCollection.updateOne(
      { userId },
      { 
        $inc: { balance: amount },
        $set: { updatedAt: new Date() }
      },
      { upsert: true } // If a balance doc doesn't exist yet, create it
    );

    // Optional: Log this transaction in a "transactions" collection for your transaction history table!
    await db.collection("transactions").insertOne({
      userId,
      description: "Paystack Deposit",
      type: "Deposit",
      amount: amount,
      reference,
      createdAt: new Date()
    });

    return { success: true };
  } catch (error: any) {
    console.error("Deposit verification error:", error);
    return { success: false, message: error.message || "Internal server error during verification." };
  }
}