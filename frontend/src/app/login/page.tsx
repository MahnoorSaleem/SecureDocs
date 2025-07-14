"use client";

import { FaLock } from "react-icons/fa";

export default function LoginPage() {
  const onSubmitLoginHandler = () => {
    console.log("login test");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={onSubmitLoginHandler}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-md space-y-6 border border-gray-200"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full p-3 mb-2">
            <FaLock className="w-6 h6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Secure Login</h2>
          <h4 className="text-gray-500 text-sm mt-1">
            Access your account securely
          </h4>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Login
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
