/**
 * Booking Model
 * 
 * This module provides functions for working with booking data.
 */

/**
 * Validate a booking
 * @param {Object} booking - Booking data to validate
 * @returns {Object} Validation result
 */
export const validateBooking = (booking) => {
  const errors = [];
  
  // Required fields
  if (!booking.title) {
    errors.push('Title is required');
  }
  
  if (!booking.date) {
    errors.push('Date is required');
  }
  
  if (!booking.startTime) {
    errors.push('Start time is required');
  }
  
  if (!booking.endTime) {
    errors.push('End time is required');
  }
  
  if (!booking.roomId) {
    errors.push('Room is required');
  }
  
  if (!booking.organizer) {
    errors.push('Organizer is required');
  }
  
  // Time validation
  if (booking.startTime && booking.endTime) {
    const start = booking.startTime.split(':').map(Number);
    const end = booking.endTime.split(':').map(Number);
    
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    
    if (startMinutes >= endMinutes) {
      errors.push('End time must be after start time');
    }
  }
  
  // Date validation
  if (booking.date) {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      errors.push('Date cannot be in the past');
    }
  }
  
  // Attendees validation
  if (booking.attendees) {
    const attendees = parseInt(booking.attendees, 10);
    
    if (isNaN(attendees) || attendees < 1) {
      errors.push('Attendees must be a positive number');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Check if a booking conflicts with another booking
 * @param {Object} booking1 - First booking
 * @param {Object} booking2 - Second booking
 * @returns {boolean} True if the bookings conflict
 */
export const checkBookingConflict = (booking1, booking2) => {
  // Different rooms don't conflict
  if (booking1.roomId !== booking2.roomId) {
    return false;
  }
  
  // Different dates don't conflict
  if (booking1.date !== booking2.date) {
    return false;
  }
  
  // Convert times to minutes for easier comparison
  const start1 = booking1.startTime.split(':').map(Number);
  const end1 = booking1.endTime.split(':').map(Number);
  const start2 = booking2.startTime.split(':').map(Number);
  const end2 = booking2.endTime.split(':').map(Number);
  
  const start1Minutes = start1[0] * 60 + start1[1];
  const end1Minutes = end1[0] * 60 + end1[1];
  const start2Minutes = start2[0] * 60 + start2[1];
  const end2Minutes = end2[0] * 60 + end2[1];
  
  // Check for overlap
  return (
    (start1Minutes < end2Minutes && end1Minutes > start2Minutes) ||
    (start2Minutes < end1Minutes && end2Minutes > start1Minutes)
  );
};

/**
 * Format a booking for display
 * @param {Object} booking - Booking data
 * @returns {Object} Formatted booking
 */
export const formatBooking = (booking) => {
  // Format start and end times
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return {
    ...booking,
    formattedStartTime: formatTime(booking.startTime),
    formattedEndTime: formatTime(booking.endTime),
    formattedDate: formatDate(booking.date),
    duration: calculateDuration(booking.startTime, booking.endTime)
  };
};

/**
 * Calculate the duration of a booking in minutes
 * @param {string} startTime - Start time (HH:MM)
 * @param {string} endTime - End time (HH:MM)
 * @returns {number} Duration in minutes
 */
export const calculateDuration = (startTime, endTime) => {
  const start = startTime.split(':').map(Number);
  const end = endTime.split(':').map(Number);
  
  const startMinutes = start[0] * 60 + start[1];
  const endMinutes = end[0] * 60 + end[1];
  
  return endMinutes - startMinutes;
};

/**
 * Generate recurring booking dates
 * @param {Object} booking - Base booking
 * @param {Object} recurrence - Recurrence pattern
 * @returns {Array} Array of booking dates
 */
export const generateRecurringDates = (booking, recurrence) => {
  const { frequency, interval, daysOfWeek, endDate } = recurrence;
  const startDate = new Date(booking.date);
  const end = new Date(endDate);
  const dates = [];
  
  // Add the initial date
  dates.push(startDate.toISOString().split('T')[0]);
  
  // Generate dates based on frequency
  let currentDate = new Date(startDate);
  
  while (currentDate <= end) {
    // Move to the next occurrence
    if (frequency === 'daily') {
      currentDate.setDate(currentDate.getDate() + interval);
    } else if (frequency === 'weekly') {
      // For weekly, we need to handle days of the week
      if (daysOfWeek && daysOfWeek.length > 0) {
        // Start from the day after the current date
        currentDate.setDate(currentDate.getDate() + 1);
        
        // Find the next matching day of the week
        let found = false;
        for (let i = 0; i < 7 && !found; i++) {
          const dayOfWeek = currentDate.getDay();
          if (daysOfWeek.includes(dayOfWeek)) {
            found = true;
          } else {
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
        
        // If we're using an interval > 1, adjust the date
        if (interval > 1 && dates.length > 0) {
          const lastDate = new Date(dates[dates.length - 1]);
          const weeksDiff = Math.floor((currentDate - lastDate) / (7 * 24 * 60 * 60 * 1000));
          
          if (weeksDiff < interval) {
            currentDate.setDate(currentDate.getDate() + (interval - weeksDiff) * 7);
          }
        }
      } else {
        // If no days of the week are specified, just add weeks
        currentDate.setDate(currentDate.getDate() + (7 * interval));
      }
    } else if (frequency === 'monthly') {
      // For monthly, keep the same day of the month
      const day = currentDate.getDate();
      currentDate.setMonth(currentDate.getMonth() + interval);
      
      // Handle cases where the day doesn't exist in the month
      const newMonth = currentDate.getMonth();
      currentDate.setDate(1);
      currentDate.setMonth(newMonth);
      
      const daysInMonth = new Date(currentDate.getFullYear(), newMonth + 1, 0).getDate();
      currentDate.setDate(Math.min(day, daysInMonth));
    }
    
    // Add the date if it's before or on the end date
    if (currentDate <= end) {
      dates.push(currentDate.toISOString().split('T')[0]);
    }
  }
  
  return dates;
};

export default {
  validateBooking,
  checkBookingConflict,
  formatBooking,
  calculateDuration,
  generateRecurringDates
};

