import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DriverLogin.css';

const DriverLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicleName: '',
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
      <h1>Driver Login</h1>
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
            <label htmlFor="startingPoint">Starting Point:</label>
            <input
              type="text"
              id="startingPoint"
              name="startingPoint"
              value={formData.startingPoint}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="destination">Destination:</label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>
          
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