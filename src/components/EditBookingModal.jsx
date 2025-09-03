import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, User, Save, Trash2, AlertCircle } from 'lucide-react';
import { validateBooking } from '../models/Booking';
import RoomSelector from './RoomSelector';

/**
 * EditBookingModal Component
 * 
 * This component provides a modal interface for editing an existing booking.
 * It handles form submission, validation, and error display.
 */
const EditBookingModal = ({ booking, onSave, onDelete, onClose, rooms = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    date: '',
    organizer: '',
    attendees: '',
    roomId: '',
    description: ''
  });
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  
  // Initialize form data when booking changes
  useEffect(() => {
    if (booking) {
      setFormData({
        title: booking.title || '',
        startTime: booking.startTime || '',
        endTime: booking.endTime || '',
        date: booking.date || new Date().toISOString().split('T')[0],
        organizer: booking.organizer || '',
        attendees: booking.attendees?.toString() || '',
        roomId: booking.roomId || '',
        description: booking.description || ''
      });
      
      // Set selected room if available
      if (booking.roomId && rooms.length > 0) {
        const room = rooms.find(r => r.id === booking.roomId);
        if (room) {
          setSelectedRoom(room);
        }
      }
    }
  }, [booking, rooms]);
  
  /**
   * Handle input change
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  /**
   * Handle room selection
   * @param {Object} room - The selected room
   */
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setFormData(prev => ({
      ...prev,
      roomId: room.id
    }));
  };
  
  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateBooking(formData);
    
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      setFormErrors([]);
      
      // Prepare booking data
      const bookingData = {
        ...formData,
        attendees: parseInt(formData.attendees) || 1,
        id: booking.id
      };
      
      // Call save callback
      await onSave(bookingData);
      
      // Close modal
      onClose();
    } catch (err) {
      console.error('Failed to save booking:', err);
      
      // Set form errors
      if (err.data && err.data.errors) {
        setFormErrors(err.data.errors);
      } else {
        setFormErrors([err.message || 'Failed to save booking. Please try again.']);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * Handle booking deletion
   */
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        setIsSubmitting(true);
        
        // Call delete callback
        await onDelete(booking.id);
        
        // Close modal
        onClose();
      } catch (err) {
        console.error('Failed to delete booking:', err);
        setFormErrors([err.message || 'Failed to delete booking. Please try again.']);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Edit Booking</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 focus:outline-none"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
          {formErrors.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700 mb-1">Please fix the following errors:</p>
                  <ul className="text-sm text-red-700 list-disc list-inside">
                    {formErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-steel-700 mb-2">
                Meeting Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter meeting title"
                className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-steel-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Organizer
              </label>
              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-steel-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-steel-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-steel-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-steel-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Expected Attendees
              </label>
              <input
                type="number"
                name="attendees"
                value={formData.attendees}
                onChange={handleChange}
                placeholder="Number of people"
                min="1"
                max="50"
                className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-steel-700 mb-2">
                Conference Room
              </label>
              <RoomSelector
                selectedRoom={selectedRoom}
                onRoomSelect={handleRoomSelect}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-steel-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Meeting agenda, notes, etc."
                rows="3"
                className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                disabled={isSubmitting}
              ></textarea>
            </div>
            
            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-steel-200 text-steel-700 py-2 px-4 rounded-lg hover:bg-steel-300 transition-colors duration-200 font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;

