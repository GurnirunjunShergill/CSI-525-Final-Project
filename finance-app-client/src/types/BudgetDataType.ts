export interface BudgetDataType {
    budgets?: BudgetItemType[];
    goals?: GoalsType;
    notYetDefinedFlag: boolean;
}

export interface GoalsType {
    dailyBudget: number;
    weeklyBudget: number;
    monthlyBudget: number;
    yearlyBudget: number;
}

export interface BudgetItemType {
    budgetDate: string;
    budget: BudgetListType[] | undefined;
    budgetTotal: number;
    budgetVariance: number;
    id: number;
}

export interface BudgetListType{
    budgetItemName: string;
    budgetItemType:  string;
    budgetItemAmount: number;
}