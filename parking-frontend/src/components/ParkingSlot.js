import React, { useState } from 'react';
import { Card, Button, Badge, Modal, Form } from 'react-bootstrap';
import { FaCar, FaEdit } from 'react-icons/fa';
import { useParking } from '../context/ParkingContext';

const ParkingSlot = ({ slot }) => {
  const { updateSlotStatus } = useParking();
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState(slot.status);

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'success';
      case 'OCCUPIED':
        return 'danger';
      case 'RESERVED':
        return 'warning';
      case 'OUT_OF_ORDER':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  const handleStatusUpdate = async () => {
    await updateSlotStatus(slot.id, newStatus);
    setShowModal(false);
  };

  return (
    <>
      <Card className={`mb-3 border-${getStatusColor(slot.status)}`}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">
                <FaCar className="me-2" />
                Slot {slot.slotNumber}
              </h6>
              <Badge bg={getStatusColor(slot.status)}>
                {slot.status}
              </Badge>
            </div>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowModal(true)}
            >
              <FaEdit />
            </Button>
          </div>
          {slot.updatedTime && (
            <small className="text-muted d-block mt-2">
              Last updated: {new Date(slot.updatedTime).toLocaleString()}
            </small>
          )}
          {slot.updatedByUser && (
            <small className="text-muted d-block">
              By: {slot.updatedByUser}
            </small>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Slot {slot.slotNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="AVAILABLE">Available</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="RESERVED">Reserved</option>
                <option value="OUT_OF_ORDER">Out of Order</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStatusUpdate}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ParkingSlot;
