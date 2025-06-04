import React, {useEffect, useState} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {FaBell, FaCar, FaDoorOpen, FaUsers} from 'react-icons/fa';

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalParkingSlots: 0,
        availableParkingSlots: 0,
        totalConferenceRooms: 0,
        activeReservations: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Mock data - replace with actual API calls
            setStats({
                totalUsers: 150,
                totalParkingSlots: 100,
                availableParkingSlots: 25,
                totalConferenceRooms: 12,
                activeReservations: 8
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const StatCard = ({title, value, icon, color = 'primary'}) => (
        <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
                <div className="d-flex align-items-center">
                    <div className={`text-${color} me-3`} style={{fontSize: '2rem'}}>
                        {icon}
                    </div>
                    <div>
                        <h6 className="text-muted mb-1">{title}</h6>
                        <h3 className="mb-0 fw-bold">{value}</h3>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );

    return (
        <div>
            <h4 className="mb-4">System Overview</h4>

            <Row className="g-4">
                <Col md={3}>
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={<FaUsers/>}
                        color="primary"
                    />
                </Col>
                <Col md={3}>
                    <StatCard
                        title="Parking Available"
                        value={`${stats.availableParkingSlots}/${stats.totalParkingSlots}`}
                        icon={<FaCar/>}
                        color="success"
                    />
                </Col>
                <Col md={3}>
                    <StatCard
                        title="Conference Rooms"
                        value={stats.totalConferenceRooms}
                        icon={<FaDoorOpen/>}
                        color="info"
                    />
                </Col>
                <Col md={3}>
                    <StatCard
                        title="Active Reservations"
                        value={stats.activeReservations}
                        icon={<FaBell/>}
                        color="warning"
                    />
                </Col>
            </Row>
        </div>
    );
};

export default DashboardOverview;