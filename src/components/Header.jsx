import React from 'react';
import { Calendar, Clock, Wifi, Battery } from 'lucide-react';

const Header = ({ currentTime }) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="bg-white shadow-sm border-b border-steel-200">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-steel-900">Conference Room Alpha</h1>
            <p className="text-steel-600 text-sm sm:text-base">Executive Meeting Space • Capacity: 12 people</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-2 text-steel-700">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-lg font-semibold">{formatTime(currentTime)}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-steel-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{formatDate(currentTime)}</span>
            </div>
            
            <div className="flex items-center space-x-3 text-steel-500">
              <Wifi className="w-4 h-4" />
              <Battery className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;