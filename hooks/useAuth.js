import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/FirebaseConfig'; // Import Firebase modules
import { firestore } from 'firebase/firestore';

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        // User is signed in, get additional user data from Firestore
        const { uid } = firebaseUser;

        // Fetch user document from Firestore
        const userRef = firestore.collection('users').doc(uid);
        const userSnapshot = await userRef.get();

        if (userSnapshot.exists()) {
          // If the user document exists, set user state with user data
          setUser(userSnapshot.data());
        } else {
          // If the user document doesn't exist, set user state to null
          setUser(null);
        }
      } else {
        // User is signed out, set user state to null
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user };
};

export default useAuth;
