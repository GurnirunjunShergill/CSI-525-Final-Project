// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth, } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyAVDnHO9ChusMTFTEqRWiKmPIUmvDn5X28",

  authDomain: "budge-it-a9209.firebaseapp.com",

  projectId: "budge-it-a9209",

  storageBucket: "budge-it-a9209.firebasestorage.app",

  messagingSenderId: "1047265561834",

  appId: "1:1047265561834:web:f6462fa75763062c7c1b93",

  measurementId: "G-L6DMKGGWVE",
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);