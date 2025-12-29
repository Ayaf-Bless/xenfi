import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: Date;
  paymentMethod: string;
  status: string;
  attachmentUrl?: string | null;
  merchantName?: string | null;
  categoryId: string;
  category: Category;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  color: string;
}

export interface DashboardStats {
  totalExpenses: number;
  budgetRemaining: number;
  budgetUsedPercentage: number;
  pendingApprovals: number;
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }[];
  recentExpenses: Expense[];
}
