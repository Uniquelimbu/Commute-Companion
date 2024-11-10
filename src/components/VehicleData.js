import React, { useEffect, useState } from 'react';

const VehicleData = ({ routeShortName }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicleData = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://api.transittracker.ca/v2/agencies/miway/vehicles");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data.data)
        // Filter vehicles based on the specified route short name
        const filteredVehicles = data.data.filter(
          (vehicle) => vehicle.trip.routeShortName == routeShortName
        );
        console.log(filteredVehicles)
        setVehicles(filteredVehicles);
      } catch (err) {
        console.error("Failed to fetch vehicle data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, [routeShortName]);

  if (loading) return <p>Loading vehicle data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>

    <div>
      <h2>Vehicles on Route: {routeShortName}</h2>
        <ul>
          {vehicles.map((vehicle) => (
            <li key={vehicle.id} style={{borderBottom: "4px solid black"}}>
              <p><strong>Vehicle ID:</strong> {vehicle.id}</p>
              <p><strong>Label:</strong> {vehicle.label}</p>
              <p><strong>Position:</strong> {vehicle.position.lat}, {vehicle.position.lon}</p>
              <p><strong>Speed:</strong> {vehicle.speed} km/h</p>
              <p><strong>Status:</strong> {vehicle.currentStatus.label}</p>
              <p><strong>Occupancy:</strong> {vehicle.occupancyStatus.label}</p>
              <p><strong>Route Headsign:</strong> {vehicle.trip.headsign}</p>
              <p><strong>Last Updated:</strong> {new Date(vehicle.timestamp * 1000).toLocaleTimeString()}</p>
            </li>
          ))}
        </ul>
        <p>No vehicles currently active on this route.</p>
    </div>
    </>
  );
};

export default VehicleData;