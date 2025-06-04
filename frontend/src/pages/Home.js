import React from 'react';
import {Button, Card, Col, Container, Row} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import {FaCar, FaChartBar, FaPlus} from 'react-icons/fa';
import {useParking} from '../context/ParkingContext';

const Home = () => {
    const {availableCount, rows} = useParking();

    const totalSlots = rows.reduce((total, row) => total + row.slots.length, 0);
    const occupiedSlots = totalSlots - availableCount;

    return (
        <Container>
            <Row className="mb-4">
                <Col>
                    <h1>Smart Office - Parking Management System</h1>
                    <p className="lead">Manage your office parking slots efficiently</p>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center border-success">
                        <Card.Body>
                            <h3 className="text-success">{availableCount}</h3>
                            <p>Available Slots</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center border-danger">
                        <Card.Body>
                            <h3 className="text-danger">{occupiedSlots}</h3>
                            <p>Occupied Slots</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center border-primary">
                        <Card.Body>
                            <h3 className="text-primary">{totalSlots}</h3>
                            <p>Total Slots</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={4} className="mb-3">
                    <Card>
                        <Card.Body className="text-center">
                            <FaCar size={48} className="text-primary mb-3"/>
                            <Card.Title>View Parking Slots</Card.Title>
                            <Card.Text>
                                View and manage all parking slots, update their status
                            </Card.Text>
                            <LinkContainer to="/parking">
                                <Button variant="primary">Go to Parking</Button>
                            </LinkContainer>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card>
                        <Card.Body className="text-center">
                            <FaPlus size={48} className="text-success mb-3"/>
                            <Card.Title>Add New Parking</Card.Title>
                            <Card.Text>
                                Add new parking rows and slots to expand capacity
                            </Card.Text>
                            <LinkContainer to="/add-parking">
                                <Button variant="success">Add Parking</Button>
                            </LinkContainer>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card>
                        <Card.Body className="text-center">
                            <FaChartBar size={48} className="text-info mb-3"/>
                            <Card.Title>View Reports</Card.Title>
                            <Card.Text>
                                View parking statistics and usage reports
                            </Card.Text>
                            <LinkContainer to="/reports">
                                <Button variant="info">View Reports</Button>
                            </LinkContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;