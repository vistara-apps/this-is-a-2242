import React from 'react';
import { Monitor, Users, Clock, Mic, Video, Leaf } from 'lucide-react';

const ConferenceRoom = ({ currentMeeting, nextMeeting, currentTime }) => {
  const getRoomStatus = () => {
    if (currentMeeting) {
      return {
        status: 'occupied',
        message: 'Meeting in Progress',
        color: 'bg-red-500',
        textColor: 'text-red-700',
        bgColor: 'bg-red-50'
      };
    } else if (nextMeeting) {
      const timeUntilNext = getTimeUntilMeeting(nextMeeting.startTime);
      if (timeUntilNext < 15) {
        return {
          status: 'upcoming',
          message: 'Meeting Starting Soon',
          color: 'bg-yellow-500',
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50'
        };
      }
    }
    return {
      status: 'available',
      message: 'Room Available',
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50'
    };
  };

  const getTimeUntilMeeting = (startTime) => {
    const now = currentTime.toTimeString().slice(0, 5);
    const [nowHours, nowMinutes] = now.split(':').map(Number);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    
    const nowTotal = nowHours * 60 + nowMinutes;
    const startTotal = startHours * 60 + startMinutes;
    
    return startTotal - nowTotal;
  };

  const formatTimeRemaining = (meeting) => {
    const now = currentTime.toTimeString().slice(0, 5);
    const [nowHours, nowMinutes] = now.split(':').map(Number);
    const [endHours, endMinutes] = meeting.endTime.split(':').map(Number);
    
    const nowTotal = nowHours * 60 + nowMinutes;
    const endTotal = endHours * 60 + endMinutes;
    const remaining = endTotal - nowTotal;
    
    if (remaining <= 0) return "Ending now";
    
    const hours = Math.floor(remaining / 60);
    const minutes = remaining % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const roomStatus = getRoomStatus();

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Industrial Ceiling Effect */}
      <div className="industrial-ceiling h-8 bg-steel-100"></div>
      
      {/* Status Bar */}
      <div className={`${roomStatus.bgColor} px-6 py-4 border-b`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${roomStatus.color} animate-pulse`}></div>
            <h2 className={`text-lg font-semibold ${roomStatus.textColor}`}>
              {roomStatus.message}
            </h2>
          </div>
          
          {currentMeeting && (
            <div className={`${roomStatus.textColor} text-sm font-medium`}>
              {formatTimeRemaining(currentMeeting)}
            </div>
          )}
        </div>
      </div>

      {/* Room Visualization */}
      <div className="p-8 bg-gradient-to-b from-steel-50 to-white">
        <div className="relative">
          {/* Conference Table */}
          <div className="mx-auto w-full max-w-md">
            <div className="bg-steel-800 rounded-3xl h-32 shadow-2xl relative overflow-hidden">
              {/* Glass reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              
              {/* Table legs indicator */}
              <div className="absolute bottom-2 left-1/4 w-2 h-6 bg-steel-700 rounded"></div>
              <div className="absolute bottom-2 right-1/4 w-2 h-6 bg-steel-700 rounded"></div>
            </div>
            
            {/* Chairs around table */}
            <div className="relative">
              {/* Top chairs */}
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 flex space-x-4">
                {[...Array(3)].map((_, i) => (
                  <div key={`top-${i}`} className="w-8 h-8 bg-steel-700 rounded-lg shadow-md"></div>
                ))}
              </div>
              
              {/* Bottom chairs */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-4">
                {[...Array(3)].map((_, i) => (
                  <div key={`bottom-${i}`} className="w-8 h-8 bg-steel-700 rounded-lg shadow-md"></div>
                ))}
              </div>
              
              {/* Side chairs */}
              <div className="absolute top-1/2 -left-12 transform -translate-y-1/2 flex flex-col space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={`left-${i}`} className="w-8 h-8 bg-steel-700 rounded-lg shadow-md"></div>
                ))}
              </div>
              
              <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 flex flex-col space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={`right-${i}`} className="w-8 h-8 bg-steel-700 rounded-lg shadow-md"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Wall-mounted display */}
          <div className="mt-12 mx-auto w-32 h-20 bg-steel-900 rounded-lg shadow-lg relative">
            <div className="absolute inset-2 bg-steel-800 rounded flex items-center justify-center">
              <Monitor className="w-6 h-6 text-steel-400" />
            </div>
          </div>

          {/* Plants */}
          <div className="absolute top-0 left-0">
            <div className="w-6 h-12 bg-green-600 rounded-full relative">
              <Leaf className="w-4 h-4 text-green-400 absolute top-1 left-1" />
            </div>
          </div>
          
          <div className="absolute top-0 right-0">
            <div className="w-6 h-12 bg-green-600 rounded-full relative">
              <Leaf className="w-4 h-4 text-green-400 absolute top-1 right-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Information */}
      <div className="px-6 py-6 border-t border-steel-100">
        {currentMeeting ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-steel-900">{currentMeeting.title}</h3>
              <p className="text-steel-600">Organized by {currentMeeting.organizer}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2 text-steel-700">
                <Clock className="w-4 h-4" />
                <span>{currentMeeting.startTime} - {currentMeeting.endTime}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-steel-700">
                <Users className="w-4 h-4" />
                <span>{currentMeeting.attendees} attendees</span>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-steel-700 text-white rounded-lg hover:bg-steel-800 transition-colors">
                <Mic className="w-4 h-4" />
                <span>Join Audio</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Video className="w-4 h-4" />
                <span>Join Video</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-steel-400 mb-2">
              <Users className="w-12 h-12 mx-auto mb-2" />
            </div>
            <h3 className="text-lg font-semibold text-steel-700 mb-1">Room Available</h3>
            <p className="text-steel-500">Ready for your next meeting</p>
            
            {nextMeeting && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">Next: {nextMeeting.title}</p>
                <p className="text-sm text-blue-600">at {nextMeeting.startTime}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConferenceRoom;