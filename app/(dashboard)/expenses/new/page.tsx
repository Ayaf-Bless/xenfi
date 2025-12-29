"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sidebar } from "@/components/ui/sidebar";
import { PAYMENT_METHODS, EXPENSE_STATUSES } from "@/lib/constants";
import { formatDateForInput } from "@/lib/utils";
import { ChevronRight, X, Plus, Loader } from "lucide-react";

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user makes a selection
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Breadcrumbs Header */}
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
                  <X size={18} className="mr-2" />
                  Cancel
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Expense Information</CardTitle>
                <CardDescription>
                  Fill out all required fields marked with *
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Amount */}
                    <div className="md:col-span-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="amount"
                          className={errors.amount ? "text-destructive" : ""}
                        >
                          Amount *
                        </Label>
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={handleInputChange}
                          className={errors.amount ? "border-destructive" : ""}
                          required
                        />
                        {errors.amount && (
                          <p className="text-sm text-destructive">
                            {errors.amount}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="description"
                          className={
                            errors.description ? "text-destructive" : ""
                          }
                        >
                          Description *
                        </Label>
                        <Input
                          id="description"
                          name="description"
                          type="text"
                          placeholder="e.g., Client lunch at Bistro"
                          value={formData.description}
                          onChange={handleInputChange}
                          className={
                            errors.description ? "border-destructive" : ""
                          }
                          required
                        />
                        {errors.description && (
                          <p className="text-sm text-destructive">
                            {errors.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Merchant Name */}
                    <div className="space-y-2">
                      <Label htmlFor="merchantName">Merchant Name</Label>
                      <Input
                        id="merchantName"
                        name="merchantName"
                        type="text"
                        placeholder="e.g., The Bistro"
                        value={formData.merchantName}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="date"
                        className={errors.date ? "text-destructive" : ""}
                      >
                        Date *
                      </Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className={errors.date ? "border-destructive" : ""}
                        required
                      />
                      {errors.date && (
                        <p className="text-sm text-destructive">
                          {errors.date}
                        </p>
                      )}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="categoryId"
                        className={errors.categoryId ? "text-destructive" : ""}
                      >
                        Category *
                      </Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) =>
                          handleSelectChange("categoryId", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            errors.categoryId ? "border-destructive" : ""
                          }
                        >
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.categoryId && (
                        <p className="text-sm text-destructive">
                          {errors.categoryId}
                        </p>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="paymentMethod"
                        className={
                          errors.paymentMethod ? "text-destructive" : ""
                        }
                      >
                        Payment Method *
                      </Label>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) =>
                          handleSelectChange("paymentMethod", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            errors.paymentMethod ? "border-destructive" : ""
                          }
                        >
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_METHODS.map((method) => (
                            <SelectItem key={method.value} value={method.value}>
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.paymentMethod && (
                        <p className="text-sm text-destructive">
                          {errors.paymentMethod}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleSelectChange("status", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPENSE_STATUSES.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Attachment URL */}
                    <div className="space-y-2">
                      <Label htmlFor="attachmentUrl">Attachment URL</Label>
                      <Input
                        id="attachmentUrl"
                        name="attachmentUrl"
                        type="text"
                        placeholder="e.g., receipt_oct24.pdf"
                        value={formData.attachmentUrl}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        className="min-h-[120px]"
                        placeholder="Add any additional notes or details..."
                        value={formData.notes}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-3 pt-6 border-t">
                    <Link href="/expenses">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader size={20} className="mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Plus size={20} className="mr-2" />
                          Add Expense
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
