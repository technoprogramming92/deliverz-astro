import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCoxc2ryQpb5xek7p0gOv3ohmRwdJU_7_g",
  authDomain: "deliverz-customer-auth-c7a9f.firebaseapp.com",
  projectId: "deliverz-customer-auth-c7a9f",
  storageBucket: "deliverz-customer-auth-c7a9f.firebasestorage.app",
  messagingSenderId: "204754784471",
  appId: "1:204754784471:web:f271bfc690801dd9f76092",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
