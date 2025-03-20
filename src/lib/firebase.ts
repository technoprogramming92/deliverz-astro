import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Load Firebase config from `.env` file
const firebaseConfig = {
  apiKey: "AIzaSyDZsvNCNy3ZuN2qz-OvS_DIR1WZLFkF8nQ",
  authDomain: "deliverz-2.firebaseapp.com",
  projectId: "deliverz-2",
  storageBucket: "deliverz-2.firebasestorage.app",
  messagingSenderId: "788902011307",
  appId: "1:788902011307:web:57d59708ffe69b77db32ee",
};

// ✅ Initialize Firebase App (Singleton)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Export Firebase Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
