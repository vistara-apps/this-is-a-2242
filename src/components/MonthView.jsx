import React from 'react';
import { Plus, Clock } from 'lucide-react';

/**
 * MonthView Component
 * 
 * This component displays bookings for a month in a calendar grid format.
 * It shows days of the month as cells and bookings as events within each cell.
 */
const MonthView = ({ date, bookings, onSelectBooking, onAddBooking }) => {
  // Get days in the month
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  
  // Get first day of the month
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Get last day of the previous month
  const lastDayOfPrevMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  
  // Generate calendar days (including days from previous and next months to fill the grid)
  const calendarDays = [];
  
  // Add days from previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevMonthDay = new Date(date.getFullYear(), date.getMonth() - 1, lastDayOfPrevMonth - i);
    calendarDays.push({
      date: prevMonthDay,
      isCurrentMonth: false,
      isPrevMonth: true
    });
  }
  
  // Add days from current month
  for (let i = 1; i <= daysInMonth; i++) {
    const currentMonthDay = new Date(date.getFullYear(), date.getMonth(), i);
    calendarDays.push({
      date: currentMonthDay,
      isCurrentMonth: true
    });
  }
  
  // Add days from next month to fill the grid (6 rows x 7 columns = 42 cells)
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    const nextMonthDay = new Date(date.getFullYear(), date.getMonth() + 1, i);
    calendarDays.push({
      date: nextMonthDay,
      isCurrentMonth: false,
      isNextMonth: true
    });
  }
  
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
   * Handle click on a day to add a new booking
   * @param {Date} day - The day for the new booking
   */
  const handleDayClick = (day) => {
    // Format date as YYYY-MM-DD
    const formattedDate = day.toISOString().split('T')[0];
    
    // Set default start time to 9:00 AM
    const startTime = '09:00';
    const endTime = '10:00';
    
    // Call onAddBooking with initial booking data
    onAddBooking({
      date: formattedDate,
      startTime,
      endTime
    });
  };
  
  // Days of the week headers
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="relative">
      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {/* Week day headers */}
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`h-10 flex items-center justify-center text-sm font-medium text-steel-700 border-b border-steel-200 ${
              index === 0 || index === 6 ? 'text-red-500' : ''
            }`}
          >
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          const dayBookings = getBookingsForDay(day.date);
          
          return (
            <div
              key={index}
              className={`min-h-24 border-b border-r border-steel-100 p-1 ${
                day.isCurrentMonth ? 'bg-white' : 'bg-steel-50'
              } ${isToday(day.date) ? 'bg-blue-50' : ''}`}
              onClick={() => handleDayClick(day.date)}
            >
              {/* Day number */}
              <div className="flex justify-between items-center mb-1">
                <div
                  className={`text-sm font-medium ${
                    isToday(day.date)
                      ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center'
                      : day.isCurrentMonth
                      ? 'text-steel-800'
                      : 'text-steel-400'
                  }`}
                >
                  {day.date.getDate()}
                </div>
                
                {day.isCurrentMonth && (
                  <button
                    className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDayClick(day.date);
                    }}
                  >
                    <Plus className="w-3 h-3 text-blue-600" />
                  </button>
                )}
              </div>
              
              {/* Bookings for the day */}
              <div className="space-y-1 overflow-y-auto max-h-20">
                {dayBookings.slice(0, 3).map(booking => (
                  <div
                    key={booking.id}
                    className="bg-blue-100 border-l-2 border-blue-600 rounded-sm px-1 py-0.5 text-xs truncate hover:bg-blue-200 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBooking(booking);
                    }}
                  >
                    <div className="font-medium text-blue-800 truncate">
                      {booking.title}
                    </div>
                    <div className="text-blue-600 flex items-center">
                      <Clock className="w-2 h-2 mr-1" />
                      {formatTime(booking.startTime)}
                    </div>
                  </div>
                ))}
                
                {dayBookings.length > 3 && (
                  <div className="text-xs text-steel-500 pl-1">
                    +{dayBookings.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
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

export default MonthView;

