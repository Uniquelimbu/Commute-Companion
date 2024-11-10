import React, { useState, useEffect } from 'react';

const BusList = ({ buses, stopName }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set the component to visible only on the first render
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000); // Adjust delay as needed

    // Cleanup to clear the timer on unmount
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs only once

  // Toggle visibility when close button is clicked
  const handleClose = () => setIsVisible(false);

  return (
    (isVisible && buses.length > 0) && (
      <div className="bus-list-dialog">
        <div className="bus-list-header">
          <h3>Bus Arrivals at {stopName}</h3>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        <ul className="bus-list">
          {buses.map((bus, index) => {
            const [hours, minutes, seconds] = bus.arrival_time.split(':').map(Number);
            const arrivalTime = new Date();
            arrivalTime.setHours(hours, minutes, seconds || 0);

            return (
              <li key={index} className="bus-list-item">
                <span className="bus-list-item-number">{index + 1}.</span>
                <span className="bus-list-item-time">{formatTime(arrivalTime)}</span>
                <span className="bus-list-item-remaining">{getTimeRemaining(arrivalTime)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    )
  );
};

export default BusList;

// Utility functions
const formatTime = (date) => {
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

const getTimeRemaining = (arrivalTime) => {
  const now = new Date();
  const diff = arrivalTime - now;

  if (diff < 0) {
    const minutesAgo = Math.abs(Math.round(diff / 60000));
    return `${minutesAgo} min ago`;
  } else {
    const minutesLeft = Math.round(diff / 60000);
    if (minutesLeft >= 60) {
      const hours = Math.floor(minutesLeft / 60);
      const minutes = minutesLeft % 60;
      return `in ${hours} hr${hours > 1 ? 's' : ''} ${minutes > 0 ? `${minutes} min` : ''}`;
    } else {
      return `in ${minutesLeft} min`;
    }
  }
};
