import React, { FC } from 'react'
// import { useBudgets } from '../contexts/BudgetsContext'
import { BudgetCard } from './BudgetCard'

interface TotalBudgetProps {
    amount: number,
    max: number
}

export const TotalBudgetCard: FC<TotalBudgetProps> = ({ amount, max }) => {
    // const { expenses, budgets } = useBudgets()
    // const amount = expenses.reduce((acc, expense) => acc + expense.amount, 0)
    // const max = budgets.reduce((acc, budget) => acc + budget.max, 0)
    // if (max === 0) return null
    return (
        <BudgetCard name="Total" gray amount={amount} max={max} hideButton />
    )
}

export default TotalBudgetCard;