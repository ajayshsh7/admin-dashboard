"use client";

import { useState } from "react";
import Image from "next/image";
import { auth, googleProvider } from "@/app/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Google Sign-up
  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Google Sign-up successful");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Email/Password Sign-up
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(userCred.user, { displayName: name });
      }
      console.log("Email/Password Sign-up successful");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Column */}
      <div className="w-2/5 bg-gray-900 text-white flex flex-col justify-between p-8">
        <h1 className="text-4xl font-bold">Base</h1>
        <div className="self-end">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </div>

      {/* Right Column */}
      <div className="w-3/5 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 p-6">
          {/* Heading */}
          <h2 className="text-3xl font-bold">Sign-up</h2>

          {/* Social Sign-up */}
          <div className="flex gap-4">
            <button
              onClick={handleGoogleSignUp}
              className="flex-1 flex items-center justify-center gap-2 border rounded-md py-2 cursor-pointer"
            >
              <Image src="/google.svg" alt="Google" width={20} height={20} />
              Sign up with Google
            </button>
            <button
              disabled
              className="flex-1 flex items-center justify-center gap-2 border rounded-md py-2 bg-gray-200 cursor-pointer text-gray-700"
            >
              <Image src="/apple.svg" alt="Apple" width={20} height={20} />
              Sign up with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-500 text-sm">or sign up with</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Email/Password Sign-up Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Create account
            </button>
          </form>

          {/* Error Message */}
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          {/* Redirect to Sign-in */}
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="/" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
