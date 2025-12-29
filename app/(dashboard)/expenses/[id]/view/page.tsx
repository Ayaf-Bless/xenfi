"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/ui/sidebar";
import { LoadingContent } from "@/components/ui/loading";
import { formatCurrency, formatDisplayDate } from "@/lib/utils";
import {
  ChevronRight,
  Pencil,
  Trash2,
  Calendar,
  CreditCard,
  DollarSign,
  Tag,
  FileText,
  AlertCircle,
  Loader,
} from "lucide-react";

interface Expense {
  id: string;
  amount: string | number;
  description: string;
  date: string;
  paymentMethod?: string;
  status?: string;
  categoryId: string;
  merchantName?: string;
  notes?: string;
  userId: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const STATUS_COLORS: Record<
  string,
  { bg: string; text: string; icon: string }
> = {
  pending: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-700 dark:text-yellow-400",
    icon: "schedule",
  },
  approved: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
    icon: "check_circle",
  },
  rejected: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
    icon: "cancel",
  },
};

export default function ViewExpensePage() {
  const router = useRouter();
  const params = useParams();
  const expenseId = params.id as string;

  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await fetch(`/api/expenses/${expenseId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch expense");
        }
        const data = await response.json();
        setExpense(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (expenseId) {
      fetchExpense();
    }
  }, [expenseId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      router.push("/expenses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete expense");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-8">
          <LoadingContent />
        </main>
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {error || "Expense not found"}
              </h2>
              <Link href="/expenses" className="text-primary hover:underline">
                Back to Expenses
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const statusKey = (expense.status || "pending").toLowerCase();
  const statusConfig = STATUS_COLORS[statusKey] || STATUS_COLORS["pending"];

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link
            href="/expenses"
            className="hover:text-primary transition-colors"
          >
            Expenses
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-slate-900 dark:text-slate-200">
            {expense.merchantName || "Expense Details"}
          </span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {expense.merchantName || "Expense"}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text}`}
              >
                <DollarSign className="w-4 h-4" />
                {expense.status || "Pending"}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              Created on{" "}
              <span className="font-medium text-slate-900 dark:text-slate-200">
                {formatDisplayDate(expense.date)}
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/expenses/${expense.id}/edit`}
              className="flex items-center justify-center gap-2 px-4 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center justify-center gap-2 px-4 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-colors disabled:opacity-50"
            >
              {deleting ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Primary Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Amount & Merchant Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Total Amount
                  </p>
                  <p className="text-4xl font-black text-primary tracking-tight">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
                <div className="text-right sm:text-left">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Category
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: expense.category.color }}
                    />
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {expense.category.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Transaction Date
                  </p>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-slate-200 font-medium">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    {formatDisplayDate(expense.date)}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Payment Method
                  </p>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-slate-200 font-medium">
                    <CreditCard className="w-5 h-5 text-slate-400" />
                    {expense.paymentMethod || "Not specified"}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {expense.description && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-400" />
                  Description
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {expense.description}
                </p>
              </div>
            )}

            {/* Notes */}
            {expense.notes && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Notes
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {expense.notes}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Additional Info */}
          <div className="space-y-6">
            {/* Submitter Info */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Submitted By
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Name
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {expense.user.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Email
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white break-all">
                    {expense.user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-4">
                Quick Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-700 dark:text-blue-400">
                    Status
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${statusConfig.bg} ${statusConfig.text}`}
                  >
                    {expense.status || "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-700 dark:text-blue-400">
                    Expense ID
                  </span>
                  <span className="text-xs font-mono text-blue-900 dark:text-blue-300">
                    {expense.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
