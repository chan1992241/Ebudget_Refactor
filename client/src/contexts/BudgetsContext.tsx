import React, { useContext, useState } from "react";
import useFetchAPI from "../hooks/useFetchAPI";
import env from "react-dotenv";

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
    const [budgets, ,] = useFetchAPI<any>(env.SERVER_HOST + '/show_budgets', options.GET);
    const [isBudgetExpensesChanged, setIsBudgetExpensesChanged] = useState<boolean>(false);

    return <BudgetsContext.Provider value={{
        budgets,
        isBudgetExpensesChanged,
        setIsBudgetExpensesChanged
    }}>{children}</BudgetsContext.Provider >
}