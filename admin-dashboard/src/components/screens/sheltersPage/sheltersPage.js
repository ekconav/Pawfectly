import React, { useState, useEffect } from "react";
import Header from "../../header/header";
import styles from "./styles"
import { db } from "../../../FirebaseConfig";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
} from "firebase/firestore";
import Modal from "./shelterModal";
import LoadingSpinner from "../loadingPage/loadingSpinner";

// Number of items per page
const itemsPerPage = 5;
const SHELTERS_COLLECTION = "shelters";
const USERS_COLLECTION = "users";

const ShelterPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [updateUser, setUpdateUser] = useState({
    shelterName: "",
    shelter: "",
    mobileNumber: "",
    verified: false,
  });

  useEffect(() => {
    const q = query(collection(db, SHELTERS_COLLECTION));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sheltersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShelters(sheltersList);
      setLoading(false);
    }, 
    (error) => {
      console.error("Error fetching shelters: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sort shelters by name (assuming lastName and firstName are fields)
  const sortedShelters = [...shelters].sort((a, b) => {
    const nameA = `${a.shelterOwner}`.toLowerCase();
    const nameB = `${b.shelterOwner}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedShelters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedShelters.slice(startIndex, startIndex + itemsPerPage);

  const changePage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleRowClick = (shelter) => {
    setSelectedUser(shelter);
    setIsUpdateUserModalOpen(true); // Open the modal when a shelter is clicked
};

  const getVerificationStatus = (isVerified) => (isVerified ? "Verified" : "Not Verified");
  const getStatusColor = (isVerified) => (isVerified ? "green" : "red");

  // Edit User
  const handleEditUser = (user) => {
    setUpdateUser({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      mobileNumber: user.mobileNumber.replace("+63", "") || "",
      verified: user.verified || false,
    });
    setIsUpdateUserModalOpen(true);
  };

  const handleDeleteButton = async (user) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${user.shelterName}?`);
    if (confirmed) {
      try {
        const userDocRef = doc(db, shelters , user.id);
        await deleteDoc(userDocRef);
        setShelters(prevShelters => prevShelters.filter(shelter => shelter.id !== user.id));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleUpdateUser = async () => {
    if (!updateUser.shelterName || !updateUser.shelterOwner || !updateUser.mobileNumber) {
      alert("All fields are required.");
      return;
    }

    if (updateUser.mobileNumber.length !== 10 || !updateUser.mobileNumber.startsWith('9')) {
      alert("Improper mobile number according to the Country Code");
      return;
    }

    try {
      const formattedMobileNumber = `+63${updateUser.mobileNumber}`;
      const userDocRef = doc(db, USERS_COLLECTION, selectedUser.id);
      await updateDoc(userDocRef, {
        firstName: updateUser.firstName,
        lastName: updateUser.lastName,
        mobileNumber: formattedMobileNumber,
        verified: updateUser.verified,
      });

      setShelters(prevShelters => prevShelters.map(user =>
        user.id === selectedUser.id ? { ...user, ...updateUser } : user
      ));
      setSelectedUser(null);
      setIsUpdateUserModalOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Header />
      <h1>Adopters Page</h1>
      <div style={styles.container}>
        <div style={styles.userListContainer}>
          <div style={styles.userDetailsLabel}>
            <div style={styles.line}>
              <p style={styles.title}>Image</p>
            </div>
            <div style={styles.line}>
              <p style={styles.title}>Name</p>
            </div>
            <div style={styles.line}>
              <p style={styles.title}>Status</p>
            </div>
          </div>
          <div style={styles.userDetails}>
            {currentItems.map((user) => (
              <React.Fragment key={user.id}>
                <div
                  style={{ ...styles.line, cursor: "pointer" }}
                  onClick={() => handleRowClick(user)}
                >
                  <img
                    src={user.accountPicture || require("../../../const/user.png")}
                    alt="Profile"
                    style={styles.userPicture}
                  />
                </div>
                <div
                  style={{ ...styles.line, cursor: "pointer" }}
                  onClick={() => handleRowClick(user)}
                >
                  <p>
                    {user.shelterOwner}
                  </p>
                </div>
                <div
                  style={{ ...styles.line, cursor: "pointer" }}
                  onClick={() => handleRowClick(user)}
                >
                  <p style={{ color: getStatusColor(user.verified) }}>
                    {getVerificationStatus(user.verified)}
                  </p>
                </div>
                <div style={styles.line}>
                  <ion-icon
                    style={{ fontSize: '30px', color: 'red', cursor: 'pointer' }}
                    name="trash-outline"
                    onClick={() => handleDeleteButton(user)}
                  ></ion-icon>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* User Information */}
        {selectedUser && (
          <div style={styles.userInfoContainer}>
            <div style={styles.userInfoHeader}>
              <h3 style={styles.userInfoTitle}>Adopter Information</h3>
              <div style={styles.editButtonContainer}>
                <ion-icon
                  name="pencil"
                  style={styles.editIcon}
                  onClick={() => handleEditUser(selectedUser)}
                ></ion-icon>
              </div>
            </div>
            <img
              src={selectedUser.accountPicture || require("../../../const/user.png")}
              alt="Profile"
              style={styles.selectedUserPicture}
            />
            <div style={styles.userInfoDetails}>
              <div style={styles.line}>
                <p style={styles.userInfoTitleLabel}>
                  Name:
                </p>
                <p>{selectedUser.shelterOwner}</p>
              </div>
              <div style={styles.line}>
                <p style={styles.userInfoTitleLabel}>
                  Mobile Number:
                </p>
                <p>{selectedUser.mobileNumber}</p>
              </div>
              <div style={styles.line}>
                <p style={styles.userInfoTitleLabel}>
                  Status:
                </p>
                <p style={{ color: getStatusColor(selectedUser.verified) }}>
                  {getVerificationStatus(selectedUser.verified)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Update User Modal */}
        {isUpdateUserModalOpen && (
    <Modal
        shelter={selectedUser} // Pass the selected shelter here
        onClose={() => setIsUpdateUserModalOpen(false)}
        onUpdate={handleUpdateUser}
    />
)}

        {/* Pagination Controls */}
        <div style={styles.paginationContainer}>
          <button
            style={styles.paginationButton}
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span style={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            style={styles.paginationButton}
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShelterPage;
