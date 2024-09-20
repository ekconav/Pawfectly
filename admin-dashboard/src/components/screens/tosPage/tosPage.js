import React, { useState, useEffect } from "react";
import Header from "../../header/header";
import styles from "./styles";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../../FirebaseConfig"; 
import LoadingSpinner from "../loadingPage/loadingSpinner";


const TOSPage = () => {

  const [tosData, setTosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage =4;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    
    const q = query(collection(db, "TOS"), orderBy("order"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tosList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTosData(tosList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching TOS data: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  // Pagination
  // Calculate the total number of pages and current items
  const totalPages = Math.ceil(tosData.length / itemsPerPage);
  console.log("Total Pages: ", totalPages); 
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = tosData.slice(startIndex, startIndex + itemsPerPage);
  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  // Function to change page
  const changePage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };





  if (loading) {
    return <LoadingSpinner />;
  }



  return (
    <div>
      <Header />
      <h1>Terms Of Service</h1>
      {/* TOS LIST */}
      <div style={styles.TOScontainer}>
        <div style={styles.TOSgridCols}>
          {currentItems.map((TOSitem) => (
            <div key={TOSitem.id} style={styles.TOSgridRows}>
              <div style={styles.line}>{TOSitem.order}</div>
              <div
                style={{
                  ...styles.line,
                  justifyContent: "flex-start",
                  textAlign: "left",
                  paddingLeft: "10px",
                }}
              >
                {TOSitem.title}
              </div>
              <div
                style={{
                  ...styles.line,
                  textAlign: "justify",
                  fontSize: "14px",
                }}
              >
                {TOSitem.description.length > 130
                  ? `${TOSitem.description.slice(0, 130)}...`
                  : TOSitem.description}
              </div>
              <div style={styles.line}>
                <div style={styles.editButtonContainer}>
                  <ion-icon
                    name="pencil"
                    style={styles.editIcon}
                    // onClick={() => handleEditUser(selectedUser)}
                  ></ion-icon>
                </div>
              
              
                <ion-icon
                  style={{ margin:"5px",fontSize: '27px', color: 'red', cursor: 'pointer' }}
                  name="trash-outline"
                  // onClick={() => handleDeleteButton(users)}
                ></ion-icon>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <span>
            {currentPage} / {totalPages}
          </span>
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
      )}
    </div>
  );
};

export default TOSPage;
