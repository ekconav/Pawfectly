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
          <h2>Edit User Information</h2>
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
                Edit User
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

// Export multiple modals
const Modal = {
  DeleteModal,
  UpdateModal,
};

export default Modal;
