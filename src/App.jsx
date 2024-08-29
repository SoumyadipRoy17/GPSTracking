import { useState } from "react";

import "./App.css";

function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState(null);

  const [GPSlatitude, setGPSLatitude] = useState(null);
  const [GPSlongitude, setGPSLongitude] = useState(null);
  //const [error, setError] = useState(null);

  const geo = navigator.geolocation;

  // const getLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(showPosition);
  //   } else {
  //     setError("Geolocation is not supported by this browser.");
  //   }
  // };

  //Get user current location
  // const getLocation = () => {
  //   if (geo) {
  //     geo.getCurrentPosition((position) => {
  //       setLatitude(position.coords.latitude);
  //       setLongitude(position.coords.longitude);
  //     });
  //   } else {
  //     alert("Geolocation is not supported by this browser.");
  //   }
  // };

  //Get user current location
  geo.getCurrentPosition(userCoords);

  function userCoords(position) {
    let userLatitude = position.coords.latitude;
    let userLongitude = position.coords.longitude;
    setLatitude(userLatitude);
    setLongitude(userLongitude);
  }

  const getUserAddress = async () => {
    let url = `https://api.opencagedata.com/geocode/v1/json?key=05aeca2a313c44608cf1ed5d3e38eb41&q=${latitude}%2C${longitude}&pretty=1&no_annotations=1`;
    const loc = await fetch(url);
    const data = await loc.json();
    console.log(data);
    setAddress(data.results[0].formatted);
  };

  //get user gps location in real time
  const watchID = geo.watchPosition(userGPSCoords);

  function userGPSCoords(position) {
    let userGPSLatitude = position.coords.latitude;
    let userGPSLongitude = position.coords.longitude;
    setGPSLatitude(userGPSLatitude);
    setGPSLongitude(userGPSLongitude);
  }

  // const getGPSAddress = async () => {
  //   let url = `https://api.opencagedata.com/geocode/v1/json?key=05aeca2a313c44608cf1ed5d3e38eb41&q=${userGPSLatitude}%2C${userGPSLongitude}&pretty=1&no_annotations=1`;
  //   const loc = await fetch(url);
  //   const data = await loc.json();
  //   console.log(data);
  //   setAddress(data.results[0].formatted);
  //};

  const handleGetUserAddress = () => {
    getUserAddress();
  };

  // const handleGetGPSAddress = () => {
  //   getGPSAddress();
  // };

  const stopGPS = () => {
    geo.clearWatch(watchID);
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
      <button onClick={stopGPS}>Stop GPS</button>
    </>
  );
}

export default App;
