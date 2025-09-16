import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './BusList.css';
import { getCurrentPosition } from '../../services/LocationService';
import { db } from '../../firebase';
import { ref, onValue } from 'firebase/database';

// Custom icons for bus and passenger
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const passengerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1077/1077063.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

// Fix for Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const BusList = () => {
  const navigate = useNavigate();
  const [passengerRoute, setPassengerRoute] = useState(null);
  const [buses, setBuses] = useState([]);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default center
  const [selectedBus, setSelectedBus] = useState(null);
  const [passengerPosition, setPassengerPosition] = useState(null);
  const [routePath, setRoutePath] = useState([]);

  useEffect(() => {
    // Get passenger route from localStorage
    const storedRoute = localStorage.getItem('passengerRoute');
    if (!storedRoute) {
      navigate('/passenger');
      return;
    }
    
    setPassengerRoute(JSON.parse(storedRoute));
    
    // Get passenger's current position
    getCurrentPosition()
      .then(position => {
        setPassengerPosition([position.lat, position.lng]);
      })
      .catch(err => {
        console.error('Error getting passenger position:', err);
      });
    
    // Fetch buses from Firebase
    const busesRef = ref(db, 'buses');
    const unsubscribe = onValue(busesRef, (snapshot) => {
      const busesData = snapshot.val() || {};
      const busList = Object.values(busesData).filter(bus => {
        return (
          bus.startingPoint.toLowerCase().includes(passengerRoute?.startingPoint.toLowerCase()) ||
          bus.destination.toLowerCase().includes(passengerRoute?.destination.toLowerCase())
        );
      });
      // Calculate ETA for each bus
      if (passengerPosition) {
        import('../../services/LocationService').then(({ calculateEstimatedArrival }) => {
          const updatedBusList = busList.map(bus => {
            const estimatedArrivalMinutes = calculateEstimatedArrival(bus.position, passengerPosition);
            const estimatedArrival = new Date(Date.now() + estimatedArrivalMinutes * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return {
              ...bus,
              estimatedArrival,
              estimatedArrivalMinutes
            };
          });
          setBuses(updatedBusList);
          if (updatedBusList.length > 0) {
            setMapCenter(updatedBusList[0].position);
            setRoutePath([updatedBusList[0].position, passengerPosition]);
          }
        });
      } else {
        setBuses(busList);
        if (busList.length > 0) {
          setMapCenter(busList[0].position);
        }
      }
    });
    return () => unsubscribe();
  }, [navigate, passengerRoute, passengerPosition]);

  const handleBusSelect = (bus) => {
    setSelectedBus(bus);
    setMapCenter(bus.position);
  };

  const handleBack = () => {
    localStorage.removeItem('passengerRoute');
    navigate('/passenger');
  };

  if (!passengerRoute) {
    return (
      <div className="loading-container">
        <div style={{ position: 'absolute', top: 20, left: 30, fontWeight: 'bold', fontSize: '2rem', color: '#1976d2', letterSpacing: '2px', zIndex: 100 }}>
          Transit Tracker
        </div>
        <h2 style={{ marginTop: 80 }}>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="bus-list-container">
      <div style={{ position: 'absolute', top: 20, left: 30, fontWeight: 'bold', fontSize: '2rem', color: '#1976d2', letterSpacing: '2px', zIndex: 100 }}>
        Transit Tracker
      </div>
      <div className="route-info-panel" style={{ marginTop: 80 }}>
        <h1>Available Buses</h1>
        <div className="route-details">
          <p><strong>From:</strong> {passengerRoute.startingPoint}</p>
          <p><strong>To:</strong> {passengerRoute.destination}</p>
        </div>
        
        <div className="bus-list">
          {buses.length > 0 ? (
            buses.map(bus => (
              <div 
                key={bus.id} 
                className={`bus-item ${selectedBus?.id === bus.id ? 'selected' : ''}`}
                onClick={() => handleBusSelect(bus)}
              >
                <div className="bus-details">
                  <h3>{bus.name}</h3>
                  <p><strong>Route:</strong> {bus.route}</p>
                  <p className="arrival-time">
                    <strong>Estimated Arrival:</strong> {bus.estimatedArrival}
                  </p>
                  {bus.estimatedArrivalMinutes > 0 && (
                    <p className="eta-minutes">
                      <strong>ETA:</strong> {bus.estimatedArrivalMinutes} minutes
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-buses">
              <p>No buses available for your route at the moment.</p>
              <p>Please check back later or try a different route.</p>
            </div>
          )}
        </div>
        
        <button className="back-button" onClick={handleBack}>
          Change Route
        </button>
      </div>

      <div className="map-container">
        <MapContainer 
          center={mapCenter} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
          key={`${mapCenter[0]}-${mapCenter[1]}`} // Force re-render when center changes
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Route path between bus and passenger */}
          {routePath.length === 2 && (
            <Polyline 
              positions={routePath}
              pathOptions={{ color: 'blue', dashArray: '10, 10' }}
            />
          )}
          
          {/* Bus markers */}
          {buses.map(bus => (
            <React.Fragment key={bus.id}>
              <Marker position={bus.position} icon={busIcon}>
                <Popup>
                  <div className="bus-popup">
                    <h3>{bus.name}</h3>
                    <p><strong>Route:</strong> {bus.route}</p>
                    <p><strong>From:</strong> {bus.from}</p>
                    <p><strong>To:</strong> {bus.to}</p>
                    <p><strong>Estimated Arrival:</strong> {bus.estimatedArrival}</p>
                    {bus.estimatedArrivalMinutes > 0 && (
                      <p><strong>ETA:</strong> {bus.estimatedArrivalMinutes} minutes</p>
                    )}
                  </div>
                </Popup>
              </Marker>
              
              {/* Bus location accuracy circle */}
              <Circle 
                center={bus.position}
                radius={50} // 50 meters radius
                pathOptions={{ color: '#3388ff', fillColor: '#3388ff', fillOpacity: 0.1 }}
              />
            </React.Fragment>
          ))}
          
          {/* Passenger location marker */}
          {passengerPosition && (
            <React.Fragment>
              <Marker position={passengerPosition} icon={passengerIcon}>
                <Popup>
                  <div className="passenger-popup">
                    <h3>Your Location</h3>
                    <p>Waiting for bus</p>
                    {buses.length > 0 && buses[0].estimatedArrivalMinutes > 0 && (
                      <p><strong>Bus arrives in:</strong> {buses[0].estimatedArrivalMinutes} minutes</p>
                    )}
                  </div>
                </Popup>
              </Marker>
              
              {/* Passenger location accuracy circle */}
              <Circle 
                center={passengerPosition}
                radius={30} // 30 meters radius
                pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.1 }}
              />
            </React.Fragment>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default BusList;