import React, { FC } from 'react'
// import { useBudgets } from '../contexts/BudgetsContext'
import { BudgetCard } from './BudgetCard'

interface TotalBudgetProps {
    amount: number,
    max: number
}

export const TotalBudgetCard: FC<TotalBudgetProps> = ({ amount, max }) => {
    return (
        <BudgetCard name="Total" gray amount={amount} max={max} hideButton />
    )
}

export default TotalBudgetCard;