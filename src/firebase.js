// firebase.js
// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDT17vf6MwoD1aYZcWa_Gik79WEOQUBKKg",
  authDomain: "bus-tracking-cc4f0.firebaseapp.com",
  databaseURL: "https://bus-tracking-cc4f0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bus-tracking-cc4f0",
  storageBucket: "bus-tracking-cc4f0.appspot.com",
  messagingSenderId: "65366392910",
  appId: "1:65366392910:web:70be98c511c2a536aa431f"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };