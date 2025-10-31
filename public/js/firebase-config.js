// Firebase Configuration
// IMPORTANT: Replace these values with your own Firebase project credentials
// Get these from: Firebase Console > Project Settings > General > Your apps > Web app

const firebaseConfig = {
  apiKey: "AIzaSyBYivAN0bwc_05464rxmmBpeKFstVLYLcY",
  authDomain: "trolldeg.firebaseapp.com",
  databaseURL: "https://trolldeg-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "trolldeg",
  storageBucket: "trolldeg.firebasestorage.app",
  messagingSenderId: "465953155417",
  appId: "1:465953155417:web:97cfa5367850d465990448",
  measurementId: "G-VB9VKP9BFP"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();
const gameStateRef = database.ref('gameState');
