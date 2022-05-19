import axios from 'axios';
import React, { FC, useRef, useEffect, useState } from 'react'
import { Modal, Form, Button } from "react-bootstrap";
import { useBudgets } from '../contexts/BudgetsContext';

interface AddNewBudgetProps {
    show: boolean;
    handleClose: () => void;
    defaulBudgetId: number;
}

interface budgetDetails {
    budget_id: number;
    name: string;
    total_expense?: number;
    max_spending: number;
}

const AddExpenseModal: FC<AddNewBudgetProps> = ({ show, handleClose, defaulBudgetId }) => {
    const descriptionRef = useRef<any>();
    const amountRef = useRef<any>();
    const budgetIdRef = useRef<any>();
    const [budgetDetails, setBudgetDetails] = useState<budgetDetails[]>([]);
    const { setIsBudgetExpensesChanged } = useBudgets();
    async function handleSubmit(e: React.SyntheticEvent): Promise<void> {
        e.preventDefault();
        const description = descriptionRef.current.value;
        const amount = amountRef.current.value;
        const budgetId = budgetIdRef.current.value;
        const newExpenseformData = new FormData();
        newExpenseformData.append('name', description);
        newExpenseformData.append('amount', amount);
        try {
            await axios.post(`http://localhost:5000/addExpense/${budgetId}`, newExpenseformData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setIsBudgetExpensesChanged(true);
            handleClose();
        } catch (err) {
            console.error(err);
        }
        handleClose();
    }
    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const response = await fetch('http://localhost:5000/show_budgets');
                const data = await response.json();
                setBudgetDetails(data.data);
                return Promise.resolve();
            } catch (err: any) {
                console.error(err);
                return Promise.resolve();
            }
        }
        fetchData();
    }, [])

    return (
        <Modal show={show} onHide={handleClose}>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>New Expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control ref={descriptionRef} type="text" placeholder="Enter name" required name='name' />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="amount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control ref={amountRef} type="number" required min={0} step={0.01} name="amount" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="budgetId">
                        <Form.Label>Budget</Form.Label>
                        <Form.Select
                            defaultValue={defaulBudgetId}
                            ref={budgetIdRef}
                            name="budgetID"
                        >
                            {budgetDetails.map((budget: budgetDetails) => (
                                <option key={budget.budget_id} value={budget.budget_id}>{budget.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button variant="primary" type="submit">Add</Button>
                    </div>
                </Modal.Body>
            </Form>
        </Modal>
    )
}

export default AddExpenseModal