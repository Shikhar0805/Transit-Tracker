// Geocoding service using Nominatim (OpenStreetMap) - Free and no API key required
export const geocodeAddress = async (address, city = '') => {
  try {
    // Try with city first
    let response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}, ${city}&limit=5`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TransitTracker'
        }
      }
    );

    let data = await response.json();

    // If no results with city, try without city
    if (data.length === 0 && city) {
      response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'TransitTracker'
          }
        }
      );
      data = await response.json();
    }

    if (data.length === 0) {
      throw new Error(`No location found for "${address}"`);
    }

    const result = data[0];
    
    return {
      name: result.name || address,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      fullAddress: result.display_name
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error(`Failed to geocode address: ${error.message}`);
  }
};

// Reverse geocoding - get address from coordinates
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }

    const data = await response.json();
    return data.address?.road || data.address?.village || data.display_name || 'Unknown Location';
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return 'Unknown Location';
  }
};
