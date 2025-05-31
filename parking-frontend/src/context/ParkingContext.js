import React, { createContext, useContext, useState, useEffect } from 'react';
import { parkingAPI } from '../services/api';
import { mockParkingData } from '../services/mockData';

const ParkingContext = createContext();

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};

// Helper function to check if data is valid
const isValidRowData = (data) => {
  return data && 
         Array.isArray(data) && 
         data.length > 0 && 
         data.some(row => Object.keys(row).length > 0);
};

// Helper function to validate and clean data
const validateRowData = (data) => {
  if (!Array.isArray(data)) {
    console.warn('Expected array, got:', typeof data, data);
    return [];
  }

  return data.map((row, index) => {
    const keys = Object.keys(row);
    console.log(`Row ${index} keys:`, keys);
    
    if (keys.length === 0) {
      console.warn(`Row ${index} is empty, skipping:`, row);
      return null;
    }

    return {
      id: row.id || `row-${index}`,
      rowName: row.rowName || row.rowNumber || `Row ${index + 1}`,
      rowNumber: row.rowNumber || index + 1,
      parkingSlots: Array.isArray(row.parkingSlots) ? row.parkingSlots : []
    };
  }).filter(row => row !== null);
};

export const ParkingProvider = ({ children }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null); // Currently editing slot
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('ParkingContext - editingSlot changed:', editingSlot);
  }, [editingSlot]);

  const fetchRows = async () => {
    setLoading(true);
    setError(null);
    setUsingMockData(false);
    
    try {
      const response = await parkingAPI.getAllRows();
      
      console.log('Raw API Response:', response);
      console.log('Response data:', response.data);
      
      let parsedData = response.data;
      
      if (typeof response.data === 'string') {
        try {
          parsedData = JSON.parse(response.data);
        } catch (parseError) {
          console.error('Failed to parse response as JSON:', parseError);
          throw new Error('Invalid JSON response from server');
        }
      }

      if (isValidRowData(parsedData)) {
        const validatedRows = validateRowData(parsedData);
        console.log('Using API data:', validatedRows);
        setRows(validatedRows);
      } else {
        console.warn('API returned empty objects, using mock data');
        setRows(mockParkingData);
        setUsingMockData(true);
        setError('API returned empty data. Using mock data for demonstration.');
      }
      
    } catch (err) {
      console.error('API Error, falling back to mock data:', err);
      setRows(mockParkingData);
      setUsingMockData(true);
      setError(`API Error: ${err.message}. Using mock data for demonstration.`);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchRows();
    setEditingSlot(null); // Clear editing state on refresh
  };

  // Toggle slot status locally (just update state)
  const toggleSlotStatus = (slotId) => {
    console.log('toggleSlotStatus called with slotId:', slotId);
    
    // Find current slot
    let currentSlot = null;
    for (const row of rows) {
      const slot = row.parkingSlots.find(s => s.id === slotId);
      if (slot) {
        currentSlot = slot;
        break;
      }
    }

    console.log('Found slot:', currentSlot);

    if (!currentSlot) {
      console.error('Slot not found with id:', slotId);
      return;
    }

    // Only allow toggling between AVAILABLE and OCCUPIED
    if (currentSlot.status !== 'AVAILABLE' && currentSlot.status !== 'OCCUPIED') {
      console.log('Cannot toggle slot with status:', currentSlot.status);
      return;
    }

    // Toggle status
    const newStatus = currentSlot.status === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE';
    
    console.log('Toggling slot from', currentSlot.status, 'to', newStatus);
    
    // Set editing state
    const newEditingSlot = {
      id: slotId,
      originalStatus: currentSlot.status,
      newStatus: newStatus,
      slotNumber: currentSlot.slotNumber
    };
    
    console.log('Setting editingSlot to:', newEditingSlot);
    setEditingSlot(newEditingSlot);
  };

  // Get effective status (editing status or original)
  const getSlotStatus = (slot) => {
    if (editingSlot && editingSlot.id === slot.id) {
      console.log('Returning edited status for slot', slot.id, ':', editingSlot.newStatus);
      return editingSlot.newStatus;
    }
    console.log('Returning original status for slot', slot.id, ':', slot.status);
    return slot.status;
  };

  // Check if slot is currently being edited
  const isSlotEditing = (slot) => {
    const result = editingSlot && editingSlot.id === slot.id;
    console.log('isSlotEditing for slot', slot.id, ':', result);
    return result;
  };

  // Check if any slot is being edited (to disable others)
  const hasEditingSlot = () => {
    const result = editingSlot !== null;
    console.log('hasEditingSlot:', result);
    return result;
  };

  // Submit the current edit to backend
  const submitUpdate = async () => {
    console.log('submitUpdate called with editingSlot:', editingSlot);
    
    if (!editingSlot) {
      alert('No changes to submit');
      return;
    }

    setIsSubmitting(true);

    try {
      // If using mock data, just update the rows state
      if (usingMockData) {
        console.log('Updating mock data...');
        setRows(prevRows => 
          prevRows.map(row => ({
            ...row,
            parkingSlots: row.parkingSlots.map(slot => 
              slot.id === editingSlot.id 
                ? { ...slot, status: editingSlot.newStatus }
                : slot
            )
          }))
        );
        setEditingSlot(null);
        alert('Slot updated successfully (mock data)');
        return;
      }

      // Submit to backend
      await parkingAPI.updateSlotStatus(editingSlot.id, editingSlot.newStatus, 'admin');
      
      // Refresh data and clear editing state
      await fetchRows();
      setEditingSlot(null);
      alert('Slot updated successfully!');

    } catch (err) {
      console.error('Error updating slot:', err);
      alert(`Error updating slot: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel current edit
  const cancelUpdate = () => {
    console.log('cancelUpdate called');
    setEditingSlot(null);
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const value = {
    rows,
    loading,
    error,
    refreshData,
    usingMockData,
    toggleSlotStatus,
    getSlotStatus,
    isSlotEditing,
    hasEditingSlot,
    submitUpdate,
    cancelUpdate,
    isSubmitting,
    editingSlot
  };

  return (
    <ParkingContext.Provider value={value}>
      {children}
    </ParkingContext.Provider>
  );
};