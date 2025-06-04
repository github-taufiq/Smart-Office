import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request/response interceptors for debugging
api.interceptors.request.use(
    (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.config.url, response.status, response.data);
        return response;
    },
    (error) => {
        console.error('API Response Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

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

    // Note: These endpoints don't exist in the backend yet
    // You'll need to add them to the ParkingController
    updateSlotStatus: (slotId, status, userId) =>
        api.put(`/parking/slots/${slotId}/status`, {status, updatedByUser: userId}),

    addParkingRow: (rowData) => api.post('/parking/rows', rowData),

    addParkingSlot: (slotData) => api.post('/parking/slots', slotData),
};

export default api;