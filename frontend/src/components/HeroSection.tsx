'use client'

import { FaCheck, FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const handleSignUpClick = () => {
    router.push("/signup");
  };
  return (
    <div className="w-full max-w-screen-lg py-10 text-center flex flex-col justify-center px-4 space-y-10 items-center">
      <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full mb-6">
        <FaLock className="w-6 h-6" />
      </div>{" "}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4">
        End-to-end encrypted
        <br />
        document sharing platform
      </h1>
      <p className="text-gray-500 text-center mb-6 max-w-xl">
        Safely store and share your sensitive files Your privacy is our priority
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FaCheck className="text-green-500 mr-2" />
          <span>Upload and encrypt your documents</span>
        </div>
        <div className="flex items-center">
          <FaCheck className="text-green-500 mr-2" />
          <span>Upload and encrypt your documents</span>
        </div>
      </div>
      <button
        type="button"
        onClick={handleSignUpClick}
        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
      >
        Signup
      </button>
    </div>
  );
}
