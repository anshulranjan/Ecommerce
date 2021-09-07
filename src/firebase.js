// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyC-luC16FAx2zLf_LIRkaKWYLi08qBcK6s",
  authDomain: "shopme-345db.firebaseapp.com",
  projectId: "shopme-345db",
  storageBucket: "shopme-345db.appspot.com",
  messagingSenderId: "375827820240",
  appId: "1:375827820240:web:1e18e22703672c59efb8d5",
  measurementId: "G-N2EKJWHK3J"
};
// initialize firebase app
const app = initializeApp(firebaseConfig);
 
// export
export const auth = getAuth(app);
 
export const googleAuthProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);