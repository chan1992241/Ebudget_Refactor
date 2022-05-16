import axios from 'axios';
import React, { FC, useRef } from 'react'
import { Modal, Form, Button } from "react-bootstrap";

interface AddBudgetModalProps {
    show: boolean;
    handleClose: () => void;
}

export const AddBudgetModal: FC<AddBudgetModalProps> = ({ show, handleClose }) => {
    const nameRef = useRef<any>();
    const maxRef = useRef<any>();
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        const bodyFormData = new FormData();
        bodyFormData.append('name', nameRef.current.value);
        bodyFormData.append('max_spending', maxRef.current.value);
        try {
            await axios.post('http://localhost:5000/addBudget/', bodyFormData, { headers: { 'Content-Type': 'multipart/form-data' } });
        } catch (err) {
            console.error(err);
        }
        handleClose();
    }
    return <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
                <Modal.Title>New Budget</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control ref={nameRef} type="text" placeholder="Enter name" required name='name' />
                </Form.Group>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Maximum Spending</Form.Label>
                    <Form.Control ref={maxRef} type="number" required min={0} step={0.01} name='maxSpending' />
                </Form.Group>
                <div className="d-flex justify-content-end">
                    <Button variant="primary" type="submit">Add</Button>
                </div>
            </Modal.Body>
        </Form>
    </Modal>
}