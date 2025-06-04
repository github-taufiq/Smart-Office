import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Row} from 'react-bootstrap';

const ParkingSlotForm = ({onSave, onCancel, editingSlot}) => {
    const [formData, setFormData] = useState({
        slotNumber: '',
        vehicleType: 'CAR',
        floor: 1,
        status: 'AVAILABLE',
        description: ''
    });

    const vehicleTypes = ['CAR', 'MOTORCYCLE', 'BICYCLE'];
    const statuses = ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'OUT_OF_ORDER'];

    useEffect(() => {
        if (editingSlot) {
            setFormData({
                slotNumber: editingSlot.slotNumber || '',
                vehicleType: editingSlot.vehicleType || 'CAR',
                floor: editingSlot.floor || 1,
                status: editingSlot.status || 'AVAILABLE',
                description: editingSlot.description || ''
            });
        }
    }, [editingSlot]);

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
        <Card>
            <Card.Header>
                <h5>{editingSlot ? 'Edit Parking Slot' : 'Add New Parking Slot'}</h5>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Slot Number *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="slotNumber"
                                    value={formData.slotNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., A001"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle Type *</Form.Label>
                                <Form.Select
                                    name="vehicleType"
                                    value={formData.vehicleType}
                                    onChange={handleChange}
                                    required
                                >
                                    {vehicleTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Floor *</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="floor"
                                    value={formData.floor}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Status *</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    {statuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Optional description or notes"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex gap-2">
                        <Button variant="primary" type="submit">
                            {editingSlot ? 'Update Slot' : 'Create Slot'}
                        </Button>
                        <Button variant="secondary" onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default ParkingSlotForm;