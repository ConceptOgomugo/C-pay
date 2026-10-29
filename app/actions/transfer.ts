"use server";

import { cookies } from "next/headers";
import { getDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function transfer(recipientEmail: string, amount: number, pin: string) {
  try {
    const cookieStore = await cookies();
    const senderUserId = cookieStore.get("cpay_session")?.value;

    if (!senderUserId) {
      return { success: false, message: "Unauthorized session." };
    }

    if (!amount || amount <= 0) {
      return { success: false, message: "Please enter a valid transfer amount." };
    }

    const db = await getDatabase();
    const usersCollection = db.collection("users");
    const balancesCollection = db.collection("balances");

// 1. Get sender details & check PIN
    const senderUser = await usersCollection.findOne({ userId: senderUserId });
    if (!senderUser) {
      return { success: false, message: "Sender account not found." };
    }

    // Safely compare the plain text input PIN against the hashed PIN in MongoDB
    if (senderUser.pin) {
      const isPinValid = await bcrypt.compare(pin, senderUser.pin);
      if (!isPinValid) {
        return { success: false, message: "Incorrect transaction PIN." };
      }
    }

    // 2. Prevent user from transferring to themselves
    if (senderUser.email.toLowerCase() === recipientEmail.toLowerCase()) {
      return { success: false, message: "You cannot transfer money to yourself." };
    }

    // 3. Check if recipient exists in the users database
    const recipientUser = await usersCollection.findOne({ email: recipientEmail.toLowerCase() });
    if (!recipientUser) {
      return { success: false, message: "Recipient email does not exist on C-Pay." };
    }

    // 4. Check sender's balance
    const senderBalanceDoc = await balancesCollection.findOne({ userId: senderUserId });
    const senderBalance = senderBalanceDoc?.balance ?? 0;

    if (senderBalance < amount) {
      return { success: false, message: "Insufficient funds in your wallet." };
    }

    // 5. Execute Transfer: Deduct from sender, Add to recipient
    // Deduct sender balance
    await balancesCollection.updateOne(
      { userId: senderUserId },
      { $inc: { balance: -amount }, 
      $set: { updatedAt: new Date() } }
    );

    // Credit recipient balance (upsert in case they haven't initialized a balance doc yet)
    await balancesCollection.updateOne(
      { userId: recipientUser.userId },
      { $inc: { balance: amount }, $set: { updatedAt: new Date() } },
      { upsert: true }
    );

    // 6. Record transaction history for both users
    const transactionsCollection = db.collection("transactions");
    
    // Sender transaction log
    await transactionsCollection.insertOne({
      userId: senderUserId,
      description: `Transfer to ${recipientUser.username}`,
      type: "Transfer",
      amount: -amount,
      createdAt: new Date(),
    });

    // Recipient transaction log
    await transactionsCollection.insertOne({
      userId: recipientUser.userId,
      description: `Transfer from ${senderUser.username}`,
      type: "Transfer",
      amount: amount,
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Transfer error:", error);
    return { success: false, message: error.message || "Internal server error during transfer." };
  }
}