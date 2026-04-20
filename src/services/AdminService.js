// Firebase service for admin credentials management
import { ref, set, get } from 'firebase/database';
import { db } from '../firebase';

// Sample admin credentials for different companies/organizations
const sampleAdminCredentials = {
  "admin001": {
    username: "admin001",
    password: "admin@123", // In production, this should be hashed
    adminName: "Bangalore Transit Admin",
    company: "City Transportation Ltd",
    email: "admin@bangalore-transit.com",
    phoneNumber: "+91-9876543220",
    cities: ["bangalore"],
    isActive: true,
    createdAt: "2025-09-26T00:00:00Z",
    updatedAt: "2025-09-26T00:00:00Z"
  },
  
  "admin002": {
    username: "admin002",
    password: "admin@456", // In production, this should be hashed
    adminName: "Mangalore Transit Admin",
    company: "Coastal Bus Services",
    email: "admin@mangalore-transit.com",
    phoneNumber: "+91-9876543221",
    cities: ["mangalore"],
    isActive: true,
    createdAt: "2025-09-26T00:00:00Z",
    updatedAt: "2025-09-26T00:00:00Z"
  },

  "admin003": {
    username: "admin003",
    password: "admin@789", // In production, this should be hashed
    adminName: "Multi-City Admin",
    company: "National Transit Corp",
    email: "admin@national-transit.com",
    phoneNumber: "+91-9876543222",
    cities: ["bangalore", "mangalore"],
    isActive: true,
    createdAt: "2025-09-26T00:00:00Z",
    updatedAt: "2025-09-26T00:00:00Z"
  }
};

// Function to initialize sample admin data in Firebase (one-time setup)
export const initializeSampleAdmins = async () => {
  try {
    // Check if admins already exist
    const adminsRef = ref(db, 'adminCredentials');
    const snapshot = await get(adminsRef);
    
    if (!snapshot.exists()) {
      // Add sample admins if none exist
      for (const [username, adminData] of Object.entries(sampleAdminCredentials)) {
        await set(ref(db, `adminCredentials/${username}`), adminData);
      }
      console.log('Sample admin credentials initialized in Firebase');
      return true;
    } else {
      console.log('Admin credentials already exist in Firebase');
      return false;
    }
  } catch (error) {
    console.error('Error initializing sample admins:', error);
    throw error;
  }
};

// Function to authenticate admin
export const authenticateAdmin = async (username, password) => {
  try {
    const adminRef = ref(db, `adminCredentials/${username}`);
    const snapshot = await get(adminRef);
    
    if (snapshot.exists()) {
      const adminData = snapshot.val();
      
      // Check if admin is active
      if (!adminData.isActive) {
        throw new Error('Account is inactive. Please contact your administrator.');
      }
      
      // Check password (in production, use proper password hashing)
      if (adminData.password !== password) {
        throw new Error('Invalid username or password.');
      }
      
      // Return admin data without password
      const { password: _, ...adminInfo } = adminData;
      return adminInfo;
    } else {
      throw new Error('Invalid username or password.');
    }
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};
