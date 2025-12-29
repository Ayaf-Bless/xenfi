import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { startOfMonth, endOfMonth } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month") || new Date().toISOString();
    const startDate = startOfMonth(new Date(month));
    const endDate = endOfMonth(new Date(month));

    // Get total expenses for current month
    const totalExpensesResult = await prisma.expense.aggregate({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const totalExpenses = Number(totalExpensesResult._sum.amount || 0);

    // Budget calculation (example: $50,000 monthly budget)
    const monthlyBudget = 50000;
    const budgetRemaining = monthlyBudget - totalExpenses;
    const budgetUsedPercentage = (totalExpenses / monthlyBudget) * 100;

    // Pending approvals count
    const pendingApprovals = await prisma.expense.count({
      where: {
        userId: session.user.id,
        status: "pending",
      },
    });

    // Category breakdown
    const categoryExpenses = await prisma.expense.groupBy({
      by: ["categoryId"],
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const categories = await prisma.category.findMany();
    const categoryBreakdown = categoryExpenses
      .map((ce) => {
        const category = categories.find((c) => c.id === ce.categoryId);
        const amount = Number(ce._sum.amount || 0);
        return {
          category: category?.name || "Unknown",
          amount,
          percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
          color: category?.color || "#137fec",
        };
      })
      .sort((a, b) => b.amount - a.amount);

    // Recent expenses
    const recentExpenses = await prisma.expense.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        category: true,
      },
      orderBy: { date: "desc" },
      take: 5,
    });

    return NextResponse.json({
      totalExpenses,
      budgetRemaining,
      budgetUsedPercentage,
      pendingApprovals,
      categoryBreakdown,
      recentExpenses,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
