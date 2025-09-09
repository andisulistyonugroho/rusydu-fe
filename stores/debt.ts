export const useDebtStore = defineStore("debt", () => {
  const { $api } = useNuxtApp();

  const debts = ref<Debt[]>([]);
  const debt = ref<Debt>();
  const parents = ref<Debt[]>([]);

  const addDebt = async (payload: NewDebt) => {
    try {
      await $api.post("/Debts", {
        title: payload.title,
        sBalance: payload.amount,
        eBalance: payload.amount,
        debtType: payload.debtType,
        tDate: payload.tDate,
        financialAccountId: payload.toFinancialAccountId,
        parentId: payload.parentId,
      });
      Promise.resolve(true);
    } catch (error) {
      Promise.reject(error);
    }
  };

  const getDebt = async () => {
    try {
      const params = {
        where: { isActive: 1, parentId: { eq: null } },
        order: "isActive DESC, id DESC",
      };
      const { data } = await $api.get<Debt[]>(
        "/Debts?filter=" + encodeURI(JSON.stringify(params)),
      );
      debts.value = data;
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getPaid = async () => {
    try {
      const params = {
        where: { parentId: { eq: null }, isActive: 0 },
        order: "id DESC",
      };
      const { data } = await $api.get<Debt[]>(
        "/Debts?filter=" + encodeURI(JSON.stringify(params)),
      );
      debts.value = data;
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getLunas = async () => {
    try {
      const params = {
        where: { isActive: 0, parentId: { eq: null } },
        order: "id DESC",
      };
      const { data } = await $api.get<Debt[]>(
        "/Debts?filter=" + encodeURI(JSON.stringify(params)),
      );
      debts.value = data;
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const payDebt = async (payload: DebtPayment) => {
    try {
      const data = {
        title: payload.title,
        amount: payload.amount,
        tDate: payload.tDate,
        financialAccountId: payload.fromFinancialAccountId,
        debtId: payload.debtId,
        monthlyBudgetId: payload.monthlyBudgetId,
      };

      await $api.post("/Debts/PayDebt", data);
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getDebtHistory = async (id: number) => {
    try {
      const { data } = await $api.get<Debt>(`/Debts/${id}`, {
        params: {
          filter: {
            include: ["financialRecords", "childs"],
          },
        },
      });
      debt.value = data;
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getParents = async () => {
    try {
      const params = {
        where: { parentId: { eq: null }, is_active: 1 },
        order: "id DESC",
      };
      const { data } = await $api.get<Debt[]>(
        "/Debts?filter=" + encodeURI(JSON.stringify(params)),
      );
      parents.value = data;
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    addDebt,
    getDebt,
    payDebt,
    getDebtHistory,
    getParents,
    getLunas,
    getPaid,
    debts,
    debt,
    parents,
  };
});
