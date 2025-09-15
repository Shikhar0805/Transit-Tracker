// LocationService.js - Handles geolocation functionality

// Get current position as a promise
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (err) => {
          reject(err);
        },
        { enableHighAccuracy: true }
      );
    }
  });
};

// Watch position and call callback when position changes
export const watchPosition = (callback) => {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by your browser');
  }
  
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      callback({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      });
    },
    (err) => {
      console.error('Error watching position:', err);
    },
    { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
  );
  
  return watchId;
};

// Clear watch position
export const clearWatch = (watchId) => {
  if (watchId && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
};

// Calculate estimated arrival time based on distance between two points
export const calculateEstimatedArrival = (startPosition, endPosition, speed = 30) => {
  // Calculate distance between two points using Haversine formula
  const distance = calculateDistance(startPosition, endPosition);
  
  // Calculate time in hours (distance in km, speed in km/h)
  const timeInHours = distance / speed;
  
  // Return minutes
  return Math.round(timeInHours * 60);
};

// Calculate distance between two points using Haversine formula
export const calculateDistance = (point1, point2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(point2[0] - point1[0]);
  const dLon = toRad(point2[1] - point1[1]);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(point1[0])) * Math.cos(toRad(point2[0])) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance; // Distance in km
};

// Convert degrees to radians
const toRad = (value) => {
  return value * Math.PI / 180;
};

// Store bus location (for demo purposes)
export const storeBusLocation = (busData) => {
  localStorage.setItem('currentBusLocation', JSON.stringify({
    ...busData,
    timestamp: new Date().toISOString()
  }));
};

// Get available buses for a route (for demo purposes)
export const getBusesForRoute = (startPoint, destination, passengerPosition) => {
  const busLocation = localStorage.getItem('currentBusLocation');
  
  if (!busLocation) return [];
  
  const busData = JSON.parse(busLocation);
  const timestamp = new Date(busData.timestamp);
  const now = new Date();
  
  // If the data is older than 2 minutes, consider the bus offline
  if (now - timestamp > 2 * 60 * 1000) return [];
  
  // Check if this bus matches the passenger's route (simplified)
  const matchesRoute = (
    busData.startingPoint.toLowerCase().includes(startPoint.toLowerCase()) ||
    busData.destination.toLowerCase().includes(destination.toLowerCase())
  );
  
  if (!matchesRoute || !busData.position) return [];
  
  // Calculate estimated arrival time based on actual distance
  let estimatedArrivalMinutes = 0;
  let estimatedArrivalTime = null;
  
  if (passengerPosition) {
    // Calculate minutes to arrival based on distance and average speed (30 km/h)
    estimatedArrivalMinutes = calculateEstimatedArrival(busData.position, passengerPosition);
    estimatedArrivalTime = new Date(now.getTime() + estimatedArrivalMinutes * 60000);
  } else {
    // Fallback if passenger position is not available
    estimatedArrivalTime = new Date(now.getTime() + Math.random() * 30 * 60000);
  }
  
  return [{
    id: busData.vehicleName,
    name: busData.vehicleName,
    route: busData.route,
    from: busData.startingPoint,
    to: busData.destination,
    position: busData.position,
    estimatedArrivalMinutes: estimatedArrivalMinutes,
    estimatedArrival: estimatedArrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }];
}