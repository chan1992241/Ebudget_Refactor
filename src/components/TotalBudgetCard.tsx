import React from 'react'
// import { useBudgets } from '../contexts/BudgetsContext'
import { BudgetCard } from './BudgetCard'

export default function TotalBudgetCard() {
    // const { expenses, budgets } = useBudgets()
    // const amount = expenses.reduce((acc, expense) => acc + expense.amount, 0)
    // const max = budgets.reduce((acc, budget) => acc + budget.max, 0)
    // if (max === 0) return null
    return (
        <BudgetCard name="Total" gray amount={100} max={200} hideButton />
    )
}