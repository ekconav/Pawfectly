import React, { useState, useEffect } from "react";
import Header from "../../header/header";
import styles from "./styles";
import { db, auth } from "../../../FirebaseConfig";
import {
  writeBatch,
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  limit,
} from "firebase/firestore";
import Modal from "./shelterModal";
import Alerts from "./alert";
import COLORS from "../../colors";
import LoadingSpinner from "../loadingPage/loadingSpinner";

// Number of items per page

const ShelterPage = () => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [shelters, setShelters] = useState([]);
  const [sortedShelters, setSortedShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Define the function to handle real-time updates
    const q = query(collection(db, "shelters"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // Convert snapshot to array of users
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
      }
    );

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Display User List in Ascending Order
  useEffect(() => {
    if (shelters.length > 0) {
      const sortedList = [...shelters].sort((a, b) => {
        const shelterNameA = a.shelterName.toLowerCase();
        const shelterNameB = b.shelterName.toLowerCase();
        if (shelterNameA < shelterNameB) return -1;
        if (shelterNameA > shelterNameB) return 1;
        return 0;
      });
      setSortedShelters(sortedList);
    }
  }, [shelters]);

  // Pagination
  // Calculate the total number of pages and current items
  const totalPages = Math.ceil(sortedShelters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedShelters.slice(startIndex, startIndex + itemsPerPage);
  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  // Function to change page
  const changePage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  //Selected User
  const [selectedShelter, setSelectedShelter] = useState(null);
  const handleRowClick = (shelter) => {
    setSelectedShelter(shelter);
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
  const [isUpdateShelterModalOpen, setIsUpdateShelterModalOpen] = useState(false);

  // Close Modal
  const handleCloseUpdateShelterModal = () => {
    setIsUpdateShelterModalOpen(false);
    setUpdateShelter({
      shelterName: "",
      lastName: "",
      mobileNumber: "",
      verified: false,
    });
  };
  const [updateShelter, setUpdateShelter] = useState({
    shelterName: "",
    address: "",
    mobileNumber: "",
  });

  const handleEditShelter = (shelter) => {
    // Must not include country code in the display
    const mobileNumberWithoutCountryCode = shelter.mobileNumber.startsWith("+63")
      ? shelter.mobileNumber.slice(3)
      : shelter.mobileNumber;

    setUpdateShelter({
      shelterName: shelter.shelterName || "",
      address: shelter.address || "",
      mobileNumber: mobileNumberWithoutCountryCode || "",
      verified: shelter.verified || false,
    });
    setIsUpdateShelterModalOpen(true);
  };

  // Verification Switch
  const handleSwitchChange = (event) => {
    setUpdateShelter((prev) => ({
      ...prev,
      verified: event.target.checked,
    }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateShelter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle user update
  const handleUpdateShelter = async () => {
    if (
      !updateShelter.shelterName ||
      !updateShelter.address||
      !updateShelter.mobileNumber
    ) {
      setAlertMessage("All fields are required.");
      setAlertType("error");
      return;
    }

    // Validate mobile number length
    if (
      updateShelter.mobileNumber.length !== 10 ||
      !updateShelter.mobileNumber.startsWith("9")
    ) {
      setAlertMessage("Improper mobile number according to the Country Code");
      setAlertType("error");
      return;
    }

    try {
      const formattedMobileNumber = `+63${updateShelter.mobileNumber}`;

      const shelterDocRef = doc(db, "shelters", selectedShelter.id);
      await updateDoc(shelterDocRef, {
        shelterName: updateShelter.shelterName,
        address: updateShelter.address,
        mobileNumber: formattedMobileNumber,
        verified: updateShelter.verified,
      });

      // Update the selectedUser state with the new data
      setSelectedShelter((prevShelter) => ({
        ...prevShelter,
        shelterName: updateShelter.shelterName,
        address: updateShelter.address,
        mobileNumber: formattedMobileNumber,
        verified: updateShelter.verified,
      }));

      // Update the users array to reflect the changes
      setShelters((prevShelter) => {
        const updatedShelter = prevShelter.map((shelter) =>
          shelter.id === selectedShelter.id
            ? { ...shelter, ...updateShelter } // Update the user in the array
            : shelter
        );
        return updatedShelter;
      });

      setIsUpdateShelterModalOpen(false);
      setAlertMessage("Shelter has been successdully updated.");
      setAlertType("success");
    } catch (error) {
      setAlertMessage("Error updating user.");
      setAlertType("error");
    }
  };

  // Delete User
  // Delete Modal
  const [isDeleteShelterModalOpen, setDeleteShelterModalOpen] = useState(false);
  const handleDeleteButton = (shelter) => {
    setSelectedShelter(shelter);
    setDeleteShelterModalOpen(true);
  };

  // Function to delete a  sub-collection
  const deleteSubCollection = async (
    shelterId,
    subCollectionName,
    nestedCollectionName
  ) => {
    try {
      // Reference to the sub-collection (e.g., conversations)
      const subCollectionRef = collection(
        db,
        "shelters",
        shelterId,
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
            "shelters",
            shelterId,
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
            "shelters",
            shelterId,
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

  // Main delete user function
  const handleDeleteShelter = async () => {
    if (!selectedShelter) return;

    try {
      // Attempt to delete the user from Firebase Authentication via backend API first
      const response = await fetch(
        `http://localhost:5000/deleteShelter/${selectedShelter.id}`,
        {
          method: "DELETE",
        }
      );

      // If the backend call fails, don't proceed with Firestore deletion
      if (!response.ok) {
        setAlertMessage("Failed to delete shelter from Firebase Authentication.");
        setAlertType("error");
        throw new Error("Failed to delete shelter from Firebase Authentication.");
      }

      // Now proceed with deleting the user's sub-collections from Firestore
      await deleteSubCollection(selectedShelter.id, "conversations", "messages");
      // await deleteSubCollection(selectedUser.id, "favorites");
      // await deleteSubCollection(selectedUser.id, "furbabies");
      // await deleteSubCollection(selectedUser.id, "petsAdopted");

      // Then delete the main user document
      const shelterDocRef = doc(db, "shelters", selectedShelter.id);
      await deleteDoc(shelterDocRef);

      // Update local state to remove the user
      setShelters((prevShelters) =>
        prevShelters.filter((shelter) => shelter.id !== selectedShelter.id)
      );

      // Close modal and reset selected user
      setDeleteShelterModalOpen(false);
      setSelectedShelter(null);
      setAlertMessage("Shelter has been successfully deleted.");
      setAlertType("success");
    } catch (error) {
      setAlertMessage("Failed to delete shelter and associated data.");
      setAlertType("error");
    }
  };

  // Inside your component
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  // Function to open the image modal
  const openImageModal = (url) => {
    setSelectedImageUrl(url);
    setIsImageModalOpen(true);
  };

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
      <h1 style={styles.pageTitle}>Shelters Page</h1>
      <div style={styles.container}>
        <div style={styles.userListContainer}>
          <div style={styles.userDetailsLabel}>
            <div style={styles.line}>
              <p style={styles.title}>Image</p>
            </div>
            <div style={styles.line}>
              <p style={styles.title}>Shelter Name</p>
            </div>
            <div style={styles.line}>
              <p style={styles.title}>Status</p>
            </div>
          </div>
          <div style={styles.userDetails}>
            {currentItems.map((shelters) => (
              <React.Fragment key={shelters.id}>
                <div
                  style={{ ...styles.line, cursor: "pointer" }}
                  onClick={() => handleRowClick(shelters)}
                >
                  <img
                    src={
                      shelters.accountPicture || require("../../../const/user.png")
                    }
                    alt="Profile"
                    style={styles.userPicture}
                  />
                </div>
                <div
                  style={{ ...styles.line, cursor: "pointer" }}
                  onClick={() => handleRowClick(shelters)}
                >
                  <p style={{ margin: 0 }}>
                    {shelters.shelterName}
                  </p>
                </div>
                <div
                  style={{ ...styles.line, cursor: "pointer" }}
                  onClick={() => handleRowClick(shelters)}
                >
                  <p
                    style={{ margin: 0, color: getStatusColor(shelters.verified) }}
                  >
                    {getVerificationStatus(shelters.verified)}
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
                    onClick={() => handleDeleteButton(shelters)}
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
        {selectedShelter && (
          <div style={styles.userInfoContainer}>
            <div style={styles.userInfoHeader}>
              <h3 style={styles.userInfoTitle}>Shelter Information</h3>
              <div style={styles.editButtonContainer}>
                <ion-icon
                  name="pencil"
                  style={styles.editIcon} // Add styling as needed
                  onClick={() => handleEditShelter(selectedShelter)}
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
                selectedShelter.accountPicture ||
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
                  {selectedShelter.shelterName}
                </p>
              </div>
              <div style={styles.line}>
                <p style={styles.userInfoTitleLabel}>Email:</p>
              </div>
              <div style={styles.line}>
                <p style={styles.userInfoTitleLabel}>{selectedShelter.email}</p>
              </div>
              <div style={styles.line}>
                <p style={{ ...styles.userInfoTitleLabel, textAlign: "left" }}>
                  Mobile Number:
                </p>
              </div>
              <div style={styles.line}>
                <p style={styles.userInfoTitleLabel}>
                  {selectedShelter.mobileNumber}
                </p>
              </div>
              <div style={styles.line}>
                <p style={styles.userInfoTitleLabel}>Status:</p>
              </div>
              <div style={styles.line}>
                <p
                  style={{
                    ...styles.userInfoTitleLabel,
                    color: getStatusColor(selectedShelter.verified),
                  }}
                >
                  {getVerificationStatus(selectedShelter.verified)}
                </p>
              </div>
              <div style={styles.line}>
                <p style={styles.userInfoTitleLabel}>Gov't ID:</p>
              </div>
              <div style={styles.line}>
                <img
                  src={
                    selectedShelter.governmentId ||
                    require("../../../const/user.png")
                  }
                  alt="ID"
                  style={styles.govtPicture}
                  onClick={() => {
                    setSelectedImageUrl(selectedShelter.governmentId);
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
        <div>
        <button disabled={isPreviousDisabled} onClick={() => changePage(currentPage - 1)}>Previous</button>
        <span>{currentPage} of {totalPages}</span>
        <button disabled={isNextDisabled} onClick={() => changePage(currentPage + 1)}>Next</button>
      </div>
      
      )}

      {/* Edit Button Modal */}
      {isUpdateShelterModalOpen && (
        <Modal.UpdateModal
          updateShelter={updateShelter}
          handleInputChange={(e) =>
            setUpdateShelter({ ...updateShelter, [e.target.name]: e.target.value })
          }
          handleSwitchChange={(e) =>
            setUpdateShelter({ ...updateShelter, verified: e.target.checked })
          }
          handleUpdateShelter={handleUpdateShelter}
          handleCloseUpdateShelterModal={() => setIsUpdateShelterModalOpen(false)}
        />
      )}
      {/* Delete Button Modal */}
      {isDeleteShelterModalOpen && (
        <Modal.DeleteModal
          onConfirm={handleDeleteShelter}
          onClose={() => setDeleteShelterModalOpen(false)}
        >
          <h3 style={styles.modalTitle}>
            Are you sure you want to delete {selectedShelter.shelterName}?
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

export default ShelterPage;
