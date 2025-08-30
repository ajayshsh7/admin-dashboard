"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
} from "firebase/firestore";

type User = {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  date?: Date | null; 
};

function normalizeDate(raw: any): Date | null {
  // Firestore Timestamp
  if (raw && typeof raw === "object" && typeof raw.toDate === "function") {
    return raw.toDate();
  }
  // ISO/string
  if (typeof raw === "string") {
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  }
  return null; // missing or unknown format
}

export default function UsersPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
  
      const q = query(collection(db, "users"), orderBy("date", "desc"));
      const snap = await getDocs(q);
      const list: User[] = snap.docs.map((doc) => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          name: data.name ?? "",
          email: data.email ?? "",
          profilePic: data.profilePic,
          date: normalizeDate(data.date),
        };
      });
      setUsers(list);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "users"), {
      name,
      email,
      profilePic: "",
      date: serverTimestamp(), 
    });
    setName("");
    setEmail("");
    fetchUsers(); 
  };

  return (
    <div className="p-4 sm:p-6">
  <h1 className="text-xl sm:text-2xl font-bold mb-4">Users</h1>

  {/* Form */}
  <form
    onSubmit={addUser}
    className="flex flex-col sm:flex-row gap-2 mb-6"
  >
    <input
      type="text"
      placeholder="Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="border rounded p-2 w-full sm:w-auto"
      required
    />
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="border rounded p-2 w-full sm:w-auto"
      required
    />
    <button
      type="submit"
      className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
    >
      Add User
    </button>
  </form>

  {/* Table with horizontal scroll on small screens */}
  <div className="overflow-x-auto">
    <table className="w-full border-collapse min-w-[400px]">
      <thead>
        <tr>
          <th className="border p-2 text-left">Name</th>
          <th className="border p-2 text-left">Email</th>
          <th className="border p-2 text-left">Date</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td className="border p-2">{u.name}</td>
            <td className="border p-2">{u.email}</td>
            <td className="border p-2">
              {u.date ? u.date.toLocaleString() : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
}
