import React, { useState, useEffect, useRef } from "react";
import Header from "../../header/header";
import styles from "./styles";
import { db, storage } from "../../../FirebaseConfig";
import { deleteObject,ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  getDoc,
  doc,
} from "firebase/firestore";
import LoadingSpinner from "../loadingPage/loadingSpinner";
import { PieChart} from "@mui/x-charts/PieChart";
import { Form, InputGroup, Container, Row, Col } from "react-bootstrap";
import COLORS from "../../colors";
import Modals from "./dashboardModal";
import Alerts from "./alert";

const DashboardPage = () => {
  const [shelterStats, setShelterStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "shelters"),
      async (sheltersSnapshot) => {
        const statsPromises = sheltersSnapshot.docs.map(async (shelterDoc) => {
          const statsRef = doc(
            db,
            `shelters/${shelterDoc.id}/statistics/${shelterDoc.id}`
          );
          const statsDoc = await getDoc(statsRef);
          return {
            shelterId: shelterDoc.id,
            ...(statsDoc.exists()
              ? statsDoc.data()
              : { petsAdopted: 0, petsRescued: 0, petsForAdoption: 0 }),
          };
        });

        const stats = await Promise.all(statsPromises);
        setShelterStats(stats);
        setLoading(false); // Set loading to false after fetching the data
      }
    );

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  const [shelterSearch, setShelterSearch] = useState(""); // For input value
  const [allShelters, setAllShelters] = useState([]); // Store all shelters from Firestore
  const [filteredShelters, setFilteredShelters] = useState([]); // For filtered shelters
  const [selectedShelterId, setSelectedShelterId] = useState(null);

  // Fetch all shelters once when the component mounts
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "shelters"),
      (querySnapshot) => {
        const shelters = [];
        querySnapshot.forEach((doc) => {
          shelters.push({ id: doc.id, ...doc.data() });
        });
        setAllShelters(shelters); // Save all shelters
      }
    );

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  // Handle filtering the shelters based on the search input
  useEffect(() => {
    if (shelterSearch.trim() !== "") {
      const lowercaseSearch = shelterSearch.toLowerCase(); // Convert search to lowercase
      const filtered = allShelters.filter(
        (shelter) => shelter.shelterName.toLowerCase().includes(lowercaseSearch) // Compare lowercase shelter names
      );
      setFilteredShelters(filtered);
    } else {
      setFilteredShelters([]); // Clear when input is empty
    }
  }, [shelterSearch, allShelters]); // Re-run when search or allShelters changes

  // Handle selecting a shelter from dropdown
  const handleShelterClick = (shelterName, shelterId) => {
    setShelterSearch(shelterName); // Set selected shelter as input value
    setSelectedShelterId(shelterId); // Save selected shelter ID
    setTimeout(() => setFilteredShelters([]), 0); // Clear the dropdown
  };

  const [pets, setPets] = useState([]);
  // Fetch pets data from Firestore using onSnapshot for real-time updates
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pets"), (petsSnapshot) => {
      const petsData = petsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPets(petsData);
      setLoading(false); // Set loading to false after fetching pets data
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  const [filteredPets, setFilteredPets] = useState([]); // Store filtered
  useEffect(() => {
    if (!selectedShelterId) {
      setFilteredPets(pets);
    }
  }, [selectedShelterId, pets]); // Run this effect wh

  const handleSearchPets = () => {
    if (selectedShelterId) {
      const filteredPets = pets.filter(
        (pet) => pet.userId === selectedShelterId
      );
      setFilteredPets(filteredPets); // Update the state with filtered pets
    } else {
      setFilteredPets(pets);
    }
  };

  // State to hold the search input for pets
  const [petSearch, setPetSearch] = useState("");

  const filteredPetsByName = petSearch
    ? filteredPets.filter((pet) =>
        pet.name.toLowerCase().includes(petSearch.toLowerCase())
      )
    : filteredPets;

  const [selectedPet, setSelectedPet] = useState(null);

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

  // View the information of the pet
  const [isViewSelectedPetModal, setVIewSelectedPetModal] = useState(false);
  const handleViewSelectedPet = async (pet) => {
    setSelectedPet(pet);

    const getAdopterName = async (userId) => {
      if (!userId) return null;
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const { firstName, lastName } = userSnap.data();
        return `${firstName} ${lastName}`;
      }
      return null;
    };

    const getPosterName = async (userId) => {
      if (!userId) return null;

      // First, check if the ID exists in the shelters collection
      const shelterRef = doc(db, "shelters", userId);
      const shelterSnap = await getDoc(shelterRef);

      if (shelterSnap.exists()) {
        // If found in shelters, return the shelterName
        const { shelterName } = shelterSnap.data();
        return shelterName || "Unknown Shelter";
      }

      // If not in shelters, check the users collection
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // If found in users, return the firstName and lastName
        const { firstName, lastName } = userSnap.data();
        return `${firstName} ${lastName}` || "Unknown User";
      }

      // If not found in either collection, return a default message
      return "Poster not found";
    };

    // Fetch the user names for 'userId' and 'adoptedBy'
    const userIdName = await getPosterName(pet.userId); // Fetch by document ID
    const adoptedByName = await getAdopterName(pet.adoptedBy); // Fetch by document ID
    setPetInfo({
      userId: userIdName || "",
      adoptedBy: adoptedByName || "",
      age: pet.age,
      breed: pet.breed,
      description: pet.description,
      gender: pet.gender,
      location: pet.location || "",
      name: pet.name,
      petPosted: pet.petPosted
        ? new Date(pet.petPosted.seconds * 1000).toLocaleDateString()
        : "",
      petPrice: pet.petPrice || "",
      type: pet.type,
      weight: pet.weight,
      images: pet.images || "",
    });
    setVIewSelectedPetModal(true);
  };

  // Delete Modal
  const [isDeleteModal, setDeleteModal] = useState(false);
  const handleDeleteButton = (pet) => {
    setSelectedPet(pet);

    setPetInfo({
      name: pet.name,
    });

    setDeleteModal(true);
  };


  // Delete the selected pet
  const handleDeleteSelectedPet = async () => {
    if (!selectedPet || !selectedPet.id) {
      setAlertMessage("Error Selecting Pet");
      setAlertType("error");
      return;
    }

    try {
      setLoading(true);
      const petRef = doc(db, "pets", selectedPet.id);
      await deleteDoc(petRef); // delete the document
      console.log(`Pet with ID ${selectedPet.id} deleted.`);

      
      // Close the modal and clear the selected pet
      setSelectedPet(null);
      // Close modal with a delay, then set loading to false
      
      setDeleteModal(false);
      // Set another delay for setting loading to false
      setTimeout(() => {
        setLoading(false);
        setAlertMessage("Successfully Deleted Pet");
        setAlertType("success");
      }, 1000);
      
    } catch (error) {
      setLoading(false);
      setAlertMessage("Error Deleting Pet");
      setAlertType("error");
    }
  };

  // Input change for forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetInfo((prevPet) => ({
      ...prevPet,
      [name]: value,
    }));
  };

  const [isEditModal, setEditModal] = useState(false);
  const [imagePreview, setImagePreview] = useState({
    image:"",
    file:"",
    flag:true,
  });
  const fileInputRef = useRef(null);


  // Data when clicking offcanvas edit
  const handleEditButton = (pet) => {
    setSelectedPet(pet);

    setPetInfo({
      age: pet.age || "",
      breed: pet.breed || "",
      description: pet.description || "",
      gender: pet.gender || "",
      name: pet.name || "",
      petPrice: pet.petPrice || "",
      type: pet.type || "",
      weight: pet.weight || "",
      images: pet.images,
    });
    setImagePreview({
      image: pet.images,
    });
    setEditModal((s) => !s);
  };

  // Close offcanvas
  const handleEditOffcanvasClose = () => {
    setSelectedPet(null);
    setPetInfo({});
    setImagePreview({
      image: "",
      file: "",
      flag: true,
    });
    setEditModal(false);
  };

  // Function to handle image selection
  const handleImageChange = (e) => {
    const MAX_SIZE_MB = 2;
    const file = e.target.files[0];

    if (file) {
      // Check the file size
      const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB

      if (fileSizeMB < MAX_SIZE_MB) {
         // Exit the function if the file is too large
         setImagePreview({
          image: URL.createObjectURL(file),
          file: file,
          flag: true,
        });
      } else {
        setImagePreview({
          image: petInfo.images,
          flag: false,
        });
        setAlertMessage("Image is too large. Please select an image under 2MB.");
        setAlertType("error");

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  // Submit Edit Button
  const handleEditSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validation
    if (
      !petInfo.name ||
      !petInfo.breed ||
      !petInfo.age ||
      !petInfo.description ||
      !petInfo.gender ||
      !petInfo.type ||
      !petInfo.weight ||
      !petInfo.images
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
      // Prepare the updated data object
      const updatedData = { ...petInfo };

      // If a new image is selected, upload it and get the URL
      if (imagePreview.flag && imagePreview.file) {
        const oldImageUrl = petInfo.images; // Assuming petInfo.images contains the URL
      const oldImageName = extractFileNameFromUrl(oldImageUrl);
        const oldImageRef = ref(storage, oldImageName);;
        // Delete the old image
        console.log(oldImageName);
        await deleteObject(oldImageRef); // Delete the old image
        const imageRef = ref(storage, `test/${imagePreview.file.name}`);
        await uploadBytes(imageRef, imagePreview.file);
        const url = await getDownloadURL(imageRef);
        updatedData.images = url; // Update the URL in the data to be sent to Firestore
      } 
      await updateDoc(doc(db, "pets", selectedPet.id), updatedData);

      //  Close the modal immediately
      setEditModal(false);

      // Add a delay before setting loading to false and displaying the alert message
      setTimeout(() => {
        setLoading(false);
        setAlertMessage("Successfully Updated Pet");
        setAlertType("success");
      }, 1000); 
            
    } catch (error) {
      setLoading(false);
      setAlertMessage("Error Updating Pet");
      setAlertType("error");
    }
  };

  const extractFileNameFromUrl = (url) => {
    // Split the URL to get the last part after the last slash
    const parts = url.split("/");
    const fileWithParams = parts[parts.length - 1]; // Get the last part of the URL
    const fileName = fileWithParams.split("?")[0]; // Remove any query parameters if present
    return decodeURIComponent(fileName); // Decode URI components to get the correct file name
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
      <h1 style={styles.pageTitle}>Dashboard Page</h1>
      <div style={styles.container}>
        <div style={styles.graphCard}>
          <h3 style={styles.pageTitle}>Graphs and Statistics</h3>
          <PieChart
            series={[
              {
                data: [
                  {
                    id: "petsAdopted",
                    label: "Pets Adopted",
                    value: shelterStats.reduce(
                      (acc, shelter) => acc + shelter.petsAdopted,
                      0
                    ),
                  },
                  {
                    id: "petsRescued",
                    label: "Pets Rescued",
                    value: shelterStats.reduce(
                      (acc, shelter) => acc + shelter.petsRescued,
                      0
                    ),
                  },
                  {
                    id: "petsForAdoption",
                    label: "Pets For Adoption",
                    value: shelterStats.reduce(
                      (acc, shelter) => acc + shelter.petsForAdoption,
                      0
                    ),
                  },
                ],
                highlightScope: { fade: "global", highlight: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
                cx: 100,
                cy: 100,
                outerRadius: 100,
                innerRadius: 30,
                paddingAngle: 2,
                cornerRadius: 8,
              },
            ]}
            slotProps={{
              legend: {
                direction: "column",
                position: { vertical: "middle", horizontal: "right" },
              },
            }}
          />
        </div>
        <div style={styles.summaryCard}>
          <h3 style={styles.pageTitle}>Pet Filter</h3>
          <Container className="mt-3">
            <Row>
              <Col lg={8} className="p-0">
                <InputGroup
                  style={{
                    border: `1px solid ${COLORS.prim}`,
                    borderRadius: "4px",
                  }}
                >
                  <InputGroup.Text id="shelter">
                    <ion-icon name="home-outline"></ion-icon>
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search Shelter"
                    value={shelterSearch}
                    onChange={(e) => {
                      const newSearchValue = e.target.value;
                      setShelterSearch(newSearchValue);
                      console.log(newSearchValue);

                      // Set selectedShelterId to null if the input is empty
                      if (newSearchValue.trim() === "") {
                        setSelectedShelterId(null);
                        console.log("testsa");
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && filteredShelters.length > 0) {
                        handleShelterClick(
                          filteredShelters[0].shelterName,
                          filteredShelters[0].id
                        ); // Select first suggestion on Enter
                      }
                    }}
                  />
                </InputGroup>
                {/* Display filtered results */}
                {filteredShelters.length > 0 && (
                  <div style={styles.dropdownScrollable}>
                    {filteredShelters.map((shelter) => (
                      <div
                        key={shelter.id}
                        style={styles.dropdownItem}
                        onClick={() =>
                          handleShelterClick(shelter.shelterName, shelter.id)
                        }
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = COLORS.prim;
                          e.target.style.color = COLORS.white;
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = COLORS.white;
                          e.target.style.color = COLORS.black;
                        }}
                      >
                        {shelter.shelterName}
                      </div>
                    ))}
                  </div>
                )}
              </Col>
              <Col className="d-flex align-items-center justify-content-start">
                <ion-icon
                  style={styles.searchIcon}
                  name="search-outline"
                  onClick={handleSearchPets}
                  onMouseOver={(e) => {
                    e.target.style.color = COLORS.hover;
                    e.target.style.borderColor = COLORS.hover;
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = COLORS.prim;
                    e.target.style.borderColor = COLORS.prim;
                  }}
                ></ion-icon>
              </Col>

              <Row>
                <Col className="p-0 mt-3">
                  <InputGroup
                    size="sm"
                    style={{
                      border: `1px solid ${COLORS.prim}`,
                      borderRadius: "4px",
                      padding: 0,
                    }}
                  >
                    <InputGroup.Text id="pet">
                      <ion-icon name="paw-outline"></ion-icon>
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Pet"
                      value={petSearch}
                      onChange={(e) => setPetSearch(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col className="d-flex align-items-center justify-content-end mt-3">
                </Col>
              </Row>
              <div style={{ justifyContent: "center" }}>
                <div style={styles.summaryGridCols}>
                  <div style={styles.summaryLabelRows}>
                    <div style={styles.line}>
                      <p style={styles.title}>ID</p>
                    </div>
                    <div style={styles.line}>
                      <p style={styles.title}>Category</p>
                    </div>
                    <div style={styles.line}>
                      <p style={styles.title}>Picture</p>
                    </div>
                    <div style={styles.line}>
                      <p style={styles.title}>Name</p>
                    </div>
                    <div style={styles.line}>
                      <p style={styles.title}>Gender</p>
                    </div>
                    <div style={styles.line}>
                      <p style={styles.title}>Age</p>
                    </div>
                    <div style={styles.line}>
                      <p style={styles.title}>Status</p>
                    </div>
                  </div>

                  {filteredPetsByName.length > 0 ? (
                    filteredPetsByName.map((pet) => (
                      <div key={pet.id} style={styles.summaryGridRows}>
                        <p
                          style={styles.IDline}
                          onClick={() => handleViewSelectedPet(pet)}
                        >
                          {pet.id}
                        </p>
                        <p
                          style={{ ...styles.line, cursor: "pointer" }}
                          onClick={() => handleViewSelectedPet(pet)}
                        >
                          {pet.type}
                        </p>
                        <div
                          style={{ ...styles.line, cursor: "pointer" }}
                          onClick={() => handleViewSelectedPet(pet)}
                        >
                          <img
                            src={
                              pet.images || require("../../../const/user.png")
                            }
                            alt="Profile"
                            style={styles.adminPicture}
                          />
                        </div>
                        <p
                          style={{ ...styles.line, cursor: "pointer" }}
                          onClick={() => handleViewSelectedPet(pet)}
                        >
                          {pet.name.length > 7 ? `${pet.name.slice(0, 7)}...` : pet.name}
                        </p>
                        <p
                          style={{ ...styles.line, cursor: "pointer" }}
                          onClick={() => handleViewSelectedPet(pet)}
                        >
                          {pet.gender.charAt(0)}
                        </p>
                        <p
                          style={{ ...styles.line, cursor: "pointer" }}
                          onClick={() => handleViewSelectedPet(pet)}
                        >
                          {pet.age}
                        </p>
                        <p
                          style={{ ...styles.line, cursor: "pointer" }}
                          onClick={() => handleViewSelectedPet(pet)}
                        >
                          {pet.adopted ? "Adopted" : "Up for Adoption"}
                        </p>
                        <div style={styles.line}>
                          <ion-icon
                            name="pencil"
                            style={styles.editIcon}
                            onClick={() => handleEditButton(pet)}
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
                            onClick={() => handleDeleteButton(pet)}
                            onMouseOver={(e) => {
                              e.currentTarget.style.color = COLORS.error;
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.color = COLORS.prim;
                            }}
                          ></ion-icon>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No matching pets found</p>
                  )}
                </div>
              </div>
            </Row>
          </Container>
        </div>
      </div>

      {/* Off Canvas Form for Edit */}
      {isEditModal && (
        <Modals.UpdateModal
          petInfo={petInfo}
          imagePreview={imagePreview}
          ref={fileInputRef}
          show={isEditModal}
          handleInputChange={handleInputChange}
          onHide={handleEditOffcanvasClose}
          handleImageChange={handleImageChange}
          handleEditSubmit={handleEditSubmit}
        />
      )}

      {/* Edit Button Modal */}
      {isViewSelectedPetModal && (
        <Modals.InformationModal
          petInfo={petInfo}
          onClose={() => setVIewSelectedPetModal(false)}
        />
      )}

      {/* Delete Button Modal */}
      {isDeleteModal && (
        <Modals.DeleteModal
          onConfirm={handleDeleteSelectedPet}
          show={isDeleteModal}
          onClose={() => setDeleteModal(false)}
        >
          Are you sure you want to delete {selectedPet.name}?
        </Modals.DeleteModal>
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

export default DashboardPage;
