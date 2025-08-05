interface FinancialRecord {
  id?: number,
  title: string,
  amountIn: number,
  amountOut: number,
  tCode: 'C' | 'D' | 'M' | 'H',
  tDate: string,
  createdAt: string
}

interface Income {
  title: string,
  amountIn: number,
  financialAccountId: number | null,
  tDate: string
}

interface Spending {
  title: string,
  amountOut: number,
  financialAccountId: number | null,
  tDate: string,
  monthlyBudgetId: number | null
}

interface Mutation {
  title: string,
  amountOut: number,
  fromFinancialAccountId: number | null,
  toFinancialAccountId: number | null,
  tDate: string
}

interface DailyRec {
  id: string,
  text: string,
  logs: FinancialRecord[],
  totalIn: number,
  totalOut: number
}

interface ReportDate {
  startDate: string,
  endDate: string
}