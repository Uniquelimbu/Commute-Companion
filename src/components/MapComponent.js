// Import necessary libraries
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import FeedbackForm from '../FeedbackForm';
import FeedbackList from '../FeedbackList';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Papa from 'papaparse'; // For parsing CSV data
import BusList from './BusList';
// Set Mapbox access token from environment variables
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapComponent = () => {
  const mapContainer = useRef(null); // Reference for map container
  const map = useRef(null); // Reference for Mapbox instance
  const [busStops, setBusStops] = useState(); // State for bus stops data in GeoJSON format
  const [stopTimes, setStopTimes] = useState([]); // State for bus stops data in GeoJSON format
  const [stopName, setStopName] = useState(); // State for bus stops data in GeoJSON format


  const loadTextFile = async (filePath) => {
    const response = await fetch(filePath);
    const text = await response.text();
    return text;
  };

  const parseCSVData = (csvData) => {
    const parsed = Papa.parse(csvData, { header: true });
    return parsed.data;
  };

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
    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    // Add geolocation control to the map
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showAccuracyCircle: true,
    });

    map.current.addControl(geolocate, 'bottom-right');

    // Automatically trigger geolocation when the map is loaded
    map.current.on('load', () => {
      geolocate.trigger(); // Requests the user's location
    });

    geolocate.on('error', (error) => {
      console.error('Geolocation error:', error);
      alert('Unable to access your location. Please make sure location services are enabled.');
    });
  }, []);

  // Fetch and parse bus stop data from GTFS
  useEffect(() => {
    const fetchBusStops = async () => {
      try {
        const response = await fetch('/gtfs_data/stops.txt');
        const text = await response.text();

        const rows = text.split('\n').slice(1).filter(row => row);
        const features = rows.map(row => {
          const [stop_id, , stop_name, stop_desc, stop_lat, stop_lon, , , , , , wheelchair_boarding] = row.split(',');

          const lat = parseFloat(stop_lat);
          const lon = parseFloat(stop_lon);
          if (isNaN(lat) || isNaN(lon)) return null;

          return {
            type: "Feature",
            geometry: { type: "Point", coordinates: [lon, lat] },
            properties: {
              id: stop_id,
              name: stop_name,
              description: stop_desc || 'No description available',
              wheelchairAccessible: 
                wheelchair_boarding === '1' ? 'Yes' :
                wheelchair_boarding === '0' ? 'No' :
                'Unknown'
            }
          };
        }).filter(feature => feature !== null);

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

    // Remove existing source and layers to avoid duplication
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
      clusterRadius: 50,
    });

    // Add cluster and individual point layers for visualization
    map.current.addLayer({
      id: "clusters",
      type: "circle",
      source: "busStops",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": "#00BF63",
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
        "circle-color": "#00BF63",
        "circle-radius": 8,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      },
    });



  // Function to load and parse CSV files
    // Display basic popup with "Write a Review" button
    map.current.on("click", "unclustered-point", async (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const { id, name, description, wheelchairAccessible } = e.features[0].properties;
      setStopName(name);

      // Calculate average rating, wheelchair accessibility, and shelter status
      const { averageRating, updatedWheelchairStatus, shelterAvailability } = await calculateBusStopFeedbackData(id);

      const initialPopupContent = document.createElement("div");
      const loadData = async () => {
        const stopTimes = await loadTextFile('/gtfs_data/stop_times.txt');
        const parsedStopTimes = parseCSVData(stopTimes);

        // Filter stop times by specific stop_id
        const filteredData = parsedStopTimes.filter(
          (stopTime) => stopTime.stop_id == id
        );

        const currentTime = new Date();
      currentTime.setMinutes(currentTime.getMinutes() - 1);

      const finalData = filteredData.filter((stopTime) => {
        // Convert arrival_time to a Date object for comparison
        const [hours, minutes, seconds] = stopTime.arrival_time.split(':').map(Number);
        const arrivalTime = new Date();
        arrivalTime.setHours(hours, minutes, seconds || 0);

        // Check if arrival time is after (current time - 1 minute)
        return arrivalTime > currentTime;
      });

       // Step 3: Filter by weekday in trip_id
       const today = new Date();
       const daysMap = {
         0: 'Sunday',
         1: 'Weekday',
         2: 'Weekday',
         3: 'Weekday',
         4: 'Weekday',
         5: 'Weekday',
         6: 'Saturday'
       };
       const todayString = daysMap[today.getDay()];
 
       const finalFilteredData = finalData.filter((stopTime) => {
         const tripID = stopTime.trip_id;
         const dayInTripID = tripID.match(/Weekday|Saturday|Sunday/);
 
         return dayInTripID && dayInTripID[0] === todayString;
       });

       // Step 4: Sort by arrival_time
      const sortedData = finalFilteredData.sort((a, b) => {
        const [hoursA, minutesA, secondsA] = a.arrival_time.split(':').map(Number);
        const [hoursB, minutesB, secondsB] = b.arrival_time.split(':').map(Number);

        const dateA = new Date();
        dateA.setHours(hoursA, minutesA, secondsA || 0);

        const dateB = new Date();
        dateB.setHours(hoursB, minutesB, secondsB || 0);

        return dateA - dateB;
      });

      // Log the filtered data
      console.log("Filtered Stop Times:", sortedData);

      // Store the filtered data in state
      setStopTimes(sortedData);
      console.log("Stop Times:", stopTimes);
      };

      loadData(); 

      ReactDOM.render(
        <>
          <h3 style={{ fontSize: '1.4em', fontWeight: 'bold' }}>{name}</h3>
          <p style={{ fontSize: '1.1em' }}>Description: {description}</p>
          <p style={{ fontSize: '1.1em' }}>Wheelchair Accessible: {updatedWheelchairStatus}</p>
          <p style={{ fontSize: '1.1em' }}>Shelter: {shelterAvailability}</p>
          <p style={{ fontSize: '1.1em' }}>Rating: {averageRating ? `${averageRating.toFixed(1)}/5` : 'No ratings yet'}</p>
          <button
            onClick={() => openFeedbackFormPopup(id, name, description, updatedWheelchairStatus, shelterAvailability)}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Write a Review
          </button>
          <FeedbackList busStopId={id} />
        </>,
        initialPopupContent
      );

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setDOMContent(initialPopupContent)
        .addTo(map.current);
    });

    // Function to open full feedback form in a new popup
    const openFeedbackFormPopup = (id, name, description, wheelchairAccessible, shelterAvailability) => {
      const feedbackPopupContent = document.createElement("div");

      ReactDOM.render(
        <FeedbackForm
          busStopId={id}
          busStopName={name}
          description={description}
          wheelchairAccessible={wheelchairAccessible}
          shelterAvailability={shelterAvailability}
        />,
        feedbackPopupContent
      );

      new mapboxgl.Popup()
        .setLngLat(map.current.getCenter()) // Set popup in the center or adjust as needed
        .setDOMContent(feedbackPopupContent)
        .addTo(map.current);
    };

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

  // Function to calculate average rating and accessibility information for a bus stop
  const calculateBusStopFeedbackData = async (busStopId) => {
    const feedbackQuery = query(
      collection(db, 'feedbacks'),
      where('busStopId', '==', busStopId)
    );

    const querySnapshot = await getDocs(feedbackQuery);
    const ratings = querySnapshot.docs.map(doc => doc.data().rating);
    const wheelchairResponses = querySnapshot.docs.map(doc => doc.data().wheelchairAccessibleResponse);
    const shelterResponses = querySnapshot.docs.map(doc => doc.data().shelterResponse);

    const averageRating = ratings.length > 0
      ? ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length
      : null;

    const wheelchairYesCount = wheelchairResponses.filter(response => response === true).length;
    const wheelchairNoCount = wheelchairResponses.filter(response => response === false).length;
    const updatedWheelchairStatus = wheelchairYesCount > wheelchairNoCount ? 'Yes' : wheelchairNoCount > wheelchairYesCount ? 'No' : 'Info unavailable';

    const shelterYesCount = shelterResponses.filter(response => response === true).length;
    const shelterNoCount = shelterResponses.filter(response => response === false).length;
    const shelterAvailability = shelterYesCount > shelterNoCount ? 'Yes' : shelterNoCount > shelterYesCount ? 'No' : 'Info unavailable';

    return { averageRating, updatedWheelchairStatus, shelterAvailability };
  };

  return (
    <>
      <div ref={mapContainer} className="map-container" style={{ width: '100%', height: '100vh' }} />
      <BusList buses={stopTimes} stopName={stopName}/>
    </>
  )
  }

export default MapComponent;
