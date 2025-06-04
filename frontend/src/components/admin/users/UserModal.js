import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Modal, Row} from 'react-bootstrap';

const UserModal = ({show, onHide, onSave, editingUser}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'EMPLOYEE',
        department: '',
        phoneNumber: ''
    });

    const roles = ['EMPLOYEE', 'MANAGER', 'VIP', 'VISITOR', 'CONTRACTOR', 'ADMIN'];

    useEffect(() => {
        if (editingUser) {
            setFormData({
                name: editingUser.name || '',
                email: editingUser.email || '',
                role: editingUser.role || 'EMPLOYEE',
                department: editingUser.department || '',
                phoneNumber: editingUser.phoneNumber || ''
            });
        } else {
            setFormData({
                name: '',
                email: '',
                role: 'EMPLOYEE',
                department: '',
                phoneNumber: ''
            });
        }
    }, [editingUser, show]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {editingUser ? 'Edit User' : 'Add New User'}
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter full name"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email *</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter email address"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Role *</Form.Label>
                                <Form.Select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                >
                                    {roles.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Department</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="Enter department"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        {editingUser ? 'Update User' : 'Create User'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default UserModal;