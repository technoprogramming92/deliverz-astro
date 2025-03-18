import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCoxc2ryQpb5xek7p0gOv3ohmRwdJU_7_g",
  authDomain: "deliverz-customer-auth-c7a9f.firebaseapp.com",
  projectId: "deliverz-customer-auth-c7a9f",
  storageBucket: "deliverz-customer-auth-c7a9f.firebasestorage.app",
  messagingSenderId: "204754784471",
  appId: "1:204754784471:web:f271bfc690801dd9f76092",
};

const productsFirebaseConfig = {
  apiKey: "AIzaSyDyewXNSUQSTrQhQTlTwPj1J6Wx47-ylEM",
  authDomain: "deliverz-auth.firebaseapp.com",
  projectId: "deliverz-auth",
  storageBucket: "deliverz-auth.firebasestorage.app",
  messagingSenderId: "136913221848",
  appId: "1:136913221848:web:cac322f4e4266108057fad",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const productsApp =
  getApps().find((app) => app.name === "productsApp") ||
  initializeApp(productsFirebaseConfig, "productsApp");
export const db2 = getFirestore(productsApp);

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("🔥 Firebase auth persistence enabled!");
  })
  .catch((error) => {
    console.error("Error enabling auth persistence:", error);
  });
