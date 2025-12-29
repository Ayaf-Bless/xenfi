"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/ui/sidebar";
import { LoadingPage } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalExpenses: number;
  budgetRemaining: number;
  budgetUsedPercentage: number;
  pendingApprovals: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
  recentExpenses: Array<{
    id: string;
    amount: number;
    description: string;
    date: string;
    paymentMethod: string;
    status: string;
    category?: { name: string };
    merchantName?: string;
  }>;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/login";
      return;
    }

    if (status === "authenticated") {
      fetchStats();
    }
  }, [status]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <LoadingPage />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <nav className="flex items-center gap-2 text-sm">
            <span className="text-gray-900 dark:text-white font-semibold">
              Dashboard
            </span>
          </nav>
          <div className="flex items-center gap-3">
            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">
                  {error}
                </p>
              </div>
            )}

            {/* Page Heading */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-tight">
                  Financial Overview
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-base">
                  Track company spending and financial health.
                </p>
              </div>
              <Link href="/expenses/new">
                <Button>
                  <span className="material-symbols-outlined text-[20px]">
                    add
                  </span>
                  <span>Add Expense</span>
                </Button>
              </Link>
            </div>

            {/* KPI Cards */}
            {stats && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Total Expenses */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-5 opacity-10 group-hover:opacity-20 transition-opacity">
                      <span className="material-symbols-outlined text-6xl text-blue-500">
                        account_balance_wallet
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 z-10">
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        Total Expenses (This Month)
                      </p>
                      <h3 className="text-gray-900 dark:text-white text-3xl font-black tracking-tight">
                        $
                        {stats.totalExpenses.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </h3>
                    </div>
                  </div>

                  {/* Budget Remaining */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-5 opacity-10 group-hover:opacity-20 transition-opacity">
                      <span className="material-symbols-outlined text-6xl text-purple-500">
                        pie_chart
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 z-10">
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        Budget Remaining
                      </p>
                      <h3 className="text-gray-900 dark:text-white text-3xl font-black tracking-tight">
                        $
                        {stats.budgetRemaining.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 z-10 mt-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-35">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: `${stats.budgetUsedPercentage}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-500 text-xs whitespace-nowrap">
                        {stats.budgetUsedPercentage.toFixed(0)}% Used
                      </p>
                    </div>
                  </div>

                  {/* Pending Approvals */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-5 opacity-10 group-hover:opacity-20 transition-opacity">
                      <span className="material-symbols-outlined text-6xl text-orange-500">
                        pending_actions
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 z-10">
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        Pending Approvals
                      </p>
                      <h3 className="text-gray-900 dark:text-white text-3xl font-black tracking-tight">
                        {stats.pendingApprovals}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-500 text-sm z-10">
                      Requires attention
                    </p>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Category Breakdown */}
                  <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
                    <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                      <h3 className="text-gray-900 dark:text-white text-lg font-bold">
                        Category Breakdown
                      </h3>
                    </div>
                    <div className="p-5 flex flex-col gap-4 flex-1">
                      {stats.categoryBreakdown.map((item, index) => (
                        <div key={index} className="flex flex-col gap-2">
                          <div className="flex justify-between items-end">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.category}
                            </span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                              {item.percentage.toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                              className="h-3 rounded-full"
                              style={{
                                backgroundColor: item.color,
                                width: `${item.percentage}%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 text-right">
                            $
                            {item.amount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Expenses */}
                  <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                      <h3 className="text-gray-900 dark:text-white text-lg font-bold">
                        Recent Expenses
                      </h3>
                      <Link
                        href="/expenses"
                        className="text-blue-500 text-sm font-bold hover:underline"
                      >
                        View All
                      </Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <th className="p-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="p-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="p-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="p-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="p-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                          {stats.recentExpenses.map((expense) => (
                            <tr
                              key={expense.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                              <td className="p-4 text-sm text-gray-900 dark:text-gray-300 font-medium whitespace-nowrap">
                                {new Date(expense.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </td>
                              <td className="p-4 text-sm text-gray-900 dark:text-white font-medium">
                                {expense.description}
                              </td>
                              <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                                {expense.category?.name || "Uncategorized"}
                              </td>
                              <td className="p-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                    expense.status === "paid"
                                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900"
                                      : expense.status === "pending"
                                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900"
                                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900"
                                  }`}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                  {expense.status.charAt(0).toUpperCase() +
                                    expense.status.slice(1)}
                                </span>
                              </td>
                              <td className="p-4 text-sm text-gray-900 dark:text-white font-bold text-right font-mono">
                                $
                                {typeof expense.amount === "string"
                                  ? parseFloat(expense.amount)
                                  : expense.amount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
