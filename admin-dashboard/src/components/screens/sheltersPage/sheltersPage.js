import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../FirebaseConfig";
import Header from "../../header/header";
import styles from "./styles.js"; // Import styles
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

// Modal Component
const Modal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <span style={styles.closeButton} onClick={onClose}>&times;</span>
        <img src={imageUrl} alt="Modal Content" style={styles.modalImage} />
      </div>
    </div>
  );
};

const SheltersPage = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const sheltersCollection = collection(db, "shelters");
        const shelterSnapshot = await getDocs(sheltersCollection);
        const shelterList = shelterSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setShelters(shelterList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching shelters:", error.message);
        setLoading(false);
      }
    };

    fetchShelters();
  }, []);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return <p>Loading shelters...</p>;
  }

  return (
    <div>
      <Header />
      <h1>Shelters Page</h1>
      {shelters.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Owner</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Verified</th>
              <th>Government ID</th>
              <th>Business Permit</th>
            </tr>
          </thead>
          <tbody>
            {shelters.map((shelter) => (
              <tr key={shelter.id}>
                <td>{shelter.shelterName}</td>
                <td>{shelter.address}</td>
                <td>{shelter.shelterOwner}</td>
                <td>{shelter.email}</td>
                <td>{shelter.mobileNumber}</td>
                <td>
                  <div style={styles.iconContainer}>
                    {shelter.verified ? (
                      <>
                        <i className="fas fa-check" style={{ ...styles.icon, color: 'green' }}></i>
                        <i className="fas fa-times" style={{ ...styles.icon, color: 'grey' }}></i>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check" style={{ ...styles.icon, color: 'grey' }}></i>
                        <i className="fas fa-times" style={{ ...styles.icon, color: 'red' }}></i>
                      </>
                    )}
                  </div>
                </td>
                <td>
                  {shelter.governmentId ? (
                    <img
                      src={shelter.governmentId}
                      alt="Government ID"
                      style={styles.clickableImage}
                      onClick={() => handleImageClick(shelter.governmentId)}
                    />
                  ) : (
                    "No ID available"
                  )}
                </td>
                <td>
                  {shelter.businessPermit ? (
                    <img
                      src={shelter.businessPermit}
                      alt="Business Permit"
                      style={styles.clickableImage}
                      onClick={() => handleImageClick(shelter.businessPermit)}
                    />
                  ) : (
                    "No permit available"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No shelters found</p>
      )}
      <Modal imageUrl={selectedImage} onClose={handleCloseModal} />
    </div>
  );
};

export default SheltersPage;
