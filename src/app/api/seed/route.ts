import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase"; // client firebase.ts
import { collection, addDoc } from "firebase/firestore";
import { seedUsers, seedTransactions } from "@/app/lib/seedUsers"; 

export async function GET() {
  try {
    // Seed Users
    for (const user of seedUsers) {
      await addDoc(collection(db, "users"), user);
    }

    // Seed Transactions
    for (const tx of seedTransactions) {
      await addDoc(collection(db, "transactions"), tx);
    }

    // Seed Revenue (optional example)
    const seedRevenue = [
      { source: "subscription", amount: 500, date: new Date().toISOString() },
      { source: "ads", amount: 250, date: new Date().toISOString() },
    ];

    for (const rev of seedRevenue) {
      await addDoc(collection(db, "revenue"), rev);
    }

    return NextResponse.json({ message: "Users, Transactions, and Revenue seeded ✅" });
  } catch (error) {
    console.error("Seeding failed:", error);
    return NextResponse.json({ error: "Seeding failed" }, { status: 500 });
  }
}
