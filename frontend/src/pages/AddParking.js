import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useParking } from '../context/ParkingContext';

const AddParking = () => {
  const { addNotification, fetchAllRows } = useParking();
  const [formData, setFormData] = useState({
    rowName: '',
    numberOfSlots: 1,
    slotPrefix: 'A',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // This would need to be implemented in your backend
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification(
        `Successfully added parking row "${formData.rowName}" with ${formData.numberOfSlots} slots`,
        'success'
      );
      
      setFormData({
        rowName: '',
        numberOfSlots: 1,
        slotPrefix: 'A',
      });
      
      fetchAllRows();
    } catch (error) {
      addNotification('Failed to add parking row', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Add New Parking</h2>
          <p>Create new parking rows and slots</p>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h4>Add Parking Row</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Row Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="rowName"
                        value={formData.rowName}
                        onChange={handleInputChange}
                        placeholder="e.g., Row A, Ground Floor"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Number of Slots</Form.Label>
                      <Form.Control
                        type="number"
                        name="numberOfSlots"
                        value={formData.numberOfSlots}
                        onChange={handleInputChange}
                        min="1"
                        max="50"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Slot Number Prefix</Form.Label>
                  <Form.Control
                    type="text"
                    name="slotPrefix"
                    value={formData.slotPrefix}
                    onChange={handleInputChange}
                    placeholder="e.g., A, B, GF"
                    maxLength="3"
                    required
                  />
                  <Form.Text className="text-muted">
                    Slots will be numbered as {formData.slotPrefix}1, {formData.slotPrefix}2, etc.
                  </Form.Text>
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading}
                  className="me-2"
                >
                  {loading ? 'Adding...' : 'Add Parking Row'}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => setFormData({
                    rowName: '',
                    numberOfSlots: 1,
                    slotPrefix: 'A',
                  })}
                >
                  Reset
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5>Preview</h5>
            </Card.Header>
            <Card.Body>
              <p><strong>Row Name:</strong> {formData.rowName || 'Not specified'}</p>
              <p><strong>Number of Slots:</strong> {formData.numberOfSlots}</p>
              <p><strong>Slot Numbers:</strong></p>
              <div className="small">
                {Array.from({ length: Math.min(