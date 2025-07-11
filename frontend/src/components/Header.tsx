"use client";

import { FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";


export default function Header() {
  const isAuth = true; // todo - state that tells user is logged in or not
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <header className="w-full">
      {isAuth ? <div className="flex justify-between items-center px-4 py-2 bg-gray-100">
        <div className="flex items-center">
          <FaLock className="text-blue-500 mr-2" />
          <h1 className="text-xl font-bold">SecureDocs</h1>
        </div>
        <button
          type="button"
          onClick={handleLoginClick}
          className="bg-lue-500 text-blue px-4 py-1 border border-gray-300 rounded-sm"
        >
          Login
        </button>
      </div> : <div>Header when user is logged In</div>}
    </header>
  );
}
