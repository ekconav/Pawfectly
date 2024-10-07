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
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../loadingPage/loadingSpinner";
import { Container, Col, Row } from "react-bootstrap";
import Modal from "./adminModal";
import Alerts from "./alert";
import COLORS from "../../colors";

const AdminsPage = () => {

  // For Pagination
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [confirmPasswordModalOpen, setConfirmPasswordModalOpen] =
    useState(false);
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Define the function to handle real-time updates
    const unsubscribe = onSnapshot(
      collection(db, "admin"),
      (snapshot) => {
        // Convert snapshot to array of admins
        const adminsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAdmins(adminsList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching admins: ", error);
        setLoading(false);
      }
    );

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Input change for forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prevAdmin) => ({
      ...prevAdmin,
      [name]: value,
    }));
  };

  // Add Admin
  const handleAddAdmin = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !newAdmin.firstName ||
      !newAdmin.lastName ||
      !newAdmin.email ||
      !newAdmin.mobileNumber ||
      !newAdmin.password ||
      !newAdmin.confirmPassword
    ) {
      setAlertMessage("Please fill out all required fields.");
      setAlertType("error");
      return;
    }

    // Validate email format
    if (!emailRegex.test(newAdmin.email)) {
      setAlertMessage("Please enter a valid email address.");
      setAlertType("error");
      return;
    }

    // Validate mobile number length
    if (
      newAdmin.mobileNumber.length !== 10 ||
      !newAdmin.mobileNumber.startsWith("9")
    ) {
      setAlertMessage("Improper mobile number according to the Country Code");
      setAlertType("error");
      return;
    }

    if (newAdmin.password.length < 6) {
      setAlertMessage("Password must be at least 6 characters long.");
      setAlertType("error");
      return;
    }

    // Validate passwords match
    if (newAdmin.password !== newAdmin.confirmPassword) {
      alert("Passwords do not match!");
      setAlertMessage("Passwords do not match!");
      setAlertType("error");
      return;
    }

    // Open confirmation modal
    setConfirmPasswordModalOpen(true);
  };

  const handleConfirmPassword = async () => {
    if (!confirmPassword) {
      setAlertMessage("Please enter the admin password.");
      setAlertType("error");
      return;
    }

    try {
      setLoading(true); // Show spinner

      const auth = getAuth();
      const currentAdmin = auth.currentUser;

      if (!currentAdmin) {
        throw new Error("No admin is currently signed in.");
      }

      // Re-authenticate the admin using the entered password
      await signInWithEmailAndPassword(
        auth,
        currentAdmin.email,
        confirmPassword
      );

      // If re-authentication is successful, create the new admin
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newAdmin.email,
        newAdmin.password
      );
      const newUser = userCredential.user;

      const formattedMobileNumber = `+63${newAdmin.mobileNumber}`;
      // Add the new admin to Firestore
      await setDoc(doc(db, "admin", newUser.uid), {
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        email: newAdmin.email,
        mobileNumber: formattedMobileNumber,
        accountPicture: "", // Default value
        accountCreated: Timestamp.now(),
      });

      // Sign out the newly created admin
      await signOut(auth);

      // Re-authenticate the original admin
      await signInWithEmailAndPassword(
        auth,
        currentAdmin.email,
        confirmPassword
      );
      navigate("/admins");

      // Reset modal and form states

      setIsAdminModalOpen(false);
      setConfirmPasswordModalOpen(false);
      setAlertMessage("New Admin successfully created.");
      setAlertType("success");
      setNewAdmin({
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        password: "",
        confirmPassword: "",
      });
      setConfirmPassword("");
      setPasswordError(""); // Clear any previous errors
      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false); // Stop spinner

      let errorMessage = "An error occurred. Please try again.";

      if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email already in use.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Incorrect Password. Please try again.";
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage = "Please log in again and try again.";
      }

      setPasswordError(errorMessage);
    }
  };

  // Close Add admin modal
  const handleCloseAdminModal = () => {
    setIsAdminModalOpen(false);
    setNewAdmin({
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleCloseConfirmPasswordModal = () => {
    setConfirmPasswordModalOpen(false);
    setConfirmPassword("");
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordError(""); // Clear the error when the user starts typing
  };

  // Edit Admin
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

  const handleEditModalOpen = (admin) => {
    setSelectedAdmin(admin);
    // Must not include country code in the display
    const mobileNumberWithoutCountryCode = admin.mobileNumber.startsWith("+63")
      ? admin.mobileNumber.slice(3)
      : admin.mobileNumber;

    setNewAdmin({
      firstName: admin.firstName || "",
      lastName: admin.lastName || "",
      mobileNumber: mobileNumberWithoutCountryCode || "",
    });

    setUpdateModalOpen(true);
  };

  // Close Edit Admin Form
  const handleCloseEditModal = () => {
    setNewAdmin({
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
    });
    setUpdateModalOpen(false);
  };

  // on submit edit button
  const handleUpdateAdmin = async () => {
    if (!newAdmin.firstName || !newAdmin.lastName || !newAdmin.mobileNumber) {
      setAlertMessage("All fields are required.");
      setAlertType("error");
      return;
    }

    // Validate mobile number length
    if (
      newAdmin.mobileNumber.length !== 10 ||
      !newAdmin.mobileNumber.startsWith("9")
    ) {
      setAlertMessage("Improper mobile number according to the Country Code");
      setAlertType("error");
      return;
    }
    try {
      const formattedMobileNumber = `+63${newAdmin.mobileNumber}`;

      const userDocRef = doc(db, "admin", selectedAdmin.id);
      await updateDoc(userDocRef, {
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        mobileNumber: formattedMobileNumber,
      });

      // Update the selectedUser state with the new data
      setSelectedAdmin((prevUser) => ({
        ...prevUser,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        mobileNumber: formattedMobileNumber,
      }));

      // Update the users array to reflect the changes
      setAdmins((prevUsers) => {
        const updatedAdmins = prevUsers.map((admin) =>
          admin.id === selectedAdmin.id
            ? { ...admin, ...newAdmin } // Update the user in the array
            : admin
        );
        return updatedAdmins;
      });

      setUpdateModalOpen(false);
      setAlertMessage("Admin has been successdully updated.");
      setAlertType("success");
    } catch (error) {
      console.log(error);
      setAlertMessage("Error updating admin.");
      setAlertType("error");
    }
  };

  // Delete Modal
  const [isDeleteAdminModalOpen, setDeleteAdminModalOpen] = useState(false);
  const handleDeleteButton = (admin) => {
    setSelectedAdmin(admin);
    setDeleteAdminModalOpen(true);
  };

  // on submit delete button
  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return;

    try {
      // Attempt to delete the user from Firebase Authentication via backend API first
      const response = await fetch(
        `http://localhost:5000/deleteUser/${selectedAdmin.id}`,
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

      // Then delete the main user document
      const userDocRef = doc(db, "admin", selectedAdmin.id);
      await deleteDoc(userDocRef);

      // Update local state to remove the user
      setAdmins((prevUsers) =>
        prevUsers.filter((admin) => admin.id !== selectedAdmin.id)
      );

      // Close modal and reset selected user
      setDeleteAdminModalOpen(false);
      setSelectedAdmin(null);
      setAlertMessage("Admin has been successfully deleted.");
      setAlertType("success");
    } catch (error) {
      setAlertMessage("Failed to delete admin.");
      setAlertType("error");
    }
  };

  // Pagination
  // Calculate the total number of pages and current items
  const totalPages = Math.ceil(admins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = admins.slice(startIndex, startIndex + itemsPerPage);
  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  // Function to change page
  const changePage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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
      <Container>
        <Row>
          <Col></Col>
          <Col xs={5}>
            <h1 style={styles.pageTitle}>Admins Page</h1>
          </Col>
          <Col
            style={{
              ...styles.line,
              justifyContent: "flex-end",
              height: "10vh",
            }}
          >
            <ion-icon
              style={{
                fontSize: "30px",
                cursor: "pointer",
                paddingLeft: "10px",
                paddingRight: "10px",
                color: COLORS.prim,
              }}
              name="add-circle-outline"
              onClick={() => setIsAdminModalOpen(true)}
              onMouseOver={(e) => {
                e.target.style.color = COLORS.hover;
              }}
              onMouseOut={(e) => {
                e.target.style.color = COLORS.prim;
              }}
            ></ion-icon>
          </Col>
        </Row>
      </Container>
      {/* TOS LIST */}
      <div style={styles.adminContainer}>
        <div style={styles.adminGridCols}>
          <div style={styles.adminLabelRows}>
            <div style={styles.line}>
              <p style={styles.title}>Image</p>
            </div>
            <div style={styles.line}>
              <p style={styles.title}>Name</p>
            </div>
            <div style={styles.line}>
              <p style={styles.title}>Email</p>
            </div>
            <div style={styles.line}>
              <p style={styles.title}>Mobile No.</p>
            </div>
          </div>

          {currentItems.map((admin) => (
            <div key={admin.id} style={styles.adminGridRows}>
              <div style={styles.line}>
                <img
                  src={
                    admin.accountPicture || require("../../../const/user.png")
                  }
                  alt="Profile"
                  style={styles.adminPicture}
                />
              </div>
              <div
                style={{
                  ...styles.line,
                  textAlign: "justify",
                }}
              >
                {admin.firstName} {admin.lastName}
              </div>
              <div
                style={{
                  ...styles.line,
                  textAlign: "justify",
                  fontSize: "14px",
                }}
              >
                {admin.email}
              </div>
              <div
                style={{
                  ...styles.line,
                  textAlign: "justify",
                  fontSize: "14px",
                }}
              >
                {admin.mobileNumber}
              </div>
              <div style={styles.line}>
                  <ion-icon
                    name="pencil"
                    style={styles.editIcon}
                    onClick={() => handleEditModalOpen(admin)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = COLORS.hover;
                      e.currentTarget.style.borderColor = COLORS.hover;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = COLORS.prim;
                      e.currentTarget.style.borderColor = COLORS.prim;
                    }}
                  ></ion-icon>
                <ion-icon
                  style={{
                    margin: "5px",
                    fontSize: "27px",
                    color: COLORS.prim,
                    cursor: "pointer",
                  }}
                  name="trash-outline"
                  onClick={() => handleDeleteButton(admin)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = COLORS.error;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = COLORS.prim;
                  }}
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

      {/* Add New Admin Modal Form */}
      {isAdminModalOpen && (
        <Modal.addAdminModal
          newAdmin={newAdmin}
          handleInputChange={handleInputChange}
          handleCloseAdminModal={handleCloseAdminModal}
          handleAddAdmin={handleAddAdmin}
        />
      )}

      {confirmPasswordModalOpen && (
        <Modal.confirmPasswordModal
          passwordError={passwordError}
          confirmPassword={confirmPassword}
          handleCloseConfirmPasswordModal={handleCloseConfirmPasswordModal}
          handleConfirmPassword={handleConfirmPassword}
          handleConfirmPasswordChange={handleConfirmPasswordChange}
        />
      )}

      {/* Edit Button Modal */}
      {isUpdateModalOpen && (
        <Modal.UpdateModal
          newAdmin={newAdmin}
          handleInputChange={handleInputChange}
          handleUpdateAdmin={handleUpdateAdmin}
          handleCloseEditModal={handleCloseEditModal}
        />
      )}

      {/* Delete Button Modal */}
      {isDeleteAdminModalOpen && (
        <Modal.DeleteModal
          onConfirm={handleDeleteAdmin}
          onClose={() => setDeleteAdminModalOpen(false)}
        >
          <h3 style={styles.modalTitle}>Are you sure you want to delete {selectedAdmin.firstName}?</h3>
        </Modal.DeleteModal>
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

export default AdminsPage;
