"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { auth, googleProvider } from "@/app/lib/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Google Sign-in
  const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const token = await user.getIdToken();

    Cookies.set("authToken", token, { expires: 1 });
    Cookies.set("userEmail", user.email ?? "", { expires: 1 });

    router.push("/dashboard");
  } catch (err: any) {
    setError(err.message);
  }
};

  // Email/Password Sign-in
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCred.user.getIdToken();
      Cookies.set("authToken", token, { expires: 1 });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
      <div className="flex flex-col lg:flex-row h-screen">
  <div className="w-full lg:w-2/5 bg-gray-900 text-white flex flex-col justify-between p-8">
    <h1 className="text-4xl font-bold">Base</h1>
    <div className="self-end">
    </div>
  </div>

  <div className="w-full lg:w-3/5 flex items-center justify-center">
    <div className="w-full max-w-md space-y-6 p-6">
      <h2 className="text-3xl font-bold">Sign-in</h2>
      <div className="flex gap-4 flex-col sm:flex-row">
        <button
          onClick={handleGoogleSignIn}
          className="flex-1 flex items-center justify-center gap-2 border rounded-md py-2 cursor-pointer">
            <Image src="/google.svg" alt="Google" width={20} height={20} />
          Sign in with Google
        </button>
        <button
          disabled
          className="flex-1 flex items-center justify-center gap-2 border rounded-md py-2 bg-gray-200 cursor-pointer text-gray-700  ">
            <Image src="/apple.svg" alt="Apple" width={20} height={20} />
          Sign in with Apple
        </button>
      </div>
      <div className="flex items-center gap-2">
        <hr className="flex-1 border-gray-300" />
        <span className="text-gray-500 text-sm">or continue with</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      <form onSubmit={handleEmailSignIn} className="space-y-4">
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
          Sign in
        </button>
      </form>
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
      <p className="text-sm text-center text-gray-600">
        Don’t have an account?{" "}
        <a href="/signup" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  </div>
</div>

  );
}

