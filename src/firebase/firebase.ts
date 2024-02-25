import { FirebaseApp, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDq8yr-5qIMj36269SkTFsFUvLLZuYRX6Y",
  authDomain: "books-list-21404.firebaseapp.com",
  projectId: "books-list-21404",
  storageBucket: "books-list-21404.appspot.com",
  messagingSenderId: "1077350115042",
  appId: "1:1077350115042:web:b7460295deff47a622e0bb",
  measurementId: "G-3JP7GV4BFP",
};

const app: FirebaseApp = initializeApp(firebaseConfig);
export const realtimeDatabase = getDatabase(app);
