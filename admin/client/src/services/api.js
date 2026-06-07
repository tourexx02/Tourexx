import axios from 'axios';

// Base API URL - loaded from environment variable
const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hotel API functions
export const hotelAPI = {
  // Get all hotels
  getAll: async () => {
    try {
      const response = await api.get('/hotels');
      return response.data;
    } catch (error) {
      console.error('Error fetching hotels:', error);
      throw error;
    }
  },

  // Get hotel by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/hotels/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hotel:', error);
      throw error;
    }
  },

  // Create new hotel
  create: async (hotelData) => {
    try {
      const formData = new FormData();
      
      // Append all hotel data to FormData
      Object.keys(hotelData).forEach(key => {
        if (key === 'images' && hotelData[key]) {
          // Handle multiple images
          Array.from(hotelData[key]).forEach(file => {
            formData.append('images', file);
          });
        } else if (key === 'roomPricing' && hotelData[key]) {
          // Handle roomPricing object - stringify it
          formData.append('roomPricing', JSON.stringify(hotelData[key]));
        } else if (key === 'amenities') {
          formData.append('amenities', JSON.stringify(hotelData[key] || []));
        } else if (hotelData[key] !== null && hotelData[key] !== undefined) {
          formData.append(key, hotelData[key]);
        }
      });

      const response = await api.post('/hotels', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating hotel:', error);
      throw error;
    }
  },

  // Update hotel
  update: async (id, hotelData) => {
    try {
      const formData = new FormData();
      
      // Append all hotel data to FormData
      Object.keys(hotelData).forEach(key => {
        if (key === 'images' && hotelData[key]) {
          // Handle multiple images
          Array.from(hotelData[key]).forEach(file => {
            formData.append('images', file);
          });
        } else if (key === 'roomPricing' && hotelData[key]) {
          // Handle roomPricing object - stringify it
          formData.append('roomPricing', JSON.stringify(hotelData[key]));
        } else if (key === 'amenities') {
          formData.append('amenities', JSON.stringify(hotelData[key] || []));
        } else if (hotelData[key] !== null && hotelData[key] !== undefined) {
          formData.append(key, hotelData[key]);
        }
      });

      const response = await api.put(`/hotels/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating hotel:', error);
      throw error;
    }
  },

  // Delete hotel
  delete: async (id) => {
    try {
      const response = await api.delete(`/hotels/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting hotel:', error);
      throw error;
    }
  },

  // Approve hotel
  approve: async (id) => {
    try {
      const response = await api.patch(`/hotels/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving hotel:', error);
      throw error;
    }
  },

  // Reject hotel
  reject: async (id) => {
    try {
      const response = await api.patch(`/hotels/${id}/reject`);
      return response.data;
    } catch (error) {
      console.error('Error rejecting hotel:', error);
      throw error;
    }
  },
};

// Restaurant API functions
export const restaurantAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/restaurants');
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  },

  create: async (restaurantData) => {
    try {
      const formData = new FormData();
      Object.keys(restaurantData).forEach(key => {
        if (key === 'images' && restaurantData[key]) {
          Array.from(restaurantData[key]).forEach(file => {
            formData.append('images', file);
          });
        } else if (key === 'amenities') {
          formData.append('amenities', JSON.stringify(restaurantData[key] || []));
        } else if (key === 'diningType') {
          formData.append('diningType', JSON.stringify(restaurantData[key] || []));
        } else if (restaurantData[key] !== null && restaurantData[key] !== undefined) {
          formData.append(key, restaurantData[key]);
        }
      });

      const response = await api.post('/restaurants', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }
  },

  update: async (id, restaurantData) => {
    try {
      const formData = new FormData();
      Object.keys(restaurantData).forEach(key => {
        if (key === 'images' && restaurantData[key]) {
          Array.from(restaurantData[key]).forEach(file => {
            formData.append('images', file);
          });
        } else if (key === 'amenities') {
          formData.append('amenities', JSON.stringify(restaurantData[key] || []));
        } else if (key === 'diningType') {
          formData.append('diningType', JSON.stringify(restaurantData[key] || []));
        } else if (restaurantData[key] !== null && restaurantData[key] !== undefined) {
          formData.append(key, restaurantData[key]);
        }
      });

      const response = await api.put(`/restaurants/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating restaurant:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      throw error;
    }
  },

  // Approve restaurant
  approve: async (id) => {
    try {
      const response = await api.patch(`/restaurants/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving restaurant:', error);
      throw error;
    }
  },

  // Reject restaurant
  reject: async (id) => {
    try {
      const response = await api.patch(`/restaurants/${id}/reject`);
      return response.data;
    } catch (error) {
      console.error('Error rejecting restaurant:', error);
      throw error;
    }
  },
};

// Transport API functions
export const transportAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/transports');
      return response.data;
    } catch (error) {
      console.error('Error fetching transports:', error);
      throw error;
    }
  },

  create: async (transportData) => {
    try {
      const formData = new FormData();
      Object.keys(transportData).forEach(key => {
        if (key === 'images' && transportData[key]) {
          Array.from(transportData[key]).forEach(file => {
            formData.append('images', file);
          });
        } else if (key === 'amenities') {
          formData.append('amenities', JSON.stringify(transportData[key] || []));
        } else if (key === 'vehicleTypes') {
          formData.append('vehicleTypes', JSON.stringify(transportData[key] || []));
        } else if (key === 'vehicleOptions') {
          formData.append('vehicleOptions', JSON.stringify(transportData[key] || []));
        } else if (transportData[key] !== null && transportData[key] !== undefined) {
          formData.append(key, transportData[key]);
        }
      });

      const response = await api.post('/transports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating transport:', error);
      throw error;
    }
  },

  update: async (id, transportData) => {
    try {
      const formData = new FormData();
      Object.keys(transportData).forEach(key => {
        if (key === 'images' && transportData[key]) {
          Array.from(transportData[key]).forEach(file => {
            formData.append('images', file);
          });
        } else if (key === 'amenities') {
          formData.append('amenities', JSON.stringify(transportData[key] || []));
        } else if (key === 'vehicleTypes') {
          formData.append('vehicleTypes', JSON.stringify(transportData[key] || []));
        } else if (key === 'vehicleOptions') {
          formData.append('vehicleOptions', JSON.stringify(transportData[key] || []));
        } else if (transportData[key] !== null && transportData[key] !== undefined) {
          formData.append(key, transportData[key]);
        }
      });

      const response = await api.put(`/transports/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating transport:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/transports/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting transport:', error);
      throw error;
    }
  },

  // Approve transport
  approve: async (id) => {
    try {
      const response = await api.patch(`/transports/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving transport:', error);
      throw error;
    }
  },

  // Reject transport
  reject: async (id) => {
    try {
      const response = await api.patch(`/transports/${id}/reject`);
      return response.data;
    } catch (error) {
      console.error('Error rejecting transport:', error);
      throw error;
    }
  },
};

// Trip Organizer API functions
export const tripOrganizerAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/trip-organizers');
      return response.data;
    } catch (error) {
      console.error('Error fetching trip organizers:', error);
      throw error;
    }
  },

  create: async (tripOrganizerData) => {
    try {
      const formData = new FormData();
      Object.keys(tripOrganizerData).forEach(key => {
        if (key === 'images' && tripOrganizerData[key]) {
          Array.from(tripOrganizerData[key]).forEach(file => {
            formData.append('images', file);
          });
        } else if (key === 'amenities') {
          formData.append('amenities', JSON.stringify(tripOrganizerData[key] || []));
        } else if (key === 'tourOptions') {
          formData.append('tourOptions', JSON.stringify(tripOrganizerData[key] || []));
        } else if (key === 'tourTypes') {
          formData.append('tourTypes', JSON.stringify(tripOrganizerData[key] || []));
        } else if (tripOrganizerData[key] !== null && tripOrganizerData[key] !== undefined) {
          formData.append(key, tripOrganizerData[key]);
        }
      });

      const response = await api.post('/trip-organizers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating trip organizer:', error);
      throw error;
    }
  },

  update: async (id, tripOrganizerData) => {
    try {
      const formData = new FormData();
      Object.keys(tripOrganizerData).forEach(key => {
        if (key === 'images' && tripOrganizerData[key]) {
          Array.from(tripOrganizerData[key]).forEach(file => {
            formData.append('images', file);
          });
        } else if (key === 'amenities') {
          formData.append('amenities', JSON.stringify(tripOrganizerData[key] || []));
        } else if (key === 'tourOptions') {
          formData.append('tourOptions', JSON.stringify(tripOrganizerData[key] || []));
        } else if (key === 'tourTypes') {
          formData.append('tourTypes', JSON.stringify(tripOrganizerData[key] || []));
        } else if (tripOrganizerData[key] !== null && tripOrganizerData[key] !== undefined) {
          formData.append(key, tripOrganizerData[key]);
        }
      });

      const response = await api.put(`/trip-organizers/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating trip organizer:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/trip-organizers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting trip organizer:', error);
      throw error;
    }
  },

  // Approve trip organizer
  approve: async (id) => {
    try {
      const response = await api.patch(`/trip-organizers/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving trip organizer:', error);
      throw error;
    }
  },

  // Reject trip organizer
  reject: async (id) => {
    try {
      const response = await api.patch(`/trip-organizers/${id}/reject`);
      return response.data;
    } catch (error) {
      console.error('Error rejecting trip organizer:', error);
      throw error;
    }
  },
};

// Business API functions
export const businessAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/businesses');
      return response.data;
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/businesses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching business:', error);
      throw error;
    }
  },

  getByType: async (type) => {
    try {
      const response = await api.get(`/businesses/type/${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching businesses by type:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/businesses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting business:', error);
      throw error;
    }
  },
};

// Booking API functions
export const bookingAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  },
};

export default api;
