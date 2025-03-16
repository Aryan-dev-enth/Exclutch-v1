// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNlyNOoQvX33KFxCyL6ASUbeqmrMsd-aQ",
  authDomain: "exclutch-12f29.firebaseapp.com",
  projectId: "exclutch-12f29",
  storageBucket: "exclutch-12f29.firebasestorage.app",
  messagingSenderId: "877155195674",
  appId: "1:877155195674:web:401f0697c41050844e2aa3",
  measurementId: "G-6N3EGVLG4J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)