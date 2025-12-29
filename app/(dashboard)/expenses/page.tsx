"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";
import { LoadingPage } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { ChevronRight, Search, Pencil, Trash2, Plus } from "lucide-react";

interface Expense {
  id: string;
  amount: string;
  description: string;
  date: string;
  paymentMethod: string;
  status: string;
  category: { name: string };
  merchantName?: string;
  attachmentUrl?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ExpensesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchExpenses();
    }
  }, [status, pagination.page, search, categoryFilter]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search) params.append("search", search);
      if (categoryFilter !== "all") params.append("categoryId", categoryFilter);

      const response = await fetch(`/api/expenses?${params}`);
      if (!response.ok) throw new Error("Failed to fetch expenses");

      const data = await response.json();
      setExpenses(data.expenses);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete expense");

      setExpenses(expenses.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense");
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
            <Link
              href="/dashboard"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              XenFi
            </Link>
            <ChevronRight
              size={16}
              className="text-gray-600 dark:text-gray-400"
            />
            <span className="text-gray-900 dark:text-white font-semibold">
              Expenses
            </span>
          </nav>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Page Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-gray-900 dark:text-white text-3xl font-black tracking-tight">
                  Expenses
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage and track company expenditures.
                </p>
              </div>
              <Link href="/expenses/new">
                <Button>
                  <Plus size={20} />
                  <span>Add Expense</span>
                </Button>
              </Link>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-60">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by description, merchant..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPagination({ ...pagination, page: 1 });
                  }}
                  className="w-full pl-10 pr-4 h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
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
                      <th className="p-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {expenses.length > 0 ? (
                      expenses.map((expense) => (
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
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {expense.description}
                              </span>
                              {expense.merchantName && (
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {expense.merchantName}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                            {expense.category?.name}
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
                          <td className="p-4 text-sm font-bold text-gray-900 dark:text-white text-right font-mono">
                            $
                            {parseFloat(expense.amount).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <Link href={`/expenses/${expense.id}/edit`}>
                                <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
                                  <Pencil size={18} />
                                </button>
                              </Link>
                              <button
                                onClick={() => handleDelete(expense.id)}
                                className="p-1 rounded-full hover:bg-red-200 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-8 text-center text-gray-600 dark:text-gray-400"
                        >
                          No expenses found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between bg-white dark:bg-gray-900">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {pagination.total}
                    </span>{" "}
                    results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          page: pagination.page - 1,
                        })
                      }
                      disabled={pagination.page === 1}
                      className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: pagination.totalPages }).map(
                      (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() =>
                            setPagination({
                              ...pagination,
                              page: i + 1,
                            })
                          }
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            pagination.page === i + 1
                              ? "bg-blue-500 text-white"
                              : "border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          {i + 1}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          page: pagination.page + 1,
                        })
                      }
                      disabled={pagination.page === pagination.totalPages}
                      className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
