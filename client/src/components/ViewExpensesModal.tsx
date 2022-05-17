import { Modal, Stack, Button } from "react-bootstrap";
import { currencyFormatter } from "../utils/currencyFormatter";
import { FC, useEffect, useState } from "react";
import axios from "axios";
import { useBudgets } from "../contexts/BudgetsContext";

interface ViewExpensesModalProps {
    budgetId: number | null,
    handleClose: () => void,
}

interface ExpenseDetails {
    amount: number,
    budget_id: number,
    id: number,
    name: string,
}

export const ViewExpensesModal: FC<ViewExpensesModalProps> = ({ budgetId, handleClose }) => {
    // const { getBudgetExpenses, budgets, deleteBudget, deleteExpense } = useBudgets()
    // const budget = UNCATEGORIZED_BUDGET_ID === budgetId ? { name: "Uncategorized", id: UNCATEGORIZED_BUDGET_ID } : budgets.find(budget => budget.id === budgetId)
    // const expenses = getBudgetExpenses(budgetId)
    const { setIsBudgetExpensesChanged } = useBudgets();
    const [expenses, setExpenses] = useState<ExpenseDetails[]>([])
    const [isDeleteExpense, setIsDeleteExpense] = useState<boolean>(false);
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                if (budgetId) {
                    const response = await axios.get(`http://localhost:5000/show_expenses/${budgetId}`);
                    setExpenses(response.data.data);
                    return Promise.resolve();
                }
            } catch (err) {
                console.error(err);
                return Promise.reject();
            }
        }
        fetchExpenses();
    }, [budgetId, isDeleteExpense])
    async function handleDeleteBudget(budgetId: number) {
        try {
            const response = await axios.delete(`http://localhost:5000/deleteBudget/${budgetId}`)
            setIsBudgetExpensesChanged(true);
            handleClose();
        } catch (err) {
            console.error(err)
        }
    }
    async function handleDeleteExpense(expenseId: number) {
        setIsDeleteExpense(false);
        try {
            await axios.delete(`http://localhost:5000/deleteExpense/${expenseId}`)
            setIsDeleteExpense(true);
            setIsBudgetExpensesChanged(true);
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Modal show={budgetId !== null} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <Stack direction="horizontal" gap={"2" as any}>
                        <div>
                            Expense - {budgetId}
                        </div>
                        {budgetId == 1 ? null : <Button variant="outline-danger" onClick={() => budgetId && handleDeleteBudget(budgetId)}>Delete Budget</Button>}
                    </Stack>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Stack direction="vertical" gap={'3' as any}>
                    {expenses && expenses.map(expense => (
                        <Stack direction='horizontal' gap={'2' as any} key={expense.id}>
                            <div className="me-auto fs-4">{expense.name}</div>
                            <div className="fs-5">{currencyFormatter.format(expense.amount)}</div>
                            <Button onClick={() => { handleDeleteExpense(expense.id); }} size='sm' variant="outline-danger">&times;</Button>
                        </Stack>
                    ))}
                </Stack>
            </Modal.Body>
        </Modal>
    )
}   