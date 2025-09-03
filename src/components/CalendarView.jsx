import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Grid } from 'lucide-react';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';

/**
 * CalendarView Component
 * 
 * This component provides a calendar interface for viewing bookings.
 * It supports day, week, and month views with navigation controls.
 */
const CalendarView = ({ bookings, onSelectBooking, onAddBooking }) => {
  const [viewType, setViewType] = useState('week'); // 'day', 'week', 'month'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayedBookings, setDisplayedBookings] = useState([]);
  
  // Filter bookings based on current view and date
  useEffect(() => {
    if (!bookings || !Array.isArray(bookings)) {
      setDisplayedBookings([]);
      return;
    }
    
    const filteredBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      
      if (viewType === 'day') {
        // Show bookings for the selected day
        return (
          bookingDate.getFullYear() === currentDate.getFullYear() &&
          bookingDate.getMonth() === currentDate.getMonth() &&
          bookingDate.getDate() === currentDate.getDate()
        );
      } else if (viewType === 'week') {
        // Show bookings for the selected week
        const startOfWeek = getStartOfWeek(currentDate);
        const endOfWeek = getEndOfWeek(currentDate);
        return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
      } else if (viewType === 'month') {
        // Show bookings for the selected month
        return (
          bookingDate.getFullYear() === currentDate.getFullYear() &&
          bookingDate.getMonth() === currentDate.getMonth()
        );
      }
      
      return false;
    });
    
    setDisplayedBookings(filteredBookings);
  }, [bookings, viewType, currentDate]);
  
  /**
   * Get the start of the week for a given date
   * @param {Date} date - The date
   * @returns {Date} The start of the week (Sunday)
   */
  const getStartOfWeek = (date) => {
    const result = new Date(date);
    const day = result.getDay();
    result.setDate(result.getDate() - day);
    result.setHours(0, 0, 0, 0);
    return result;
  };
  
  /**
   * Get the end of the week for a given date
   * @param {Date} date - The date
   * @returns {Date} The end of the week (Saturday)
   */
  const getEndOfWeek = (date) => {
    const result = new Date(date);
    const day = result.getDay();
    result.setDate(result.getDate() + (6 - day));
    result.setHours(23, 59, 59, 999);
    return result;
  };
  
  /**
   * Navigate to today
   */
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  /**
   * Navigate to the previous period (day, week, or month)
   */
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    
    if (viewType === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    
    setCurrentDate(newDate);
  };
  
  /**
   * Navigate to the next period (day, week, or month)
   */
  const goToNext = () => {
    const newDate = new Date(currentDate);
    
    if (viewType === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    
    setCurrentDate(newDate);
  };
  
  /**
   * Format the date range for display
   * @returns {string} Formatted date range
   */
  const getDateRangeText = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    if (viewType === 'day') {
      return currentDate.toLocaleDateString(undefined, options);
    } else if (viewType === 'week') {
      const startOfWeek = getStartOfWeek(currentDate);
      const endOfWeek = getEndOfWeek(currentDate);
      
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startOfWeek.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })} - ${endOfWeek.toLocaleDateString(undefined, { day: 'numeric', year: 'numeric' })}`;
      } else {
        return `${startOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
    } else if (viewType === 'month') {
      return currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    }
    
    return '';
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-steel-700 to-steel-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2" />
          Calendar
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setViewType('day')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewType === 'day'
                ? 'bg-white text-steel-800'
                : 'bg-steel-600 text-white hover:bg-steel-500'
            }`}
          >
            Day
          </button>
          
          <button
            onClick={() => setViewType('week')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewType === 'week'
                ? 'bg-white text-steel-800'
                : 'bg-steel-600 text-white hover:bg-steel-500'
            }`}
          >
            Week
          </button>
          
          <button
            onClick={() => setViewType('month')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewType === 'month'
                ? 'bg-white text-steel-800'
                : 'bg-steel-600 text-white hover:bg-steel-500'
            }`}
          >
            Month
          </button>
        </div>
      </div>
      
      <div className="p-4 border-b border-steel-200 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={goToPrevious}
            className="p-1 rounded-md hover:bg-steel-100"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-steel-600" />
          </button>
          
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm font-medium text-steel-700 hover:bg-steel-100 rounded-md"
          >
            Today
          </button>
          
          <button
            onClick={goToNext}
            className="p-1 rounded-md hover:bg-steel-100"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 text-steel-600" />
          </button>
        </div>
        
        <div className="text-lg font-semibold text-steel-800">
          {getDateRangeText()}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setViewType('month')}
            className={`p-1 rounded-md ${viewType === 'month' ? 'bg-steel-100 text-steel-800' : 'text-steel-600 hover:bg-steel-100'}`}
            aria-label="Month view"
          >
            <Grid className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setViewType('week')}
            className={`p-1 rounded-md ${viewType === 'week' || viewType === 'day' ? 'bg-steel-100 text-steel-800' : 'text-steel-600 hover:bg-steel-100'}`}
            aria-label="List view"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
        {viewType === 'day' && (
          <DayView
            date={currentDate}
            bookings={displayedBookings}
            onSelectBooking={onSelectBooking}
            onAddBooking={onAddBooking}
          />
        )}
        
        {viewType === 'week' && (
          <WeekView
            date={currentDate}
            bookings={displayedBookings}
            onSelectBooking={onSelectBooking}
            onAddBooking={onAddBooking}
          />
        )}
        
        {viewType === 'month' && (
          <MonthView
            date={currentDate}
            bookings={displayedBookings}
            onSelectBooking={onSelectBooking}
            onAddBooking={onAddBooking}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarView;

