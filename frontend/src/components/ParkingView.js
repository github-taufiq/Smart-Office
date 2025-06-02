import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Badge, Button } from 'react-bootstrap';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import ParkingSlot from './ParkingSlot';
import { FaCar, FaParking, FaCalendarCheck, FaInfoCircle } from 'react-icons/fa';

const ParkingView = () => {
  const { user } = useAuth();
  const { 
    slots, 
    loading, 
    fetchSlots, 
    getAvailableSlotCount, 
    getMyReservations 
  } = useParking();
  
  const [stats, setStats] = useState({
    available: 0,
    occupied: 0,
    reserved: 0,
    outOfOrder: 0
  });
  const [myReservations, setMyReservations] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadParkingData();
  }, []);

  useEffect(() => {
    if (slots.length > 0) {
      calculateStats();
    }
  }, [slots]);

  const loadParkingData = async () => {
    try {
      // Fetch slots
      await fetchSlots();
      
      // Fetch user reservations
      const reservationsResult = await getMyReservations();
      if (reservationsResult.success) {
        setMyReservations(reservationsResult.data);
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to load parking data' });
    }
  };

  const calculateStats = () => {
    const newStats = {
      available: 0,
      occupied: 0,
      reserved: 0,
      outOfOrder: 0
    };

    slots.forEach(slot => {
      switch (slot.status) {
        case 'AVAILABLE':
          newStats.available++;
          break;
        case 'OCCUPIED':
          newStats.occupied++;
          break;
        case 'RESERVED':
          newStats.reserved++;
          break;
        case 'OUT_OF_ORDER':
          newStats.outOfOrder++;
          break;
        default:
          break;
      }
    });

    setStats(newStats);
  };

  const refreshData = async () => {
    setMessage({ type: '', text: '' });
    await loadParkingData();
    setMessage({ type: 'success', text: 'Parking data refreshed!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  if (loading && slots.length === 0) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <Spinner animation="border" />
          <p className="mt-2">Loading parking information...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <ParkingSlot />
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>
                <FaParking className="me-2" />
                Parking Management
              </h2>
              <p className="text-muted">Welcome, {user?.name}! Manage your parking reservations.</p>
            </div>
            <Button variant="outline-primary" onClick={refreshData} disabled={loading}>
              {loading ? <Spinner size="sm" className="me-2" /> : null}
              Refresh
            </Button>
          </div>
        </Col>
      </Row>

      {/* Alert Messages */}
      {message.text && (
        <Alert variant={message.type} className="mb-4">
          {message.text}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaCar size={32} className="text-success mb-2" />
              <h4 className="text-success">{stats.available}</h4>
              <small className="text-muted">Available</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaCar size={32} className="text-warning mb-2" />
              <h4 className="text-warning">{stats.occupied}</h4>
              <small className="text-muted">Occupied</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaCar size={32} className="text-info mb-2" />
              <h4 className="text-info">{stats.reserved}</h4>
              <small className="text-muted">Reserved</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaCar size={32} className="text-secondary mb-2" />
              <h4 className="text-secondary">{stats.outOfOrder}</h4>
              <small className="text-muted">Out of Order</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* My Reservations */}
      {myReservations.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <FaCalendarCheck className="me-2" />
                  My Current Reservations
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {myReservations.map(reservation => (
                    <Col key={reservation.id} md={6} lg={4} className="mb-2">
                      <div className="d-flex align-items-center">
                        <Badge bg="info" className="me-2">
                          Slot {reservation.slotNumber}
                        </Badge>
                        <small className="text-muted">
                          Reserved until {new Date(reservation.reservedUntil).toLocaleString()}
                        </small>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Instructions */}
      <Row className="mb-4">
        <Col>
          <Alert variant="info">
            <FaInfoCircle className="me-2" />
            <strong>How to use:</strong>
            <ul className="mb-0 mt-2">
              <li>Click on an <Badge bg="success">Available</Badge> slot to reserve it</li>
              <li>Click on your <Badge bg="info">Reserved</Badge> slot to check in</li>
              <li>Use the "Reserve" button to confirm your selection</li>
              <li>Use the "Cancel" button to cancel your selection</li>
            </ul>
          </Alert>
        </Col>
      </Row>

      {/* Parking Slots Grid */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Parking Slots</h5>
            </Card.Header>
            <Card.Body>
              {slots.length === 0 ? (
                <Alert variant="warning">
                  No parking slots available. Please contact the administrator.
                </Alert>
              ) : (
                <Row className="g-3">
                  {slots.map(slot => (
                    <Col key={slot.id} xs={12} sm={6} md={4} lg={3}>
                      <ParkingSlot slot={slot} />
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Legend */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h6 className="mb-0">Legend</h6>
            </Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col xs={6} md={3}>
                  <div className="p-2 border rounded" style={{ backgroundColor: '#d1e7dd', borderColor: '#198754' }}>
                    <Badge bg="success">Available</Badge>
                    <br />
                    <small className="text-muted">Click to reserve</small>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className="p-2 border rounded" style={{ backgroundColor: '#fff3cd', borderColor: '#fd7e14' }}>
                    <Badge bg="warning">Occupied</Badge>
                    <br />
                    <small className="text-muted">Currently in use</small>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className="p-2 border rounded" style={{ backgroundColor: '#d1ecf1', borderColor: '#0dcaf0' }}>
                    <Badge bg="info">Reserved</Badge>
                    <br />
                    <small className="text-muted">Click to check in</small>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className="p-2 border rounded" style={{ backgroundColor: '#e2e3e5', borderColor: '#6c757d' }}>
                    <Badge bg="secondary">Out of Order</Badge>
                    <br />
                    <small className="text-muted">Not available</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ParkingView;
