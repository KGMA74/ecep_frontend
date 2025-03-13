import React, { useState } from 'react';

const DatePicker = ({ onDateChange, initialDate = new Date() }) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Format date as YYYY-MM-DD for input value
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Format date for display
  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get day of week the month starts on (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  // Change month
  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };
  
  // Handle date selection
  const handleDateSelect = (day) => {
    if (!day) return;
    
    const newDate = new Date(currentDate);
    newDate.setDate(day);
    setCurrentDate(newDate);
    
    if (onDateChange) {
      onDateChange(newDate);
    }
    
    setShowCalendar(false);
  };
  
  // Handle manual date input
  const handleInputChange = (e) => {
    const inputDate = new Date(e.target.value);
    if (!isNaN(inputDate.getTime())) {
      setCurrentDate(inputDate);
      if (onDateChange) {
        onDateChange(inputDate);
      }
    }
  };
  
  // Get month name
  const getMonthName = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  return (
    <div className="relative w-full max-w-md">
      <div className="flex">
        <input
          type="text"
          className="w-full p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formatDateForDisplay(currentDate)}
          onClick={() => setShowCalendar(!showCalendar)}
          readOnly
        />
        <input
          type="date"
          className="sr-only"
          value={formatDateForInput(currentDate)}
          onChange={handleInputChange}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          📅
        </button>
      </div>
      
      {showCalendar && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg">
          <div className="flex justify-between items-center p-2 border-b">
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => changeMonth(-1)}
            >
              &lt;
            </button>
            <div className="font-semibold">{getMonthName()}</div>
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => changeMonth(1)}
            >
              &gt;
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 p-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-700">
                {day}
              </div>
            ))}
            
            {generateCalendarDays().map((day, index) => (
              <div 
                key={index}
                className={`text-center p-1 ${
                  day ? 'cursor-pointer hover:bg-blue-100' : ''
                } ${
                  day === currentDate.getDate() ? 'bg-blue-500 text-white rounded' : ''
                }`}
                onClick={() => handleDateSelect(day)}