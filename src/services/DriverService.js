// Firebase service for driver credentials management
import { ref, set, get, child } from 'firebase/database';
import { db } from '../firebase';

// Sample driver credentials that would be added by institution/company admin
const sampleDriverCredentials = {
  "driver001": {
    username: "driver001",
    password: "password123", // In production, this should be hashed
    vehicleNumber: "KA-01-HH-1234",
    driverName: "John Doe",
    phoneNumber: "+91-9876543210",
    licenseNumber: "KA1234567890",
    isActive: true,
    assignedRoutes: ["Route 42", "Route 15"],
    createdAt: "2025-09-26T00:00:00Z",
    updatedAt: "2025-09-26T00:00:00Z"
  },
  
  "driver002": {
    username: "driver002",
    password: "secure456", // In production, this should be hashed
    vehicleNumber: "KA-02-AB-5678",
    driverName: "Jane Smith",
    phoneNumber: "+91-9876543211",
    licenseNumber: "KA0987654321",
    isActive: true,
    assignedRoutes: ["Route 23", "Route 67"],
    createdAt: "2025-09-26T00:00:00Z",
    updatedAt: "2025-09-26T00:00:00Z"
  },
  
  "driver003": {
    username: "driver003",
    password: "test789", // In production, this should be hashed
    vehicleNumber: "MH-12-CD-9012",
    driverName: "Mike Johnson",
    phoneNumber: "+91-9876543212",
    licenseNumber: "MH1122334455",
    isActive: false, // Inactive driver
    assignedRoutes: ["Route 88"],
    createdAt: "2025-09-26T00:00:00Z",
    updatedAt: "2025-09-26T00:00:00Z"
  }
};

// Function to initialize sample driver data in Firebase (one-time setup)
export const initializeSampleDrivers = async () => {
  try {
    // Check if drivers already exist
    const driversRef = ref(db, 'driverCredentials');
    const snapshot = await get(driversRef);
    
    if (!snapshot.exists()) {
      // Add sample drivers if none exist
      for (const [username, driverData] of Object.entries(sampleDriverCredentials)) {
        await set(ref(db, `driverCredentials/${username}`), driverData);
      }
      console.log('Sample driver credentials initialized in Firebase');
      return true;
    } else {
      console.log('Driver credentials already exist in Firebase');
      return false;
    }
  } catch (error) {
    console.error('Error initializing sample drivers:', error);
    throw error;
  }
};

// Function to authenticate driver
export const authenticateDriver = async (username, password) => {
  try {
    const driverRef = ref(db, `driverCredentials/${username}`);
    const snapshot = await get(driverRef);
    
    if (snapshot.exists()) {
      const driverData = snapshot.val();
      
      // Check if driver is active
      if (!driverData.isActive) {
        throw new Error('Account is inactive. Please contact your administrator.');
      }
      
      // Check password (in production, use proper password hashing)
      if (driverData.password !== password) {
        throw new Error('Invalid username or password.');
      }
      
      // Return driver data without password
      const { password: _, ...driverInfo } = driverData;
      return driverInfo;
    } else {
      throw new Error('Invalid username or password.');
    }
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

// Function to add a new driver (for admin use)
export const addDriver = async (driverData) => {
  try {
    const driverRef = ref(db, `driverCredentials/${driverData.username}`);
    const newDriver = {
      ...driverData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await set(driverRef, newDriver);
    console.log('Driver added successfully');
    return true;
  } catch (error) {
    console.error('Error adding driver:', error);
    throw error;
  }
};

// Function to update driver status (for admin use)
export const updateDriverStatus = async (username, isActive) => {
  try {
    const driverRef = ref(db, `driverCredentials/${username}`);
    const snapshot = await get(driverRef);
    
    if (snapshot.exists()) {
      const driverData = snapshot.val();
      const updatedDriver = {
        ...driverData,
        isActive,
        updatedAt: new Date().toISOString()
      };
      
      await set(driverRef, updatedDriver);
      console.log('Driver status updated successfully');
      return true;
    } else {
      throw new Error('Driver not found');
    }
  } catch (error) {
    console.error('Error updating driver status:', error);
    throw error;
  }
};

// Function to get all drivers (for admin use)
export const getAllDrivers = async () => {
  try {
    const driversRef = ref(db, 'driverCredentials');
    const snapshot = await get(driversRef);
    
    if (snapshot.exists()) {
      const driversData = snapshot.val();
      // Remove passwords from the response
      const sanitizedDrivers = {};
      Object.keys(driversData).forEach(username => {
        const { password, ...driverInfo } = driversData[username];
        sanitizedDrivers[username] = driverInfo;
      });
      return sanitizedDrivers;
    } else {
      return {};
    }
  } catch (error) {
    console.error('Error getting drivers:', error);
    throw error;
  }
};