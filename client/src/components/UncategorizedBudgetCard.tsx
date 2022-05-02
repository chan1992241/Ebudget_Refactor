import React from 'react'
// import { UNCATEGORIZED_BUDGET_ID, useBudgets } from '../contexts/BudgetsContext'
import { BudgetCard } from './BudgetCard'

interface UncategorizedBudgetCardProps {
    onViewExpensesClick: () => void
}

export default function UncategorizedBudgetCard<UncategorizedBudgetCardProps>(props: UncategorizedBudgetCardProps) {
    // const { getBudgetExpenses } = useBudgets()
    // const amount = getBudgetExpenses(UNCATEGORIZED_BUDGET_ID).reduce((acc, expense) => acc + expense.amount, 0)
    // if (amount === 0) return null
    return (
        <BudgetCard name="Uncategorized" gray amount={100} max={200} hideButton={false} {...props} />
    )
}