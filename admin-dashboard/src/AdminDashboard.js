import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../src/FirebaseConfig'; //  // Import your Firebase configuration


function AdminDashboard() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    // Function to fetch user data from Firestore
    const fetchUserData = async () => {
      try {
        const userCollection = collection(firestore, 'users'); // Reference to the 'users' collection
        const snapshot = await getDocs(userCollection); // Get all documents from the collection
        const userDataList = snapshot.docs.map(doc => doc.data()); // Extract data from each document
        setUserData(userDataList); // Update state with user data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchUserData function
    fetchUserData();

    // Cleanup function (if needed)
    return () => {
      // Cleanup code here
    };
  }, []); // Empty dependency array to ensure useEffect runs only once

  return (
    <div>
    <h1>User Data</h1>
    <ul>
      {userData.map((user, index) => (
        <li key={index}>
          {/* Update with your actual field names */}
          {user.firstName} {user.lastName} - {user.email} - {user.mobileNumber} - {user.address}
        </li>
      ))}
    </ul>
  </div>
);
}

export default AdminDashboard;

