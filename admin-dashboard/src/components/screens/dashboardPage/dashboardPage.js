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
  getDoc,
  getDocs,
  doc,
  query,
  limit,
  where,
} from "firebase/firestore";
import LoadingSpinner from "../loadingPage/loadingSpinner";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import {
  Form,
  InputGroup,
  Container,
  Row,
  Col,
  Offcanvas,
} from "react-bootstrap";
import COLORS from "../../colors";
import Modals from "./dashboardModal";

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

  const [isDeleteModal, setDeleteModal] = useState(false);
  const handleDeleteButton = (pet) => {
    setSelectedPet(pet);

    setPetInfo({
      name: pet.name,
    });

    setDeleteModal(true);
  };

  const handleDeleteSelectedPet = async () => {
    if (!selectedPet || !selectedPet.id) {
      console.error("No pet selected or missing ID.");
      return;
    }

    try {
      const petRef = doc(db, "pets", selectedPet.id);
      await deleteDoc(petRef); // delete the document
      console.log(`Pet with ID ${selectedPet.id} deleted.`);

      // Close the modal and clear the selected pet
      setDeleteModal(false);
      setSelectedPet(null);
    } catch (error) {
      console.error("Error deleting pet:", error);
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
      images: pet.images || "",
    });

    setEditModal((s) => !s);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

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
                  {/* <ion-icon
                    style={{
                      fontSize: "30px",
                      cursor: "pointer",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      color: COLORS.prim,
                    }}
                    name="add-circle-outline"
                    onClick={toggleShow}
                    onMouseOver={(e) => {
                      e.target.style.color = COLORS.hover;
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = COLORS.prim;
                    }}
                  ></ion-icon>
                  <p style={{ margin: 0, fontWeight: 30, color: COLORS.prim }}>
                    Add Pet
                  </p> */}
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
                          {pet.name}
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
        show={isEditModal}
        handleInputChange={handleInputChange}
        onHide={() => setEditModal(false)}
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
    </div>
  );
};

export default DashboardPage;
