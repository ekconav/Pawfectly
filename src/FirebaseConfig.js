import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCIfgf9rujEfHxE3N7oenS710_f1aXlDIk",
  authDomain: "pawfectlyadaptable.firebaseapp.com",
  databaseURL: "https://pawfectlyadaptable-default-rtdb.firebaseio.com",
  projectId: "pawfectlyadaptable",
  storageBucket: "pawfectlyadaptable.appspot.com",
  messagingSenderId: "94574457255",
  appId: "1:94574457255:web:8a4bf920f769e1669f0682",
  measurementId: "G-68TX7PF2KM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  if (error.code === "auth/already-initialized") {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
