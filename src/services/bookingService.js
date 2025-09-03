import api from './api';

/**
 * Booking Service
 * 
 * This service handles all booking-related API calls.
 */
const bookingService = {
  /**
   * Get all bookings
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} List of bookings
   */
  getBookings: async (params = {}) => {
    try {
      // In a real app, we would call the API
      // const response = await api.get('/bookings', { params });
      // return response.data;
      
      // For now, we'll return mock data
      return [
        {
          id: 1,
          title: "Weekly Team Standup",
          startTime: "09:00",
          endTime: "09:30",
          date: new Date().toISOString().split('T')[0],
          organizer: "Sarah Johnson",
          attendees: 8,
          roomId: 1,
          description: "Weekly team standup meeting"
        },
        {
          id: 2,
          title: "Product Strategy Review",
          startTime: "11:00",
          endTime: "12:00",
          date: new Date().toISOString().split('T')[0],
          organizer: "Mike Chen",
          attendees: 12,
          roomId: 1,
          description: "Quarterly product strategy review"
        },
        {
          id: 3,
          title: "Client Presentation",
          startTime: "14:00",
          endTime: "15:30",
          date: new Date().toISOString().split('T')[0],
          organizer: "Emma Davis",
          attendees: 6,
          roomId: 1,
          description: "Presentation for new client"
        }
      ];
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get bookings for a specific date
   * @param {string} date - Date (YYYY-MM-DD)
   * @param {number} roomId - Room ID
   * @returns {Promise<Array>} List of bookings
   */
  getBookingsByDate: async (date, roomId) => {
    try {
      // In a real app, we would call the API
      // const response = await api.get(`/bookings?date=${date}&roomId=${roomId}`);
      // return response.data;
      
      // For now, we'll return mock data
      return [
        {
          id: 1,
          title: "Weekly Team Standup",
          startTime: "09:00",
          endTime: "09:30",
          date: date,
          organizer: "Sarah Johnson",
          attendees: 8,
          roomId: roomId,
          description: "Weekly team standup meeting"
        },
        {
          id: 2,
          title: "Product Strategy Review",
          startTime: "11:00",
          endTime: "12:00",
          date: date,
          organizer: "Mike Chen",
          attendees: 12,
          roomId: roomId,
          description: "Quarterly product strategy review"
        },
        {
          id: 3,
          title: "Client Presentation",
          startTime: "14:00",
          endTime: "15:30",
          date: date,
          organizer: "Emma Davis",
          attendees: 6,
          roomId: roomId,
          description: "Presentation for new client"
        }
      ];
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get a specific booking
   * @param {number} id - Booking ID
   * @returns {Promise<Object>} Booking data
   */
  getBooking: async (id) => {
    try {
      // In a real app, we would call the API
      // const response = await api.get(`/bookings/${id}`);
      // return response.data;
      
      // For now, we'll return mock data
      return {
        id: id,
        title: "Weekly Team Standup",
        startTime: "09:00",
        endTime: "09:30",
        date: new Date().toISOString().split('T')[0],
        organizer: "Sarah Johnson",
        attendees: 8,
        roomId: 1,
        description: "Weekly team standup meeting",
        isRecurring: false,
        recurrencePattern: null
      };
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise<Object>} Created booking
   */
  createBooking: async (bookingData) => {
    try {
      // In a real app, we would call the API
      // const response = await api.post('/bookings', bookingData);
      // return response.data;
      
      // For now, we'll return mock data
      return {
        id: Date.now(),
        ...bookingData,
        isRecurring: false,
        recurrencePattern: null
      };
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Update a booking
   * @param {number} id - Booking ID
   * @param {Object} bookingData - Updated booking data
   * @returns {Promise<Object>} Updated booking
   */
  updateBooking: async (id, bookingData) => {
    try {
      // In a real app, we would call the API
      // const response = await api.put(`/bookings/${id}`, bookingData);
      // return response.data;
      
      // For now, we'll return mock data
      return {
        id: id,
        ...bookingData,
        isRecurring: false,
        recurrencePattern: null
      };
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Delete a booking
   * @param {number} id - Booking ID
   * @returns {Promise<void>}
   */
  deleteBooking: async (id) => {
    try {
      // In a real app, we would call the API
      // await api.delete(`/bookings/${id}`);
      
      // For now, we'll just return
      return;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Check if a booking conflicts with existing bookings
   * @param {Object} bookingData - Booking data
   * @returns {Promise<Object>} Conflict check result
   */
  checkConflicts: async (bookingData) => {
    try {
      // In a real app, we would call the API
      // const response = await api.post('/bookings/check-conflicts', bookingData);
      // return response.data;
      
      // For now, we'll return mock data
      return {
        hasConflicts: false,
        conflicts: []
      };
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Create a recurring booking
   * @param {Object} bookingData - Booking data
   * @param {Object} recurrencePattern - Recurrence pattern
   * @returns {Promise<Object>} Created recurring booking
   */
  createRecurringBooking: async (bookingData, recurrencePattern) => {
    try {
      // In a real app, we would call the API
      // const response = await api.post('/bookings/recurring', {
      //   booking: bookingData,
      //   recurrence: recurrencePattern
      // });
      // return response.data;
      
      // For now, we'll return mock data
      return {
        seriesId: 'abc123',
        bookings: [
          {
            id: Date.now(),
            ...bookingData,
            isRecurring: true,
            recurrencePattern
          },
          {
            id: Date.now() + 1,
            ...bookingData,
            date: new Date(new Date(bookingData.date).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            isRecurring: true,
            recurrencePattern
          }
        ]
      };
    } catch (error) {
      throw error;
    }
  }
};

export default bookingService;

