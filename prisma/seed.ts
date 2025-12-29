import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Software & SaaS",
        description: "Software subscriptions and SaaS products",
        color: "#3b82f6",
      },
    }),
    prisma.category.create({
      data: {
        name: "Travel & Meals",
        description: "Business travel and meal expenses",
        color: "#a855f7",
      },
    }),
    prisma.category.create({
      data: {
        name: "Infrastructure",
        description: "Cloud infrastructure and hosting",
        color: "#137fec",
      },
    }),
    prisma.category.create({
      data: {
        name: "Office Supplies",
        description: "Office equipment and supplies",
        color: "#64748b",
      },
    }),
    prisma.category.create({
      data: {
        name: "Meals",
        description: "Client meals and team lunches",
        color: "#f97316",
      },
    }),
  ]);

  // Create test user
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.create({
    data: {
      name: "Alex Morgan",
      email: "alex@xenfi.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  // Create sample expenses
  const expenses = [
    {
      amount: new Prisma.Decimal(1240.0),
      description: "AWS Web Services",
      merchantName: "Amazon Web Services",
      date: new Date("2023-10-24"),
      paymentMethod: "Visa •••• 4242",
      status: "paid",
      categoryId: categories[2].id,
      userId: user.id,
    },
    {
      amount: new Prisma.Decimal(45.0),
      description: "Figma Professional",
      merchantName: "Figma Inc",
      date: new Date("2023-10-23"),
      paymentMethod: "Visa •••• 4242",
      status: "paid",
      categoryId: categories[0].id,
      userId: user.id,
    },
    {
      amount: new Prisma.Decimal(32.5),
      description: "Uber Business",
      merchantName: "Uber",
      date: new Date("2023-10-22"),
      paymentMethod: "Amex •••• 1009",
      status: "pending",
      categoryId: categories[1].id,
      userId: user.id,
    },
    {
      amount: new Prisma.Decimal(850.0),
      description: "Slack Enterprise",
      merchantName: "Slack Technologies",
      date: new Date("2023-10-21"),
      paymentMethod: "Visa •••• 4242",
      status: "paid",
      categoryId: categories[0].id,
      userId: user.id,
    },
    {
      amount: new Prisma.Decimal(145.2),
      description: "Client Lunch @ Bistro",
      merchantName: "The Bistro",
      date: new Date("2023-10-24"),
      paymentMethod: "Visa •••• 4242",
      status: "paid",
      attachmentUrl: "receipt_oct24.pdf",
      categoryId: categories[4].id,
      userId: user.id,
    },
  ];

  await Promise.all(
    expenses.map((expense) => prisma.expense.create({ data: expense }))
  );

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
