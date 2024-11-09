// Import necessary libraries
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox CSS

// Set Mapbox access token from environment variables
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapComponent = () => {
  const mapContainer = useRef(null); // Reference for the map container div
  const map = useRef(null); // Reference for the Mapbox instance

  useEffect(() => {
    // Check if map has already been initialized
    if (map.current) return; 

    // Initialize the Mapbox map
    map.current = new mapboxgl.Map({
      container: mapContainer.current, // Container for the map
      style: 'mapbox://styles/mapbox/streets-v11', // Map style (streets view)
      center: [-79.7616, 43.7315], // Initial map center coordinates (Brampton)
      zoom: 12 // Initial zoom level
    });

    // Add zoom and rotation controls to the map
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Event Listener for handling map clicks (optional, if needed)
    map.current.on('click', (e) => {
      console.log("Map clicked at:", e.lngLat);
    });

    // Clean up the map instance on component unmount
    return () => map.current.remove();

  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div>
      <h2>Commute Companion - Map View</h2>
      {/* Map container */}
      <div ref={mapContainer} style={{ width: '100%', height: '500px', border: '1px solid #ccc' }} />
    </div>
  );
};

export default MapComponent;
