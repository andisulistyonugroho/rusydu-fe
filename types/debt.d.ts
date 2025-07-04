interface Debt {
  id: number,
  title: string,
  sBalance: number,
  eBalance: number,
  debtType: 'bill' | 'capital',
  tDate: string,
  isActive: boolean,
  createdAt: string,
  updatedAt: string,
  financialRecords?: FinancialRecord[],
  childs?: Debt[]
}

interface NewDebt {
  title: string,
  amount: number,
  debtType: 'bill' | 'capital',
  tDate: string,
  toFinancialAccountId: number | null,
  parentId?: number | null
}

interface DebtPayment {
  title: string,
  tCode: string,
  amount: number,
  tDate: string,
  fromFinancialAccountId: number,
  debtId: number,
  monthlyBudgetId?: number
}