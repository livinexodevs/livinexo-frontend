export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseItem {
  id: string;
  itemName: string;
  quantity: number;
  quantityUnit: string;
  price: number;
  totalAmount: number;
  purchaseDate: string;
  notes: string | null;
  category: string;
  addedById: string;
  addedBy: Member;
  splits: ExpenseSplit[];
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseSplit {
  id: string;
  amount: number;
  settled: boolean;
  expenseId: string;
  expense?: ExpenseItem;
  memberId: string;
  member: Member;
  createdAt: string;
  updatedAt: string;
}

export interface MemberBalance {
  member: Member;
  totalSpent: number;
  totalOwed: number;
  netBalance: number;
}

export interface AnalyticsData {
  totalExpenses: number;
  totalItems: number;
  memberCount: number;
  avgExpensePerItem: number;
  topItems: { name: string; count: number; total: number }[];
  highestSpending: { name: string; total: number }[];
  memberSpending: { name: string; spent: number; owed: number }[];
  monthlyTrend: { month: string; total: number }[];
  categoryBreakdown: { category: string; total: number }[];
}
