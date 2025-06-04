import React, {useState} from 'react';
import {Card, Col, Container, Nav, Row, Tab} from 'react-bootstrap';
import {BookingProvider} from '../context/BookingContext';
// import { useAuth } from '../context/AuthContext';
import BookingForm from './BookingForm';
import MyBookings from './MyBookings';
// import OfficeBookings from './OfficeBookings';

const BookingView = () => {
//   const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('book');

    return (
        <BookingProvider>
            <Container fluid className="py-4">
                <Row className="mb-4">
                    <Col>
                        <h2>Conference Room Booking</h2>
                        <p className="text-muted">Book and manage conference room reservations</p>
                    </Col>
                </Row>

                <Card>
                    <Card.Header>
                        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                            <Nav variant="tabs">
                                <Nav.Item>
                                    <Nav.Link eventKey="book">Book Room</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="my-bookings">My Bookings</Nav.Link>
                                </Nav.Item>
                                {/* {user?.role === 'ADMIN' && (
                  <>
                    <Nav.Item>
                      <Nav.Link eventKey="pending">Pending Approvals</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="all-bookings">All Bookings</Nav.Link>
                    </Nav.Item>
                  </>
                )} */}
                            </Nav>
                        </Tab.Container>
                    </Card.Header>

                    <Card.Body>
                        <Tab.Container activeKey={activeTab}>
                            <Tab.Content>
                                <Tab.Pane eventKey="book">
                                    <BookingForm/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="my-bookings">
                                    <MyBookings/>
                                </Tab.Pane>
                                {/* {user?.role === 'ADMIN' && (
                  <>
                    <Tab.Pane eventKey="pending">
                      <PendingApprovals />
                    </Tab.Pane>
                    <Tab.Pane eventKey="all-bookings">
                      <OfficeBookings />
                    </Tab.Pane>
                  </>
                )} */}
                            </Tab.Content>
                        </Tab.Container>
                    </Card.Body>
                </Card>
            </Container>
        </BookingProvider>
    );
};

export default BookingView;
