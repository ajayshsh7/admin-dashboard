"use client";

import { useEffect, useState } from "react";
import { auth } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,} from "recharts";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const cardStyle = "flex flex-col items-center justify-center bg-white shadow rounded-xl p-6 w-full md:w-1/3";

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
   useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsSnap = await getDocs(collection(db, "transactions"));
        setTotalTransactions(transactionsSnap.size);

        // Prepare chart data
        const dailyMap: Record<string, { transactions: number; revenue: number }> = {};
        transactionsSnap.forEach((doc) => {
          const data = doc.data();
          const date = new Date(data.date).toLocaleDateString();
          if (!dailyMap[date]) dailyMap[date] = { transactions: 0, revenue: 0 };
          dailyMap[date].transactions += 1;
          dailyMap[date].revenue += data.amount || 0;
        });
        const chartData = Object.keys(dailyMap)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
          .map((date) => ({ date, ...dailyMap[date] }));
        setActivityData(chartData);

        const revenueSnap = await getDocs(collection(db, "revenue"));
        let revenue = 0;
        revenueSnap.forEach((doc) => {
          revenue += doc.data().amount || 0;
        });
        setTotalRevenue(revenue);

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
      if (!user) router.push("/");
      else if (user.email === ADMIN_EMAIL) setIsAdmin(true);
      else router.push("/");
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!isAdmin) return <div className="p-6">Access Denied ❌</div>;

  return (
     <div className="max-w-[100rem] mx-auto">
      <div className="flex">
        {/* Sidebar for large screens */}
        <aside className="hidden lg:block w-64 h-screen bg-gray-900 text-white p-4">
          <h2 className="text-xl font-bold mb-6">Dashboard</h2>
          <nav className="flex flex-col gap-4">
            <a href="/dashboard" className="hover:text-gray-300">Overview</a>
            <a href="/dashboard/users" className="hover:text-gray-300">Users</a>
            <a href="/dashboard/reports" className="hover:text-gray-300">Reports</a>
            <a href="/dashboard/setting" className="hover:text-gray-300">Settings</a>
          </nav>
        </aside>

        {/* Mobile Sidebar overlay */}
        {sidebarOpen && (
          <aside className="fixed inset-0 z-50 w-64 h-full bg-gray-900 text-white p-4 lg:hidden shadow-lg">
            <button
              className="mb-4 p-2 text-gray-300 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-6">Dashboard</h2>
            <nav className="flex flex-col gap-4">
              <a href="/dashboard" className="hover:text-gray-300">Overview</a>
              <a href="/dashboard/users" className="hover:text-gray-300">Users</a>
              <a href="/dashboard/reports" className="hover:text-gray-300">Reports</a>
              <a href="/dashboard/setting" className="hover:text-gray-300">Settings</a>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Hamburger button (mobile only) */}
          <button
            className="lg:hidden mb-4 p-2 text-gray-700 hover:text-black"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          <h1 className="text-2xl font-bold">Welcome, Admin</h1>
          <p className="pt-2 text-gray-600">This is your protected dashboard.</p>

          <div className="mx-auto p-6">
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
                <p className="text-2xl font-bold text-blue-600">{totalTransactions}</p>
              </div>
              <div className={cardStyle}>
                <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
                <p className="text-2xl font-bold text-purple-600">{totalUsers}</p>
              </div>
            </div>
            <div className="mt-10 p-6 bg-white shadow rounded-xl">
  <h2 className="text-lg font-semibold text-gray-700 mb-4">Activity Over Time</h2>
  <ResponsiveContainer width="100%" height={300}>
  <LineChart data={activityData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="transactions" stroke="#3b82f6" name="Transactions" />
    <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue" />
  </LineChart>
</ResponsiveContainer>
</div>
          </div>
        </main>
      </div>
    </div>
  );
}
