"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { Button } from "@/components/ui/button";
import { formatDateForInput } from "@/lib/utils";
import { PAYMENT_METHODS, EXPENSE_STATUSES } from "@/lib/constants";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function NewExpensePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: formatDateForInput(new Date()),
    paymentMethod: "Visa •••• 4242",
    status: "pending",
    categoryId: "",
    merchantName: "",
    notes: "",
    attachmentUrl: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
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

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Payment method is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        merchantName: formData.merchantName || null,
        notes: formData.notes || null,
        attachmentUrl: formData.attachmentUrl || null,
      };

      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create expense");
      }

      router.push("/expenses");
      router.refresh();
    } catch (error: any) {
      console.error("Error creating expense:", error);
      alert(error.message || "Failed to create expense");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <>
      {/* Breadcrumbs Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-[#dbe0e6] dark:border-gray-800 bg-white dark:bg-[#111418] shrink-0">
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/dashboard"
            className="text-[#617589] font-medium hover:text-primary transition-colors"
          >
            XenFi
          </Link>
          <span className="text-[#617589] material-symbols-outlined text-[16px]">
            chevron_right
          </span>
          <Link
            href="/expenses"
            className="text-[#617589] font-medium hover:text-primary transition-colors"
          >
            Expenses
          </Link>
          <span className="text-[#617589] material-symbols-outlined text-[16px]">
            chevron_right
          </span>
          <span className="text-[#111418] dark:text-white font-semibold">
            New Expense
          </span>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-background-light dark:bg-background-dark p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[#111418] dark:text-white text-3xl font-black tracking-tight">
                Add New Expense
              </h2>
              <p className="text-[#617589] mt-1">
                Enter the details of your expense below.
              </p>
            </div>
            <Link href="/expenses">
              <Button variant="outline">
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
                <span>Cancel</span>
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
                  {/* Amount */}
                  <div className="md:col-span-2">
                    <FormInput
                      id="amount"
                      name="amount"
                      label="Amount *"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={handleChange}
                      error={errors.amount}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <FormInput
                      id="description"
                      name="description"
                      label="Description *"
                      type="text"
                      placeholder="e.g., Client lunch at Bistro"
                      value={formData.description}
                      onChange={handleChange}
                      error={errors.description}
                      required
                    />
                  </div>

                  {/* Merchant Name */}
                  <FormInput
                    id="merchantName"
                    name="merchantName"
                    label="Merchant Name"
                    type="text"
                    placeholder="e.g., The Bistro"
                    value={formData.merchantName}
                    onChange={handleChange}
                  />

                  {/* Date */}
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

                  {/* Category */}
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

                  {/* Payment Method */}
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
                    error={errors.paymentMethod}
                    required
                  />

                  {/* Status */}
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

                  {/* Attachment URL */}
                  <FormInput
                    id="attachmentUrl"
                    name="attachmentUrl"
                    label="Attachment URL"
                    type="text"
                    placeholder="e.g., receipt_oct24.pdf"
                    value={formData.attachmentUrl}
                    onChange={handleChange}
                  />

                  {/* Notes */}
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
                      className="form-textarea w-full rounded-lg border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-[#1a2632] text-[#111418] dark:text-white focus:ring-primary focus:border-primary px-4 py-3 text-base placeholder:text-[#617589] dark:placeholder:text-gray-500"
                      rows={4}
                      placeholder="Add any additional notes or details..."
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#dbe0e6] dark:border-gray-700">
                  <Link href="/expenses">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="animate-spin material-symbols-outlined">
                          refresh
                        </span>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">
                          check
                        </span>
                        <span>Create Expense</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px] mt-0.5">
                  info
                </span>
                <div>
                  <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">
                    Expense Submission Tips
                  </h4>
                  <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Include detailed descriptions for faster approval</li>
                    <li>• Attach receipts when available</li>
                    <li>
                      • Categorize expenses accurately for better reporting
                    </li>
                    <li>• Submit expenses within 30 days for compliance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
