import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Check } from 'lucide-react';
import roomService from '../services/roomService';
import { useNotification } from '../context/NotificationContext';

/**
 * RoomSelector Component
 * 
 * This component provides a dropdown interface for selecting a conference room.
 * It includes search, filtering, and room details.
 */
const RoomSelector = ({ selectedRoom, onRoomSelect }) => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minCapacity: '',
    features: [],
    floor: ''
  });
  
  const { error: showError } = useNotification();
  
  // Available room features for filtering
  const availableFeatures = [
    'Projector',
    'Whiteboard',
    'Video Conference',
    'TV',
    'Phone',
    'Windows'
  ];
  
  // Fetch rooms on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const roomsData = await roomService.getRooms();
        setRooms(roomsData);
        setFilteredRooms(roomsData);
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
        showError('Failed to load conference rooms');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRooms();
  }, [showError]);
  
  // Filter rooms when search term or filters change
  useEffect(() => {
    const applyFilters = () => {
      let result = [...rooms];
      
      // Apply search term filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(room => 
          room.name.toLowerCase().includes(term) || 
          room.location.toLowerCase().includes(term)
        );
      }
      
      // Apply capacity filter
      if (filters.minCapacity) {
        const minCapacity = parseInt(filters.minCapacity, 10);
        if (!isNaN(minCapacity)) {
          result = result.filter(room => room.capacity >= minCapacity);
        }
      }
      
      // Apply features filter
      if (filters.features.length > 0) {
        result = result.filter(room => 
          filters.features.every(feature => 
            room.features && room.features.includes(feature)
          )
        );
      }
      
      // Apply floor filter
      if (filters.floor) {
        result = result.filter(room => room.floor === parseInt(filters.floor, 10));
      }
      
      setFilteredRooms(result);
    };
    
    applyFilters();
  }, [searchTerm, filters, rooms]);
  
  /**
   * Handle room selection
   * @param {Object} room - The selected room
   */
  const handleRoomSelect = (room) => {
    onRoomSelect(room);
    setIsOpen(false);
  };
  
  /**
   * Toggle feature selection in filters
   * @param {string} feature - The feature to toggle
   */
  const toggleFeature = (feature) => {
    setFilters(prev => {
      const features = [...prev.features];
      
      if (features.includes(feature)) {
        return {
          ...prev,
          features: features.filter(f => f !== feature)
        };
      } else {
        return {
          ...prev,
          features: [...features, feature]
        };
      }
    });
  };
  
  /**
   * Reset all filters
   */
  const resetFilters = () => {
    setFilters({
      minCapacity: '',
      features: [],
      floor: ''
    });
    setSearchTerm('');
  };
  
  return (
    <div className="relative">
      {/* Selected Room Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white border border-steel-300 rounded-lg shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <div className="flex items-center">
          {selectedRoom ? (
            <div>
              <div className="font-medium text-steel-900">{selectedRoom.name}</div>
              <div className="text-sm text-steel-500">
                {selectedRoom.location} • Capacity: {selectedRoom.capacity}
              </div>
            </div>
          ) : (
            <div className="text-steel-500">Select a conference room</div>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-steel-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-steel-200 rounded-lg shadow-lg overflow-hidden">
          {/* Search and Filter Bar */}
          <div className="p-3 border-b border-steel-200">
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search rooms..."
                  className="w-full pl-9 pr-3 py-2 border border-steel-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-md ${showFilters ? 'bg-blue-100 text-blue-600' : 'bg-steel-100 text-steel-600'} hover:bg-blue-100 hover:text-blue-600 transition-colors`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
            
            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-3 p-3 bg-steel-50 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-steel-700 mb-1">
                      Minimum Capacity
                    </label>
                    <input
                      type="number"
                      value={filters.minCapacity}
                      onChange={(e) => setFilters(prev => ({ ...prev, minCapacity: e.target.value }))}
                      min="1"
                      placeholder="Min. people"
                      className="w-full px-3 py-1 border border-steel-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-steel-700 mb-1">
                      Floor
                    </label>
                    <select
                      value={filters.floor}
                      onChange={(e) => setFilters(prev => ({ ...prev, floor: e.target.value }))}
                      className="w-full px-3 py-1 border border-steel-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="">Any floor</option>
                      <option value="1">1st Floor</option>
                      <option value="2">2nd Floor</option>
                      <option value="3">3rd Floor</option>
                      <option value="4">4th Floor</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-3">
                  <label className="block text-sm font-medium text-steel-700 mb-1">
                    Features
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableFeatures.map(feature => (
                      <button
                        key={feature}
                        onClick={() => toggleFeature(feature)}
                        className={`px-2 py-1 text-xs rounded-full ${
                          filters.features.includes(feature)
                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                            : 'bg-white text-steel-700 border border-steel-300 hover:bg-steel-50'
                        }`}
                      >
                        {filters.features.includes(feature) && (
                          <Check className="w-3 h-3 inline mr-1" />
                        )}
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="px-3 py-1 text-sm text-steel-600 hover:text-steel-800"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Room List */}
          <div className="max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-steel-500">
                Loading rooms...
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="p-4 text-center text-steel-500">
                No rooms match your criteria
              </div>
            ) : (
              <div className="divide-y divide-steel-100">
                {filteredRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => handleRoomSelect(room)}
                    className={`w-full text-left px-4 py-3 hover:bg-steel-50 transition-colors ${
                      selectedRoom && selectedRoom.id === room.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-steel-900">{room.name}</div>
                        <div className="text-sm text-steel-500">
                          {room.location} • Floor {room.floor}
                        </div>
                      </div>
                      <div className="bg-steel-100 px-2 py-1 rounded-full text-xs font-medium text-steel-700">
                        {room.capacity} people
                      </div>
                    </div>
                    
                    {room.features && room.features.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {room.features.map(feature => (
                          <span
                            key={feature}
                            className="px-1.5 py-0.5 text-xs bg-steel-100 text-steel-600 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomSelector;

