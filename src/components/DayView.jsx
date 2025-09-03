import React from 'react';
import { Plus, Clock } from 'lucide-react';

/**
 * DayView Component
 * 
 * This component displays bookings for a single day in a time-slot format.
 * It shows hourly time slots and positions bookings based on their start and end times.
 */
const DayView = ({ date, bookings, onSelectBooking, onAddBooking }) => {
  // Generate time slots from 7:00 to 19:00 (7am to 7pm)
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 7;
    return `${hour.toString().padStart(2, '0')}:00`;
  });
  
  /**
   * Format time for display
   * @param {string} time - Time in 24-hour format (HH:MM)
   * @returns {string} Formatted time in 12-hour format
   */
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
  
  /**
   * Calculate position and height for a booking
   * @param {Object} booking - The booking object
   * @returns {Object} Position and height styles
   */
  const getBookingStyle = (booking) => {
    const [startHour, startMinute] = booking.startTime.split(':').map(Number);
    const [endHour, endMinute] = booking.endTime.split(':').map(Number);
    
    // Calculate position from top (in percentage)
    const dayStart = 7; // 7:00 AM
    const startPosition = ((startHour - dayStart) * 60 + startMinute) / (12 * 60) * 100;
    
    // Calculate height (in percentage)
    const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    const heightPercentage = durationMinutes / (12 * 60) * 100;
    
    return {
      top: `${startPosition}%`,
      height: `${heightPercentage}%`,
      width: '95%'
    };
  };
  
  /**
   * Handle click on a time slot to add a new booking
   * @param {string} time - The time slot (HH:MM)
   */
  const handleTimeSlotClick = (time) => {
    // Calculate end time (1 hour after start time)
    const [hours, minutes] = time.split(':').map(Number);
    const endHours = hours + 1;
    const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // Format date as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    
    // Call onAddBooking with initial booking data
    onAddBooking({
      date: formattedDate,
      startTime: time,
      endTime: endTime
    });
  };
  
  return (
    <div className="relative">
      {/* Time slots */}
      <div className="flex">
        {/* Time labels */}
        <div className="w-20 flex-shrink-0 border-r border-steel-200">
          {timeSlots.map((time, index) => (
            <div
              key={time}
              className={`h-16 flex items-center justify-center text-sm text-steel-500 ${
                index > 0 ? 'border-t border-steel-100' : ''
              }`}
            >
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(time)}
            </div>
          ))}
        </div>
        
        {/* Day column */}
        <div className="flex-grow relative">
          {/* Time slot grid */}
          {timeSlots.map((time, index) => (
            <div
              key={time}
              className={`h-16 ${index > 0 ? 'border-t border-steel-100' : ''}`}
              onClick={() => handleTimeSlotClick(time)}
            >
              {/* Half-hour marker */}
              <div className="h-1/2 border-b border-dashed border-steel-100 relative">
                <button
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    const halfHourTime = `${time.split(':')[0]}:30`;
                    handleTimeSlotClick(halfHourTime);
                  }}
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
          ))}
          
          {/* Bookings */}
          {bookings.map(booking => (
            <div
              key={booking.id}
              className="absolute left-0 bg-blue-100 border-l-4 border-blue-600 rounded-r-md p-2 overflow-hidden hover:bg-blue-200 transition-colors cursor-pointer"
              style={getBookingStyle(booking)}
              onClick={() => onSelectBooking(booking)}
            >
              <div className="font-medium text-blue-800 text-sm truncate">
                {booking.title}
              </div>
              <div className="text-xs text-blue-600">
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </div>
              <div className="text-xs text-blue-500 truncate">
                {booking.organizer} • {booking.attendees} {booking.attendees === 1 ? 'person' : 'people'}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add booking button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
        onClick={() => onAddBooking({ date: date.toISOString().split('T')[0] })}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default DayView;

