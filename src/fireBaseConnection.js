// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjtZjiaoZzsB3X5wu0WEwT9hjCHytYiUQ",
  authDomain: "sixtdespesasapp.firebaseapp.com",
  projectId: "sixtdespesasapp",
  storageBucket: "sixtdespesasapp.appspot.com",
  messagingSenderId: "272432329600",
  appId: "1:272432329600:web:23fea946d7113760410765",
  measurementId: "G-0MZYJZM034"
};


// Inicialize o Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase inicializado");
  }

console.log("start")
// const analytics = getAnalytics(app);
export default firebase;