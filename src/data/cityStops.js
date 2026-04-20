export const cityStops = {
  bangalore: [
    { name: "Majestic", coords: [12.9776, 77.5726] },        // Bangalore City Bus Stand
    { name: "Silk Board", coords: [12.9181, 77.6233] },      // Silk Board Junction
    { name: "KR Market", coords: [12.964, 77.576] },       // Karnataka State Bus Stand, KR Market
    { name: "Yeshwantpur", coords: [13.0157, 77.5553] },      // Yeshwantpur Railway Station
    { name: "Bellahalli Cross", coords: [13.1013, 77.6349] }, // Bellahalli Cross
    { name: "Bagalur Cross", coords: [13.1220, 77.6106] },    // Bagalur Cross
    { name: "REVA University", coords: [13.1143, 77.6566] }   // REVA University
  ],
  mangalore: [
    { name: "Pumpwell", coords: [12.8858, 74.8418] },        // Mangalore Central Bus Stand
    { name: "State Bank", coords: [12.8630, 74.8372] },      // State Bank of India, Mangalore
    { name: "Kankanady", coords: [12.8687, 74.8578] },       // Kankanady Clock Tower
    { name: "Surathkal", coords: [12.9956, 74.8033] }      // Surathkal
  ]
  // When adding new stops:
  // 1. Open Google Maps (https://maps.google.com)
  // 2. Search for the location/bus stand
  // 3. Right-click on the pin and select "What's here?"
  // 4. Copy the coordinates shown (lat, lng)
  // 5. Add to the list above with format: { name: "Stop Name", coords: [lat, lng] }
};

// Admin-defined routes with start, end, and all stops along the way
export const busRoutes = {
  bangalore: [
    {
      routeId: "1",
      routeName: "Route 1",
      startStop: "Majestic",
      endStop: "Silk Board",
      stops: [
        { name: "Majestic", coords: [12.9776, 77.5726], order: 1 },
        { name: "KR Market", coords: [12.964, 77.576], order: 2 },
        { name: "Silk Board", coords: [12.9181, 77.6233], order: 3 }
      ]
    },
    {
      routeId: "2",
      routeName: "Route 2",
      startStop: "KR Market",
      endStop: "Yeshwantpur",
      stops: [
        { name: "KR Market", coords: [12.964, 77.576], order: 1 },
        { name: "Bellahalli Cross", coords: [13.1013, 77.6349], order: 2 },
        { name: "Yeshwantpur", coords: [13.0157, 77.5553], order: 3 }
      ]
    },
    {
      routeId: "3",
      routeName: "Route 3",
      startStop: "Bagalur Cross",
      endStop: "Bellahalli Cross",
      stops: [
        { name: "Bagalur Cross", coords: [13.1220, 77.6106], order: 1 },
        { name: "Bellahalli Cross", coords: [13.1013, 77.6349], order: 2 }
      ]
    }
  ],
  mangalore: [
    {
      routeId: "23",
      routeName: "Route 23",
      startStop: "Pumpwell",
      endStop: "State Bank",
      stops: [
        { name: "Pumpwell", coords: [12.8858, 74.8418], order: 1 },
        { name: "Kankanady", coords: [12.8687, 74.8578], order: 2 },
        { name: "State Bank", coords: [12.8630, 74.8372], order: 3 }
      ]
    }
  ]
};

// Helper function to get stop coordinates by city and stop name
export const getStopCoordinates = (city, stopName) => {
  const stop = cityStops[city]?.find(s => s.name === stopName);
  return stop?.coords || null;
};

// Helper function to get stop name from coordinates (optional)
export const getStopName = (city, coords) => {
  const stop = cityStops[city]?.find(s => JSON.stringify(s.coords) === JSON.stringify(coords));
  return stop?.name || null;
};

// Helper function to get route by ID
export const getRouteById = (city, routeId) => {
  return busRoutes[city]?.find(route => route.routeId === routeId) || null;
};

// Helper function to get all routes for a city
export const getRoutesByCity = (city) => {
  return busRoutes[city] || [];
};
