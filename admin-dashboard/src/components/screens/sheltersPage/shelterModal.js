import React from "react";
import styles from "./styles";
import Switch from "@mui/material/Switch";

// Delete Modal Component
const DeleteModal = ({ onConfirm, onClose, children }) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        {children}
        <div style={styles.modalButtons}>
          <button style={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button style={styles.confirmButton} onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Update Modal Component
const UpdateModal = ({
  updateShelter,
  handleInputChange,
  handleSwitchChange,
  handleUpdateShelter,
  handleCloseUpdateShelterModal,
}) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.modalTitle}>Edit Shelter Information</h2>
        <div style={styles.modalForm}>
          <input
            type="text"
            name="shelterName"
            placeholder="Shelter Name"
            value={updateShelter.shelterName}
            onChange={handleInputChange}
            style={styles.inputField}
            required
          />
          <div style={styles.mobileNumberContainer}>
            <span style={styles.countryCode}>+63</span>
            <input
              type="text"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={updateShelter.mobileNumber}
              onChange={handleInputChange}
              style={{ ...styles.inputField, paddingLeft: "50px" }} // Adding padding to avoid overlap
              required
            />
          </div>
          <div style={styles.SwitchLine}>
            <label style={styles.title}>Verified:</label>
            <Switch
              checked={updateShelter.verified}
              onChange={handleSwitchChange}
              inputProps={{ "aria-label": "User verification switch" }}
            />
          </div>
          <div style={styles.modalButtons}>
            <button
              onClick={handleCloseUpdateShelterModal}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button onClick={handleUpdateShelter} style={styles.confirmButton}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// Image Modal Component
const ImageModal = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Full View" style={styles.fullImage} />
        <button onClick={onClose} style={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
};

// Export multiple modals
const Modal = {
  DeleteModal,
  UpdateModal,
  ImageModal,
};

export default Modal;
