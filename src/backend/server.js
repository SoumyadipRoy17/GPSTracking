import express from "express";
import mysql from "mysql2";
import cors from "cors";
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// MySQL connection
const db = mysql.createConnection({
  host: "sql313.infinityfree.com",
  user: "if0_37208788", // Replace with your MySQL username
  password: "IZvkLZWgcS0", // Replace with your MySQL password
  database: "if0_37208788_location_tracker",
});
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root", // Replace with your MySQL username
//   password: "", // Replace with your MySQL password
//   database: "location_tracker",
// });

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: ", err);
    return;
  }
  console.log("Connected to MySQL");
});

// API endpoint to store or update location data with address
app.post("/location", (req, res) => {
  const { user_id, latitude, longitude, GPSlatitude, GPSlongitude, address } =
    req.body;
  const query = `
    INSERT INTO user_locations (user_id, latitude, longitude, gps_latitude, gps_longitude, address)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      latitude = VALUES(latitude),
      longitude = VALUES(longitude),
      gps_latitude = VALUES(gps_latitude),
      gps_longitude = VALUES(gps_longitude),
      address = VALUES(address);
  `;

  db.query(
    query,
    [user_id, latitude, longitude, GPSlatitude, GPSlongitude, address],
    (err, result) => {
      if (err) {
        console.error("Error updating data in MySQL: ", err);
        res.status(500).send("Error updating data");
        return;
      }
      res.status(200).send("Location data updated successfully");
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
