import { FC } from 'react'
// import { UNCATEGORIZED_BUDGET_ID, useBudgets } from '../contexts/BudgetsContext'
import { BudgetCard } from './BudgetCard'

interface UncategorizedBudgetCardProps {
    onViewExpensesClick: () => void;
    amount: number;
}

export const UncategorizedBudgetCard: FC<UncategorizedBudgetCardProps> = (props) => {
    // const { getBudgetExpenses } = useBudgets()
    // const amount = getBudgetExpenses(UNCATEGORIZED_BUDGET_ID).reduce((acc, expense) => acc + expense.amount, 0)
    // if (amount === 0) return null
    return (
        <BudgetCard name="Uncategorized" gray hideButton={false} {...props} />
    )
}