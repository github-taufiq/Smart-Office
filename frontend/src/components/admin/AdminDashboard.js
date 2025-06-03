import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import { FaUsers, FaCar, FaDoorOpen, FaCog, FaChartBar } from 'react-icons/fa';
import DashboardOverview from './DashboardOverview';
// import UserManagement from './UserManagement';
// import ParkingManagement from './ParkingManagement';
// import ConferenceRoomManagement from './ConferenceRoomManagement';
// import SystemSettings from './SystemSettings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
    //   case 'users':
    //     return <UserManagement />;
    //   case 'parking':
    //     return <ParkingManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Administration Dashboard</h2>
          <p className="text-muted">Manage users, parking, conference rooms, and system settings</p>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
            <Nav.Item>
              <Nav.Link eventKey="overview">
                <FaChartBar className="me-2" />
                Overview
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="users">
                <FaUsers className="me-2" />
                Users
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="parking">
                <FaCar className="me-2" />
                Parking
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="conference-rooms">
                <FaDoorOpen className="me-2" />
                Rooms
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="settings">
                <FaCog className="me-2" />
                Settings
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        
        <Card.Body>
          {renderTabContent()}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;