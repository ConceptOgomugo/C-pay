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

export async function Login(formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const pin = formData.get("pin")?.toString();

  if (!email || !pin) {
    throw new Error("Required");
  }

  const db = await getDatabase();
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    throw new Error("Incorrect Email");
  }

  const validPin = await bcrypt.compare(pin, user.pin);

  if (!validPin) {
    throw new Error("Incorrect Pin");
  }

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
