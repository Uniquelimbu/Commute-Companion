import React from 'react';
import MapComponent from './components/MapComponent';
import FeedbackForm from './FeedbackForm';
import FeedbackList from './FeedbackList';

function App() {
  const busStopId = "123"; // Example bus stop ID, you can set this dynamically as needed

  return (
    <div className="App">
      <h1>Commute Companion</h1>
      <MapComponent />
      
      {/* Feedback form for submitting feedback related to a specific bus stop */}
      <FeedbackForm busStopId={busStopId} />
      
      {/* Feedback list for displaying feedback related to the same bus stop */}
      <FeedbackList busStopId={busStopId} />
    </div>
  );
}

export default App;
