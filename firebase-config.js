// Your web app's Firebase configuration
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
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  window.db = firebase.firestore();
} else {
  console.error('Firebase SDK not found');
}
