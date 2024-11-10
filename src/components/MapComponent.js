// Import necessary libraries
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import FeedbackForm from '../FeedbackForm'; // Adjust path as necessary
import FeedbackList from '../FeedbackList'; // Adjust path as necessary

// Set Mapbox access token from environment variables
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapComponent = () => {
  const mapContainer = useRef(null);    // Reference for map container
  const map = useRef(null);             // Reference for Mapbox instance
  const [busData, setBusData] = useState([]);      // State for real-time bus data
  const [busStops, setBusStops] = useState(null);  // State for bus stops data in GeoJSON format
  const busMarkersRef = useRef([]);     // Array to store bus markers for cleanup

  // Initialize Mapbox map on component mount
  useEffect(() => {
    if (map.current) return; // Ensure map is initialized only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-79.7616, 43.7315], // Center on Brampton
      zoom: 12,
    });

    // Add zoom and rotation controls to the map
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  }, []);

  // Fetch and parse bus stop data from GTFS
  useEffect(() => {
    const fetchBusStops = async () => {
      try {
        const response = await fetch('/gtfs_data/stops.txt');
        const text = await response.text();

        // Parse stops.txt and convert to GeoJSON format
        const rows = text.split('\n').slice(1).filter(row => row);
        const features = rows.map(row => {
          const [stop_id, , stop_name, stop_desc, stop_lat, stop_lon, , , , , , wheelchair_boarding] = row.split(',');

          const lat = parseFloat(stop_lat);
          const lon = parseFloat(stop_lon);
          if (isNaN(lat) || isNaN(lon)) return null; // Skip invalid entries

          return {
            type: "Feature",
            geometry: { type: "Point", coordinates: [lon, lat] },
            properties: {
              id: stop_id,
              name: stop_name,
              description: stop_desc || 'No description available',
              wheelchairAccessible: wheelchair_boarding === '1' ? 'Yes' : 'No'
            }
          };
        }).filter(feature => feature !== null); // Filter out invalid features

        setBusStops({ type: "FeatureCollection", features });
      } catch (error) {
        console.error('Error loading GTFS stops data:', error);
      }
    };

    fetchBusStops();
  }, []);

  // Add clustered bus stop markers to the map
  useEffect(() => {
    if (!map.current || !busStops) return;

    // Remove source and layers if they exist to avoid duplicates
    if (map.current.getSource("busStops")) {
      map.current.removeSource("busStops");
    }
    ["clusters", "cluster-count", "unclustered-point"].forEach(layer => {
      if (map.current.getLayer(layer)) {
        map.current.removeLayer(layer);
      }
    });

    // Add clustered GeoJSON source for bus stops
    map.current.addSource("busStops", {
      type: "geojson",
      data: busStops,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });

    // Add cluster and individual point layers for visualization
    map.current.addLayer({
      id: "clusters",
      type: "circle",
      source: "busStops",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": "#51bbd6",
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
      },
    });

    map.current.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "busStops",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-size": 12,
      },
    });

    map.current.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "busStops",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#11b4da",
        "circle-radius": 8,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      },
    });

    // Display popup with feedback form and feedback list on click of an unclustered point
    map.current.on("click", "unclustered-point", (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const { id, name, description, wheelchairAccessible } = e.features[0].properties;

      // Create a container for rendering React components into the popup
      const popupContent = document.createElement("div");

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setDOMContent(popupContent)
        .addTo(map.current);

      // Render FeedbackForm and FeedbackList into the popup using ReactDOM
      ReactDOM.render(
        <>
          <h3>{name}</h3>
          <p>Description: {description}</p>
          <p>Wheelchair Accessible: {wheelchairAccessible}</p>
          <FeedbackForm busStopId={id} style={{ resize: 'none', width: '100%' }} />
          <FeedbackList busStopId={id} />
        </>,
        popupContent
      );
    });

    // Zoom into clusters on click
    map.current.on("click", "clusters", (e) => {
      const features = map.current.queryRenderedFeatures(e.point, { layers: ["clusters"] });
      const clusterId = features[0].properties.cluster_id;

      map.current.getSource("busStops").getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.current.easeTo({
          center: features[0].geometry.coordinates,
          zoom,
        });
      });
    });
  }, [busStops]);

  // Fetch real-time bus data and refresh every 15 seconds
  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const response = await fetch('https://nextride.brampton.ca:81/API/VehiclePositions?format=json');
        const data = await response.json();
        setBusData(data.entity || []);
      } catch (error) {
        console.error('Error fetching bus data:', error);
      }
    };

    fetchBusData();
    const interval = setInterval(fetchBusData, 15000);

    return () => clearInterval(interval);
  }, []);

  // Add markers for real-time bus data
  useEffect(() => {
    if (!map.current || busData.length === 0) return;

    // Clear previous markers
    busMarkersRef.current.forEach(marker => marker.remove());
    busMarkersRef.current = [];

    busData.forEach((bus) => {
      const latitude = bus.vehicle?.position?.latitude;
      const longitude = bus.vehicle?.position?.longitude;

      if (latitude && longitude) {
        const marker = new mapboxgl.Marker({ color: 'blue' })
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`<p>Bus ID: ${bus.id}</p>`))
          .addTo(map.current);

        busMarkersRef.current.push(marker);
      }
    });

    return () => busMarkersRef.current.forEach(marker => marker.remove());
  }, [busData]);

  
  return (
    <div ref={mapContainer} className="map-container" />
  );
};

export default MapComponent;
