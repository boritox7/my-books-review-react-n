import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRk3c9wq5lJjwfvaoGY-Ktzy2KO6cWJWI",
  authDomain: "books-review-f8a75.firebaseapp.com",
  projectId: "books-review-f8a75",
  storageBucket: "books-review-f8a75.firebasestorage.app",
  messagingSenderId: "873894266516",
  appId: "1:873894266516:web:6ddbd90c77d1a7e91d5681",
  measurementId: "G-ZREKWJ9M5B"
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
  export const db = getFirestore(app);