"use client";

import { useEffect, useState } from "react";
import { auth } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const cardStyle = "flex flex-col items-center justify-center bg-white shadow rounded-xl p-6 w-full md:w-1/3";

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL; 
   useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions
        const transactionsSnap = await getDocs(collection(db, "transactions"));
        let revenue = 0;
        transactionsSnap.forEach((doc) => {
          revenue += doc.data().amount || 0;
        });
        setTotalTransactions(transactionsSnap.size);
        setTotalRevenue(revenue);

        // Fetch users
        const usersSnap = await getDocs(collection(db, "users"));
        setTotalUsers(usersSnap.size);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/");
      } else if (user.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        router.push("/"); // not admin
      }
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!isAdmin) return <div className="p-6">Access Denied ❌</div>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="flex flex-col gap-4">
          <a href="/dashboard" className="hover:text-gray-300">Overview</a>
          <a href="/dashboard/users" className="hover:text-gray-300">Users</a>
          <a href="/dashboard/reports" className="hover:text-gray-300">Reports</a>
          <a href="/dashboard/setting" className="hover:text-gray-300">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Welcome, Admin</h1>
        <p className="mt-2 text-gray-600">This is your protected dashboard.</p>
        <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className={cardStyle}>
          <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
          <p className="text-2xl font-bold text-green-600">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className={cardStyle}>
          <h2 className="text-lg font-semibold text-gray-700">Total Transactions</h2>
          <p className="text-2xl font-bold text-blue-600">
            {totalTransactions}
          </p>
        </div>

        <div className={cardStyle}>
          <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
          <p className="text-2xl font-bold text-purple-600">{totalUsers}</p>
        </div>
      </div>
    </div>
      </main>
    </div>
  );
}
