import React from 'react';
import {Alert, Button, Card, Col, Container, Row} from 'react-bootstrap';
import {useAuth} from '../context/AuthContext';

const Dashboard = () => {
    const {user, isAuthenticated} = useAuth();

    console.log('Dashboard - rendering with user:', user, 'isAuthenticated:', isAuthenticated);

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
                    <Alert variant="success">
                        You are successfully logged in as: {user?.email} ({user?.role})
                    </Alert>
                </Col>
            </Row>

            <Row className="g-4">
                <Col md={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <h5>Parking Management</h5>
                            <p className="text-muted">Reserve parking spots and check availability</p>
                            <Button
                                variant="success"
                                onClick={() => window.location.href = '/parking'}
                            >
                                Go to Parking
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <h5>Conference Rooms</h5>
                            <p className="text-muted">Book meeting rooms and check schedules</p>
                            <Button variant="info" disabled>
                                Coming Soon
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
