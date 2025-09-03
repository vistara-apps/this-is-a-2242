import React, { useState, useEffect } from 'react';
import ConferenceRoom from './components/ConferenceRoom';
import BookingPanel from './components/BookingPanel';
import ScheduleDisplay from './components/ScheduleDisplay';
import Header from './components/Header';

function App() {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      title: "Weekly Team Standup",
      startTime: "09:00",
      endTime: "09:30",
      date: new Date().toISOString().split('T')[0],
      organizer: "Sarah Johnson",
      attendees: 8
    },
    {
      id: 2,
      title: "Product Strategy Review",
      startTime: "11:00",
      endTime: "12:00",
      date: new Date().toISOString().split('T')[0],
      organizer: "Mike Chen",
      attendees: 12
    },
    {
      id: 3,
      title: "Client Presentation",
      startTime: "14:00",
      endTime: "15:30",
      date: new Date().toISOString().split('T')[0],
      organizer: "Emma Davis",
      attendees: 6
    }
  ]);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const addBooking = (newBooking) => {
    const booking = {
      ...newBooking,
      id: Date.now(),
    };
    setBookings(prev => [...prev, booking]);
  };

  const deleteBooking = (id) => {
    setBookings(prev => prev.filter(booking => booking.id !== id));
  };

  const getCurrentMeeting = () => {
    const now = currentTime.toTimeString().slice(0, 5);
    const today = currentTime.toISOString().split('T')[0];
    
    return bookings.find(booking => 
      booking.date === today &&
      booking.startTime <= now &&
      booking.endTime > now
    );
  };

  const getNextMeeting = () => {
    const now = currentTime.toTimeString().slice(0, 5);
    const today = currentTime.toISOString().split('T')[0];
    
    return bookings
      .filter(booking => 
        booking.date === today &&
        booking.startTime > now
      )
      .sort((a, b) => a.startTime.localeCompare(b.startTime))[0];
  };

  const currentMeeting = getCurrentMeeting();
  const nextMeeting = getNextMeeting();

  return (
    <div className="min-h-screen bg-gradient-to-br from-steel-50 to-steel-100">
      <Header currentTime={currentTime} />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Conference Room Display */}
          <div className="lg:col-span-2">
            <ConferenceRoom 
              currentMeeting={currentMeeting}
              nextMeeting={nextMeeting}
              currentTime={currentTime}
            />
          </div>
          
          {/* Side Panel */}
          <div className="space-y-6">
            <BookingPanel onAddBooking={addBooking} />
            <ScheduleDisplay 
              bookings={bookings}
              onSelectBooking={setSelectedBooking}
              onDeleteBooking={deleteBooking}
              selectedBooking={selectedBooking}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;