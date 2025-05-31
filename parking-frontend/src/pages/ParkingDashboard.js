import React from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button, Badge, ButtonGroup } from 'react-bootstrap';
import { FaSave, FaTimes, FaSync } from 'react-icons/fa';
import { useParking } from '../context/ParkingContext';
import ParkingSlot from '../components/ParkingSlot';

const ParkingDashboard = () => {
  const { 
    rows, 
    loading, 
    error, 
    refreshData, 
    usingMockData,
    submitUpdate,
    cancelUpdate,
    hasEditingSlot,
    isSubmitting,
    editingSlot
  } = useParking();

  const isEditing = hasEditingSlot();

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading parking data...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="px-2">
      {/* Header Section */}
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="mb-2 mb-md-0">
              <h4 className="mb-1">
                Parking Management 
                {usingMockData && (
                  <Badge bg="warning" className="ms-2">Mock Data</Badge>
                )}
              </h4>
              <div className="d-flex flex-wrap gap-2 mb-1">
                <small>
                  <Badge bg="success" style={{ fontSize: '0.7rem' }}>●</Badge>
                  <span className="ms-1">Available</span>
                </small>
                <small>
                  <Badge bg="warning" style={{ fontSize: '0.7rem' }}>●</Badge>
                  <span className="ms-1">Occupied</span>
                </small>
                <small>
                  <Badge bg="info" style={{ fontSize: '0.7rem' }}>●</Badge>
                  <span className="ms-1">Reserved</span>
                </small>
                <small>
                  <Badge bg="secondary" style={{ fontSize: '0.7rem' }}>●</Badge>
                  <span className="ms-1">Out of Order</span>
                </small>
              </div>
              <small className="text-muted">
                {isEditing 
                  ? `Editing Slot ${editingSlot?.slotNumber} - Others disabled`
                  : 'Tap Available/Occupied slots to toggle'
                }
              </small>
            </div>
            
            <div className="d-flex flex-column align-items-end">
              {isEditing ? (
                <ButtonGroup size="sm">
                  <Button 
                    variant="success" 
                    onClick={submitUpdate}
                    disabled={isSubmitting}
                  >
                    <FaSave className="me-1" />
                    {isSubmitting ? 'Saving...' : 'Submit'}
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    onClick={cancelUpdate}
                    disabled={isSubmitting}
                  >
                    <FaTimes className="me-1" />
                    Cancel
                  </Button>
                </ButtonGroup>
              ) : (
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={refreshData}
                  disabled={isSubmitting}
                >
                  <FaSync className="me-1" />
                  Refresh
                </Button>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Alert variant={usingMockData ? "warning" : "danger"} className="mb-3">
          <Alert.Heading style={{ fontSize: '1rem' }}>
            {usingMockData ? "Using Mock Data" : "Error Loading Data"}
          </Alert.Heading>
          <p className="mb-2">{error}</p>
          <Button variant="outline-primary" size="sm" onClick={refreshData}>
            Try Again
          </Button>
        </Alert>
      )}

      {/* Editing Alert */}
      {isEditing && (
        <Alert variant="info" className="mb-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="mb-2 mb-md-0">
              <strong>Editing:</strong> Slot {editingSlot?.slotNumber} - 
              <Badge bg="secondary" className="mx-1">{editingSlot?.originalStatus}</Badge>
              →
              <Badge bg={editingSlot?.newStatus === 'AVAILABLE' ? 'success' : 'warning'} className="ms-1">
                {editingSlot?.newStatus}
              </Badge>
            </div>
            <ButtonGroup size="sm">
              <Button variant="success" onClick={submitUpdate} disabled={isSubmitting}>
                Submit
              </Button>
              <Button variant="outline-secondary" onClick={cancelUpdate} disabled={isSubmitting}>
                Cancel
              </Button>
            </ButtonGroup>
          </div>
        </Alert>
      )}

      {/* Parking Rows */}
      {!rows || rows.length === 0 ? (
        <Alert variant="info">
          No parking rows found. Please add some parking rows first.
        </Alert>
      ) : (
        rows.map((row, index) => (
          <Card key={row.id || `row-${index}`} className="mb-3">
            <Card.Header className="py-2">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  {row.rowName || row.rowNumber || `Row ${index + 1}`}
                </h6>
                <small className="text-muted">
                  {row.parkingSlots?.length || 0} slots
                </small>
              </div>
            </Card.Header>
            <Card.Body className="p-2">
              {row.parkingSlots && row.parkingSlots.length > 0 ? (
                <div className="parking-slots-grid">
                  {row.parkingSlots.map((slot, slotIndex) => (
                    <div key={slot.id || `slot-${slotIndex}`} className="parking-slot-item">
                      <ParkingSlot slot={slot} />
                    </div>
                  ))}
                </div>
              ) : (
                <Alert variant="info" className="mb-0">
                  No slots found in this row.
                </Alert>
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default ParkingDashboard;
