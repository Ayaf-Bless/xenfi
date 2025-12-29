import { z } from "zod";

export const expenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  date: z.coerce.date(),
  paymentMethod: z.string().min(1, "Payment method is required"),
  status: z.enum(["pending", "approved", "rejected", "paid"]),
  categoryId: z.string().min(1, "Category is required"),
  merchantName: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  attachmentUrl: z.string().optional().nullable(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  color: z.string().default("#137fec"),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
