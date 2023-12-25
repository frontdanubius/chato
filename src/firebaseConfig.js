// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7kcIG3FSJihH97GZP_EWOIBJ3eVBr7PY",
  authDomain: "alto-f90d5.firebaseapp.com",
  databaseURL: "https://alto-f90d5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "alto-f90d5",
  storageBucket: "alto-f90d5.appspot.com",
  messagingSenderId: "649907371805",
  appId: "1:649907371805:web:b24ab4693f0163d66dabf4",
  measurementId: "G-SN85R1Q872"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);