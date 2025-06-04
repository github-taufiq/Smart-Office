import React, {useEffect, useState} from 'react';
import {Alert, Badge, Button, Card, Modal, Spinner} from 'react-bootstrap';
import {useBooking} from '../context/BookingContext';
import {FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers} from 'react-icons/fa';

const MyBookings = () => {
    const {getMyBookings, cancelMyBooking, loading} = useBooking();
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState({type: '', text: ''});
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        const result = await getMyBookings();
        if (result.success) {
            setBookings(result.data);
        } else {
            setMessage({type: 'danger', text: result.error});
        }
    };

    const handleCancelBooking = async () => {
        if (!selectedBooking) return;

        const result = await cancelMyBooking(selectedBooking.id);
        if (result.success) {
            setMessage({type: 'success', text: 'Booking cancelled successfully!'});
            fetchMyBookings(); // Refresh the list
            setShowCancelModal(false);
            setSelectedBooking(null);
        } else {
            setMessage({type: 'danger', text: result.error});
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            'PENDING': 'warning',
            'APPROVED': 'success',
            'REJECTED': 'danger',
            'CANCELLED': 'secondary'
        };
        return <Badge bg={variants[status] || 'primary'}>{status}</Badge>;
    };

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
        };
    };

    const canCancelBooking = (booking) => {
        return booking.status === 'PENDING' || booking.status === 'APPROVED';
    };

    if (loading && bookings.length === 0) {
        return (
            <div className="text-center py-4">
                <Spinner animation="border"/>
                <p className="mt-2">Loading your bookings...</p>
            </div>
        );
    }

    return (
        <div>
            <h4 className="mb-4">My Bookings</h4>

            {message.text && (
                <Alert variant={message.type} className="mb-3">
                    {message.text}
                </Alert>
            )}

            {bookings.length === 0 ? (
                <Alert variant="info">
                    You don't have any bookings yet. <a href="#book">Create your first booking</a>
                </Alert>
            ) : (
                <div className="row g-3">
                    {bookings.map(booking => {
                        const startDateTime = formatDateTime(booking.startDateTime);
                        const endDateTime = formatDateTime(booking.endDateTime);

                        return (
                            <div key={booking.id} className="col-md-6 col-lg-4">
                                <Card className="h-100">
                                    <Card.Header className="d-flex justify-content-between align-items-center">
                                        <h6 className="mb-0">{booking.room?.name}</h6>
                                        {getStatusBadge(booking.status)}
                                    </Card.Header>

                                    <Card.Body>
                                        <div className="mb-2">
                                            <FaCalendarAlt className="me-2 text-muted"/>
                                            <small>{startDateTime.date}</small>
                                        </div>

                                        <div className="mb-2">
                                            <FaClock className="me-2 text-muted"/>
                                            <small>{startDateTime.time} - {endDateTime.time}</small>
                                        </div>

                                        <div className="mb-2">
                                            <FaUsers className="me-2 text-muted"/>
                                            <small>{booking.attendeeCount} attendees</small>
                                        </div>

                                        <div className="mb-3">
                                            <FaMapMarkerAlt className="me-2 text-muted"/>
                                            <small>{booking.room?.location}</small>
                                        </div>

                                        <div className="mb-3">
                                            <strong>Purpose:</strong>
                                            <p className="small text-muted mb-0">{booking.purpose}</p>
                                        </div>

                                        {booking.status === 'REJECTED' && booking.rejectionReason && (
                                            <div className="mb-3">
                                                <strong>Rejection Reason:</strong>
                                                <p className="small text-danger mb-0">{booking.rejectionReason}</p>
                                            </div>
                                        )}
                                    </Card.Body>

                                    <Card.Footer>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <small className="text-muted">
                                                Requested: {formatDateTime(booking.requestedAt).date}
                                            </small>

                                            {canCancelBooking(booking) && (
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setShowCancelModal(true);
                                                    }}
                                                    disabled={loading}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cancel Booking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBooking && (
                        <div>
                            <p>Are you sure you want to cancel this booking?</p>
                            <div className="bg-light p-3 rounded">
                                <strong>{selectedBooking.room?.name}</strong><br/>
                                <small className="text-muted">
                                    {formatDateTime(selectedBooking.startDateTime).date} at {formatDateTime(selectedBooking.startDateTime).time}
                                </small><br/>
                                <small>{selectedBooking.purpose}</small>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
                        Keep Booking
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleCancelBooking}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Spinner size="sm" className="me-2"/>
                                Cancelling...
                            </>
                        ) : (
                            'Yes, Cancel Booking'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MyBookings;

