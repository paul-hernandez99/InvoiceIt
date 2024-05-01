// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5WjUD9gB35DYdAzeguz4Y2THmZl0z2D8",
  authDomain: "testinghci-63c17.firebaseapp.com",
  projectId: "testinghci-63c17",
  storageBucket: "testinghci-63c17.appspot.com",
  messagingSenderId: "162465841968",
  appId: "1:162465841968:web:364c9b0ebcc9e26bdffef5"
};


// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);