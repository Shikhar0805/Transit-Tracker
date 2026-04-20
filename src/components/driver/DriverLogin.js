import React, { useState } from 'react';
import { cityStops, cityRoutes } from '../../data/cityStops';
import { useNavigate } from 'react-router-dom';
import { initializeSampleDrivers, authenticateDriver } from '../../services/DriverService';
import './DriverLogin.css';

const DriverLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [routeData, setRouteData] = useState({
    city: '',
    startingPoint: '',
    destination: '',
    route: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [driverInfo, setDriverInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCredentialChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
    setError(''); // Clear error when user types
  };

  const handleRouteChange = (e) => {
    const { name, value } = e.target;
    setRouteData({
      ...routeData,
      [name]: value
    });
    // Reset stops and route if city changes
    if (name === 'city') {
      setRouteData({ ...routeData, city: value, startingPoint: '', destination: '', route: '' });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Initialize sample drivers if they don't exist (for demo purposes)
      await initializeSampleDrivers();
      
      // Authenticate driver using the service
      const driverData = await authenticateDriver(credentials.username, credentials.password);
      
      // Authentication successful
      setDriverInfo(driverData);
      setIsAuthenticated(true);
      setError('');
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSubmit = (e) => {
    e.preventDefault();
    
    // Combine driver info with route data
    const completeDriverInfo = {
      ...driverInfo,
      ...routeData,
      vehicleName: driverInfo.vehicleNumber, // Use vehicleNumber as vehicleName for compatibility
      name: driverInfo.driverName
    };
    
    // Store complete driver info in localStorage
    localStorage.setItem('driverInfo', JSON.stringify(completeDriverInfo));
    navigate('/driver/tracking');
  };

  return (
    <div className="driver-login-container">
      <div style={{ position: 'absolute', top: 20, left: 30, fontWeight: 'bold', fontSize: '2rem', color: '#fff', letterSpacing: '2px', zIndex: 100 }}>
        Transit Tracker
      </div>
      <h1 style={{ marginTop: 80 }}>Driver Login</h1>
      
      {!isAuthenticated ? (
        <div className="driver-form-container">
          <form onSubmit={handleLogin}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleCredentialChange}
                required
                placeholder="Enter your username"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleCredentialChange}
                required
                placeholder="Enter your password"
              />
            </div>
            
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="demo-credentials">
            <h3>Demo Credentials:</h3>
            <p><strong>Username:</strong> driver001 | <strong>Password:</strong> password123</p>
            <p><strong>Username:</strong> driver002 | <strong>Password:</strong> secure456</p>
          </div>
        </div>
      ) : (
        <div className="driver-form-container">
          <div className="welcome-message">
            <h2>Welcome, {driverInfo.driverName}!</h2>
            <p><strong>Vehicle:</strong> {driverInfo.vehicleNumber}</p>
            <p>Please select your route details:</p>
          </div>
          
          <form onSubmit={handleRouteSubmit}>
            <div className="form-group">
              <label htmlFor="city">City:</label>
              <select
                id="city"
                name="city"
                value={routeData.city}
                onChange={handleRouteChange}
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
                  <label htmlFor="startingPoint">Starting Point:</label>
                  <select
                    id="startingPoint"
                    name="startingPoint"
                    value={routeData.startingPoint}
                    onChange={handleRouteChange}
                    required
                  >
                    <option value="">Select Source Stop</option>
                    {cityStops[routeData.city].map(stop => (
                      <option key={stop} value={stop}>{stop}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="destination">Destination:</label>
                  <select
                    id="destination"
                    name="destination"
                    value={routeData.destination}
                    onChange={handleRouteChange}
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
            
            {routeData.city && (
              <div className="form-group">
                <label htmlFor="route">Route:</label>
                <select
                  id="route"
                  name="route"
                  value={routeData.route}
                  onChange={handleRouteChange}
                  required
                >
                  <option value="">Select Route</option>
                  {cityRoutes[routeData.city]?.map(route => (
                    <option key={route} value={route}>{route}</option>
                  ))}
                </select>
              </div>
            )}
            
            <button type="submit" className="submit-button">
              Start Sharing Location
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DriverLogin;