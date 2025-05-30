import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const parkingAPI = {
  // Get all available slots
  getAvailableSlots: () => api.get('/parking/slots/available'),
  
  // Get all rows with slots
  getAllRows: () => api.get('/parking/rows'),
  
  // Reserve a slot
  reserveSlot: (slotId, userId) => 
    api.post(`/parking/slots/${slotId}/reserve?userId=${userId}`),
  
  // Get available slot count
  getAvailableSlotCount: () => api.get('/parking/stats/available-count'),
  
  // Update slot status (you'll need to add this endpoint to backend)
  updateSlotStatus: (slotId, status, userId) =>
    api.put(`/parking/slots/${slotId}/status`, { status, updatedByUser: userId }),
  
  // Add new parking row (you'll need to add this endpoint to backend)
  addParkingRow: (rowData) => api.post('/parking/rows', rowData),
  
  // Add new parking slot (you'll need to add this endpoint to backend)
  addParkingSlot: (slotData) => api.post('/parking/slots', slotData),
};

export default api;