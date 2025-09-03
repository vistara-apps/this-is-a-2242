import React from 'react';
import { Plus, Clock } from 'lucide-react';

/**
 * WeekView Component
 * 
 * This component displays bookings for a week in a calendar grid format.
 * It shows days of the week as columns and time slots as rows.
 */
const WeekView = ({ date, bookings, onSelectBooking, onAddBooking }) => {
  // Generate time slots from 7:00 to 19:00 (7am to 7pm)
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 7;
    return `${hour.toString().padStart(2, '0')}:00`;
  });
  
  // Generate days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(date);
    day.setDate(day.getDate() - day.getDay() + i);
    return day;
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
   * Format date for display
   * @param {Date} date - The date to format
   * @returns {string} Formatted date (e.g., "Mon 15")
   */
  const formatDate = (date) => {
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayOfMonth = date.getDate();
    return `${day} ${dayOfMonth}`;
  };
  
  /**
   * Check if a date is today
   * @param {Date} date - The date to check
   * @returns {boolean} True if the date is today
   */
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  /**
   * Get bookings for a specific day
   * @param {Date} day - The day to get bookings for
   * @returns {Array} Array of bookings for the day
   */
  const getBookingsForDay = (day) => {
    const formattedDate = day.toISOString().split('T')[0];
    return bookings.filter(booking => booking.date === formattedDate);
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
      width: '90%'
    };
  };
  
  /**
   * Handle click on a time slot to add a new booking
   * @param {Date} day - The day for the new booking
   * @param {string} time - The time slot (HH:MM)
   */
  const handleTimeSlotClick = (day, time) => {
    // Calculate end time (1 hour after start time)
    const [hours, minutes] = time.split(':').map(Number);
    const endHours = hours + 1;
    const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // Format date as YYYY-MM-DD
    const formattedDate = day.toISOString().split('T')[0];
    
    // Call onAddBooking with initial booking data
    onAddBooking({
      date: formattedDate,
      startTime: time,
      endTime: endTime
    });
  };
  
  return (
    <div className="relative">
      <div className="flex">
        {/* Time labels */}
        <div className="w-20 flex-shrink-0 border-r border-steel-200">
          <div className="h-12 border-b border-steel-200"></div>
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
        
        {/* Days of the week */}
        <div className="flex-grow grid grid-cols-7">
          {/* Day headers */}
          {weekDays.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className={`h-12 flex flex-col items-center justify-center border-b border-steel-200 ${
                isToday(day) ? 'bg-blue-50' : ''
              }`}
            >
              <div className={`text-sm font-medium ${isToday(day) ? 'text-blue-700' : 'text-steel-700'}`}>
                {formatDate(day)}
              </div>
              {isToday(day) && (
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs mt-1">
                  {day.getDate()}
                </div>
              )}
            </div>
          ))}
          
          {/* Time slots grid */}
          {timeSlots.map((time, timeIndex) => (
            <React.Fragment key={time}>
              {weekDays.map((day, dayIndex) => (
                <div
                  key={`${dayIndex}-${timeIndex}`}
                  className={`h-16 border-r border-steel-100 ${
                    timeIndex > 0 ? 'border-t border-steel-100' : ''
                  } ${dayIndex === 6 ? 'border-r-0' : ''} ${
                    isToday(day) ? 'bg-blue-50/30' : ''
                  }`}
                  onClick={() => handleTimeSlotClick(day, time)}
                >
                  {/* Half-hour marker */}
                  <div className="h-1/2 border-b border-dashed border-steel-100 relative">
                    <button
                      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        const halfHourTime = `${time.split(':')[0]}:30`;
                        handleTimeSlotClick(day, halfHourTime);
                      }}
                    >
                      <Plus className="w-3 h-3 text-blue-600" />
                    </button>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
          
          {/* Bookings */}
          {weekDays.map((day, dayIndex) => {
            const dayBookings = getBookingsForDay(day);
            
            return (
              <div key={`bookings-${dayIndex}`} className="absolute" style={{ 
                left: `calc(${dayIndex / 7 * 100}% + ${20 / 8 * 100}%)`, 
                width: `${100 / 7}%`,
                top: '3rem',
                height: 'calc(100% - 3rem)'
              }}>
                {dayBookings.map(booking => (
                  <div
                    key={booking.id}
                    className="absolute left-0 bg-blue-100 border-l-4 border-blue-600 rounded-r-md p-1 overflow-hidden hover:bg-blue-200 transition-colors cursor-pointer"
                    style={getBookingStyle(booking)}
                    onClick={() => onSelectBooking(booking)}
                  >
                    <div className="font-medium text-blue-800 text-xs truncate">
                      {booking.title}
                    </div>
                    <div className="text-xs text-blue-600">
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
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

export default WeekView;

