import { FC } from 'react'
import { BudgetCard } from './BudgetCard'

interface UncategorizedBudgetCardProps {
    onViewExpensesClick: () => void;
    onAddExpenseClick: () => void;
    amount: number;
}

export const UncategorizedBudgetCard: FC<UncategorizedBudgetCardProps> = (props) => {
    return (
        <BudgetCard name="Uncategorized" gray hideButton={false} {...props} />
    )
}