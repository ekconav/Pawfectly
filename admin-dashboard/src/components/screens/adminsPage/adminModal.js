import React from "react";
import styles from "./styles";

// Add Modal
const addAdminModal = ({
  handleInputChange,
  handleCloseAdminModal,
  handleAddAdmin,
  newAdmin,
}) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.modalTitle}>Add New Admin</h2>
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
          <div style={styles.mobileNumberContainer}>
              <span style={styles.countryCode}>+63</span>
              <input
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={newAdmin.mobileNumber}
                onChange={handleInputChange}
                style={{ ...styles.inputField, paddingLeft: '50px' }} // Adding padding to avoid overlap
                required
              />
            </div>
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
              onClick={handleCloseAdminModal}
              className="button"
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              onClick={handleAddAdmin}
              className="button"
              style={styles.confirmButton}
            >
              Add Admin
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

//Confirm Password in Add modal
const confirmPasswordModal = ({
    handleConfirmPasswordChange,
    handleConfirmPassword,
    handleCloseConfirmPasswordModal,
    confirmPassword,
    passwordError
  }) => {
    return (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Confirm Admin Password</h2>
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
                onClick={handleCloseConfirmPasswordModal}
                className="button"
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button       
                onClick={handleConfirmPassword}
                className="button"
                style={styles.confirmButton}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
    )
  }

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
  newAdmin,
  handleInputChange,
  handleUpdateAdmin,
  handleCloseEditModal,
}) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.modalTitle}>Edit Admin Information</h2>
        <div style={styles.modalForm}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={newAdmin.firstName}
            onChange={handleInputChange}
            style={styles.inputField}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={newAdmin.lastName}
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
              value={newAdmin.mobileNumber}
              onChange={handleInputChange}
              style={{ ...styles.inputField, paddingLeft: "50px" }}
              required
            />
          </div>
          <div style={styles.modalButtons}>
            <button
              onClick={handleCloseEditModal}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
             onClick={handleUpdateAdmin} 
            style={styles.confirmButton}>
              Confirm
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
  addAdminModal,
  confirmPasswordModal,
};

export default Modal;
