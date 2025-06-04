import React from 'react';
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        return (
            <Container className="py-4">
                <Alert variant="warning">You are not authenticated</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2>Welcome to Smart Office Dashboard</h2>
                    <p className="text-muted">Hello, {user?.name || 'User'}!</p>
                </Col>
            </Row>

            <Row className="g-4">
                <Col md={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <h5>Parking Management</h5>
                            <p className="text-muted">Reserve parking spots and check availability</p>
                            <Button variant="success" onClick={() => navigate('/parking')}>
                                Go to Parking
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <h5>Conference Room Booking</h5>
                            <p className="text-muted">Book rooms and manage meetings</p>
                            <Button variant="primary" onClick={() => navigate('/conference-booking')}>
                                Book Now
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <h5>Attendance System</h5>
                            <p className="text-muted">View, check-in, and monitor attendance</p>
                            <Button variant="warning" onClick={() => navigate('/attendance')}>
                                View Attendance
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {user?.role === 'ADMIN' && (
                <Row className="mt-4">
                    <Col>
                        <Card>
                            <Card.Header>
                                <h5>Admin Panel</h5>
                            </Card.Header>
                            <Card.Body>
                                <p>You have admin access!</p>
                                <Button variant="danger" disabled>
                                    Admin Dashboard (Coming Soon)
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default Dashboard;
