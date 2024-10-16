import React, { useState, useEffect } from "react";
import Header from "../../header/header";
import styles from "./styles";
import { db} from "../../../FirebaseConfig";
import {
  writeBatch,
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  where,
} from "firebase/firestore";
import Modal from "./usersModal";
import Alerts from "./alert";
import COLORS from "../../colors";
import LoadingSpinner from "../loadingPage/loadingSpinner";

// Number of items per page

const UsersPage = () => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Define the function to handle real-time updates
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(
      q,
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

  // Display User List in Ascending Order
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

  // Pagination
  // Calculate the total number of pages and current items
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedUsers.slice(startIndex, startIndex + itemsPerPage);
  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  // Function to change page
  const changePage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  //Selected User
  const [selectedUser, setSelectedUser] = useState(null);
  const handleRowClick = (user) => {
    setSelectedUser(user);
  };

  //Verifcation Status
  const getVerificationStatus = (isVerified) => {
    return isVerified ? "Verified" : "Not Verified";
  };
  const getStatusColor = (isVerified) => {
    return isVerified ? "green" : "red";
  };

  // Edit User
  // Edit Modal
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);

  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
  });

  const handleEditUser = (user) => {
    // Must not include country code in the display
    const mobileNumberWithoutCountryCode = user.mobileNumber.startsWith("+63")
      ? user.mobileNumber.slice(3)
      : user.mobileNumber;

    setUpdateUser({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      mobileNumber: mobileNumberWithoutCountryCode || "",
      verified: user.verified || false,
    });
    setIsUpdateUserModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle user update
  const handleUpdateUser = async () => {
    if (
      !updateUser.firstName ||
      !updateUser.lastName ||
      !updateUser.mobileNumber
    ) {
      setAlertMessage("All fields are required.");
      setAlertType("error");
      return;
    }

    // Validate mobile number length
    if (
      updateUser.mobileNumber.length !== 10 ||
      !updateUser.mobileNumber.startsWith("9")
    ) {
      setAlertMessage("Improper mobile number according to the Country Code");
      setAlertType("error");
      return;
    }

    try {
      setLoading(true);
      const formattedMobileNumber = `+63${updateUser.mobileNumber}`;

      const userDocRef = doc(db, "users", selectedUser.id);
      await updateDoc(userDocRef, {
        firstName: updateUser.firstName,
        lastName: updateUser.lastName,
        mobileNumber: formattedMobileNumber,
        verified: updateUser.verified,
      });

      // Update the selectedUser state with the new data
      setSelectedUser((prevUser) => ({
        ...prevUser,
        firstName: updateUser.firstName,
        lastName: updateUser.lastName,
        mobileNumber: formattedMobileNumber,
        verified: updateUser.verified,
      }));

      // Update the users array to reflect the changes
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) =>
          user.id === selectedUser.id
            ? { ...user, ...updateUser } // Update the user in the array
            : user
        );
        return updatedUsers;
      });
      
      setIsUpdateUserModalOpen(false);
      setTimeout(() => {
        setLoading(false);
        setAlertMessage("Adopter has been successdully updated.");
        setAlertType("success");  
      }, 1000);
      
      
    } catch (error) {
      setLoading(false);
      setAlertMessage("Error updating user.");
      setAlertType("error");
    }
  };

  // Delete User
  // Delete Modal
  const [isDeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const handleDeleteButton = (user) => {
    setSelectedUser(user);
    setDeleteUserModalOpen(true);
  };

  // Function to delete a  sub-collection
  const deleteSubCollection = async (
    userId,
    subCollectionName,
    nestedCollectionName
  ) => {
    try {
      // Reference to the sub-collection (e.g., conversations)
      const subCollectionRef = collection(
        db,
        "users",
        userId,
        subCollectionName
      );
      const subCollectionSnapshot = await getDocs(subCollectionRef);

      if (subCollectionSnapshot.empty) {
        console.log("No documents found");
        return;
      }

      const batch = writeBatch(db);

      if (subCollectionName === "conversations") {
        for (const subDoc of subCollectionSnapshot.docs) {
          const data = subDoc.data();
          const participants = data.participants || [];
          const petId = data.petId || "";

          // Construct the subdocId from fields in the document
          const subdocId = `${participants[0]}_${participants[1]}_${petId}`;

          const nestedSubCollectionRef = collection(
            db,
            "users",
            userId,
            subCollectionName,
            subdocId,
            nestedCollectionName
          );
          const nestedSubCollectionSnapshot = await getDocs(
            nestedSubCollectionRef
          );

          // Delete each document in the nested sub-collection
          nestedSubCollectionSnapshot.forEach((nestedDoc) => {
            const nestedDocRef = nestedDoc.ref;
            batch.delete(nestedDocRef);
          });

          // Delete the sub-collection document itself
          const subDocRef = doc(
            db,
            "users",
            userId,
            subCollectionName,
            subdocId
          );
          batch.delete(subDocRef);
        }
      } else {
        subCollectionSnapshot.forEach((doc) => {
          const docRef = doc.ref;
          batch.delete(docRef);
        });
      }
      await batch.commit();
    } catch (error) {
      console.error(`Error deleting:`, error);
    }
  };

  // deletePosts of the user
  const deleteUserPosts = async (userId) => {
    try {
      // Reference to the "pets" collection
      const petsCollectionRef = collection(db, "pets");
      // Query to find documents where userID matches the given userId
      const userPostsQuery = query(petsCollectionRef, where("userId", "==", userId));
      const userPostsSnapshot = await getDocs(userPostsQuery);
  
      if (userPostsSnapshot.empty) {
        console.log("No user posts found");
        return;
      }
  
      const batch = writeBatch(db);
  
      // Delete each post document associated with the user
      userPostsSnapshot.forEach((postDoc) => {
        const postDocRef = postDoc.ref;
        batch.delete(postDocRef);
      });
  
      await batch.commit();
      console.log("User posts deleted successfully");
    } catch (error) {
      console.error("Error deleting user posts:", error);
    }
  };

  // Main delete user function
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      // Attempt to delete the user from Firebase Authentication via backend API first
      const response = await fetch(
        `http://localhost:5000/deleteUser/${selectedUser.id}`,
        {
          method: "DELETE",
        }
      );

      // If the backend call fails, don't proceed with Firestore deletion
      if (!response.ok) {
        setAlertMessage("Failed to delete user from Firebase Authentication.");
        setAlertType("error");
        throw new Error("Failed to delete user from Firebase Authentication.");
      }

      // Now proceed with deleting the user's sub-collections from Firestore
      await deleteSubCollection(selectedUser.id, "conversations", "messages");
      await deleteSubCollection(selectedUser.id, "favorites");
      await deleteSubCollection(selectedUser.id, "furbabies");
      await deleteSubCollection(selectedUser.id, "petsAdopted");
      await deleteSubCollection(selectedUser.id, "adoptedBy");
      await deleteSubCollection(selectedUser.id, "adoptedFrom");
      await deleteSubCollection(selectedUser.id, "notifications");

      // Delete the user's posts in the "pets" collection
      await deleteUserPosts(selectedUser.id);

      // Then delete the main user document
      const userDocRef = doc(db, "users", selectedUser.id);
      await deleteDoc(userDocRef);

      // Update local state to remove the user
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUser.id)
      );

      // Close modal and reset selected user
      setSelectedUser(null);
      setDeleteUserModalOpen(false);
      setTimeout(() => {
        setLoading(false);
        setAlertMessage("Adopter has been successfully deleted.");
        setAlertType("success"); 
      }, 1000);
      
    } catch (error) {
      setLoading(false);
      setAlertMessage("Failed to delete user and associated data.");
      setAlertType("error");
    }
  };

  // Inside your component
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");


  //Alert Message and Type
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(""); // Clear the message
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Header />
      <h1 style={styles.pageTitle}>Adopters Page</h1>
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
            {currentItems.map((users) => (
              <React.Fragment key={users.id}>
                <div
                  style={{ ...styles.line, cursor: "pointer" }}
                  onClick={() => handleRowClick(users)}
                >
                  <img
                    src={
                      users.accountPicture || require("../../../const/user.png")
                    }
                    alt="Profile"
                    style={styles.userPicture}
                  />
                </div>
                <div
                  style={{ ...styles.line, cursor: "pointer" }}
                  onClick={() => handleRowClick(users)}
                >
                  <p style={{ margin: 0 }}>
                    {users.lastName} , {users.firstName}
                  </p>
                </div>
                <div
                  style={{ ...styles.line, cursor: "pointer" }}
                  onClick={() => handleRowClick(users)}
                >
                  <p
                    style={{ margin: 0, color: getStatusColor(users.verified) }}
                  >
                    {getVerificationStatus(users.verified)}
                  </p>
                </div>
                <div
                  style={{
                    ...styles.line,
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <ion-icon
                    style={{
                      fontSize: "30px",
                      color: COLORS.prim,
                      cursor: "pointer",
                    }}
                    name="trash-outline"
                    onClick={() => handleDeleteButton(users)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = COLORS.error;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = COLORS.prim;
                    }}
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
                  style={styles.editIcon} // Add styling as needed
                  onClick={() => handleEditUser(selectedUser)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = COLORS.hover;
                    e.currentTarget.style.borderColor = COLORS.hover;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = COLORS.prim;
                    e.currentTarget.style.borderColor = COLORS.prim;
                  }}
                ></ion-icon>
              </div>
            </div>
            <img
              src={
                selectedUser.accountPicture ||
                require("../../../const/user.png")
              }
              alt="Profile"
              style={styles.selectedUserPicture}
            />
            <div style={styles.userInfoDetails}>
              <div style={styles.line}>
                <p style={styles.userInfoTitleLabel}>Name:</p>
              </div>
              <div style={styles.line}>
                <p style={styles.userInfoTitleLabel}>
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
              </div>
              <div style={styles.line}>
                <p style={styles.userInfoTitleLabel}>Email:</p>
              </div>
              <div style={styles.line}>
                <p style={styles.userInfoTitleLabel}>{selectedUser.email}</p>
              </div>
              <div style={styles.line}>
                <p style={{ ...styles.userInfoTitleLabel, textAlign: "left" }}>
                  Mobile Number:
                </p>
              </div>
              <div style={styles.line}>
                <p style={styles.userInfoTitleLabel}>
                  {selectedUser.mobileNumber}
                </p>
              </div>
              <div style={styles.line}>
                <p style={styles.userInfoTitleLabel}>Status:</p>
              </div>
              <div style={styles.line}>
                <p
                  style={{
                    ...styles.userInfoTitleLabel,
                    color: getStatusColor(selectedUser.verified),
                  }}
                >
                  {getVerificationStatus(selectedUser.verified)}
                </p>
              </div>
              <div style={styles.line}>
                <p style={styles.userInfoTitleLabel}>Gov't ID:</p>
              </div>
              <div style={styles.line}>
                <img
                  src={
                    selectedUser.governmentId ||
                    require("../../../const/user.png")
                  }
                  alt="ID"
                  style={styles.govtPicture}
                  onClick={() => {
                    setSelectedImageUrl(selectedUser.governmentId);
                    setIsImageModalOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
        )}
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

      {/* Edit Button Modal */}
      {isUpdateUserModalOpen && (
        <Modal.UpdateModal
          updateUser={updateUser}
          handleInputChange={(e) =>
            setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
          }
          handleSwitchChange={(e) =>
            setUpdateUser({ ...updateUser, verified: e.target.checked })
          }
          handleUpdateUser={handleUpdateUser}
          handleCloseUpdateUserModal={() => setIsUpdateUserModalOpen(false)}
        />
      )}
      {/* Delete Button Modal */}
      {isDeleteUserModalOpen && (
        <Modal.DeleteModal
          onConfirm={handleDeleteUser}
          onClose={() => setDeleteUserModalOpen(false)}
        >
          <h3 style={styles.modalTitle}>
            Are you sure you want to delete {selectedUser.firstName}?
          </h3>
        </Modal.DeleteModal>
      )}

      {/* Image Zoom Modal */}
      {isImageModalOpen && (
        <Modal.ImageModal
          isOpen={isImageModalOpen}
          imageUrl={selectedImageUrl}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}

      {/* Alert rendering based on the type */}
      {alertMessage && alertType === "success" && (
        <Alerts.SuccessAlert>{alertMessage}</Alerts.SuccessAlert>
      )}
      {alertMessage && alertType === "error" && (
        <Alerts.ErrorAlert>{alertMessage}</Alerts.ErrorAlert>
      )}
    </div>
  );
};

export default UsersPage;
