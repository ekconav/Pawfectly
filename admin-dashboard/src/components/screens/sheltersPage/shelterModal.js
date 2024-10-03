import React from 'react';
import styles from './styles';


const ShelterModal = ({ shelter, onUpdate, onClose }) => {
    const [formData, setFormData] = React.useState({
        firstName: shelter.firstName || '',
        lastName: shelter.lastName || '',
        mobileNumber: shelter.mobileNumber || '',
        verified: shelter.verified || false,
    });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      verified: e.target.checked,
    }));
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.mobileNumber) {
      alert("All fields are required.");
      return;
    }
    onUpdate(formData);
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2>Edit Shelter Information</h2>

        <div style={styles.formGroup}>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            style={styles.inputField}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            style={styles.inputField}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Mobile Number:</label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            style={styles.inputField}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Verified:</label>
          <input
            type="checkbox"
            checked={formData.verified}
            onChange={handleCheckboxChange}
            style={styles.checkbox}
          />
        </div>

        <div style={styles.modalActions}>
          <button onClick={handleSubmit} style={styles.updateButton}>
            Update Shelter
          </button>
          <button onClick={onClose} style={styles.closeButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShelterModal;
