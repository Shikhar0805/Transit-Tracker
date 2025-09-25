import React, { useState } from 'react';
import { cityStops } from '../../data/cityStops';
import { useNavigate } from 'react-router-dom';
import './DriverLogin.css';

const DriverLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicleName: '',
    city: '',
    startingPoint: '',
    destination: '',
    route: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Reset stops if city changes
    if (name === 'city') {
      setFormData({ ...formData, city: value, startingPoint: '', destination: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store driver info in localStorage for demo purposes
    // In a real app, this would be sent to a backend server
    localStorage.setItem('driverInfo', JSON.stringify(formData));
    navigate('/driver/tracking');
  };

  return (
    <div className="driver-login-container">
      <div style={{ position: 'absolute', top: 20, left: 30, fontWeight: 'bold', fontSize: '2rem', color: '#fff', letterSpacing: '2px', zIndex: 100 }}>
        Transit Tracker
      </div>
      <h1 style={{ marginTop: 80 }}>Driver Login</h1>
      <div className="driver-form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="vehicleName">Vehicle Name/Number:</label>
            <input
              type="text"
              id="vehicleName"
              name="vehicleName"
              value={formData.vehicleName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City:</label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            >
              <option value="">Select City</option>
              {Object.keys(cityStops).map(city => (
                <option key={city} value={city}>{city.charAt(0).toUpperCase() + city.slice(1)}</option>
              ))}
            </select>
          </div>
          {formData.city && (
            <>
              <div className="form-group">
                <label htmlFor="startingPoint">Starting Point:</label>
                <select
                  id="startingPoint"
                  name="startingPoint"
                  value={formData.startingPoint}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Source Stop</option>
                  {cityStops[formData.city].map(stop => (
                    <option key={stop} value={stop}>{stop}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="destination">Destination:</label>
                <select
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Destination Stop</option>
                  {cityStops[formData.city].map(stop => (
                    <option key={stop} value={stop}>{stop}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="form-group">
            <label htmlFor="route">Route:</label>
            <input
              type="text"
              id="route"
              name="route"
              value={formData.route}
              onChange={handleChange}
              required
              placeholder="e.g. Route 42"
            />
          </div>
          <button type="submit" className="submit-button">
            Start Sharing Location
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverLogin;