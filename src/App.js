import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import components
import LandingPage from './components/landing/LandingPage';
import DriverLogin from './components/driver/DriverLogin';
import DriverTracking from './components/driver/DriverTracking';
import PassengerRoute from './components/passenger/PassengerRoute';
import BusList from './components/passenger/BusList';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/driver" element={<DriverLogin />} />
          <Route path="/driver/tracking" element={<DriverTracking />} />
          <Route path="/passenger" element={<PassengerRoute />} />
          <Route path="/passenger/buses" element={<BusList />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
