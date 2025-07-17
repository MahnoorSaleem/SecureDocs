"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaLock } from "react-icons/fa";
import { loginUser } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const schema = z.object({
 email: z.string().email({ message: "Invalid email address" }),
 password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();

  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: 'onTouched', });

  const onSubmitLoginHandler = async (data: FormData) => {
    setApiError(null); // reset previous errors
    setIsSubmitting(true);

    try {
      const { email, password } = data;
      await loginUser({ email, password }); // your API call
      router.push("dashboard");
    } catch (error: unknown) {
      
      if (error instanceof Error) {
        console.error(error);
        setApiError("Login failed. Please try again.");
      } else {
        setApiError("Login failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmitLoginHandler)}
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
            {...register("email")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        {apiError && (
          <p className="text-red-600 text-center text-sm mb-2">{apiError}</p>
        )}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
           {isSubmitting ? "Logging in..." : "Login"}
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
