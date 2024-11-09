// Import necessary libraries
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token from environment variables
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapComponent = () => {
  // References for the map container and Mapbox instance
  const mapContainer = useRef(null);
  const map = useRef(null);

  // States to store real-time bus data and bus stop data
  const [busData, setBusData] = useState([]);
  const [busStops, setBusStops] = useState([]);
  const busMarkers = useRef([]); // Array to hold bus markers for easy cleanup
  const stopMarkers = useRef([]); // Array to hold stop markers for easy cleanup

  // Initialize Mapbox map on component mount
  useEffect(() => {
    if (map.current) return; // Initialize only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-79.7616, 43.7315], // Center on Brampton
      zoom: 12,
    });

    // Add navigation controls (zoom and rotation)
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  }, []);

  // Fetch and parse bus stop data from GTFS stops.txt
  useEffect(() => {
    const fetchBusStops = async () => {
      try {
        const response = await fetch('/gtfs_data/stops.txt'); // Adjust path if necessary
        const text = await response.text();

        // Parse stops.txt, skipping header
        const rows = text.split('\n').slice(1).filter(row => row); // Filter out empty lines
        const stops = rows.map(row => {
          const [
            stop_id,
            stop_code,
            stop_name,
            stop_desc,
            stop_lat,
            stop_lon,
            zone_id,
            stop_url,
            location_type,
            parent_station,
            stop_timezone,
            wheelchair_boarding
          ] = row.split(',');

          // Parse latitude and longitude, handling invalid values
          const lat = parseFloat(stop_lat);
          const lon = parseFloat(stop_lon);

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`Skipping invalid stop data: ${row}`);
            return null; // Skip this stop if coordinates are invalid
          }

          return {
            id: stop_id,
            name: stop_name,
            description: stop_desc || 'No description available',
            coordinates: [lon, lat], // Use parsed coordinates
            wheelchairAccessible: wheelchair_boarding === '1' ? 'Yes' : 'No'
          };
        }).filter(stop => stop !== null); // Filter out any invalid stops
        setBusStops(stops);
      } catch (error) {
        console.error('Error loading GTFS stops data:', error);
      }
    };

    fetchBusStops();
  }, []);

  // Fetch real-time bus data and update state
  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const response = await fetch('https://nextride.brampton.ca:81/API/VehiclePositions?format=json');
        const data = await response.json();
        console.log(data)
        if (data.entity && data.entity.length > 0) {
          setBusData(data.entity); // Only set busData if there are active positions
        } else {
          console.log('No active bus positions at this time.');
          setBusData([]); // Clear bus data if empty
        }
      } catch (error) {
        console.error('Error fetching bus data:', error);
      }
    };

    fetchBusData();
    const interval = setInterval(fetchBusData, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  // Add markers for bus stops
  useEffect(() => {
    if (!map.current || busStops.length === 0) return;

    // Clear previous bus stop markers
    stopMarkers.current.forEach(marker => marker.remove());
    stopMarkers.current = []; // Clear the array

    // Add new markers for each bus stop
    busStops.forEach(stop => {
      const marker = new mapboxgl.Marker({ color: 'green' }) // Different color for bus stops
        .setLngLat(stop.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`
          <h3>${stop.name}</h3>
          <p>Stop ID: ${stop.id}</p>
          ${stop.description ? `<p>Description: ${stop.description}</p>` : ''}
          <p>Wheelchair Accessible: ${stop.wheelchairAccessible}</p>
        `))
        .addTo(map.current);

      stopMarkers.current.push(marker); // Store marker for later cleanup
    });

    return () => stopMarkers.current.forEach(marker => marker.remove()); // Clean up markers on unmount
  }, [busStops]);

  // Add markers for real-time bus data
  useEffect(() => {
    if (!map.current || busData.length === 0) return;

    // Clear previous bus markers
    busMarkers.current.forEach(marker => marker.remove());
    busMarkers.current = []; // Clear the array

    // Add new markers for each real-time bus position
    busData.forEach((bus, index) => {
      const latitude = bus.vehicle?.position?.latitude;
      const longitude = bus.vehicle?.position?.longitude;

      if (latitude === undefined || longitude === undefined || isNaN(latitude) || isNaN(longitude)) {
        console.warn(`Invalid bus position for bus ID: ${bus.id}`);
        return; // Skip this bus if position data is invalid
      }

      const marker = new mapboxgl.Marker({ color: 'blue' })
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup().setText(`Bus ID: ${bus.id}`))
        .addTo(map.current);

      busMarkers.current.push(marker);
    });

    return () => busMarkers.current.forEach(marker => marker.remove()); // Clean up markers on unmount
  }, [busData]);

  return (
    <div>
      <h2>Commute Companion - Transit Map</h2>
      <div ref={mapContainer} style={{ width: '100%', height: '500px', border: '1px solid #ccc' }} />
    </div>
  );
};

export default MapComponent;
