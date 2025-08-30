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
  date?: Date | null; // normalized JS Date (or null)
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
      // optional: order by date desc if present
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
      profilePic: "", // or keep undefined
      date: serverTimestamp(), // ✅ let Firestore set it
    });
    setName("");
    setEmail("");
    fetchUsers(); // refresh
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <form onSubmit={addUser} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded">
          Add User
        </button>
      </form>

      <table className="w-full border-collapse">
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
  );
}
