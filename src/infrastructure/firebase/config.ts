import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyBvEfJqaaJtufw0i3ugSzSxM1x905OIS_w",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "birthday-tracker-ae53b.firebaseapp.com",
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || "birthday-tracker-ae53b",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "birthday-tracker-ae53b.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "658083449370",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:658083449370:web:8d21b1e1b4acd28dfcdfa3",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
