import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.expenseSplit.deleteMany();
  await prisma.expenseItem.deleteMany();
  await prisma.member.deleteMany();

  const arjun = await prisma.member.create({
    data: { name: "Arjun Sharma", email: "arjun@haveli.com" },
  });
  const priya = await prisma.member.create({
    data: { name: "Priya Sharma", email: "priya@haveli.com" },
  });
  const rohan = await prisma.member.create({
    data: { name: "Rohan Patel", email: "rohan@haveli.com" },
  });
  const meera = await prisma.member.create({
    data: { name: "Meera Gupta", email: "meera@haveli.com" },
  });

  const members = [arjun, priya, rohan, meera];

  const expenses = [
    { itemName: "Basmati Rice", qty: 5, unit: "kg", price: 90, cat: "Groceries", days: 1 },
    { itemName: "Olive Oil", qty: 500, unit: "ml", price: 0.76, cat: "Groceries", days: 2 },
    { itemName: "LED Bulbs", qty: 1, unit: "pack", price: 599, cat: "Household", days: 3 },
    { itemName: "Wireless Mouse", qty: 1, unit: "pcs", price: 899, cat: "Electronics", days: 5 },
    { itemName: "Dish Soap", qty: 500, unit: "ml", price: 0.15, cat: "Kitchen", days: 5 },
    { itemName: "Face Wash", qty: 150, unit: "ml", price: 1.47, cat: "Personal Care", days: 7 },
    { itemName: "Floor Cleaner", qty: 1, unit: "L", price: 189, cat: "Household", days: 8 },
    { itemName: "Coffee Beans", qty: 500, unit: "g", price: 1.3, cat: "Groceries", days: 10 },
    { itemName: "HDMI Cable", qty: 1, unit: "pcs", price: 349, cat: "Electronics", days: 12 },
    { itemName: "Shampoo", qty: 400, unit: "ml", price: 0.78, cat: "Personal Care", days: 14 },
    { itemName: "Kitchen Towels", qty: 4, unit: "pack", price: 60, cat: "Kitchen", days: 15 },
    { itemName: "Milk", qty: 6, unit: "L", price: 62, cat: "Groceries", days: 16 },
    { itemName: "Laundry Detergent", qty: 2, unit: "kg", price: 213, cat: "Household", days: 18 },
    { itemName: "Pizza Night", qty: 1, unit: "pcs", price: 1200, cat: "Food & Dining", days: 20 },
    { itemName: "Netflix Subscription", qty: 1, unit: "pcs", price: 649, cat: "Entertainment", days: 22 },
    { itemName: "Electricity Bill", qty: 1, unit: "pcs", price: 2800, cat: "Utilities", days: 25 },
    { itemName: "Basmati Rice", qty: 5, unit: "kg", price: 90, cat: "Groceries", days: 30 },
    { itemName: "Vegetables Weekly", qty: 3, unit: "kg", price: 127, cat: "Groceries", days: 32 },
    { itemName: "Phone Charger", qty: 1, unit: "pcs", price: 499, cat: "Electronics", days: 35 },
    { itemName: "Toothpaste", qty: 3, unit: "pcs", price: 95, cat: "Personal Care", days: 38 },
    { itemName: "Biryani Dinner", qty: 1, unit: "pcs", price: 850, cat: "Food & Dining", days: 40 },
    { itemName: "Water Purifier Filter", qty: 1, unit: "pcs", price: 1200, cat: "Kitchen", days: 42 },
    { itemName: "Milk", qty: 4, unit: "L", price: 62, cat: "Groceries", days: 44 },
    { itemName: "WiFi Router", qty: 1, unit: "pcs", price: 1899, cat: "Electronics", days: 48 },
    { itemName: "Vegetables Weekly", qty: 2.5, unit: "kg", price: 168, cat: "Groceries", days: 50 },
    { itemName: "Gas Cylinder Refill", qty: 1, unit: "pcs", price: 900, cat: "Utilities", days: 55 },
    { itemName: "Movie Tickets", qty: 4, unit: "pcs", price: 250, cat: "Entertainment", days: 58 },
    { itemName: "Bed Sheets Set", qty: 1, unit: "pcs", price: 1500, cat: "Household", days: 60 },
  ];

  for (const exp of expenses) {
    const addedBy = members[Math.floor(Math.random() * members.length)];
    const numSplitters = Math.floor(Math.random() * 3) + 2;
    const shuffled = [...members].sort(() => 0.5 - Math.random());
    const splitMembers = shuffled.slice(0, Math.min(numSplitters, members.length));
    if (!splitMembers.find((m) => m.id === addedBy.id)) {
      splitMembers[0] = addedBy;
    }

    const totalAmount = exp.qty * exp.price;
    const splitAmount = totalAmount / splitMembers.length;
    const purchaseDate = new Date();
    purchaseDate.setDate(purchaseDate.getDate() - exp.days);

    await prisma.expenseItem.create({
      data: {
        itemName: exp.itemName,
        quantity: exp.qty,
        quantityUnit: exp.unit,
        price: exp.price,
        totalAmount,
        purchaseDate,
        category: exp.cat,
        addedById: addedBy.id,
        splits: {
          create: splitMembers.map((m) => ({
            memberId: m.id,
            amount: splitAmount,
            settled: Math.random() > 0.6,
          })),
        },
      },
    });
  }

  console.log("Seed completed: 4 members & 28 expenses created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
