import React, { useState } from 'react';
import { cityStops } from '../../data/cityStops';
import { useNavigate } from 'react-router-dom';
import './PassengerRoute.css';

const PassengerRoute = () => {
  const navigate = useNavigate();
  const [routeData, setRouteData] = useState({
    city: '',
    startingPoint: '',
    destination: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRouteData({
      ...routeData,
      [name]: value
    });
    // Reset stops if city changes
    if (name === 'city') {
      setRouteData({ city: value, startingPoint: '', destination: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  // Store route info in localStorage
  localStorage.setItem('passengerRoute', JSON.stringify(routeData));
  navigate('/passenger/buses');
  };

  return (
    <div className="passenger-route-container">
      <div style={{ position: 'absolute', top: 20, left: 30, fontWeight: 'bold', fontSize: '2rem', color: '#fff', letterSpacing: '2px', zIndex: 100 }}>
        Transit Tracker
      </div>
  <h1 style={{ marginTop: 80, color: '#fff' }}>Find Your Bus</h1>
      <div className="route-form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="city">City:</label>
            <select
              id="city"
              name="city"
              value={routeData.city}
              onChange={handleChange}
              required
            >
              <option value="">Select City</option>
              {Object.keys(cityStops).map(city => (
                <option key={city} value={city}>{city.charAt(0).toUpperCase() + city.slice(1)}</option>
              ))}
            </select>
          </div>
          {routeData.city && (
            <>
              <div className="form-group">
                <label htmlFor="startingPoint">From:</label>
                <select
                  id="startingPoint"
                  name="startingPoint"
                  value={routeData.startingPoint}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Source Stop</option>
                  {cityStops[routeData.city].map(stop => (
                    <option key={stop} value={stop}>{stop}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="destination">To:</label>
                <select
                  id="destination"
                  name="destination"
                  value={routeData.destination}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Destination Stop</option>
                  {cityStops[routeData.city].map(stop => (
                    <option key={stop} value={stop}>{stop}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          <button type="submit" className="search-button">
            Find Buses
          </button>
        </form>
      </div>
    </div>
  );
};

export default PassengerRoute;