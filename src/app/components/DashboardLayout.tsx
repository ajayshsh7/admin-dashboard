"use client";
import { ReactNode, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex max-w-[100rem] mx-auto">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 h-screen bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="flex flex-col gap-4">
          <a href="/dashboard" className="hover:text-gray-300">Overview</a>
          <a href="/dashboard/users" className="hover:text-gray-300">Users</a>
          <a href="/dashboard/reports" className="hover:text-gray-300">Reports</a>
          <a href="/dashboard/setting" className="hover:text-gray-300">Settings</a>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
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

        {children}
      </main>
    </div>
  );
}
