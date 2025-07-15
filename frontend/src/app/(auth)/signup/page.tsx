"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaLock } from "react-icons/fa";

const schema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .min(6, { message: "Username must be at least 6 characters" })
    .max(20, { message: "Username must not exceed 20 characters" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }).min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, { message: "Confirm Password is required" }).min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: "onTouched" });

  const onSubmitSignupHandler = (data: FormData) => {
    console.log("Signup:", data);
  };

  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmitSignupHandler)}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-md space-y-6 border border-gray-200"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full p-3 mb-2">
            <FaLock className="w-6 h6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Secure Signup</h2>
          <h4 className="text-gray-500 text-sm mt-1">
            Create your account securely
          </h4>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            {...register("username")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
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
        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Signup
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}
