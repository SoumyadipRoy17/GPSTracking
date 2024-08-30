import { useState, useEffect } from "react";
import "./App.css";
import { backendURL } from "./backend/config";

function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState(null);
  const [GPSlatitude, setGPSLatitude] = useState(null);
  const [GPSlongitude, setGPSLongitude] = useState(null);

  const geo = navigator.geolocation;
  const userId = "unique_user_id"; // Replace with dynamic user ID if available

  useEffect(() => {
    geo.getCurrentPosition(userCoords);
    const watchID = geo.watchPosition(userGPSCoords);

    // Update location data every second
    const intervalId = setInterval(() => {
      updateLocationData();
    }, 1000);

    // Clean up watch and interval on component unmount
    return () => {
      geo.clearWatch(watchID);
      clearInterval(intervalId);
    };
  }, [latitude, longitude, GPSlatitude, GPSlongitude, address]); // Run effect when coordinates or address change

  function userCoords(position) {
    let userLatitude = position.coords.latitude;
    let userLongitude = position.coords.longitude;
    setLatitude(userLatitude);
    setLongitude(userLongitude);
    getUserAddress(userLatitude, userLongitude); // Fetch address whenever coordinates change
  }

  function userGPSCoords(position) {
    let userGPSLatitude = position.coords.latitude;
    let userGPSLongitude = position.coords.longitude;
    setGPSLatitude(userGPSLatitude);
    setGPSLongitude(userGPSLongitude);
  }

  const getUserAddress = async (lat, lon) => {
    try {
      let url = `https://api.opencagedata.com/geocode/v1/json?key=05aeca2a313c44608cf1ed5d3e38eb41&q=${lat}%2C${lon}&pretty=1&no_annotations=1`;
      const loc = await fetch(url);
      const data = await loc.json();
      const formattedAddress = data.results[0]?.formatted || "Unknown location";
      setAddress(formattedAddress);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const updateLocationData = async () => {
    try {
      await fetch(backendURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          latitude: latitude,
          longitude: longitude,
          GPSlatitude: GPSlatitude,
          GPSlongitude: GPSlongitude,
          address: address,
        }),
      });
    } catch (error) {
      console.error("Error sending data to server:", error);
    }
  };

  const handleGetUserAddress = () => {
    if (latitude && longitude) {
      getUserAddress(latitude, longitude);
    }
  };

  return (
    <>
      <h1>Current Location</h1>
      <p>Latitude: {latitude}</p>
      <p>Longitude: {longitude}</p>
      <p>User Address: {address}</p>
      <button onClick={handleGetUserAddress}>Get Address</button>
      <hr></hr>
      <h1>GPS Location</h1>
      <p>Latitude: {GPSlatitude}</p>
      <p>Longitude: {GPSlongitude}</p>
    </>
  );
}

export default App;
