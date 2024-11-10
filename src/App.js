// Import necessary libraries
import './App.css';
import React from 'react';
import MapComponent from './components/MapComponent';
import VehicleData from './components/VehicleData';

function App() {
  return (
    <div className="App">
      {/* Logo Image */}
      <img src="./logo.png" alt="Logo" className="logo" />
      <MapComponent />
      //<VehicleData routeShortName={2}/>
    </div>
  );
}

export default App;
