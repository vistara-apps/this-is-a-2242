import api from './api';

/**
 * Room Service
 * 
 * This service handles all room-related API calls.
 */
const roomService = {
  /**
   * Get all rooms
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} List of rooms
   */
  getRooms: async (params = {}) => {
    try {
      // In a real app, we would call the API
      // const response = await api.get('/rooms', { params });
      // return response.data;
      
      // For now, we'll return mock data
      return [
        {
          id: 1,
          name: "Conference Room Alpha",
          capacity: 12,
          location: "Main Building, Floor 3",
          floor: 3,
          building: "Main Building",
          features: ["Projector", "Whiteboard", "Video Conference"],
          equipment: ["TV", "Phone", "HDMI Cable"]
        },
        {
          id: 2,
          name: "Meeting Room Beta",
          capacity: 8,
          location: "Main Building, Floor 2",
          floor: 2,
          building: "Main Building",
          features: ["Whiteboard", "Video Conference"],
          equipment: ["TV", "Phone"]
        },
        {
          id: 3,
          name: "Executive Suite",
          capacity: 20,
          location: "Executive Building, Floor 5",
          floor: 5,
          building: "Executive Building",
          features: ["Projector", "Whiteboard", "Video Conference", "Catering"],
          equipment: ["TV", "Phone", "HDMI Cable", "Microphones"]
        }
      ];
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get a specific room
   * @param {number} id - Room ID
   * @returns {Promise<Object>} Room data
   */
  getRoom: async (id) => {
    try {
      // In a real app, we would call the API
      // const response = await api.get(`/rooms/${id}`);
      // return response.data;
      
      // For now, we'll return mock data
      return {
        id: id,
        name: "Conference Room Alpha",
        capacity: 12,
        location: "Main Building, Floor 3",
        floor: 3,
        building: "Main Building",
        features: ["Projector", "Whiteboard", "Video Conference"],
        equipment: ["TV", "Phone", "HDMI Cable"],
        description: "Large conference room with video conferencing capabilities"
      };
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Create a new room
   * @param {Object} roomData - Room data
   * @returns {Promise<Object>} Created room
   */
  createRoom: async (roomData) => {
    try {
      // In a real app, we would call the API
      // const response = await api.post('/rooms', roomData);
      // return response.data;
      
      // For now, we'll return mock data
      return {
        id: Date.now(),
        ...roomData,
        isActive: true
      };
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Update a room
   * @param {number} id - Room ID
   * @param {Object} roomData - Updated room data
   * @returns {Promise<Object>} Updated room
   */
  updateRoom: async (id, roomData) => {
    try {
      // In a real app, we would call the API
      // const response = await api.put(`/rooms/${id}`, roomData);
      // return response.data;
      
      // For now, we'll return mock data
      return {
        id: id,
        ...roomData,
        isActive: true
      };
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Delete a room
   * @param {number} id - Room ID
   * @returns {Promise<void>}
   */
  deleteRoom: async (id) => {
    try {
      // In a real app, we would call the API
      // await api.delete(`/rooms/${id}`);
      
      // For now, we'll just return
      return;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Check room availability
   * @param {number} id - Room ID
   * @param {string} date - Date (YYYY-MM-DD)
   * @param {string} startTime - Start time (HH:MM)
   * @param {string} endTime - End time (HH:MM)
   * @returns {Promise<Object>} Availability data
   */
  checkAvailability: async (id, date, startTime, endTime) => {
    try {
      // In a real app, we would call the API
      // const response = await api.get(`/rooms/${id}/availability`, {
      //   params: { date, startTime, endTime }
      // });
      // return response.data;
      
      // For now, we'll return mock data
      return {
        isAvailable: true,
        conflicts: []
      };
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Find available rooms
   * @param {string} date - Date (YYYY-MM-DD)
   * @param {string} startTime - Start time (HH:MM)
   * @param {string} endTime - End time (HH:MM)
   * @param {Object} params - Additional query parameters
   * @returns {Promise<Array>} List of available rooms
   */
  findAvailableRooms: async (date, startTime, endTime, params = {}) => {
    try {
      // In a real app, we would call the API
      // const response = await api.get('/rooms/available', {
      //   params: { date, startTime, endTime, ...params }
      // });
      // return response.data;
      
      // For now, we'll return mock data
      return [
        {
          id: 1,
          name: "Conference Room Alpha",
          capacity: 12,
          location: "Main Building, Floor 3",
          floor: 3,
          building: "Main Building",
          features: ["Projector", "Whiteboard", "Video Conference"],
          equipment: ["TV", "Phone", "HDMI Cable"]
        },
        {
          id: 3,
          name: "Executive Suite",
          capacity: 20,
          location: "Executive Building, Floor 5",
          floor: 5,
          building: "Executive Building",
          features: ["Projector", "Whiteboard", "Video Conference", "Catering"],
          equipment: ["TV", "Phone", "HDMI Cable", "Microphones"]
        }
      ];
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get room equipment
   * @param {number} id - Room ID
   * @returns {Promise<Array>} List of equipment
   */
  getRoomEquipment: async (id) => {
    try {
      // In a real app, we would call the API
      // const response = await api.get(`/rooms/${id}/equipment`);
      // return response.data;
      
      // For now, we'll return mock data
      return [
        {
          id: 1,
          name: "TV",
          description: "65-inch 4K TV"
        },
        {
          id: 2,
          name: "Phone",
          description: "Conference phone with microphone"
        },
        {
          id: 3,
          name: "HDMI Cable",
          description: "HDMI cable for connecting laptops"
        }
      ];
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get room statistics
   * @param {number} id - Room ID
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Object>} Room statistics
   */
  getRoomStatistics: async (id, startDate, endDate) => {
    try {
      // In a real app, we would call the API
      // const response = await api.get(`/rooms/${id}/statistics`, {
      //   params: { startDate, endDate }
      // });
      // return response.data;
      
      // For now, we'll return mock data
      return {
        totalBookings: 10,
        totalHours: 15,
        averageBookingDuration: 90,
        utilization: 0.75,
        popularTimes: [
          {
            hour: 9,
            count: 5
          },
          {
            hour: 14,
            count: 3
          }
        ]
      };
    } catch (error) {
      throw error;
    }
  }
};

export default roomService;

