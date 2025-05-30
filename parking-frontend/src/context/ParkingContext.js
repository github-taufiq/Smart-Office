import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { parkingAPI } from '../services/api';

const ParkingContext = createContext();

const initialState = {
  rows: [],
  availableSlots: [],
  availableCount: 0,
  loading: false,
  error: null,
  notifications: [],
};

const parkingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_ROWS':
      return { ...state, rows: action.payload, loading: false };
    case 'SET_AVAILABLE_SLOTS':
      return { ...state, availableSlots: action.payload };
    case 'SET_AVAILABLE_COUNT':
      return { ...state, availableCount: action.payload };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((_, index) => index !== action.payload),
      };
    case 'UPDATE_SLOT_STATUS':
      return {
        ...state,
        rows: state.rows.map(row => ({
          ...row,
          slots: row.slots.map(slot =>
            slot.id === action.payload.slotId
              ? { ...slot, status: action.payload.status }
              : slot
          ),
        })),
      };
    default:
      return state;
  }
};

export const ParkingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(parkingReducer, initialState);

  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  };

  const removeNotification = (id) => {
    const index = state.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: index });
    }
  };

  const fetchAllRows = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await parkingAPI.getAllRows();
      dispatch({ type: 'SET_ROWS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      addNotification('Failed to fetch parking data', 'error');
    }
  };

  const fetchAvailableCount = async () => {
    try {
      const response = await parkingAPI.getAvailableSlotCount();
      dispatch({ type: 'SET_AVAILABLE_COUNT', payload: response.data });
    } catch (error) {
      console.error('Failed to fetch available count:', error);
    }
  };

  const updateSlotStatus = async (slotId, status, userId = 'current-user') => {
    try {
      await parkingAPI.updateSlotStatus(slotId, status, userId);
      dispatch({ type: 'UPDATE_SLOT_STATUS', payload: { slotId, status } });
      addNotification(`Slot status updated to ${status}`, 'success');
      fetchAvailableCount();
    } catch (error) {
      addNotification('Failed to update slot status', 'error');
    }
  };

  useEffect(() => {
    fetchAllRows();
    fetchAvailableCount();
  }, []);

  const value = {
    ...state,
    addNotification,
    removeNotification,
    fetchAllRows,
    fetchAvailableCount,
    updateSlotStatus,
  };

  return (
    <ParkingContext.Provider value={value}>
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};