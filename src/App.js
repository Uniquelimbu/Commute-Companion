// Import necessary libraries
import './App.css';
import React from 'react';
import MapComponent from './components/MapComponent';

function App() {
  return (
    <div className="App">
      {/* Logo Image */}
      <img src="./logo.png" alt="Logo" className="logo" />
      <MapComponent />
    </div>
  );
}

export default App;
