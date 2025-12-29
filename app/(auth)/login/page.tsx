"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Column: Visual/Marketing (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBKBXRTIfBlXXVv2jgsFVZgFH-u_4KHTc48gA-JnYBStBDuzGEjpHgHyfhFXlo1-0yWDaVV_-mWFdtXvugMgv1uUPvY-skJYOuxQq3MeIyqQeNmGiWocwOBXc-gOB0yylGFWezHnyTSZpHYjKbq8g4NZKzwvBfWGHdNpjMcliKtOuvaW4k4F9aGEIzhySWpJlK49sye8zDerfV8pCMZtOrbrGns9Ud7yz7N8NysgaFsAv_lAcfRedzqBBY6j3IYUqzOQDh56-qWmQ')",
          }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 via-gray-900/20 to-transparent"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12 text-white">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">
                  bar_chart
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight">XenFi</span>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-4 leading-tight">
              Streamline your financial workflow
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Access real-time expense tracking, automated accounting, and
              comprehensive financial reports securely from anywhere.
            </p>
          </div>

          <div className="flex gap-4 text-sm text-gray-400">
            <span>© 2024 XenFi Internal Systems</span>
          </div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-gray-900">
        {/* Mobile Header Logo (Only visible on small screens) */}
        <div className="lg:hidden p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl">
              bar_chart
            </span>
          </div>
          <span className="text-xl font-bold tracking-tight dark:text-white">
            XenFi
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-120 flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex flex-col gap-2 mb-2">
              <h1 className="text-gray-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight">
                Welcome back
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
                Please enter your details to sign in.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-gray-900 dark:text-gray-200 text-sm font-medium leading-normal"
                  htmlFor="email"
                >
                  Work Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@xenfi.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="flex w-full resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-blue-500 h-12 placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 text-base font-normal leading-normal transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-gray-900 dark:text-gray-200 text-sm font-medium leading-normal"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative flex w-full items-stretch rounded-lg">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="flex w-full resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-blue-500 h-12 placeholder:text-gray-500 dark:placeholder:text-gray-400 pl-4 pr-12 text-base font-normal leading-normal transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors flex items-center justify-center disabled:opacity-50"
                    disabled={loading}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Actions Row */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 w-4 h-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 disabled:opacity-50"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  href="#"
                  className="text-blue-500 text-sm font-medium hover:underline hover:text-blue-600 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Primary Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors shadow-sm mt-2 disabled:cursor-not-allowed"
              >
                <span className="truncate">
                  {loading ? "Signing in..." : "Log In"}
                </span>
              </button>
            </form>

            {/* Disclaimer */}
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-200 dark:border-gray-800">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-gray-400 text-[20px] mt-0.5">
                  lock
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  This system is for authorized use only. Activity may be
                  monitored and recorded. Unauthorized access is prohibited and
                  subject to prosecution.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer for Form Side */}
        <div className="p-6 text-center lg:text-left lg:pl-12">
          <p className="text-xs text-gray-400">
            Need help?{" "}
            <Link href="#" className="text-blue-500 hover:underline">
              Contact IT Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
