"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { Button } from "@/components/ui/button";
import { LoadingPage } from "@/components/ui/loading";
import { Sidebar } from "@/components/ui/sidebar";
import { formatDateForInput } from "@/lib/utils";
import { PAYMENT_METHODS, EXPENSE_STATUSES } from "@/lib/constants";
import { ChevronRight, X, CheckCircle, Loader } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  amount: string;
  description: string;
  date: string;
  paymentMethod: string;
  status: string;
  categoryId: string;
  merchantName?: string;
  notes?: string;
  attachmentUrl?: string;
}

export default function EditExpensePage() {
  const router = useRouter();
  const params = useParams();
  const expenseId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: "",
    paymentMethod: "",
    status: "",
    categoryId: "",
    merchantName: "",
    notes: "",
    attachmentUrl: "",
  });

  useEffect(() => {
    fetchData();
  }, [expenseId]);

  const fetchData = async () => {
    try {
      const [categoriesRes, expenseRes] = await Promise.all([
        fetch("/api/categories"),
        fetch(`/api/expenses/${expenseId}`),
      ]);

      if (!categoriesRes.ok || !expenseRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const categoriesData = await categoriesRes.json();
      const expenseData = await expenseRes.json();

      setCategories(categoriesData);
      setFormData({
        amount: expenseData.amount,
        description: expenseData.description,
        date: formatDateForInput(expenseData.date),
        paymentMethod: expenseData.paymentMethod,
        status: expenseData.status,
        categoryId: expenseData.categoryId,
        merchantName: expenseData.merchantName || "",
        notes: expenseData.notes || "",
        attachmentUrl: expenseData.attachmentUrl || "",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load expense");
      router.push("/expenses");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        merchantName: formData.merchantName || null,
        notes: formData.notes || null,
        attachmentUrl: formData.attachmentUrl || null,
      };

      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update expense");
      }

      router.push("/expenses");
      router.refresh();
    } catch (error: any) {
      console.error("Error updating expense:", error);
      alert(error.message || "Failed to update expense");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 border-b border-[#dbe0e6] dark:border-gray-800 bg-white dark:bg-[#111418] shrink-0">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/dashboard"
              className="text-[#617589] font-medium hover:text-primary transition-colors"
            >
              XenFi
            </Link>
            <ChevronRight size={16} className="text-[#617589]" />
            <Link
              href="/expenses"
              className="text-[#617589] font-medium hover:text-primary transition-colors"
            >
              Expenses
            </Link>
            <ChevronRight size={16} className="text-[#617589]" />
            <span className="text-[#111418] dark:text-white font-semibold">
              Edit Expense
            </span>
          </nav>
        </header>

        <div className="flex-1 overflow-auto bg-background-light dark:bg-background-dark p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[#111418] dark:text-white text-3xl font-black tracking-tight">
                  Edit Expense
                </h2>
                <p className="text-[#617589] mt-1">
                  Update the expense details below.
                </p>
              </div>
              <Link href="/expenses">
                <Button variant="outline">
                  <X size={18} />
                  Cancel
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-[#111418] dark:text-white">
                  Expense Information
                </h3>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <FormInput
                        id="amount"
                        name="amount"
                        label="Amount *"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={handleChange}
                        error={errors.amount}
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <FormInput
                        id="description"
                        name="description"
                        label="Description *"
                        type="text"
                        value={formData.description}
                        onChange={handleChange}
                        error={errors.description}
                        required
                      />
                    </div>

                    <FormInput
                      id="merchantName"
                      name="merchantName"
                      label="Merchant Name"
                      type="text"
                      value={formData.merchantName}
                      onChange={handleChange}
                    />

                    <FormInput
                      id="date"
                      name="date"
                      label="Date *"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      error={errors.date}
                      required
                    />

                    <FormSelect
                      id="categoryId"
                      name="categoryId"
                      label="Category *"
                      value={formData.categoryId}
                      onValueChange={(value) =>
                        handleChange({
                          target: {
                            name: "categoryId",
                            value,
                          },
                        } as any)
                      }
                      options={categories.map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                      }))}
                      error={errors.categoryId}
                      required
                    />

                    <FormSelect
                      id="paymentMethod"
                      name="paymentMethod"
                      label="Payment Method *"
                      value={formData.paymentMethod}
                      onValueChange={(value) =>
                        handleChange({
                          target: {
                            name: "paymentMethod",
                            value,
                          },
                        } as any)
                      }
                      options={PAYMENT_METHODS}
                      required
                    />

                    <FormSelect
                      id="status"
                      name="status"
                      label="Status *"
                      value={formData.status}
                      onValueChange={(value) =>
                        handleChange({
                          target: {
                            name: "status",
                            value,
                          },
                        } as any)
                      }
                      options={EXPENSE_STATUSES}
                      required
                    />

                    <FormInput
                      id="attachmentUrl"
                      name="attachmentUrl"
                      label="Attachment URL"
                      type="text"
                      value={formData.attachmentUrl}
                      onChange={handleChange}
                    />

                    <div className="md:col-span-2">
                      <label
                        className="text-[#111418] dark:text-gray-200 text-sm font-medium leading-normal mb-2 block"
                        htmlFor="notes"
                      >
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        className="form-textarea w-full rounded-lg border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-[#1a2632] text-[#111418] dark:text-white focus:ring-primary focus:border-primary px-4 py-3 text-base"
                        rows={4}
                        value={formData.notes}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#dbe0e6] dark:border-gray-700">
                    <Link href="/expenses">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          <Loader size={20} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
