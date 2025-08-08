import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { getDatabase, ref, set, get, onValue, push, update, remove } from "firebase/database";

// Hardcoded Firebase configuration for your project
const firebaseConfig = {
  apiKey: "AIzaSyCEtbJ-KR_UV9LAlYlnvgoxliRs5FkSdXk",
  appId: "1:987543051729:web:c258be8a9deaa79a52d4f0",
  authDomain: "kicked-in-the-disc.firebaseapp.com",
  databaseURL: "https://kicked-in-the-disc-default-rtdb.firebaseio.com",
  messagingSenderId: "987543051729",
  projectId: "kicked-in-the-disc",
  storageBucket: "kicked-in-the-disc.firebasestorage.app"
};

console.log('Initializing Firebase with config:', firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);

// Export Firebase functions
export { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  ref,
  set,
  get,
  onValue,
  push,
  update,
  remove
};
