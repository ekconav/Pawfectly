import React, { useState, useEffect, useRef } from "react";
import Header from "../../header/header";
import styles from "./styles";
import { db, storage, auth } from "../../../FirebaseConfig";
import {
  writeBatch,
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  getDocs,
  addDoc,
  setDoc,
  doc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import {
  deleteObject,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Modals from "./usersModal";
import Alerts from "./alert";
import COLORS from "../../colors";
import LoadingSpinner from "../loadingPage/loadingSpinner";
import { Col, Container, Row, Button } from "react-bootstrap";

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
    address: "",
    birthdate: null,
    verified: false,
    governmentId: "",
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
      address: user.address || "",
      birthdate: user.birthdate ? user.birthdate.toDate() : "",
      verified: user.verified || false,
      governmentId: user.governmentId || "",
    });
    setImagePreview({
      image: user.governmentId,
    });
    setIsUpdateUserModalOpen(true);
  };

  const handleCloseEditAdopter = () => {
    setUpdateUser({
      firstName: "",
      lastName: "",
      mobileNumber: "",
      address: "",
      birthdate: null,
      verified: false,
      governmentId: "",
    });
    setImagePreview({
      image: "",
      file: "",
      flag: true,
    });
    setIsUpdateUserModalOpen(false);
  };

  // Function to handle image selection
  const handleImageChangeAdopter = (e) => {
    const MAX_SIZE_MB = 5;
    const file = e.target.files[0];

    if (file) {
      // Check the file size
      const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB

      if (fileSizeMB < MAX_SIZE_MB) {
        setImagePreview({
          image: URL.createObjectURL(file),
          file: file,
          flag: true,
        });
      } else {
        setImagePreview({
          image: updateUser.governmentId,
          flag: false,
        });
        setAlertMessage(
          "Image is too large. Please select an image under 5MB."
        );
        setAlertType("error");

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } else {
      setImagePreview({
        image: "",
        file: "",
        flag: true,
      });
    }
  };

  // Function to handle user update
  const handleUpdateUser = async () => {
    if (
      !updateUser.firstName ||
      !updateUser.lastName ||
      !updateUser.mobileNumber ||
      !updateUser.birthdate ||
      !updateUser.address
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
      const birthdateTimestamp = Timestamp.fromDate(updateUser.birthdate);

      // Initialize updated data
      const updatedData = {
        firstName: updateUser.firstName,
        lastName: updateUser.lastName,
        mobileNumber: formattedMobileNumber,
        address: updateUser.address,
        birthdate: birthdateTimestamp,
        verified: updateUser.verified,
      };

      // If a new image is selected, upload it and get the URL
      if (imagePreview.flag && imagePreview.file) {
        try {
          const imageRef = ref(
            storage,
            `adopters/governmentIds/${selectedUser.id}`
          );
          await uploadBytes(imageRef, imagePreview.file);
          const url = await getDownloadURL(imageRef);
          updatedData.governmentId = url; // Update the URL in the data to be sent to Firestore
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          setAlertMessage("Failed to upload the image.");
          setAlertType("error");
          setLoading(false);
          return;
        }
      }

      await updateDoc(doc(db, "users", selectedUser.id), updatedData);

      // Update the selectedUser state with the new data
      setSelectedUser((prevUser) => ({
        ...prevUser,
        ...updatedData,
      }));

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
      const userPostsQuery = query(
        petsCollectionRef,
        where("userId", "==", userId)
      );
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

  const [petInfo, setPetInfo] = useState({
    adoptedBy: "",
    age: "",
    breed: "",
    description: "",
    gender: "",
    location: "",
    name: "",
    petPosted: "",
    petPrice: "",
    type: "",
    weight: "",
    userId: "",
    images: "",
  });
  const [imagePreview, setImagePreview] = useState({
    image: "",
    file: "",
    flag: true,
  });
  const fileInputRef = useRef(null);

  const [isAddPetModal, setAddPetModal] = useState(false);
  const handleAddPetButton = (user) => {
    setSelectedUser(user);
    setPetInfo({
      adoptedBy: "",
      age: "",
      breed: "",
      description: "",
      gender: "",
      location: "",
      name: "",
      petPosted: "",
      petPrice: "",
      type: "",
      weight: "",
      userId: "",
      images: "",
    });
    setAddPetModal((s) => !s);
  };
  // Close offcanvas
  const handleCloseAddPetOffCanvas = () => {
    setPetInfo({
      name: "",
      breed: "",
      age: "",
      description: "",
      gender: "",
      type: "",
      weight: "",
      images: "",
      petPrice: "",
      adoptedBy: "",
      location: "",
      petPosted: "",
      userId: "",
    });
    setImagePreview({
      image: "",
      file: "",
      flag: true,
    });
    setAddPetModal(false);
  };

  // Input change for forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetInfo((prevPet) => ({
      ...prevPet,
      [name]: value,
    }));
  };

  // Function to handle image selection
  const handleImageChange = (e) => {
    const MAX_SIZE_MB = 5;
    const file = e.target.files[0];

    if (file) {
      // Check the file size
      const fileSizeMB = file.size / (1024 * 1024);

      if (fileSizeMB < MAX_SIZE_MB) {
        setImagePreview({
          image: URL.createObjectURL(file),
          file: file,
        });
      } else {
        setImagePreview({
          image: "",
          file: "",
        });

        setAlertMessage(
          "Image is too large. Please select an image under 5MB."
        );
        setAlertType("error");

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleAddPetSubmit = async () => {
    // Validation
    if (
      !petInfo.name ||
      !petInfo.breed ||
      !petInfo.age ||
      !petInfo.description ||
      !petInfo.gender ||
      !petInfo.type ||
      !petInfo.weight ||
      !imagePreview.image
    ) {
      setAlertMessage("All fields are required, except for pet price.");
      setAlertType("error");
      return; // Stop submission if there are errors
    }

    // Check if weight is a positive number and not zero
    if (isNaN(petInfo.weight) || petInfo.weight <= 0) {
      setAlertMessage("Weight must be a positive number and cannot be zero.");
      setAlertType("error");
      return; // Stop submission if weight is invalid
    }

    // Check if fee is a number and not less than zero
    if (petInfo.petPrice && (isNaN(petInfo.petPrice) || petInfo.petPrice < 0)) {
      setAlertMessage("Fee must be a number and cannot be less than zero.");
      setAlertType("error");
      return; // Stop submission if fee is invalid
    }
    try {
      setLoading(true);
      const updatedData = {
        ...petInfo,
        userId: selectedUser.id,
        location: selectedUser.address,
      };
      const timestamp = new Date().getTime();
      const imageRef = ref(
        storage,
        `adopters/petsPosted/${updatedData.userId}/${timestamp}`
      );
      await uploadBytes(imageRef, imagePreview.file);
      const url = await getDownloadURL(imageRef);
      updatedData.images = url; // Update the URL in the data to be sent to Firestore

      const petsCollectionRef = collection(db, "pets");
      await addDoc(petsCollectionRef, updatedData);

      handleCloseAddPetOffCanvas();
      setTimeout(() => {
        setLoading(false);
        setAlertMessage("Successfully Added Pet");
        setAlertType("success");
      }, 1000);
    } catch (error) {
      setLoading(false);
      setAlertMessage("Error Adding Pet");
      setAlertType("error");
    }
  };

  const [isAddUserModal, setAddUserModal] = useState(false);

  const handleAddUserForm = () => {
    setUpdateUser({
      firstName: "",
      lastName: "",
      mobileNumber: "",
      address: "",
      birthdate: "",
      verified: false,
      governmentId: "",
      email: "",
    });
    setAddUserModal(true);
  };

  const handleCloseAddUserForm = () => {
    setUpdateUser({
      firstName: "",
      lastName: "",
      mobileNumber: "",
      address: "",
      birthdate: "",
      verified: false,
      governmentId: "",
      email: "",
    });
    setImagePreview({
      image: "",
      file: "",
      flag: true,
    });
    setAddUserModal(false);
  };

  const handleAddUserSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation
    if (
      !updateUser.firstName ||
      !updateUser.lastName ||
      !updateUser.mobileNumber ||
      !updateUser.email ||
      !updateUser.address ||
      !updateUser.birthdate
    ) {
      setAlertMessage("All fields are required.");
      setAlertType("error");
      return; // Stop submission if there are errors
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

    // Validate email format
    if (!emailRegex.test(updateUser.email)) {
      setAlertMessage("Please enter a valid email address.");
      setAlertType("error");
      return;
    }

    try {
      setLoading(true);
      const formattedMobileNumber = `+63${updateUser.mobileNumber}`;
      const birthdateTimestamp = Timestamp.fromDate(updateUser.birthdate);
      // Create a new user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        updateUser.email,
        "user12345"
      );
      const user = userCredential.user;

      // Add additional user information to Firestore
      const userData = {
        firstName: updateUser.firstName,
        lastName: updateUser.lastName,
        mobileNumber: formattedMobileNumber,
        email: updateUser.email,
        address: updateUser.address,
        birthdate: birthdateTimestamp,
        verified: false,
      };

      if (imagePreview.flag && imagePreview.file) {
        try {
          const imageRef = ref(storage, `adopters/governmentIds/${user.uid}`);
          await uploadBytes(imageRef, imagePreview.file);
          const url = await getDownloadURL(imageRef);
          userData.governmentId = url; // Update the URL in the data to be sent to Firestore
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          setAlertMessage("Failed to upload the image.");
          setAlertType("error");
          setLoading(false);
          return;
        }
      }

      await setDoc(doc(db, "users", user.uid), userData);

      // Reset form fields
      handleCloseAddUserForm();
      setLoading(false);
      setAlertMessage("User added successfully.");
      setAlertType("success");
    } catch (error) {
      setLoading(false);
      console.error("Error adding user: ", error);
      setAlertMessage("Failed to add user. Please try again.");
      setAlertType("error");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", // Full month name
      day: "2-digit",
    });
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
          <Col
            style={{
              justifyContent: "flex-start",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button
              style={{
                paddingLeft: "10px",
                paddingRight: "10px",
                backgroundColor: COLORS.prim,
                border: COLORS.prim,
                color: COLORS.white,
                transition: "background-color 0.3s ease, color 0.3s ease",
              }}
              size="sm"
              onClick={() => handleAddUserForm()}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = COLORS.hover;
                e.target.style.color = COLORS.white;
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = COLORS.prim;
                e.target.style.color = COLORS.white;
              }}
            >
              Add Adopter
            </Button>
          </Col>
          <Col lg={7}>
            <h1 style={styles.pageTitle}>Adopters Page</h1>
          </Col>
          <Col></Col>
        </Row>
      </Container>
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
            {/* <div style={styles.userInfoHeader}> */}
            <Container className="mt-2">
              <Row>
                <Col lg={2}></Col>
                <Col>
                  <h3 style={styles.userInfoTitle}>Adopter Information</h3>
                </Col>
                <Col lg={2} className="p-0 d-flex align-items-center">
                  {/* <div style={styles.editButtonContainer}> */}
                  <ion-icon
                    style={{
                      fontSize: "30px",
                      cursor: "pointer",
                      color: COLORS.prim,
                    }}
                    name="add-circle-outline"
                    onClick={() => handleAddPetButton(selectedUser)} // Function for click
                    onMouseOver={(e) => {
                      e.target.style.color = COLORS.hover;
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = COLORS.prim;
                    }}
                  ></ion-icon>
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
                  {/* </div> */}
                </Col>
              </Row>
            </Container>
            {/* </div> */}
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
                  Mobile #:
                </p>
              </div>
              <div style={styles.line}>
                <p style={styles.userInfoTitleLabel}>
                  {selectedUser.mobileNumber}
                </p>
              </div>
              <div style={styles.line}>
                <p style={{ ...styles.userInfoTitleLabel, textAlign: "left" }}>
                  Birthdate:
                </p>
              </div>
              <div style={styles.line}>
                <p style={styles.userInfoTitleLabel}>
                  {selectedUser.birthdate
                    ? formatDate(selectedUser.birthdate)
                    : "N/A"}
                </p>
              </div>
              <div style={styles.line}>
                <p style={{ ...styles.userInfoTitleLabel, textAlign: "left" }}>
                  Address:
                </p>
              </div>
              <div style={styles.line}>
                <p style={styles.userInfoTitleLabel}>{selectedUser.address}</p>
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
        <Modals.UpdateModal
          updateUser={updateUser}
          setUpdateUser={setUpdateUser}
          handleInputChange={(e) =>
            setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
          }
          handleSwitchChange={(e) =>
            setUpdateUser({ ...updateUser, verified: e.target.checked })
          }
          handleUpdateUser={handleUpdateUser}
          handleImageChange={handleImageChangeAdopter}
          handleCloseUpdateUserModal={handleCloseEditAdopter}
          ref={fileInputRef}
          imagePreview={imagePreview}
        />
      )}
      {/* Add Button Modal */}
      {isAddUserModal && (
        <Modals.AddModal
          updateUser={updateUser}
          setUpdateUser={setUpdateUser}
          handleInputChange={(e) =>
            setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
          }
          handleAddUserSubmit={handleAddUserSubmit}
          handleImageChange={handleImageChangeAdopter}
          handleCloseAddUserForm={handleCloseAddUserForm}
          ref={fileInputRef}
          imagePreview={imagePreview}
        />
      )}
      {/* Delete Button Modal */}
      {isDeleteUserModalOpen && (
        <Modals.DeleteModal
          onConfirm={handleDeleteUser}
          onClose={() => setDeleteUserModalOpen(false)}
        >
          <h3 style={styles.modalTitle}>
            Are you sure you want to delete {selectedUser.firstName}?
          </h3>
        </Modals.DeleteModal>
      )}

      {/* Image Zoom Modal */}
      {isImageModalOpen && (
        <Modals.ImageModal
          isOpen={isImageModalOpen}
          imageUrl={selectedImageUrl}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}

      {/* Off Canvas Form for Add Pet */}
      {isAddPetModal && (
        <Modals.AddPetModal
          imagePreview={imagePreview}
          petInfo={petInfo}
          ref={fileInputRef}
          show={isAddPetModal}
          handleInputChange={handleInputChange}
          onHide={handleCloseAddPetOffCanvas}
          handleImageChange={handleImageChange}
          handleAddPetSubmit={handleAddPetSubmit}
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
