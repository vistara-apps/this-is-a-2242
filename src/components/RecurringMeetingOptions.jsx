import React, { useState } from 'react';
import { Calendar, Repeat, AlertCircle } from 'lucide-react';

/**
 * RecurringMeetingOptions Component
 * 
 * This component provides options for creating recurring meetings.
 * It allows users to set frequency, end date, and days of the week.
 */
const RecurringMeetingOptions = ({ onChange, initialValues = {} }) => {
  const [isRecurring, setIsRecurring] = useState(initialValues.isRecurring || false);
  const [frequency, setFrequency] = useState(initialValues.frequency || 'weekly');
  const [endDate, setEndDate] = useState(initialValues.endDate || '');
  const [daysOfWeek, setDaysOfWeek] = useState(initialValues.daysOfWeek || []);
  const [interval, setInterval] = useState(initialValues.interval || 1);
  
  // Days of the week options
  const weekdays = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' }
  ];
  
  /**
   * Toggle a day of the week
   * @param {number} day - Day value (0-6)
   */
  const toggleDay = (day) => {
    setDaysOfWeek(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };
  
  /**
   * Handle recurring toggle
   * @param {Event} e - Change event
   */
  const handleRecurringToggle = (e) => {
    const isChecked = e.target.checked;
    setIsRecurring(isChecked);
    
    // Call onChange with updated values
    onChange({
      isRecurring: isChecked,
      frequency,
      endDate,
      daysOfWeek,
      interval
    });
  };
  
  /**
   * Handle frequency change
   * @param {Event} e - Change event
   */
  const handleFrequencyChange = (e) => {
    const newFrequency = e.target.value;
    setFrequency(newFrequency);
    
    // Reset days of week if not weekly
    if (newFrequency !== 'weekly') {
      setDaysOfWeek([]);
    }
    
    // Call onChange with updated values
    onChange({
      isRecurring,
      frequency: newFrequency,
      endDate,
      daysOfWeek: newFrequency !== 'weekly' ? [] : daysOfWeek,
      interval
    });
  };
  
  /**
   * Handle end date change
   * @param {Event} e - Change event
   */
  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    
    // Call onChange with updated values
    onChange({
      isRecurring,
      frequency,
      endDate: newEndDate,
      daysOfWeek,
      interval
    });
  };
  
  /**
   * Handle interval change
   * @param {Event} e - Change event
   */
  const handleIntervalChange = (e) => {
    const newInterval = parseInt(e.target.value, 10) || 1;
    setInterval(newInterval);
    
    // Call onChange with updated values
    onChange({
      isRecurring,
      frequency,
      endDate,
      daysOfWeek,
      interval: newInterval
    });
  };
  
  /**
   * Handle days of week change
   */
  const handleDaysChange = () => {
    // Call onChange with updated values
    onChange({
      isRecurring,
      frequency,
      endDate,
      daysOfWeek,
      interval
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isRecurring"
          checked={isRecurring}
          onChange={handleRecurringToggle}
          className="h-4 w-4 text-blue-600 border-steel-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="isRecurring" className="ml-2 text-sm font-medium text-steel-700">
          <Repeat className="w-4 h-4 inline mr-1" />
          Make this a recurring meeting
        </label>
      </div>
      
      {isRecurring && (
        <div className="bg-blue-50 p-4 rounded-lg space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-steel-700 mb-1">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={handleFrequencyChange}
                className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-steel-700 mb-1">
                Repeat every
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={interval}
                  onChange={handleIntervalChange}
                  min="1"
                  max="30"
                  className="w-16 px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
                <span className="ml-2 text-steel-700">
                  {frequency === 'daily' ? 'day(s)' : 
                   frequency === 'weekly' ? 'week(s)' : 'month(s)'}
                </span>
              </div>
            </div>
          </div>
          
          {frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-steel-700 mb-1">
                Repeat on
              </label>
              <div className="flex flex-wrap gap-2">
                {weekdays.map(day => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => {
                      toggleDay(day.value);
                      handleDaysChange();
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      daysOfWeek.includes(day.value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-steel-700 border border-steel-300 hover:bg-steel-50'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              
              {daysOfWeek.length === 0 && (
                <div className="mt-2 flex items-center text-yellow-700 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Please select at least one day
                </div>
              )}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-steel-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required={isRecurring}
            />
          </div>
          
          <div className="text-sm text-steel-600 bg-white p-3 rounded-md border border-steel-200">
            <p className="font-medium mb-1">Summary:</p>
            <p>
              {isRecurring ? (
                <>
                  This meeting will repeat 
                  {frequency === 'daily' && ` daily`}
                  {frequency === 'weekly' && ` weekly on ${daysOfWeek.map(d => weekdays.find(w => w.value === d)?.label).join(', ') || 'selected days'}`}
                  {frequency === 'monthly' && ` monthly`}
                  {interval > 1 && ` every ${interval} ${frequency === 'daily' ? 'days' : frequency === 'weekly' ? 'weeks' : 'months'}`}
                  {endDate && ` until ${new Date(endDate).toLocaleDateString()}`}
                </>
              ) : (
                'This is a one-time meeting'
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringMeetingOptions;

