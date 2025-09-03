import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ConferenceRoom from './components/ConferenceRoom';
import BookingPanel from './components/BookingPanel';
import ScheduleDisplay from './components/ScheduleDisplay';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import CalendarView from './components/CalendarView';
import EditBookingModal from './components/EditBookingModal';
import RoomSelector from './components/RoomSelector';
import Notifications from './components/Notifications';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { A11yProvider } from './components/A11yProvider';
import { useMediaQuery } from './hooks/useMediaQuery';
import bookingService from './services/bookingService';
import roomService from './services/roomService';
import logger from './utils/logger';

// Initialize logger
logger.configure({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  appName: 'conference-room-app',
  version: '1.0.0'
});

/**
 * Protected Route Component
 * 
 * This component ensures that routes are only accessible to authenticated users.
 * Unauthenticated users are redirected to the login page.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

/**
 * Main App Component
 * 
 * This component is the root of the application and provides the overall layout.
 * It manages global state and routing.
 */
function App() {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      title: "Weekly Team Standup",
      startTime: "09:00",
      endTime: "09:30",
      date: new Date().toISOString().split('T')[0],
      organizer: "Sarah Johnson",
      attendees: 8,
      roomId: 1
    },
    {
      id: 2,
      title: "Product Strategy Review",
      startTime: "11:00",
      endTime: "12:00",
      date: new Date().toISOString().split('T')[0],
      organizer: "Mike Chen",
      attendees: 12,
      roomId: 1
    },
    {
      id: 3,
      title: "Client Presentation",
      startTime: "14:00",
      endTime: "15:30",
      date: new Date().toISOString().split('T')[0],
      organizer: "Emma Davis",
      attendees: 6,
      roomId: 1
    }
  ]);
  
  const [rooms, setRooms] = useState([
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
  ]);
  
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('room'); // 'room', 'calendar'
  
  // Check if screen is mobile
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Fetch bookings and rooms from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch rooms
        const roomsData = await roomService.getRooms();
        if (roomsData && roomsData.length > 0) {
          setRooms(roomsData);
          setSelectedRoom(roomsData[0]);
        }
        
        // Fetch bookings for the selected room
        if (selectedRoom) {
          const bookingsData = await bookingService.getBookingsByDate(
            new Date().toISOString().split('T')[0],
            selectedRoom.id
          );
          
          if (bookingsData) {
            setBookings(bookingsData);
          }
        }
      } catch (error) {
        logger.error('Failed to fetch initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // In a real app, we would call fetchData() here
    // For now, we'll use the mock data
    // fetchData();
  }, []);
  
  /**
   * Add a new booking
   * @param {Object} newBooking - The booking data to add
   */
  const addBooking = async (newBooking) => {
    try {
      // In a real app, we would call the API
      // const response = await bookingService.createBooking({
      //   ...newBooking,
      //   roomId: selectedRoom.id
      // });
      
      // For now, we'll create a local booking
      const booking = {
        ...newBooking,
        id: Date.now(),
        roomId: selectedRoom.id
      };
      
      setBookings(prev => [...prev, booking]);
      setIsEditModalOpen(false);
    } catch (error) {
      logger.error('Failed to add booking:', error);
    }
  };
  
  /**
   * Update an existing booking
   * @param {Object} updatedBooking - The updated booking data
   */
  const updateBooking = async (updatedBooking) => {
    try {
      // In a real app, we would call the API
      // const response = await bookingService.updateBooking(
      //   updatedBooking.id,
      //   updatedBooking
      // );
      
      // For now, we'll update the local booking
      setBookings(prev =>
        prev.map(booking =>
          booking.id === updatedBooking.id ? updatedBooking : booking
        )
      );
      
      setSelectedBooking(null);
      setIsEditModalOpen(false);
    } catch (error) {
      logger.error('Failed to update booking:', error);
    }
  };
  
  /**
   * Delete a booking
   * @param {number|string} id - The ID of the booking to delete
   */
  const deleteBooking = async (id) => {
    try {
      // In a real app, we would call the API
      // await bookingService.deleteBooking(id);
      
      // For now, we'll delete the local booking
      setBookings(prev => prev.filter(booking => booking.id !== id));
      
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(null);
      }
      
      setIsEditModalOpen(false);
    } catch (error) {
      logger.error('Failed to delete booking:', error);
    }
  };
  
  /**
   * Handle booking selection
   * @param {Object} booking - The selected booking
   */
  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking);
    setIsEditModalOpen(true);
  };
  
  /**
   * Handle room selection
   * @param {Object} room - The selected room
   */
  const handleRoomSelect = async (room) => {
    setSelectedRoom(room);
    
    try {
      setIsLoading(true);
      
      // In a real app, we would fetch bookings for the selected room
      // const bookingsData = await bookingService.getBookingsByDate(
      //   new Date().toISOString().split('T')[0],
      //   room.id
      // );
      
      // For now, we'll filter the local bookings
      const filteredBookings = bookings.filter(booking => booking.roomId === room.id);
      setBookings(filteredBookings);
    } catch (error) {
      logger.error('Failed to fetch bookings for room:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get the current meeting
   * @returns {Object|null} The current meeting or null if none
   */
  const getCurrentMeeting = () => {
    const now = currentTime.toTimeString().slice(0, 5);
    const today = currentTime.toISOString().split('T')[0];
    
    return bookings.find(booking => 
      booking.date === today &&
      booking.startTime <= now &&
      booking.endTime > now &&
      booking.roomId === selectedRoom?.id
    );
  };
  
  /**
   * Get the next meeting
   * @returns {Object|null} The next meeting or null if none
   */
  const getNextMeeting = () => {
    const now = currentTime.toTimeString().slice(0, 5);
    const today = currentTime.toISOString().split('T')[0];
    
    return bookings
      .filter(booking => 
        booking.date === today &&
        booking.startTime > now &&
        booking.roomId === selectedRoom?.id
      )
      .sort((a, b) => a.startTime.localeCompare(b.startTime))[0];
  };
  
  const currentMeeting = getCurrentMeeting();
  const nextMeeting = getNextMeeting();
  
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <AuthProvider>
          <A11yProvider>
            <div className="min-h-screen bg-gradient-to-br from-steel-50 to-steel-100">
              <Header 
                currentTime={currentTime} 
                selectedRoom={selectedRoom}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
              
              <Notifications />
              
              <div className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Room Selector */}
                <div className="mb-6">
                  <RoomSelector
                    selectedRoom={selectedRoom}
                    onRoomSelect={handleRoomSelect}
                  />
                </div>
                
                {viewMode === 'room' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Conference Room Display */}
                    <div className="lg:col-span-2">
                      <ConferenceRoom 
                        currentMeeting={currentMeeting}
                        nextMeeting={nextMeeting}
                        currentTime={currentTime}
                        selectedRoom={selectedRoom}
                      />
                    </div>
                    
                    {/* Side Panel */}
                    <div className="space-y-6">
                      <BookingPanel 
                        onAddBooking={(bookingData) => {
                          setSelectedBooking(null);
                          addBooking({
                            ...bookingData,
                            roomId: selectedRoom.id
                          });
                        }} 
                      />
                      <ScheduleDisplay 
                        bookings={bookings.filter(b => b.roomId === selectedRoom?.id)}
                        onSelectBooking={handleSelectBooking}
                        onDeleteBooking={deleteBooking}
                        selectedBooking={selectedBooking}
                      />
                    </div>
                  </div>
                ) : (
                  <CalendarView
                    bookings={bookings}
                    onSelectBooking={handleSelectBooking}
                    onAddBooking={(bookingData) => {
                      setSelectedBooking(null);
                      setIsEditModalOpen(true);
                      // Pre-fill the booking form
                      setSelectedBooking({
                        title: '',
                        startTime: bookingData.startTime || '09:00',
                        endTime: bookingData.endTime || '10:00',
                        date: bookingData.date || new Date().toISOString().split('T')[0],
                        organizer: '',
                        attendees: 1,
                        roomId: selectedRoom.id
                      });
                    }}
                  />
                )}
              </div>
              
              {/* Edit Booking Modal */}
              {isEditModalOpen && (
                <EditBookingModal
                  booking={selectedBooking || {
                    title: '',
                    startTime: '',
                    endTime: '',
                    date: new Date().toISOString().split('T')[0],
                    organizer: '',
                    attendees: 1,
                    roomId: selectedRoom.id
                  }}
                  onSave={selectedBooking?.id ? updateBooking : addBooking}
                  onDelete={deleteBooking}
                  onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedBooking(null);
                  }}
                  rooms={rooms}
                />
              )}
            </div>
          </A11yProvider>
        </AuthProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;

