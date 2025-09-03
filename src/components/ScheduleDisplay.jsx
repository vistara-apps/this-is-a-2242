import React from 'react';
import { Clock, Users, Trash2, Calendar } from 'lucide-react';

const ScheduleDisplay = ({ bookings, onSelectBooking, onDeleteBooking, selectedBooking }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(booking => booking.date === today);
  
  const sortedBookings = todayBookings.sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isCurrentMeeting = (booking) => {
    const now = new Date().toTimeString().slice(0, 5);
    return booking.startTime <= now && booking.endTime > now;
  };

  const isUpcoming = (booking) => {
    const now = new Date().toTimeString().slice(0, 5);
    return booking.startTime > now;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-steel-700 to-steel-800">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-white" />
          <h2 className="text-lg font-semibold text-white">Today's Schedule</h2>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {sortedBookings.length === 0 ? (
          <div className="p-6 text-center">
            <Calendar className="w-12 h-12 text-steel-300 mx-auto mb-3" />
            <p className="text-steel-500">No meetings scheduled for today</p>
          </div>
        ) : (
          <div className="divide-y divide-steel-100">
            {sortedBookings.map((booking) => (
              <div
                key={booking.id}
                className={`p-4 cursor-pointer transition-colors duration-200 ${
                  selectedBooking?.id === booking.id
                    ? 'bg-blue-50 border-r-4 border-blue-500'
                    : 'hover:bg-steel-50'
                } ${
                  isCurrentMeeting(booking)
                    ? 'bg-green-50 border-l-4 border-green-500'
                    : isUpcoming(booking)
                    ? 'bg-blue-25'
                    : 'bg-steel-50 opacity-75'
                }`}
                onClick={() => onSelectBooking(booking)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-steel-900 text-sm leading-tight">
                    {booking.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBooking(booking.id);
                    }}
                    className="text-steel-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1 text-xs text-steel-600">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </span>
                    {isCurrentMeeting(booking) && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Live
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Users className="w-3 h-3" />
                    <span>{booking.attendees} people</span>
                  </div>

                  <div className="text-steel-500">
                    by {booking.organizer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {sortedBookings.length > 0 && (
        <div className="px-6 py-4 bg-steel-50 border-t border-steel-100">
          <div className="flex justify-between text-xs text-steel-600">
            <span>{sortedBookings.length} meeting{sortedBookings.length !== 1 ? 's' : ''} today</span>
            <span>
              {sortedBookings.reduce((total, booking) => {
                const start = booking.startTime.split(':').map(Number);
                const end = booking.endTime.split(':').map(Number);
                const duration = (end[0] * 60 + end[1]) - (start[0] * 60 + start[1]);
                return total + duration;
              }, 0)} minutes total
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleDisplay;