/**
 * Room Model
 * 
 * This module defines the Room data model, validation rules, and utility functions.
 */

/**
 * Validate a room object
 * @param {Object} room - The room object to validate
 * @returns {Object} Validation result with isValid flag and errors array
 */
export const validateRoom = (room) => {
  const errors = [];
  
  // Required fields
  if (!room.name || room.name.trim() === '') {
    errors.push('Room name is required');
  }
  
  if (room.capacity === undefined || room.capacity === null) {
    errors.push('Room capacity is required');
  } else {
    const capacity = Number(room.capacity);
    if (isNaN(capacity) || capacity < 1) {
      errors.push('Capacity must be a positive number');
    }
  }
  
  if (!room.location || room.location.trim() === '') {
    errors.push('Room location is required');
  }
  
  // Optional fields with validation
  if (room.features && !Array.isArray(room.features)) {
    errors.push('Features must be an array');
  }
  
  if (room.equipment && !Array.isArray(room.equipment)) {
    errors.push('Equipment must be an array');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Create a new room object with default values
 * @param {Object} data - Initial room data
 * @returns {Object} A new room object with defaults applied
 */
export const createRoom = (data = {}) => {
  return {
    name: '',
    capacity: 1,
    location: '',
    floor: 1,
    building: '',
    features: [],
    equipment: [],
    isActive: true,
    description: '',
    imageUrl: '',
    ...data
  };
};

/**
 * Get room features as a formatted string
 * @param {Object} room - The room object
 * @returns {string} Formatted features string
 */
export const getRoomFeaturesString = (room) => {
  if (!room.features || room.features.length === 0) {
    return 'No special features';
  }
  
  return room.features.join(', ');
};

/**
 * Get room equipment as a formatted string
 * @param {Object} room - The room object
 * @returns {string} Formatted equipment string
 */
export const getRoomEquipmentString = (room) => {
  if (!room.equipment || room.equipment.length === 0) {
    return 'No equipment';
  }
  
  return room.equipment.join(', ');
};

/**
 * Check if a room meets capacity requirements
 * @param {Object} room - The room to check
 * @param {number} requiredCapacity - The required capacity
 * @returns {boolean} True if the room meets the capacity requirement
 */
export const roomMeetsCapacity = (room, requiredCapacity) => {
  if (!room || room.capacity === undefined || room.capacity === null) {
    return false;
  }
  
  return room.capacity >= requiredCapacity;
};

/**
 * Check if a room has all required features
 * @param {Object} room - The room to check
 * @param {Array} requiredFeatures - Array of required features
 * @returns {boolean} True if the room has all required features
 */
export const roomHasFeatures = (room, requiredFeatures) => {
  if (!room || !room.features || !requiredFeatures) {
    return false;
  }
  
  return requiredFeatures.every(feature => room.features.includes(feature));
};

/**
 * Check if a room has all required equipment
 * @param {Object} room - The room to check
 * @param {Array} requiredEquipment - Array of required equipment
 * @returns {boolean} True if the room has all required equipment
 */
export const roomHasEquipment = (room, requiredEquipment) => {
  if (!room || !room.equipment || !requiredEquipment) {
    return false;
  }
  
  return requiredEquipment.every(item => room.equipment.includes(item));
};

/**
 * Filter rooms based on requirements
 * @param {Array} rooms - Array of room objects
 * @param {Object} requirements - Requirements object (capacity, features, equipment)
 * @returns {Array} Filtered array of rooms that meet all requirements
 */
export const filterRooms = (rooms, requirements = {}) => {
  if (!rooms || !Array.isArray(rooms)) {
    return [];
  }
  
  return rooms.filter(room => {
    // Check capacity requirement
    if (requirements.capacity && !roomMeetsCapacity(room, requirements.capacity)) {
      return false;
    }
    
    // Check features requirement
    if (requirements.features && !roomHasFeatures(room, requirements.features)) {
      return false;
    }
    
    // Check equipment requirement
    if (requirements.equipment && !roomHasEquipment(room, requirements.equipment)) {
      return false;
    }
    
    // Check floor requirement
    if (requirements.floor !== undefined && room.floor !== requirements.floor) {
      return false;
    }
    
    // Check building requirement
    if (requirements.building && room.building !== requirements.building) {
      return false;
    }
    
    // Check active status
    if (requirements.onlyActive && !room.isActive) {
      return false;
    }
    
    return true;
  });
};

/**
 * Sort rooms by specified criteria
 * @param {Array} rooms - Array of room objects
 * @param {string} sortBy - Sort criteria (name, capacity, location)
 * @param {boolean} ascending - Sort direction
 * @returns {Array} Sorted array of rooms
 */
export const sortRooms = (rooms, sortBy = 'name', ascending = true) => {
  if (!rooms || !Array.isArray(rooms)) {
    return [];
  }
  
  const sortedRooms = [...rooms];
  
  sortedRooms.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'capacity':
        comparison = a.capacity - b.capacity;
        break;
      case 'location':
        comparison = a.location.localeCompare(b.location);
        break;
      case 'name':
      default:
        comparison = a.name.localeCompare(b.name);
        break;
    }
    
    return ascending ? comparison : -comparison;
  });
  
  return sortedRooms;
};

export default {
  validateRoom,
  createRoom,
  getRoomFeaturesString,
  getRoomEquipmentString,
  roomMeetsCapacity,
  roomHasFeatures,
  roomHasEquipment,
  filterRooms,
  sortRooms
};

