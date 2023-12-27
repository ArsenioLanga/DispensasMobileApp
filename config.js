import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage"


const firebaseConfig = {
    apiKey: "AIzaSyAyQ1rgbN12Aqo5KJ2ftVQAZhvE6fUQOgo",
    authDomain: "uploadimagem-a6ad7.firebaseapp.com",
    projectId: "uploadimagem-a6ad7",
    storageBucket: "uploadimagem-a6ad7.appspot.com",
    messagingSenderId: "747358546351",
    appId: "1:747358546351:web:76e1b6d271a7837791a75a",
    measurementId: "G-Z7YY9CXZF3"
}

// const firebaseConfig = {
//     apiKey: "AIzaSyBlHYfHbO966iAXFMCWfPKShSyJf2F_4AY",
//     authDomain: "apptestes-8a498.firebaseapp.com",
//     projectId: "apptestes-8a498",
//     storageBucket: "apptestes-8a498.appspot.com",
//     messagingSenderId: "102881425765",
//     appId: "1:102881425765:web:d3f6ae1583f119fa51898c"
//   };

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export {firebase};