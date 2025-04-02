// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXDgnm-taNPUDZNRK1YuHmfUV0Pu7BDPk",
  authDomain: "ezsplit-plus.firebaseapp.com",
  projectId: "ezsplit-plus",
  storageBucket: "ezsplit-plus.firebasestorage.app",
  messagingSenderId: "1082075090740",
  appId: "1:1082075090740:web:cf424da6cac9dd652e5f61",
  measurementId: "G-KEDEKV4RY3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();
