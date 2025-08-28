"use client";

import { useEffect, useState } from "react";
import { auth } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL; 

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
      </main>
    </div>
  );
}
