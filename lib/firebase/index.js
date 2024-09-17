// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_xmdF7qF6B1PZqqWp6C7K1mKPlS3Eb0A",
  authDomain: "finance-tracker-1ba2d.firebaseapp.com",
  projectId: "finance-tracker-1ba2d",
  storageBucket: "finance-tracker-1ba2d.appspot.com",
  messagingSenderId: "476289761222",
  appId: "1:476289761222:web:43600cbd2fd159c1dc7cc7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };