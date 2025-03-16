document.addEventListener('DOMContentLoaded', function() {
    const pickupLocationInput = document.getElementById('pickupLocation');
    const dropLocationInput = document.getElementById('dropLocation');
    const requestRideButton = document.getElementById('requestRide');
    const tripStatus = document.getElementById('tripStatus');
  
    let ws;
  
    function connectWebSocket() {
      ws = new WebSocket('ws://localhost:5000');
  
      ws.onopen = function() {
        ws.send(JSON.stringify({ type: 'register', role: 'user', userId: 'user123' }));
      };
  
      ws.onmessage = function(message) {
        const data = JSON.parse(message.data);
        if (data.type === 'trip_accepted') {
          tripAccepted();
        }
      };
  
      ws.onclose = function() {
        console.log('WebSocket disconnected');
        setTimeout(connectWebSocket, 1000); // Reconnect after 1 second
      };
    }
  
    function tripAccepted() {
      tripStatus.style.display = 'block';
    }
  
    requestRideButton.addEventListener('click', async function() {
      const pickupLocation = pickupLocationInput.value;
      const dropLocation = dropLocationInput.value;
  
      if (!pickupLocation || !dropLocation) {
        alert('Please enter both pickup and drop locations.');
        return;
      }
  
      try {
        const response = await axios.post('http://localhost:5000/api/trip-request', {
          pickupLocation,
          dropLocation,
          userId: 'user123',
        });
        alert('Trip requested successfully!');
      } catch (error) {
        console.error('Error submitting trip', error);
      }
    });
  
    connectWebSocket();
  });