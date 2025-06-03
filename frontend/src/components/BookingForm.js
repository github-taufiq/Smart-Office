import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Alert, Card, Badge, Spinner } from 'react-bootstrap';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

const BookingForm = () => {
  const { user } = useAuth();
  const { requestBooking, getAvailableRooms, loading } = useBooking();
  
  const [formData, setFormData] = useState({
    roomId: '',
    startDateTime: '',
    endDateTime: '',
    purpose: '',
    attendeeCount: 1
  });
  
  const [availableRooms, setAvailableRooms] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const searchAvailableRooms = async () => {
    if (!formData.startDateTime || !formData.endDateTime) {
      setMessage({ type: 'warning', text: 'Please select start and end date/time first' });
      return;
    }

    const availabilityRequest = {
      startDateTime: formData.startDateTime,
      endDateTime: formData.endDateTime,
      attendeeCount: parseInt(formData.attendeeCount)
    };

    const result = await getAvailableRooms(availabilityRequest);
    if (result.success) {
      setAvailableRooms(result.data);
      setSearchPerformed(true);
      setMessage({ type: 'success', text: `Found ${result.data.length} available rooms` });
    } else {
      setMessage({ type: 'danger', text: result.error });
      setAvailableRooms([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.roomId) {
      setMessage({ type: 'warning', text: 'Please select a room' });
      return;
    }

    const bookingRequest = {
      roomId: parseInt(formData.roomId),
      startDateTime: formData.startDateTime,
      endDateTime: formData.endDateTime,
      purpose: formData.purpose,
      attendeeCount: parseInt(formData.attendeeCount),
      requestedBy: user?.id || 1
    };

    const result = await requestBooking(bookingRequest);
    if (result.success) {
      setMessage({ type: 'success', text: 'Booking request submitted successfully!' });
      // Reset form
      setFormData({
        roomId: '',
        startDateTime: '',
        endDateTime: '',
        purpose: '',
        attendeeCount: 1
      });
      setAvailableRooms([]);
      setSearchPerformed(false);
    } else {
      setMessage({ type: 'danger', text: result.error });
    }
  };

  // Set minimum date/time to current time
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  // Auto-set end time when start time changes
  const handleStartTimeChange = (e) => {
    const startTime = e.target.value;
    setFormData(prev => {
      const newData = { ...prev, startDateTime: startTime };
      
      // Auto-set end time to 1 hour later if not set
      if (!prev.endDateTime && startTime) {
        const start = new Date(startTime);
        start.setHours(start.getHours() + 1);
        start.setMinutes(start.getMinutes() - start.getTimezoneOffset());
        newData.endDateTime = start.toISOString().slice(0, 16);
      }
      
      return newData;
    });
  };

  return (
    <div>
      <h4 className="mb-4">Book Conference Room</h4>
      
      {message.text && (
        <Alert variant={message.type} className="mb-3">
          {message.text}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Start Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="startDateTime"
                value={formData.startDateTime}
                onChange={handleStartTimeChange}
                min={getCurrentDateTime()}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>End Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="endDateTime"
                value={formData.endDateTime}
                onChange={handleInputChange}
                min={formData.startDateTime || getCurrentDateTime()}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Number of Attendees</Form.Label>
              <Form.Control
                type="number"
                name="attendeeCount"
                value={formData.attendeeCount}
                onChange={handleInputChange}
                min="1"
                max="50"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6} className="d-flex align-items-end">
            <Button 
              variant="outline-primary" 
              onClick={searchAvailableRooms}
              disabled={loading || !formData.startDateTime || !formData.endDateTime}
              className="w-100"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Searching...
                </>
              ) : (
                'Search Available Rooms'
              )}
            </Button>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Purpose/Meeting Title</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="purpose"
            value={formData.purpose}
            onChange={handleInputChange}
            placeholder="Enter the purpose of the meeting..."
            required
          />
        </Form.Group>

        {/* Available Rooms Section */}
        {searchPerformed && (
          <div className="mb-4">
            <h5>Available Rooms</h5>
            {availableRooms.length === 0 ? (
              <Alert variant="info">
                No rooms available for the selected time slot. Please try different times.
              </Alert>
            ) : (
              <Row className="g-3">
                {availableRooms.map(room => (
                  <Col key={room.id} md={6} lg={4}>
                    <Card 
                      className={`h-100 ${formData.roomId == room.id ? 'border-primary' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setFormData(prev => ({ ...prev, roomId: room.id.toString() }))}
                    >
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0">{room.name}</h6>
                          <Form.Check
                            type="radio"
                            name="roomId"
                            value={room.id}
                            checked={formData.roomId == room.id}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <p className="text-muted small mb-2">{room.description}</p>
                        
                        <div className="d-flex flex-wrap gap-1 mb-2">
                          <Badge bg="secondary">
                            Capacity: {room.capacity}
                          </Badge>
                          <Badge bg="info">
                            Floor: {room.floor}
                          </Badge>
                          {room.hasProjector && (
                            <Badge bg="success">Projector</Badge>
                          )}
                          {room.hasWhiteboard && (
                            <Badge bg="success">Whiteboard</Badge>
                          )}
                          {room.hasVideoConference && (
                            <Badge bg="success">Video Conf</Badge>
                          )}
                        </div>
                        
                        <small className="text-muted">
                          Location: {room.location}
                        </small>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        )}

        <div className="d-flex gap-2">
          <Button 
            type="submit" 
            variant="primary"
            disabled={loading || !formData.roomId}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Submitting...
              </>
            ) : (
              'Submit Booking Request'
            )}
          </Button>
          
          <Button 
            type="button" 
            variant="outline-secondary"
            onClick={() => {
              setFormData({
                roomId: '',
                startDateTime: '',
                endDateTime: '',
                purpose: '',
                attendeeCount: 1
              });
              setAvailableRooms([]);
              setSearchPerformed(false);
              setMessage({ type: '', text: '' });
            }}
          >
            Reset
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default BookingForm;
