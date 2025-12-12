// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0B7lfx7gGMzrwP4vCYIQ4SHdtCdZAzJI",
  authDomain: "litnessfitness-72cb2.firebaseapp.com",
  projectId: "litnessfitness-72cb2",
  storageBucket: "litnessfitness-72cb2.firebasestorage.app",
  messagingSenderId: "796249477722",
  appId: "1:796249477722:web:d8da7ac7345e4bdeb83e63",
  measurementId: "G-CNRMV6Q1G4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);