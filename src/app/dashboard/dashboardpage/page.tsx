"use client";

import DashboardLayout from "@/app/components/DashboardLayout";
import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Overview() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activityData, setActivityData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const transactionsSnap = await getDocs(collection(db, "transactions"));
      setTotalTransactions(transactionsSnap.size);

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
      revenueSnap.forEach((doc) => { revenue += doc.data().amount || 0; });
      setTotalRevenue(revenue);

      const usersSnap = await getDocs(collection(db, "users"));
      setTotalUsers(usersSnap.size);
    };

    fetchData();
  }, []);

  const cardStyle = "flex flex-col items-center justify-center bg-white shadow rounded-xl p-6 w-full md:w-1/3";

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">Welcome, Admin</h1>
      <p className="pt-2 text-gray-600">This is your protected dashboard.</p>
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        <div className={cardStyle}>
          <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
          <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
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
    </DashboardLayout>
  );
}
