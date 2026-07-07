// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiOVNenp4GUOcI2NKCAxMxWrgzaZod-fo",
  authDomain: "traindekho-web.firebaseapp.com",
  projectId: "traindekho-web",
  storageBucket: "traindekho-web.firebasestorage.app",
  messagingSenderId: "68120749814",
  appId: "1:68120749814:web:1fb87c224ad29501e9eed7",
  measurementId: "G-8DMJNP3SCY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics, app };
