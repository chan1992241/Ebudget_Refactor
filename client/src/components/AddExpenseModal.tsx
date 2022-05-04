import React, { FC, useRef } from 'react'
import { Modal, Form, Button } from "react-bootstrap";

interface AddNewBudgetProps {
    show: boolean;
    handleClose: () => void;
    defaulBudgetId: string;
}

const AddExpenseModal: FC<AddNewBudgetProps> = ({ show, handleClose, defaulBudgetId }) => {
    const descriptionRef = useRef<any>();
    const amountRef = useRef<any>();
    const budgetIdRef = useRef<any>();
    function handleSubmit(e: React.SyntheticEvent): void {
        e.preventDefault();
        /*
            TODO: submit data to server
        */
        handleClose();
    }
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
                            <option key={"no_key"} value={"no_val"}>No Value</option>
                            {/* TODO: add other option */}
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