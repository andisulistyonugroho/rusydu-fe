interface Budget {
  id: number,
  title: string,
  thePeriod: string,
  amount: number,
  amountUsed: number,
  amountLeft: number,
  isActive?: boolean,
  createdAt?: string,
  updatedAt?: string,
  userId: number
}

interface SpendingBudget {
  title: string,
  amount: number,
  tDate: string,
  fromFinancialAccountId: number | null,
  monthlyBudgetId: number | null
}

interface AvailableMonth {
  thePeriod: string,
  amount: number,
  amountUsed: number,
  amountLeft: number
}