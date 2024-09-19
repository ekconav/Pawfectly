import React from 'react';
import styles from "./styles";
import Switch from '@mui/material/Switch';


// Delete Modal Component
const DeleteModal = ({ onConfirm, onClose, children }) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        {children}
        <div style={styles.modalButtons}>
          <button style={styles.confirmButton} onClick={onConfirm}>
            Confirm
          </button>
          <button style={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Update Modal Component
const UpdateModal = ({ updateUser, handleInputChange, handleSwitchChange, handleUpdateUser, handleCloseUpdateUserModal }) => {
    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <h2>Edit Adopter Information</h2>
          <div style={styles.modalForm}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={updateUser.firstName}
              onChange={handleInputChange}
              style={styles.inputField}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={updateUser.lastName}
              onChange={handleInputChange}
              style={styles.inputField}
              required
            />
            <input
              type="text"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={updateUser.mobileNumber}
              onChange={handleInputChange}
              style={styles.inputField}
              required
            />
            <div style={styles.SwitchLine}>
              <label style={styles.title}>Verified:</label>
              <Switch
                checked={updateUser.verified}
                onChange={handleSwitchChange}
                inputProps={{ 'aria-label': 'User verification switch' }}
              />
            </div>
            <div style={styles.modalButtons}>
              <button
                onClick={handleUpdateUser}
                style={styles.confirmButton}
              >
                Confirm
              </button>
              <button
                onClick={handleCloseUpdateUserModal}
                style={styles.cancelButton}
              >
                Cancel
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
        <button onClick={onClose} style={styles.closeButton}>Close</button>
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
