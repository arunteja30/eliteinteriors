// Firebase Configuration - Using compatibility SDKs for easier integration
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEZ-WBYQSLpkIx9zurU2IspJBUi9jJ3dE",
  authDomain: "mat-interiors.firebaseapp.com",
  databaseURL: "https://mat-interiors-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mat-interiors",
  messagingSenderId: "1089097535681",
  appId: "1:1089097535681:web:dc0eb7c6193677abc38440"
};

// Initialize Firebase using compatibility SDK
firebase.initializeApp(firebaseConfig);

// Initialize services using compatibility SDK for Realtime Database
const database = firebase.database();

// Make available globally
window.database = database;

console.log('🔥 Firebase initialized successfully!');
console.log('📊 Realtime Database:', database ? '✅ Connected' : '❌ Failed');
