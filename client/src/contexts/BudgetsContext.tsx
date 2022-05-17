import React, { useContext, useState } from "react";
import useFetchAPI from "../hooks/useFetchAPI";

export const BudgetsContext = React.createContext<any>(null);

export function useBudgets() {
    return useContext(BudgetsContext)
}

type props = {
    children: React.ReactNode
}

export const BudgetsProvider = ({ children }: props) => {
    enum options {
        GET = 'GET',
        POST = 'POST',
        PUT = 'PUT',
        DELETE = 'DELETE'
    }
    const [budgets, ,] = useFetchAPI<any>('http://localhost:5000/show_budgets', options.GET);
    const [isBudgetExpensesChanged, setIsBudgetExpensesChanged] = useState<boolean>(false);


    // function getBudgets() {
    //     return budgets
    // }
    // function getBudgetExpenses(budgetId: number) {
    // const [expenses, , isError] = useFetchAPI(`http://localhost:5000/show_expenses/${budgetId}`, options.GET);
    //     return [expenses, isError]
    // }
    // function addExpense({ description, amount, budgetId: budgetId }: { description: string, amount: number, budgetId: number }) {
    //     const [response, , isError] = useFetchAPI(`http://localhost:5000/add_expense/${budgetId}`, options.POST, { description, amount });
    //     return [response, isError]
    // }
    // function addBudget({ name, max }: { name: string, max: number }): [boolean, boolean] {
    //     const [, isLoading, isError] = useFetchAPI(`http://localhost:5000/add_budget`, options.POST, { name, max });
    //     return [isLoading, isError]
    // }
    // function deleteBudget({ id }: { id: number }): [boolean, boolean] {
    //     const [, isLoading, isError] = useFetchAPI(`http://localhost:5000/delete_budget/${id}`, options.DELETE);
    //     return [isLoading, isError]
    // }
    // function deleteExpense({ id }: { id: number }): [boolean, boolean] {
    //     const [, isLoading, isError] = useFetchAPI(`http://localhost:5000/delete_expense/${id}`, options.DELETE);
    //     return [isLoading, isError]
    // }
    return <BudgetsContext.Provider value={{
        budgets,
        isBudgetExpensesChanged,
        setIsBudgetExpensesChanged
        // getBudgetExpenses,
        // addExpense,
        // addBudget,
        // deleteBudget,
        // deleteExpense,
    }}>{children}</BudgetsContext.Provider >
}