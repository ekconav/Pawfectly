import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore"; // Update the import statement
import { getStorage } from 'firebase/storage';
import 'firebase/compat/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIfgf9rujEfHxE3N7oenS710_f1aXlDIk",
  authDomain: "pawfectlyadaptable.firebaseapp.com",
  databaseURL: "https://pawfectlyadaptable-default-rtdb.firebaseio.com",
  projectId: "pawfectlyadaptable",
  storageBucket: "pawfectlyadaptable.appspot.com",
  messagingSenderId: "94574457255",
  appId: "1:94574457255:web:8a4bf920f769e1669f0682",
  measurementId: "G-68TX7PF2KM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };