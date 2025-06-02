import React, { useState, useEffect } from 'react';
import { Button, Alert, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import ParkingSlot from '../ParkingSlot';
// import ParkingSlotForm from './parking/ParkingSlotForm';
// import ParkingAnalytics from './parking/ParkingAnalytics';

const ParkingManagement = () => {
  const [parkingSlots, setParkingSlots] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchParkingSlots();
  }, []);

  const fetchParkingSlots = async () => {
    try {
      // Mock data - replace with actual API call
      const mockSlots = [
        { id: 1, slotNumber: 'A001', status: 'AVAILABLE', vehicleType: 'CAR', floor: 1 },
        { id: 2, slotNumber: 'A002', status: 'OCCUPIED', vehicleType: 'CAR', floor: 1 },
        { id: 3, slotNumber: 'A003', status: 'RESERVED', vehicleType: 'CAR', floor: 1 }
      ];
      setParkingSlots(mockSlots);
    } catch (error) {
      showAlert('Error fetching parking slots', 'danger');
    }
  };

  const handleSaveSlot = async (slotData) => {
    try {
      if (editingSlot) {
        setParkingSlots(slots => 
          slots.map(slot => 
            slot.id === editingSlot.id ? { ...slot, ...slotData } : slot
          )
        );
        showAlert('Parking slot updated successfully', 'success');
      } else {
        const newSlot = { ...slotData, id: Date.now() };
        setParkingSlots(slots => [...slots, newSlot]);
        showAlert('Parking slot created successfully', 'success');
      }
      setShowForm(false);
      setEditingSlot(null);
    } catch (error) {
      showAlert('Error saving parking slot', 'danger');
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (window.confirm('Are you sure you want to delete this parking slot?')) {
      setParkingSlots(slots => slots.filter(slot => slot.id !== slotId));
      showAlert('Parking slot deleted successfully', 'success');
    }
  };

  const handleEditSlot = (slot) => {
    setEditingSlot(slot);
    setShowForm(true);
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Parking Management</h4>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          <FaPlus className="me-2" />
          Add Parking Slot
        </Button>
      </div>

      {/* {alert && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )} */}

      {/* <Row className="mb-4">
        <Col>
          <ParkingAnalytics slots={parkingSlots} />
        </Col>
      </Row> */}

      {/* {showForm ? (
        <ParkingSlotForm
          onSave={handleSaveSlot}
          onCancel={() => {
            setShowForm(false);
            setEditingSlot(null);
          }}
          editingSlot={editingSlot}
        />
      ) : (
        <ParkingSlotList
          slots={parkingSlots}
          onEdit={handleEditSlot}
          onDelete={handleDeleteSlot}
        />
      )} */}
    </div>
  );
};

export default ParkingManagement;