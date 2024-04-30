// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOx2B59WIKRa6XULQk0ZCjg9yshXTqpkE",
  authDomain: "invoiceit-c4d60.firebaseapp.com",
  projectId: "invoiceit-c4d60",
  storageBucket: "invoiceit-c4d60.appspot.com",
  messagingSenderId: "69759863027",
  appId: "1:69759863027:web:f3c0751ad59619d71fcf86"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);