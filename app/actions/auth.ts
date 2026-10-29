"use server"

import bcrypt from "bcryptjs";
import { getDatabase } from "@/lib/mongodb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function SignUp(formData: FormData) {
  const username = formData.get("username")?.toString().trim().toLowerCase();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const pin = formData.get("pin")?.toString();

  if (!username || !email || !pin) {
    throw new Error("Fields Are Required");
  }

  const db = await getDatabase();
  const userCollection = db.collection("users");

  const existingUser = await userCollection.findOne({ email });

  if (existingUser) {
    throw new Error("User already Exists");
  }

  const hashedPin = await bcrypt.hash(pin, 10);
  const userId = await crypto.randomUUID();

  await userCollection.insertOne({
    userId,
    username,
    email,
    pin: hashedPin,
    createdAt: new Date(),
  });

  await db.collection("balances").insertOne({
    userId,
    balance: 0.00,
    updatedAt: new Date()
  })

  const cookieStore = await cookies();
  cookieStore.set({
    name: "cpay_session",
    value: userId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/");
}

export async function Login(prevState: any, formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const pin = formData.get("pin")?.toString();

  if (!email || !pin) {
    return { error: "Required" };
  }

  const db = await getDatabase();
  const usersCollection = db.collection("users");
  const user = await usersCollection.findOne({ email });

  if (!user) {
    return { error: "Account with this email does not exist." };
  }

  // 1. Check if the account is currently locked due to too many failed attempts
  const now = new Date();
  if (user.lockUntil && new Date(user.lockUntil) > now) {
    const minutesLeft = Math.ceil((new Date(user.lockUntil).getTime() - now.getTime()) / 60000);
    return { 
      error: `Account temporarily locked. Try again in ${minutesLeft} minute(s).` 
    };
  }

  // 2. Verify PIN
  const validPin = await bcrypt.compare(pin, user.pin);

  if (!validPin) {
    // Increment failed attempts
    const failedAttempts = (user.failedLoginAttempts || 0) + 1;
    
    const updateData: any = { failedLoginAttempts: failedAttempts };

    // If they fail 3 times, lock the account for 15 minutes
    if (failedAttempts >= 3) {
      const lockUntilDate = new Date(now.getTime() + 15 * 60000); // 15 mins from now
      updateData.lockUntil = lockUntilDate;
      
      await usersCollection.updateOne({ email }, { $set: updateData });
      return { 
        error: "Too many failed attempts. Account locked for 15 minutes." 
      };
    }

    // Otherwise, update failed attempts count and show remaining tries
    await usersCollection.updateOne({ email }, { $set: updateData });
    return { error: `Incorrect Pin. ${3 - failedAttempts} attempt(s) remaining.` };
  }

  // 3. On successful login, reset failed attempts and lock fields
  await usersCollection.updateOne(
    { email },
    { $set: { failedLoginAttempts: 0, lockUntil: null } }
  );

  const cookieStore = await cookies();
  cookieStore.set({
    name: "cpay_session",
    value: user.userId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/");
}

export async function Logout() {
  const cookieStore = await cookies();
  
  // Delete the session cookie
  cookieStore.delete("cpay_session");

  // Redirect back to the login page
  redirect("/login");
}
