// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPReGKGp55KYmcKXkfvsJyNi22Cfmaavw",
  authDomain: "retail-dashboard-68692.firebaseapp.com",
  databaseURL: "https://retail-dashboard-68692-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "retail-dashboard-68692",
  storageBucket: "retail-dashboard-68692.firebasestorage.app",
  messagingSenderId: "996962698366",
  appId: "1:996962698366:web:367456eea63eccd940842f",
  measurementId: "G-KTRWYF9NBG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);