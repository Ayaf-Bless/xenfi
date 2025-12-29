"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/dashboard",
    },
    {
      name: "Expenses",
      href: "/expenses",
      icon: Receipt,
      current: pathname.includes("/expenses"),
    },
    {
      name: "Reports",
      href: "/reports",
      icon: BarChart3,
      current: pathname.includes("/reports"),
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: pathname.includes("/settings"),
    },
  ];

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full shrink-0">
      <div className="p-6 flex flex-col gap-8 h-full">
        {/* Brand */}
        <div className="flex flex-col">
          <h1 className="text-gray-900 dark:text-white text-xl font-bold leading-normal tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white">
              <Zap size={20} />
            </span>
            XenFi
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-normal leading-normal mt-1 pl-10">
            Internal Admin
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  item.current
                    ? "bg-blue-100 dark:bg-blue-500/20 text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon size={20} />
                <p className="text-sm font-medium leading-normal">
                  {item.name}
                </p>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm font-bold">
              {session?.user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
