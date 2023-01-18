import { initializeApp } from "firebase/app";
import { getAuth,  GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
let username = "";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN ,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID
};
// In order to use firebase authentication functionality firstly we have to register our web to firebase.
// This firebase config is our own data.

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
//console.log("Auth "+ JSON.stringify(auth));

// using this initializeApp() function we intialize to our app.
// For authentication purpose we share our app data to getAuth() funtion.

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
// As we can see here to use firebase firestore functionality we pass our app data to getFirestore() function.

export {username};