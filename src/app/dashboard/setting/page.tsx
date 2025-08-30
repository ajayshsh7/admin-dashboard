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
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName || "");
        setEmail(user.email || "");
        setPhotoURL(user.photoURL || "/default-profile.png");
      }
    });
    return () => unsubscribe();
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
      await updateProfile(user, { displayName: userName });

      if (email !== user.email) {
        await updateEmail(user, email);
      }

      setMessage("✅ Profile updated successfully");
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Account Settings</h1>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-36 h-36 relative">
            <img
              src={newPhoto ? URL.createObjectURL(newPhoto) : photoURL || "/default-profile.png"}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border shadow cursor-pointer"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewPhoto(e.target.files?.[0] || null)}
            className="text-sm text-gray-600"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900">Full Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full border rounded-md px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-900"
            />
          </div>

          {message && (
            <p
              className={`text-sm font-medium mt-2 ${message.startsWith("✅") ? "text-green-600" : "text-gray-600"
                }`}
            >
              {message}
            </p>
          )}

          <div className="flex gap-6 pt-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Save Changes
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white font-medium py-2 px-6 rounded-lg shadow hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
