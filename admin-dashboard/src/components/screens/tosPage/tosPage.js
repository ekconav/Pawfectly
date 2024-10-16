import React, { useState, useEffect } from "react";
import Header from "../../header/header";
import styles from "./styles";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  doc,
  where,
} from "firebase/firestore";
import { db } from "../../../FirebaseConfig";
import LoadingSpinner from "../loadingPage/loadingSpinner";
import { Container, Col, Row, Button } from "react-bootstrap";
import Modal from "./tosModal";
import Alerts from "./alert";
import COLORS from "../../colors";

const TOSPage = () => {
  const [loading, setLoading] = useState(true);

  // Fetch TOS Data to Display
  const [tosData, setTosData] = useState([]);
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

        // Use the utility function to generate order number
        setAvailableOrders(generateAvailableOrders(tosList));
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
  const itemsPerPage = 4;
  const totalPages = Math.ceil(tosData.length / itemsPerPage);
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

  // Add TOS

  // Initialization
  const [createTOS, setCreateTOS] = useState({
    title: "",
    order: "",
    description: "",
  });

  // ADD TOS Modal Initialization
  const [isCreateTOSeModalOpen, setIsCreateTOSModalOpen] = useState(false);

  // Open modal
  const handleOpenCreateTOSModal = () => {
    setCreateTOS({
      title: "",
      order: availableOrders.length + 1,
      description: "",
    });
    setIsCreateTOSModalOpen(true);
  };

  // Close Modal
  const handleCloseCreateTOSModal = () => {
    setIsCreateTOSModalOpen(false);
    setCreateTOS({
      title: "",
      order: "",
      description: "",
    });
  };

  // Create TOS Submit Button
  const handleCreateTOS = async () => {
    // Validation: Ensure that all fields are filled out
    if (!createTOS.title || !createTOS.order || !createTOS.description) {
      setAlertMessage("All fields are required.");
      setAlertType("error");
      return;
    }

    // Convert order to a number
    const orderNumber = parseInt(createTOS.order, 10);

    // Check if the order number is valid
    if (orderNumber < 1 || orderNumber > availableOrders.length + 1) {
      setAlertMessage(
        `Order number must be between 1 and ${availableOrders.length + 1}`
      );
      setAlertType("error");
      return;
    }

    // Prepare the TOS data object
    const newTOS = {
      title: createTOS.title,
      order: orderNumber,
      description: createTOS.description,
    };

    try {
      // Check if the order number already exists
      const existingTOS = await getDocs(collection(db, "TOS"));
      const existingEntries = existingTOS.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Find if the order already exists
      const existingOrderEntry = existingEntries.find(
        (entry) => entry.order === orderNumber
      );

      if (existingOrderEntry) {
        // Increment the order numbers for entries that are greater than or equal to the selected order
        const updatedEntries = existingEntries.map((entry) => {
          if (entry.order >= orderNumber) {
            return { ...entry, order: entry.order + 1 };
          }
          return entry;
        });

        // Update the existing TOS entries in Firestore
        const batch = writeBatch(db);
        updatedEntries.forEach((entry) => {
          const docRef = doc(collection(db, "TOS"), entry.id);
          batch.set(docRef, {
            title: entry.title,
            order: entry.order,
            description: entry.description,
          });
        });

        await batch.commit();
      }

      // Add the new TOS entry to your Firestore collection
      await addDoc(collection(db, "TOS"), newTOS);

      handleCloseCreateTOSModal();
      setAlertMessage(`New TOS has been added`);
      setAlertType("success");
    } catch (error) {
      console.error("Error adding TOS:", error); // Log the error
      setAlertMessage(`Failed to add new TOS`);
      setAlertType("error");
    }
  };

  // Function for Number of Order
  const [availableOrders, setAvailableOrders] = useState([]);
  const generateAvailableOrders = (tosList) => {
    const maxOrder =
      tosList.length > 0 ? Math.max(...tosList.map((item) => item.order)) : 0;
    // Generate available order numbers (1 to maxOrder + 1)
    return [...Array(maxOrder + 1).keys()].slice(1);
  };

  // Input Change for forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateTOS((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Handle order selection from dropdown
  const handleOrderChange = (e) => {
    const { value } = e.target;
    setCreateTOS((prev) => ({
      ...prev,
      order: value,
    }));
  };

  const [selectedTOS, setSelectedTOS] = useState(null);

  const [isDeleteTOSModalOpen, setDeleteTOSModalOpen] = useState(false);

  const handleOpenDeleteModal = (tosItem) => {
    setSelectedTOS(tosItem);

    setDeleteTOSModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteTOSModalOpen(false); // Close modal
  };

  // Function to handle TOS deletion
  const handleConfirmDelete = async () => {
    if (selectedTOS?.id) {
      try {
        // delete the selected in the firebase
        const docRef = doc(db, "TOS", selectedTOS.id);
        await deleteDoc(docRef);

        const higherOrderQuery = query(
          collection(db, "TOS"),
          where("order", ">", selectedTOS.order)
        );

        const querySnapshot = await getDocs(higherOrderQuery);

        //Decrement the order of TOS entries with higher orders
        const batch = writeBatch(db);
        querySnapshot.forEach((docSnapshot) => {
          const docRef = doc(db, "TOS", docSnapshot.id);
          const newOrder = docSnapshot.data().order - 1;
          batch.update(docRef, { order: newOrder });
        });
        await batch.commit();

        setAlertMessage(`TOS entry has been deleted`);
        setAlertType("success");
        setDeleteTOSModalOpen(false);
      } catch (error) {
        setAlertMessage(`Error deleting TOS entry`);
        setAlertType("error");
      }
    }
  };

  // Edit TOS
  const [isEditTOSModalOpen, setEditTOSModalOpen] = useState(false);

  // Open Edit TOS Modal
  const handleOpenEditTOSModal = (tosItem) => {
    setSelectedTOS(tosItem);
    setCreateTOS({
      title: tosItem.title,
      description: tosItem.description,
    });
    setEditTOSModalOpen(true);
  };

  // Clsoe Edit TOS Modal
  const handleCloseEditTOSModal = () => {
    setEditTOSModalOpen(false);
  };

  // Edit TOS
  const handleEditTOS = async () => {
    if (!createTOS.title || !createTOS.description) {
      setAlertMessage("All fields are required.");
      setAlertType("error");
      return;
    }

    try {
      const docRef = doc(db, "TOS", selectedTOS.id);
      await updateDoc(docRef, {
        title: createTOS.title,
        description: createTOS.description,
      });
      setAlertMessage("TOS entry has been successfully updated.");
      setAlertType("success");
      setEditTOSModalOpen(false);
    } catch (error) {
      setAlertMessage("Failed to update TOS entry.");
      setAlertType("error");
    }
  };

  // Notify Modal
  const [isNotifyTOSModalOpen, setNotifyTOSModalOpen] = useState(false);

  // Open Notify Modal
  const handleOpenNotifyTOSModal = () => {
    setNotifyTOSModalOpen(true);
  };

  // Close notify Modal
  const handleCloseNotifyTOSModal = () => {
    setNotifyTOSModalOpen(false);
  };

  // Turn termsAccpeted to false to all users
  const handleNotifyTOS = async () => {
    try {
      const usersCollectionRef = collection(db, "users");
      const sheltersCollectionRef = collection(db, "shelters");

      const usersQuery = query(
        usersCollectionRef,
        where("termsAccepted", "==", true)
      );
      const usersSnapshot = await getDocs(usersQuery);

      // Query shelters where termsAccepted is true
      const sheltersQuery = query(
        sheltersCollectionRef,
        where("termsAccepted", "==", true)
      );
      const sheltersSnapshot = await getDocs(sheltersQuery);

      const batch = writeBatch(db);

      usersSnapshot.forEach((doc) => {
        const userDocRef = doc.ref;
        batch.update(userDocRef, { termsAccepted: false });
      });

      // Update shelters
      sheltersSnapshot.forEach((doc) => {
        const shelterDocRef = doc.ref;
        batch.update(shelterDocRef, { termsAccepted: false });
      });

      await batch.commit();

      setNotifyTOSModalOpen(false);
      setAlertMessage("Users have been successfully notified of the new TOS.");
      setAlertType("success");
    } catch (error) {
      setAlertMessage("Error notifying users about the new TOS.");
      setAlertType("error");
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
            <div style={styles.pageTitle}>Terms Of Service</div>
          </Col>
          <Col
            style={{
              ...styles.line,
              justifyContent: "flex-end",
              height: "10vh",
              margin: 10,
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
              onClick={() => handleOpenNotifyTOSModal()}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = COLORS.hover;
                e.target.style.color = COLORS.white;
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = COLORS.prim;
                e.target.style.color = COLORS.white;
              }}
            >
              Notify Users
            </Button>
            <ion-icon
              style={{
                fontSize: "30px",
                cursor: "pointer",
                paddingLeft: "10px",
                paddingRight: "10px",
                color: COLORS.prim,
              }}
              name="add-circle-outline"
              onClick={() => handleOpenCreateTOSModal()} // Function for click
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
                <ion-icon
                  name="pencil"
                  style={styles.editIcon}
                  onClick={() => handleOpenEditTOSModal(TOSitem)}
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
                  onClick={() => handleOpenDeleteModal(TOSitem)}
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

      {/* Create TOS Modal */}
      {isCreateTOSeModalOpen && (
        <Modal.CreateTOSModal
          createTOS={createTOS}
          handleInputChange={handleInputChange}
          handleCreateTOS={handleCreateTOS}
          handleCloseCreateTOSModal={handleCloseCreateTOSModal}
          handleOrderChange={handleOrderChange}
          availableOrders={availableOrders}
        />
      )}

      {/* Delete Button Modal */}
      {isDeleteTOSModalOpen && (
        <Modal.DeleteModal
          onConfirm={handleConfirmDelete}
          onClose={handleCloseDeleteModal}
        >
          <h3 style={styles.modalTitle}>
            Are you sure you want to delete {selectedTOS?.title}?
          </h3>
        </Modal.DeleteModal>
      )}

      {/* Edit TOS Modal */}
      {isEditTOSModalOpen && (
        <Modal.EditTOSModal
          createTOS={createTOS}
          handleInputChange={handleInputChange}
          handleEditTOS={handleEditTOS}
          handleCloseEditTOSModal={handleCloseEditTOSModal}
        />
      )}

      {/* Notify Button Modal */}
      {isNotifyTOSModalOpen && (
        <Modal.NotifyModal
          onConfirm={handleNotifyTOS}
          onClose={handleCloseNotifyTOSModal}
        >
          <h3 style={styles.modalTitle}>NOTIFY ALL USERS?</h3>
        </Modal.NotifyModal>
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

export default TOSPage;
