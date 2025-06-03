import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  // 1. Request Booking
  const requestBooking = async (bookingData) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:8081/api/bookings/request', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, data: result };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Failed to request booking' };
      }
    } catch (error) {
      console.error('Error requesting booking:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // 2. Cancel My Booking
  const cancelMyBooking = async (bookingId) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:8081/api/bookings/${bookingId}/cancel-my-booking`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, data: result };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Failed to cancel booking' };
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // 3. Get My Bookings
  const getMyBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:8081/api/bookings/my-bookings', {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, data: result };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Failed to get bookings' };
      }
    } catch (error) {
      console.error('Error getting my bookings:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // 4. Get Available Rooms
  const getAvailableRooms = async (availabilityRequest) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:8081/api/bookings/available-rooms', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(availabilityRequest)
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, data: result };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Failed to get available rooms' };
      }
    } catch (error) {
      console.error('Error getting available rooms:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // 5. Get Pending Bookings For My Office
  const getPendingBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:8081/api/bookings/pending', {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, data: result };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Failed to get pending bookings' };
      }
    } catch (error) {
      console.error('Error getting pending bookings:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // 6. Process Booking Approval
  const processBookingApproval = async (bookingId, approvalData) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:8081/api/bookings/${bookingId}/process-approval`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(approvalData)
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, data: result };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Failed to process approval' };
      }
    } catch (error) {
      console.error('Error processing approval:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // 7. Get All Bookings For Office
  const getOfficeBookings = async (officeId) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:8081/api/bookings/office/${officeId}`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, data: result };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Failed to get office bookings' };
      }
    } catch (error) {
      console.error('Error getting office bookings:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // 8. Admin Cancel Booking
  const adminCancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:8081/api/bookings/${bookingId}/admin-cancel`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, data: result };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Failed to cancel booking' };
      }
    } catch (error) {
      console.error('Error admin canceling booking:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    loading,
    error,
    requestBooking,
    cancelMyBooking,
    getMyBookings,
    getAvailableRooms,
    getPendingBookings,
    processBookingApproval,
    getOfficeBookings,
    adminCancelBooking,
    setError
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
