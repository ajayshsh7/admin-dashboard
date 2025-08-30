"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function UsersPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "users"), {
      name,
      email,
      date: new Date().toISOString(),
    });
    setName("");
    setEmail("");
    fetchUsers();
    useEffect(() => {
  const fetchUsers = async () => {
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      const usersList = usersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  fetchUsers();
  
}, []);

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
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{new Date(user.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
