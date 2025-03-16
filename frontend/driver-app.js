document.addEventListener('DOMContentLoaded', function () {
    const tripRequestsList = document.getElementById('tripRequests');
    const badgeElement = document.getElementById('badge');
    let ws;
  
    // WebSocket connection
    function connectWebSocket() {
      ws = new WebSocket('ws://localhost:5000');
  
      ws.onopen = function () {
        ws.send(JSON.stringify({ type: 'register', role: 'driver', driverId: 'driver1' }));
      };
  
      ws.onmessage = function (message) {
        const data = JSON.parse(message.data);
        if (data.type === 'new_trip' && data.badge === badgeElement.textContent) {
          addTripRequest(data.trip);
        }
      };
  
      ws.onclose = function () {
        console.log('WebSocket disconnected. Reconnecting...');
        setTimeout(connectWebSocket, 1000); // Reconnect after 1 second
      };
    }
  
    // Add trip request to the list
    function addTripRequest(trip) {
      const li = document.createElement('li');
      li.innerHTML = `
        <p>Pickup: ${trip.pickupLocation}</p>
        <p>Drop: ${trip.dropLocation}</p>
        <button onclick="handleAccept('${trip._id}', 'user123')">Accept</button>
      `;
      tripRequestsList.appendChild(li);
    }
  
    // Handle trip acceptance
    window.handleAccept = function (tripId, userId) {
      const ws = new WebSocket('ws://localhost:5000');
      ws.onopen = function () {
        ws.send(JSON.stringify({ type: 'accept_trip', tripId, userId }));
        alert(`Trip ${tripId} accepted!`);
      };
    };
  
    // Initialize WebSocket connection
    connectWebSocket();
  });