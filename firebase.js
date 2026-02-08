const firebaseConfig = {
  apiKey: "AIzaSyCXJGaB65s--mfTGf64vd5EGzEfUHr8VEw",
  authDomain: "litnessfitness-72cb2.firebaseapp.com",
  projectId: "litnessfitness-72cb2",
  storageBucket: "litnessfitness-72cb2.appspot.com",
  messagingSenderId: "796249477722",
  appId: "1:796249477722:web:d8da7ac7345e4bdeb83e63",
  measurementId: "G-CNRMV6Q1G4"
};

firebase.initializeApp(firebaseConfig);

// Global references
const auth = firebase.auth();
const db = firebase.firestore();

