import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleUserTypeSelection = (userType) => {
    if (userType === 'driver') {
      navigate('/driver');
    } else {
      navigate('/passenger');
    }
  };

  return (
    <div className="landing-container">
      <h1>Bus Tracking System</h1>
      <div className="user-selection">
        <h2>I am a:</h2>
        <div className="button-container">
          <button 
            className="user-type-button driver-button"
            onClick={() => handleUserTypeSelection('driver')}
          >
            Driver
          </button>
          <button 
            className="user-type-button passenger-button"
            onClick={() => handleUserTypeSelection('passenger')}
          >
            Passenger
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;