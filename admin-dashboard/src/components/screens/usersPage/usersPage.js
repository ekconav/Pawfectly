import React, { useState, useEffect } from "react";
import Header from "../../header/header";
import styles from "./styles";
import { db, auth } from "../../../FirebaseConfig";
import {writeBatch,collection,onSnapshot,updateDoc,deleteDoc,getDocs,doc,query,where,} from "firebase/firestore";
import Modal from "./usersModal";

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

  // Close Modal
  const handleCloseUpdateUserModal = () => {
    setIsUpdateUserModalOpen(false);
    setUpdateUser({
      firstName: "",
      lastName: "",
      mobileNumber: "",
      verified: false,
    });
  };
  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
  });
  const handleEditUser = (user) => {
    setUpdateUser({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      mobileNumber: user.mobileNumber || "",
      verified: user.verified || false,
    });
    setIsUpdateUserModalOpen(true); 
  };

   // Verification Switch
   const handleSwitchChange = (event) => {
    setUpdateUser((prev) => ({
      ...prev,
      verified: event.target.checked,
    }));
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

    if (!updateUser.firstName || !updateUser.lastName || !updateUser.mobileNumber) {
      alert("All fields are required.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", selectedUser.id);
      await updateDoc(userDocRef, {
        firstName: updateUser.firstName,
        lastName: updateUser.lastName,
        // email: updateUser.email,
        mobileNumber: updateUser.mobileNumber,
        verified: updateUser.verified, 
      });

      // Update the selectedUser state with the new data
      setSelectedUser((prevUser) => ({
        ...prevUser,
        firstName: updateUser.firstName,
        lastName: updateUser.lastName,
        // email: updateUser.email,
        mobileNumber: updateUser.mobileNumber,
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
      
      setIsUpdateUserModalOpen(false); // Close the modal after update
    } catch (error) {
      console.error("Error updating user:", error);
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
const deleteSubCollection = async (userId, subCollectionName, nestedCollectionName) => {
  try {
    // Reference to the sub-collection (e.g., conversations)
    const subCollectionRef = collection(db, "users", userId, subCollectionName);
    const subCollectionSnapshot = await getDocs(subCollectionRef);

    if (subCollectionSnapshot.empty) {
      console.log("No documents found");
      return;
    }

    const batch = writeBatch(db); 

    if(subCollectionName === "conversations"){
      for (const subDoc of subCollectionSnapshot.docs) {
        const data = subDoc.data();
        const participants = data.participants || [];
        const petId = data.petId || "";

        // Construct the subdocId from fields in the document
        const subdocId = `${participants[0]}_${participants[1]}_${petId}`;

        
        const nestedSubCollectionRef = collection(db, "users", userId, subCollectionName, subdocId, nestedCollectionName);
        const nestedSubCollectionSnapshot = await getDocs(nestedSubCollectionRef);

        // Delete each document in the nested sub-collection 
        nestedSubCollectionSnapshot.forEach((nestedDoc) => {
          const nestedDocRef = nestedDoc.ref;
          batch.delete(nestedDocRef); 
        });

        // Delete the sub-collection document itself 
        const subDocRef = doc(db, "users", userId, subCollectionName, subdocId);
        batch.delete(subDocRef);
      }
    }else{
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


  // Main delete user function
const handleDeleteUser = async () => {
  if (!selectedUser) return;

  try {
    // Delete the user's sub-collections first
    await deleteSubCollection(selectedUser.id, 'conversations','messages'); 
    await deleteSubCollection(selectedUser.id, 'favorites'); 
    await deleteSubCollection(selectedUser.id, 'furbabies');
    await deleteSubCollection(selectedUser.id, 'petsAdopted');

    // // Then delete the main user document
    const userDocRef = doc(db, "users", selectedUser.id);
    await deleteDoc(userDocRef);

    // Delete the user from Firebase Authentication
    // Call backend to delete user from Firebase Authentication
    await fetch(`http://localhost:5000/deleteUser/${selectedUser.id}`, {
      method: 'DELETE',
    });

    // // Update local state to remove the user
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== selectedUser.id));

    // // Close modal
    setDeleteUserModalOpen(false);
    setSelectedUser(null);
    } catch (error) {
    // console.error("Error deleting user and sub-collections:", error);
    // alert("Failed to delete user and associated data.");
  }
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
                  <p>
                    {users.lastName} , {users.firstName}
                  </p>
                </div>
                <div
                  style={{ ...styles.line, cursor: "pointer" }}
                  onClick={() => handleRowClick(users)}
                >
                  <p style={{ color: getStatusColor(users.verified) }}>
                    {getVerificationStatus(users.verified)}
                  </p>
                </div>
                <div style={styles.line} >
                <ion-icon
                  style={{ fontSize: '30px', color: 'red', cursor: 'pointer' }}
                  name="trash-outline"
                  onClick={() => handleDeleteButton(users)}
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
              <h3 style={styles.userInfoTitle}>User Information</h3>
              <div style={styles.editButtonContainer}>
                <ion-icon
                  name="pencil"
                  sstyle={styles.editIcon} // Add styling as needed
                  onClick={() => handleEditUser(selectedUser)}
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
                <p p style={styles.title}>
                  Name:
                </p>
              </div>
              <div style={styles.line}>
                <p>
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
              </div>
              <div style={styles.line}>
                <p style={styles.title}>Email:</p>
              </div>
              <div style={styles.line}>
                <p>{selectedUser.email}</p>
              </div>
              <div style={styles.line}>
                <p style={styles.title}>Mobile Number:</p>
              </div>
              <div style={styles.line}>
                <p>{selectedUser.mobileNumber}</p>
              </div>
              <div style={styles.line}>
                <p style={styles.title}>Status:</p>
              </div>
              <div style={styles.line}>
                <p style={{ color: getStatusColor(selectedUser.verified) }}>
                  {getVerificationStatus(selectedUser.verified)}
                </p>
              </div>
              
              
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}

      {/* Edit Button Modal */}
      {isUpdateUserModalOpen && (
        <Modal.UpdateModal
          updateUser={updateUser}
          handleInputChange={(e) => setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })}
          handleSwitchChange={(e) => setUpdateUser({ ...updateUser, verified: e.target.checked })}
          handleUpdateUser={handleUpdateUser}
          handleCloseUpdateUserModal={() => setIsUpdateUserModalOpen(false)}
        />
      )}

      {isDeleteUserModalOpen && (
        <Modal.DeleteModal onConfirm={handleDeleteUser} onClose={() => setDeleteUserModalOpen(false)}>
          <p>Are you sure you want to delete {selectedUser.firstName}?</p>
        </Modal.DeleteModal>
      )}
    </div>
  );
};

export default UsersPage;
