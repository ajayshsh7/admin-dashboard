import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebaseAdmin";
import { db } from "@/app/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { seedTransactions, seedRevenue } from "@/app/lib/seedUsers";
import { seedUsers } from "@/app/lib/seedUsers";

export async function GET() {
    try {
    for (const user of seedUsers) {
      await adminDb.collection("users").add(user);
    }

    return NextResponse.json({ message: "Seeding successful" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
    
  try {
    // Seed users
    for (const user of seedUsers) {
      await addDoc(collection(db, "users"), user);
    }

    // Seed transactions
    for (const tx of seedTransactions) {
      await addDoc(collection(db, "transactions"), tx);
    }

    // Seed revenue
    for (const rev of seedRevenue) {
      await addDoc(collection(db, "revenue"), rev);
    }

    return NextResponse.json({ message: "Seeding successful ✅" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
