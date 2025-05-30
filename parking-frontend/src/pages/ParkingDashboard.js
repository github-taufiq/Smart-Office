import React from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useParking } from '../context/ParkingContext';
import ParkingSlot from '../components/ParkingSlot';

const ParkingDashboard = () => {
  const { rows, loading, error } = useParking();

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

  if (error) {
    return (
      <Container>
        <Alert variant="danger">
          <Alert.Heading>Error Loading Data</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Parking Slots Management</h2>
          <p>Click on the edit button to update slot status</p>
        </Col>
      </Row>

      {rows.length === 0 ? (
        <Alert variant="info">
          No parking rows found. Please add some parking rows first.
        </Alert>
      ) : (
        rows.map((row) => (
          <Card key={row.id} className="mb-4">
            <Card.Header>
              <h4>Row: {row.rowName}</h4>
              <small className="text-muted">
                {row.slots.length} slots in this row
              </small>
            </Card.Header>
            <Card.Body>
              <Row>
                {row.slots.map((slot) => (
                  <Col key={slot.id} md={6} lg={4} xl={3}>
                    <ParkingSlot slot={slot} />
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default ParkingDashboard;