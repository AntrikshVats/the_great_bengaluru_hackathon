require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/ride_booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Trip Schema
const tripRequestSchema = new mongoose.Schema({
  pickupLocation: String,
  dropLocation: String,
  status: { type: String, default: 'pending' },
});
const TripRequest = mongoose.model('TripRequest', tripRequestSchema);

// Store WebSocket connections
let driverSockets = {};
let userSockets = {};

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data);

      if (data.type === 'register') {
        if (data.role === 'driver') {
          driverSockets[data.driverId] = ws;
          console.log(`Driver ${data.driverId} registered`);
        } else if (data.role === 'user') {
          userSockets[data.userId] = ws;
          console.log(`User ${data.userId} registered`);
        }
      } else if (data.type === 'accept_trip') {
        TripRequest.findByIdAndUpdate(data.tripId, { status: 'accepted' }, { new: true })
          .then((trip) => {
            if (trip) {
              console.log(`Trip ${trip._id} accepted by driver ${data.driverId}`);
              // Notify the user that their trip was accepted
              if (userSockets[data.userId]) {
                userSockets[data.userId].send(
                  JSON.stringify({ type: 'trip_accepted', trip })
                );
                console.log(`Notified user ${data.userId} about trip acceptance`);
              } else {
                console.error(`User ${data.userId} not found in userSockets`);
              }
            }
          })
          .catch((err) => console.error('Error accepting trip:', err));
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    // Remove disconnected WebSocket connections
    Object.keys(driverSockets).forEach((key) => {
      if (driverSockets[key] === ws) {
        delete driverSockets[key];
        console.log(`Driver ${key} disconnected`);
      }
    });
    Object.keys(userSockets).forEach((key) => {
      if (userSockets[key] === ws) {
        delete userSockets[key];
        console.log(`User ${key} disconnected`);
      }
    });
  });
});

// API to handle trip requests
app.post('/api/trip-request', async (req, res) => {
  const { pickupLocation, dropLocation, userId } = req.body;

  try {
    const newTrip = new TripRequest({ pickupLocation, dropLocation });
    await newTrip.save();

    console.log(`New trip request created: ${newTrip._id}`);

    const notifyDrivers = (badge, delay) => {
      setTimeout(() => {
        Object.values(driverSockets).forEach((ws) => {
          ws.send(
            JSON.stringify({
              type: 'new_trip',
              trip: newTrip,
              badge: badge,
            })
          );
          console.log(`Notified drivers with badge ${badge} about trip ${newTrip._id}`);
        });
      }, delay);
    };

    notifyDrivers('gold', 0);
    notifyDrivers('silver', 10000);
    notifyDrivers('bronze', 20000);

    res.status(201).json({ message: 'Trip request created!', tripId: newTrip._id });
  } catch (error) {
    console.error('Error creating trip request:', error);
    res.status(500).json({ message: 'Failed to create trip request' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
server.listen(5000, () => {
  console.log(`Server running`);
});