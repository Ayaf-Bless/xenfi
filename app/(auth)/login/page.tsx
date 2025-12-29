"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12 text-white">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart size={20} className="text-white" />
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
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BarChart size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight dark:text-white">
            XenFi
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-[480px] flex flex-col gap-6">
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

            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@xenfi.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember-me"
                        checked={rememberMe}
                        onCheckedChange={(checked) =>
                          setRememberMe(checked as boolean)
                        }
                        disabled={loading}
                      />
                      <label
                        htmlFor="remember-me"
                        className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link
                      href="#"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Log In"}
                  </Button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* SSO Button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    {/* Microsoft Icon SVG */}
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 23 23"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0h23v23H0z" fill="#f3f3f3" />
                      <path d="M1 1h10v10H1z" fill="#f35325" />
                      <path d="M12 1h10v10H12z" fill="#81bc06" />
                      <path d="M1 12h10v10H1z" fill="#05a6f0" />
                      <path d="M12 12h10v10H12z" fill="#ffba08" />
                    </svg>
                    Single Sign-On (SSO)
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Lock
                    size={20}
                    className="text-gray-400 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    This system is for authorized use only. Activity may be
                    monitored and recorded. Unauthorized access is prohibited
                    and subject to prosecution.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Need help?{" "}
                <Link href="#" className="text-primary hover:underline">
                  Contact IT Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
