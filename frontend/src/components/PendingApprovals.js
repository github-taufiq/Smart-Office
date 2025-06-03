import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Alert, Spinner, Modal, Form, Card, Row, Col } from 'react-bootstrap';
import { useBooking } from '../context/BookingContext';
import { FaCalendarAlt, FaClock, FaUsers, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

const PendingApprovals = () => {
  const { getPendingBookings, processBookingApproval, loading } = useBooking();
  const [pendingBookings, setPendingBookings] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [approvalData, setApprovalData] = useState({
    approved: true,
    rejectionReason: ''
  });

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const fetchPendingBookings = async () => {
    const result = await getPendingBookings();
    if (result.success) {
      setPendingBookings(result.data);
    } else {
      setMessage({ type: 'danger', text: result.error });
    }
  };

  const handleApprovalSubmit = async () => {
    if (!selectedBooking) return;

    const result = await processBookingApproval(selectedBooking.id, approvalData);
    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: `Booking ${approvalData.approved ? 'approved' : 'rejected'} successfully!` 
      });
      fetchPendingBookings(); // Refresh the list
      setShowApprovalModal(false);
      setSelectedBooking(null);
      setApprovalData({ approved: true, rejectionReason: '' });
    } else {
      setMessage({ type: 'danger', text: result.error });
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const openApprovalModal = (booking, approved) => {
    setSelectedBooking(booking);
    setApprovalData({ approved, rejectionReason: '' });
    setShowApprovalModal(true);
  };

  if (loading && pendingBookings.length === 0) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
        <p className="mt-2">Loading pending approvals...</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4">Pending Approvals</h4>
      
      {message.text && (
        <Alert variant={message.type} className="mb-3">
          {message.text}
        </Alert>
      )}

      {pendingBookings.length === 0 ? (
        <Alert variant="info">
          No pending bookings to approve.
        </Alert>
      ) : (
        <div className="row g-3">
          {pendingBookings.map(booking => {
            const startDateTime = formatDateTime(booking.startDateTime);
            const endDateTime = formatDateTime(booking.endDateTime);
            
            return (
              <div key={booking.id} className="col-md-6 col-lg-4">
                <Card className="h-100">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">{booking.room?.name}</h6>
                    <Badge bg="warning">PENDING</Badge>
                  </Card.Header>
                  
                  <Card.Body>
                    <div className="mb-2">
                      <FaUser className="me-2 text-muted" />
                      <small><strong>{booking.requestedByUser?.name}</strong></small>
                    </div>
                    
                    <div className="mb-2">
                      <FaCalendarAlt className="me-2 text-muted" />
                      <small>{startDateTime.date}</small>
                    </div>
                    
                    <div className="mb-2">
                      <FaClock className="me-2 text-muted" />
                      <small>{startDateTime.time} - {endDateTime.time}</small>
                    </div>
                    
                    <div className="mb-2">
                      <FaUsers className="me-2 text-muted" />
                      <small>{booking.attendeeCount} attendees</small>
                    </div>
                    
                    <div className="mb-3">
                      <FaMapMarkerAlt className="me-2 text-muted" />
                      <small>{booking.room?.location}</small>
                    </div>
                    
                    <div className="mb-3">
                      <strong>Purpose:</strong>
                      <p className="small text-muted mb-0">{booking.purpose}</p>
                    </div>
                  </Card.Body>
                  
                  <Card.Footer>
                    <div className="d-flex gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => openApprovalModal(booking, true)}
                        disabled={loading}
                        className="flex-fill"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => openApprovalModal(booking, false)}
                        disabled={loading}
                        className="flex-fill"
                      >
                        Reject
                      </Button>
                    </div>
                    <small className="text-muted d-block mt-2">
                      Requested: {formatDateTime(booking.requestedAt).date}
                    </small>
                  </Card.Footer>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Approval Modal */}
      <Modal show={showApprovalModal} onHide={() => setShowApprovalModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {approvalData.approved ? 'Approve' : 'Reject'} Booking
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <div>
              <div className="bg-light p-3 rounded mb-3">
                <strong>{selectedBooking.room?.name}</strong><br />
                <small className="text-muted">
                  Requested by: {selectedBooking.requestedByUser?.name}
                </small><br />
                <small className="text-muted">
                  {formatDateTime(selectedBooking.startDateTime).date} at {formatDateTime(selectedBooking.startDateTime).time}
                </small><br />
                <small>{selectedBooking.purpose}</small>
              </div>
              
              {!approvalData.approved && (
                <Form.Group>
                  <Form.Label>Rejection Reason</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={approvalData.rejectionReason}
                    onChange={(e) => setApprovalData(prev => ({
                      ...prev,
                      rejectionReason: e.target.value
                    }))}
                    placeholder="Please provide a reason for rejection..."
                    required
                  />
                </Form.Group>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApprovalModal(false)}>
            Cancel
          </Button>
          <Button 
            variant={approvalData.approved ? 'success' : 'danger'}
            onClick={handleApprovalSubmit}
            disabled={loading || (!approvalData.approved && !approvalData.rejectionReason.trim())}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              approvalData.approved ? 'Approve Booking' : 'Reject Booking'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PendingApprovals;
