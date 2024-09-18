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
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../loadingPage/loadingSpinner";

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [isHovered, setIsHovered] = useState(null);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prevAdmin) => ({
      ...prevAdmin,
      [name]: value,
    }));
  };

  const handleAddAdmin = () => {
    if (
      !newAdmin.firstName ||
      !newAdmin.lastName ||
      !newAdmin.email ||
      !newAdmin.mobileNumber ||
      !newAdmin.password ||
      !newAdmin.confirmPassword
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    if (newAdmin.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    // Validate passwords match
    if (newAdmin.password !== newAdmin.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Open confirmation modal
    setConfirmPasswordModalOpen(true);
  };

  const handleConfirmPassword = async () => {
    if (!confirmPassword) {
      alert("Please enter the admin password.");
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

      // Add the new admin to Firestore
      await setDoc(doc(db, "admin", newUser.uid), {
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        email: newAdmin.email,
        mobileNumber: newAdmin.mobileNumber,
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Header />
      <h1>Admins page</h1>
      <div style={styles.adminListContainer}>
        <div style={styles.adminDetails}>
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

          {admins.map((admin) => (
            <React.Fragment key={admin.id}>
              <div style={styles.line}>
                <img
                  src={
                    admin.accountPicture || require("../../../const/user.png")
                  }
                  alt="Profile"
                  style={styles.adminPicture}
                />
              </div>
              <div style={styles.line}>
                <p>
                  {admin.firstName} {admin.lastName}
                </p>
              </div>
              <div style={styles.line}>
                <p>{admin.email}</p>
              </div>
              <div style={styles.line}>
                <p>{admin.mobileNumber}</p>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div style={styles.buttons}>
          <button
            className="button"
            style={
              isHovered === "add" ? styles.addButtonHover : styles.addButton
            }
            onMouseEnter={() => setIsHovered("add")}
            onMouseLeave={() => setIsHovered(null)}
            onClick={() => setIsAdminModalOpen(true)}
          >
            Add Admin
          </button>
          <button
            className="button"
            style={
              isHovered === "delete"
                ? styles.deleteButtonHover
                : styles.deleteButton
            }
            onMouseEnter={() => setIsHovered("delete")}
            onMouseLeave={() => setIsHovered(null)}
          >
            Delete Admin
          </button>
        </div>
      </div>

      {isAdminModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Add New Admin</h2>
            <div style={styles.modalForm}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={newAdmin.firstName}
                onChange={handleInputChange}
                className="input"
                style={styles.inputField}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={newAdmin.lastName}
                onChange={handleInputChange}
                className="input"
                style={styles.inputField}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newAdmin.email}
                onChange={handleInputChange}
                className="input"
                style={styles.inputField}
                required
              />
              <input
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={newAdmin.mobileNumber}
                onChange={handleInputChange}
                className="input"
                style={styles.inputField}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={newAdmin.password}
                onChange={handleInputChange}
                className="input"
                style={styles.inputField}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={newAdmin.confirmPassword}
                onChange={handleInputChange}
                className="input"
                style={styles.inputField}
                required
              />
              <div style={styles.modalButtons}>
                <button
                  onClick={handleAddAdmin}
                  className="button"
                  style={styles.addAdminButton}
                >
                  Add Admin
                </button>
                <button
                  onClick={handleCloseAdminModal}
                  className="button"
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmPasswordModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Confirm Admin Password</h2>
            <input
              type="password"
              placeholder="Enter your password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="input"
              style={styles.inputField}
            />
            {passwordError && <p style={styles.error}>{passwordError}</p>}
            <div style={styles.modalButtons}>
              <button
                onClick={handleConfirmPassword}
                className="button"
                style={styles.addButton}
              >
                Confirm
              </button>
              <button
                onClick={handleCloseConfirmPasswordModal}
                className="button"
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminsPage;
