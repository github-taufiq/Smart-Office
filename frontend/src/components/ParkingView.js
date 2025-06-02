import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Alert, Spinner } from 'react-bootstrap';
import { ParkingProvider } from '../context/ParkingContext';
import ParkingSlot from './ParkingSlot';

const ParkingView = () => {
  const [parkingRows, setParkingRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch parking rows from backend
  useEffect(() => {
    fetchParkingRows();
  }, []);

  const fetchParkingRows = async () => {
    try {
      setLoading(true);
      // Fetch parking rows from backend
      const response = await fetch('http://localhost:8080/api/parking/rows', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setParkingRows(data);
        console.log('Fetched parking rows:', data);
      } else {
        throw new Error('Failed to fetch parking rows');
      }
    } catch (err) {
      console.error('Error fetching parking rows:', err);
      setError('Failed to load parking data. Please try again.');
      // Optionally use mock data as fallback
      setParkingRows(getMockParkingRows());
    } finally {
      setLoading(false);
    }
  };

  // Mock data as fallback
  const getMockParkingRows = () => [
    {
      id: 1,
      rowName: 'A',
      floor: 'Ground Floor',
      vehicleType: 'CAR',
      slots: [
        { id: 1, slotNumber: 'A001', status: 'AVAILABLE', vehicleType: 'CAR', floor: 'Ground Floor' },
        { id: 2, slotNumber: 'A002', status: 'OCCUPIED', vehicleType: 'CAR', floor: 'Ground Floor', reservedByUser: 'John Doe' },
        { id: 3, slotNumber: 'A003', status: 'RESERVED', vehicleType: 'CAR', floor: 'Ground Floor', reservedByUser: 'Jane Smith' },
        { id: 4, slotNumber: 'A004', status: 'AVAILABLE', vehicleType: 'CAR', floor: 'Ground Floor' },
        { id: 5, slotNumber: 'A005', status: 'OUT_OF_ORDER', vehicleType: 'CAR', floor: 'Ground Floor' },
        { id: 6, slotNumber: 'A006', status: 'AVAILABLE', vehicleType: 'CAR', floor: 'Ground Floor' }
      ]
    },
    {
      id: 2,
      rowName: 'B',
      floor: 'Ground Floor',
      vehicleType: 'CAR',
      slots: [
        { id: 7, slotNumber: 'B001', status: 'AVAILABLE', vehicleType: 'CAR', floor: 'Ground Floor' },
        { id: 8, slotNumber: 'B002', status: 'OCCUPIED', vehicleType: 'CAR', floor: 'Ground Floor', reservedByUser: 'Mike Johnson' },
        { id: 9, slotNumber: 'B003', status: 'AVAILABLE', vehicleType: 'CAR', floor: 'Ground Floor' },
        { id: 10, slotNumber: 'B004', status: 'RESERVED', vehicleType: 'CAR', floor: 'Ground Floor', reservedByUser: 'Sarah Wilson' },
        { id: 11, slotNumber: 'B005', status: 'AVAILABLE', vehicleType: 'CAR', floor: 'Ground Floor' },
        { id: 12, slotNumber: 'B006', status: 'AVAILABLE', vehicleType: 'CAR', floor: 'Ground Floor' }
      ]
    },
    {
      id: 3,
      rowName: 'C',
      floor: 'First Floor',
      vehicleType: 'CAR',
      slots: [
        { id: 13, slotNumber: 'C001', status: 'AVAILABLE', vehicleType: 'CAR', floor: 'First Floor' },
        { id: 14, slotNumber: 'C002', status: 'AVAILABLE', vehicleType: 'CAR', floor: 'First Floor' },
        { id: 15, slotNumber: 'C003', status: 'OCCUPIED', vehicleType: 'CAR', floor: 'First Floor', reservedByUser: 'Tom Brown' },
        { id: 16, slotNumber: 'C004', status: 'AVAILABLE', vehicleType: 'CAR', floor: 'First Floor' }
      ]
    },
    {
      id: 4,
      rowName: 'M',
      floor: 'Ground Floor',
      vehicleType: 'MOTORCYCLE',
      slots: [
        { id: 17, slotNumber: 'M001', status: 'AVAILABLE', vehicleType: 'MOTORCYCLE', floor: 'Ground Floor' },
        { id: 18, slotNumber: 'M002', status: 'OCCUPIED', vehicleType: 'MOTORCYCLE', floor: 'Ground Floor', reservedByUser: 'Alex Lee' },
        { id: 19, slotNumber: 'M003', status: 'AVAILABLE', vehicleType: 'MOTORCYCLE', floor: 'Ground Floor' },
        { id: 20, slotNumber: 'M004', status: 'AVAILABLE', vehicleType: 'MOTORCYCLE', floor: 'Ground Floor' }
      ]
    }
  ];

  const getAllSlots = () => {
    return parkingRows.flatMap(row => row.slots || []);
  };

  const getStatusCounts = () => {
    const allSlots = getAllSlots();
    const counts = {
      AVAILABLE: 0,
      OCCUPIED: 0,
      RESERVED: 0,
      OUT_OF_ORDER: 0
    };
    allSlots.forEach(slot => {
      counts[slot.status] = (counts[slot.status] || 0) + 1;
    });
    return counts;
  };

  const groupRowsByFloor = () => {
    const grouped = {};
    parkingRows.forEach(row => {
      const floor = row.floor || 'Ground Floor';
      if (!grouped[floor]) {
        grouped[floor] = [];
      }
      grouped[floor].push(row);
    });
    return grouped;
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading parking data...</span>
        </Spinner>
        <p className="mt-2">Loading parking data...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          {error}
          <div className="mt-2">
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={fetchParkingRows}
            >
              Retry
            </button>
          </div>
        </Alert>
      </Container>
    );
  }

  const statusCounts = getStatusCounts();
  const groupedRows = groupRowsByFloor();

  return (
    <ParkingProvider onRefresh={fetchParkingRows}>
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h2>Parking Management</h2>
            <p className="text-muted">Reserve and manage your parking spots</p>
          </Col>
        </Row>

        {/* Status Summary */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body>
                <Row className="text-center">
                  <Col md={3}>
                    <Badge bg="success" className="p-2 fs-6">
                      Available: {statusCounts.AVAILABLE}
                    </Badge>
                  </Col>
                  <Col md={3}>
                    <Badge bg="warning" className="p-2 fs-6">
                      Occupied: {statusCounts.OCCUPIED}
                    </Badge>
                  </Col>
                  <Col md={3}>
                    <Badge bg="info" className="p-2 fs-6">
                      Reserved: {statusCounts.RESERVED}
                    </Badge>
                  </Col>
                  <Col md={3}>
                    <Badge bg="secondary" className="p-2 fs-6">
                      Out of Order: {statusCounts.OUT_OF_ORDER}
                    </Badge>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Parking Rows by Floor */}
        {Object.entries(groupedRows).map(([floor, rows]) => (
          <div key={floor} className="mb-5">
            <h4 className="mb-3">{floor}</h4>
            
            {rows.map((row) => (
              <Card key={row.id} className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">
                    Row {row.rowName}
                    {row.vehicleType === 'MOTORCYCLE' && (
                      <Badge bg="info" className="ms-2">Motorcycle Section</Badge>
                    )}
                    <span className="text-muted ms-2">
                      ({row.slots?.length || 0} slots)
                    </span>
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-2">
                    {(row.slots || []).map(slot => (
                      <Col key={slot.id} xs={6} sm={4} md={3} lg={2}>
                        <ParkingSlot slot={slot} />
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </div>
        ))}

        {/* Legend */}
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header>
                <h6 className="mb-0">Legend</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                  <div className="d-flex align-items-center">
                    <div 
                      className="me-2" 
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#d1e7dd',
                        border: '2px solid #198754',
                        borderRadius: '4px'
                      }}
                    ></div>
                    <span>Available - Click to Reserve</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div 
                      className="me-2" 
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#fff3cd',
                        border: '2px solid #fd7e14',
                        borderRadius: '4px'
                      }}
                    ></div>
                    <span>Occupied</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div 
                      className="me-2" 
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#d1ecf1',
                        border: '2px solid #0dcaf0',
                        borderRadius: '4px'
                      }}
                    ></div>
                    <span>Reserved - Click to Check In</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div 
                      className="me-2" 
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#cfe2ff',
                        border: '2px solid #0d6efd',
                        borderRadius: '4px'
                      }}
                    ></div>
                    <span>Selected for Reservation</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </ParkingProvider>
  );
};

export default ParkingView;
