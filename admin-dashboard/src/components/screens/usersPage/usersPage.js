import React, { useState, useEffect } from "react";
import Header from "../../header/header";
import styles from "./styles";
import { db, auth } from "../../../FirebaseConfig";
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

import LoadingSpinner from "../loadingPage/loadingSpinner";

// Number of items per page


const UsersPage = () => {
  const itemsPerPage = 5; 
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculate the total number of pages and current items
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedUsers.slice(startIndex, startIndex + itemsPerPage);

   // Function to change page
  const changePage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  }


  useEffect(() => {
    // Define the function to handle real-time updates
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        // Convert snapshot to array of users
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching users: ", error);
        setLoading(false);
      }
    );

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      const sortedList = [...users].sort((a, b) => {
        const lastNameA = a.lastName.toLowerCase();
        const lastNameB = b.lastName.toLowerCase();
        if (lastNameA < lastNameB) return -1;
        if (lastNameA > lastNameB) return 1;
        return 0;
      });
      setSortedUsers(sortedList);
    }
  }, [users]);

  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  const getVerificationStatus = (isVerified) => {
    return isVerified ? 'Verified' : 'Not Verified';
  };

  const getStatusColor = (isVerified) => {
    return isVerified ? 'green' : 'red';
  };



  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Header />
      <h1>Users Page</h1>
      <div style={styles.container}>
      <div style={styles.userListContainer}>
        <div style={styles.userDetails}>
          <div style={styles.line}>
            <p style={styles.title}>Image</p>
          </div>
          <div style={styles.line}>
            <p style={styles.title}>Name</p>
          </div>
          <div style={styles.line}>
            <p style={styles.title}>Status</p>
          </div>
          
          {currentItems.map((users) => (
            <React.Fragment key={users.id}>
              <div style={styles.line}>
                <img
                  src={
                    users.accountPicture || require("../../../const/user.png")
                  }
                  alt="Profile"
                  style={styles.userPicture}
                />
              </div>
              <div style={styles.line}>
                <p>
                  {users.lastName} , {users.firstName} 
                </p>
              </div>
              <div style={styles.line}>
                <p style={{ color: getStatusColor(users.verified) }}>
                  {getVerificationStatus(users.verified)}
                </p>
              </div>

            </React.Fragment>
          ))}
        </div>
        
      </div>
      <div style={styles.userInfoContainer}>
      </div>
      </div>

    {/* Pagination */}
      <div style={styles.pagination}>
        <span>{currentPage} / {totalPages}</span>
        <button
            style={{
              ...styles.paginationButton,
              ...(isPreviousDisabled ? styles.disabledButton : {}),
            }}
            onClick={() => changePage(currentPage - 1)}
            disabled={isPreviousDisabled}
          >
            Previous
          </button>
          <button
            style={{
              ...styles.paginationButton,
              ...(isNextDisabled ? styles.disabledButton : {}),
            }}
            onClick={() => changePage(currentPage + 1)}
            disabled={isNextDisabled}
          >
            Next
          </button>
      </div>

    </div>
  );
};

export default UsersPage;
