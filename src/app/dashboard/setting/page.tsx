"use client";

import { useEffect, useState } from "react";
import { auth } from "@/app/lib/firebase";
import { updateProfile, updateEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function SettingsPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [photoURL, setPhotoURL] = useState<string>("");
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || "");
      setEmail(user.email || "");
      setPhotoURL(user.photoURL || "/default-profile.png");
    }
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    Cookies.remove("authToken");
    Cookies.remove("userEmail");
    router.push("/");
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Update display name
      await updateProfile(user, { displayName: userName });

      // Update email
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      // Optionally, you can handle profile picture upload to Firebase Storage here
      // and then call updateProfile({ photoURL: downloadURL })

      setMessage("Profile updated successfully ✅");
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Profile Picture */}
        <div className="w-32 h-32 relative">
          <img
            src={newPhoto ? URL.createObjectURL(newPhoto) : photoURL}
            alt="Profile"
            className="w-full h-full rounded-full object-cover border"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewPhoto(e.target.files?.[0] || null)}
            className="mt-2"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {message && <p className="text-sm text-green-600">{message}</p>}

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
