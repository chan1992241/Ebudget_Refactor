import { Modal, Stack, Button } from "react-bootstrap";
import { currencyFormatter } from "../utils/currencyFormatter";
import { FC } from "react";
import axios from "axios";

interface ViewExpensesModalProps {
    budgetId: number | null,
    handleClose: () => void,
}

export const ViewExpensesModal: FC<ViewExpensesModalProps> = ({ budgetId, handleClose }) => {
    // const { getBudgetExpenses, budgets, deleteBudget, deleteExpense } = useBudgets()
    // const budget = UNCATEGORIZED_BUDGET_ID === budgetId ? { name: "Uncategorized", id: UNCATEGORIZED_BUDGET_ID } : budgets.find(budget => budget.id === budgetId)
    // const expenses = getBudgetExpenses(budgetId)
    async function handleDeleteBudget(budgetId: number) {
        try {
            const response = await axios.delete(`http://localhost:5000/deleteBudget/${budgetId}`)
            if (response.status === 200) {
                //redirect to home page
                if (typeof window !== 'undefined') {
                    window.location.href = window.location.origin;
                }

            }
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
                            Expense - Expense Name
                        </div>
                        <Button variant="outline-danger" onClick={() => budgetId && handleDeleteBudget(budgetId)}>Delete Budget</Button>
                    </Stack>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Stack direction="vertical" gap={'3' as any}>
                    <Stack direction='horizontal' gap={'2' as any}>
                        <div className="me-auto fs-4">Expense Description</div>
                        <div className="fs-5">{currencyFormatter.format(10)}</div>
                        <Button onClick={() => { handleClose(); }} size='sm' variant="outline-danger">&times;</Button>
                    </Stack>
                </Stack>
            </Modal.Body>
        </Modal>
    )
}   