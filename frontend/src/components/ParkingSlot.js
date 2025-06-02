import React from 'react';
import { Badge } from 'react-bootstrap';
import { FaCar, FaEdit, FaLock } from 'react-icons/fa';
import { useParking } from '../context/ParkingContext';

const ParkingSlot = ({ slot }) => {
  const { 
    toggleSlotStatus, 
    getSlotStatus, 
    isSlotEditing, 
    hasEditingSlot,
    reserveSlot,
    cancelUpdate
  } = useParking();

  // Use slot.status directly as fallback if getSlotStatus doesn't work properly
  const currentStatus = getSlotStatus ? getSlotStatus(slot) : slot.status;
  const isEditing = isSlotEditing ? isSlotEditing(slot) : false;
  const hasOtherSlotEditing = hasEditingSlot ? hasEditingSlot() && !isEditing : false;
  
  // Debug logging
  console.log(`Slot ${slot.slotNumber}: status=${slot.status}, currentStatus=${currentStatus}, isEditing=${isEditing}, hasOtherSlotEditing=${hasOtherSlotEditing}`);
  
  // Allow clicking on AVAILABLE slots when no other slot is being edited, OR clicking on currently editing slot
  const isClickable = !hasOtherSlotEditing && (currentStatus === 'AVAILABLE' || isEditing);

  const handleSlotClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`Slot ${slot.slotNumber} clicked - Current Status: ${currentStatus}, isEditing: ${isEditing}`);
    
    if (!isClickable) {
      console.log('Slot not clickable');
      return;
    }
    
    if (isEditing) {
      // If clicking on an already selected slot, reserve it
      console.log('Reserving slot...');
      if (reserveSlot) {
        reserveSlot(slot.id);
      }
    } else if (toggleSlotStatus) {
      // Select the slot for editing
      console.log('Selecting slot for editing...');
      toggleSlotStatus(slot.id);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Canceling slot edit...');
    if (cancelUpdate) {
      cancelUpdate();
    }
  };

  const getSlotStyles = () => {
    let backgroundColor = '#ffffff';
    let borderColor = '#dee2e6';
    let textColor = '#000000';

    if (isEditing) {
      // Blue for editing/reserved state
      backgroundColor = '#cfe2ff';
      borderColor = '#0d6efd';
    } else if (hasOtherSlotEditing) {
      // Disabled state when another slot is being edited
      backgroundColor = '#f8f9fa';
      borderColor = '#dee2e6';
    } else {
      switch (currentStatus) {
        case 'AVAILABLE':
          backgroundColor = '#d1e7dd'; // Green
          borderColor = '#198754';
          break;
        case 'OCCUPIED':
          backgroundColor = '#fff3cd'; // Orange
          borderColor = '#fd7e14';
          break;
        case 'RESERVED':
          backgroundColor = '#d1ecf1'; // Blue
          borderColor = '#0dcaf0';
          break;
        case 'OUT_OF_ORDER':
          backgroundColor = '#e2e3e5'; // Gray
          borderColor = '#6c757d';
          break;
        default:
          backgroundColor = '#ffffff';
          borderColor = '#dee2e6';
          break;
      }
    }

    return {
      backgroundColor,
      borderColor,
      color: textColor,
      border: `2px solid ${borderColor}`,
      borderRadius: '8px',
      cursor: isClickable ? 'pointer' : 'not-allowed',
      opacity: hasOtherSlotEditing ? 0.5 : 1,
      transition: 'all 0.3s ease',
      transform: isEditing ? 'scale(1.05)' : 'scale(1)',
      boxShadow: isEditing ? '0 4px 12px rgba(13, 110, 253, 0.4)' : '0 2px 4px rgba(0,0,0,0.1)',
      minHeight: '80px',
      width: '100%',
      textAlign: 'left'
    };
  };

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'success';
      case 'OCCUPIED':
        return 'warning';
      case 'RESERVED':
        return 'info';
      case 'OUT_OF_ORDER':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  return (
    <div 
      onClick={handleSlotClick}
      style={getSlotStyles()}
      className="parking-slot-compact"
    >
      <div className="p-2">
        <div className="d-flex justify-content-start align-items-start">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-1">
              <FaCar size={18} className="me-2" />
              <span className="fw-bold" style={{ fontSize: '0.8rem' }}>
                {slot.slotNumber}
              </span>
              {hasOtherSlotEditing && <FaLock size={10} className="ms-1 text-muted" />}
            </div>
            
            <div className="d-flex flex-wrap gap-1">
              <Badge 
                bg={getBadgeVariant(currentStatus)} 
                style={{ fontSize: '0.6rem' }}
              >
                {currentStatus}
              </Badge>
              
              {isEditing && (
                <Badge bg="primary" style={{ fontSize: '0.6rem' }}>
                  <FaEdit size={8} className="me-1" />
                  Selected
                </Badge>
              )}
            </div>

            {isEditing && (
              <div className="mt-1">
                <div className="d-flex gap-1">
                  <button 
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.6rem', padding: '2px 6px' }}
                    onClick={handleSlotClick}
                  >
                    Reserve
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.6rem', padding: '2px 6px' }}
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {slot.reservedByUser && (
              <div className="mt-1">
                <div style={{ fontSize: '0.6rem', color: '#666' }}>
                  {slot.reservedByUser}
                </div>
              </div>
            )}
          </div>

          <div className="text-end">
            {isClickable && !isEditing && currentStatus === 'AVAILABLE' && (
              <div style={{ fontSize: '0.6rem', color: '#198754', fontWeight: 'bold' }}>
                Available
              </div>
            )}
            {!isClickable && !isEditing && (
              <div style={{ fontSize: '0.6rem', color: '#6c757d' }}>
                {currentStatus === 'OCCUPIED' ? 'Occupied' : 'Locked'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingSlot;
