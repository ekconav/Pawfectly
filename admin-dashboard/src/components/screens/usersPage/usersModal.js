import React, { forwardRef } from "react";
import styles from "./styles";
import Switch from "@mui/material/Switch";
import { Form, Row, Col, Offcanvas } from "react-bootstrap";
import COLORS from "../../colors";
import DatePicker from "react-datepicker";

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
const UpdateModal = forwardRef(
  (
    {
      updateUser,
      setUpdateUser,
      handleInputChange,
      handleSwitchChange,
      handleUpdateUser,
      handleCloseUpdateUserModal,
      handleImageChange,
      imagePreview,
    },
    ref
  ) => {
    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <h3 style={styles.modalTitle}>Edit Adopter Information</h3>
          {/* <div style={styles.modalForm}> */}
          <Form>
            {/* Select for order */}
            <Form.Group className="mb-2">
              <Form.Control
                type="text"
                name="firstName"
                placeholder="First Name"
                value={updateUser.firstName}
                onChange={handleInputChange}
                style={styles.inputField}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={updateUser.lastName}
                onChange={handleInputChange}
                style={styles.inputField}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <div style={styles.mobileNumberContainer}>
                <span style={styles.countryCode}>+63</span>
                <Form.Control
                  type="text"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  value={updateUser.mobileNumber}
                  onChange={handleInputChange}
                  style={{ ...styles.inputField, paddingLeft: "50px" }} // Adding padding to avoid overlap
                  required
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                type="text"
                name="address"
                placeholder="address"
                value={updateUser.address}
                onChange={handleInputChange}
                style={styles.inputField}
                required
              />
            </Form.Group>

            <div style={styles.SwitchLine}>
              <label style={styles.title}>Birthdate:</label>
              <DatePicker
                showIcon
                placeholderText="Birthdate"
                selected={updateUser.birthdate} // Bind to the current birthdate in the state
                onChange={(date) =>
                  setUpdateUser({ ...updateUser, birthdate: date })
                } // Directly set the date
                dateFormat="yyyy-MM-dd"
                className={styles.datePicker} // Use the defined style here
                required
              />
            </div>
            <div style={styles.SwitchLine}>
              <label style={styles.title}>Verified:</label>
              <Switch
                checked={updateUser.verified}
                onChange={handleSwitchChange}
                inputProps={{ "aria-label": "User verification switch" }}
              />
            </div>
            <Form.Group className="mb-2">
              {imagePreview.image && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center", // Center horizontally
                    alignItems: "center", // Center vertically
                  }}
                >
                  <img
                    src={
                      imagePreview.image || require("../../../const/user.png")
                    }
                    alt="Government Id"
                    style={{ 
                      ...styles.infoPicture, 
                      width: "10vw",
                      height: "15vh",
                    }} 
                  />
                </div>
              )}
              <Form.Control
                ref={ref}
                type="file"
                accept="image/*" // Allow only image files
                onChange={handleImageChange}
                required
              />
            </Form.Group>
          </Form>
          <div style={styles.modalButtons}>
            <button
              onClick={handleCloseUpdateUserModal}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button onClick={handleUpdateUser} style={styles.confirmButton}>
              Confirm
            </button>
          </div>
        </div>
        {/* </div> */}
      </div>
    );
  }
);
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

// Update Modal Component
const AddPetModal = forwardRef(
  (
    {
      handleImageChange,
      handleInputChange,
      handleAddPetSubmit,
      petInfo,
      imagePreview,
      show,
      onHide,
    },
    ref // The forwarded ref is received as the second argument
  ) => {
    return (
      <Offcanvas
        show={show}
        onHide={onHide} // Wrap in a function
        scroll={true}
        backdrop={true}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={styles.modalTitle}>Add Pet</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            {/* Select for order */}
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="name"
                placeholder="Name"
                style={styles.inputFieldOffcanvas}
                value={petInfo.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="breed"
                placeholder="Breed"
                style={styles.inputFieldOffcanvas}
                value={petInfo.breed}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Select
                aria-label="Age"
                name="age"
                value={petInfo.age}
                onChange={handleInputChange}
                required
                style={styles.inputFieldOffcanvas}
              >
                <option value="">Choose Age</option>
                <option value="0-3 Months">0-3 Months</option>
                <option value="4-6 Months">4-6 Months</option>
                <option value="7-9 Months">7-9 Months</option>
                <option value="10-12 Months">10-12 Months</option>
                <option value="10-12 Months">1-3 Years Old</option>
                <option value="4-6 Years Old">4-6 Years Old</option>
                <option value="7 Years Old and Above">
                  7 Years Old and Above
                </option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Row>
                <Col xs={3}>
                  <Form.Label>Type</Form.Label>
                </Col>
                <Col>
                  <Form.Check
                    inline
                    label="Dog"
                    name="type"
                    type="radio"
                    value="Dog"
                    checked={petInfo.type === "Dog"}
                    onChange={handleInputChange}
                  />
                  <Form.Check
                    inline
                    label="Cat"
                    name="type"
                    type="radio"
                    value="Cat"
                    checked={petInfo.type === "Cat"}
                    onChange={handleInputChange}
                  />
                  <Form.Check
                    inline
                    label="Others"
                    name="type"
                    type="radio"
                    value="Others"
                    checked={petInfo.type === "Others"}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mb-2">
              <Row>
                <Col xs={3}>
                  <Form.Label>Gender</Form.Label>
                </Col>
                <Col>
                  <Form.Check
                    inline
                    label="Male"
                    name="gender"
                    type="radio"
                    value="Male"
                    checked={petInfo.gender === "Male"}
                    onChange={handleInputChange}
                  />
                  <Form.Check
                    inline
                    label="Female"
                    name="gender"
                    type="radio"
                    value="Female"
                    checked={petInfo.gender === "Female"}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="weight"
                    placeholder="Weight (kg)"
                    style={styles.inputFieldOffcanvas}
                    value={petInfo.weight}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="petPrice"
                    placeholder="Fee (₱)"
                    style={styles.inputFieldOffcanvas}
                    value={petInfo.petPrice}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Control
                name="description"
                value={petInfo.description}
                onChange={handleInputChange}
                as="textarea"
                placeholder="Description"
                required
                style={{
                  width: "100%",
                  minHeight: "15vh",
                  maxHeight: "15vh",
                  resize: "vertical",
                  border: `2px solid ${COLORS.prim}`,
                  borderRadius: 8,
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              {imagePreview.image && (
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "center", // Center horizontally
                    alignItems: "center", // Center vertically
                  }}
                >
                  <img
                    src={
                      imagePreview.image || require("../../../const/user.png")
                    }
                    alt="Pet"
                    style={styles.infoPicture}
                  />
                </div>
              )}
              <Form.Label>Change Image</Form.Label>
              <Form.Control
                ref={ref}
                type="file"
                accept="image/*" // Allow only image files
                onChange={handleImageChange}
                required
              />
            </Form.Group>
          </Form>
          <div style={styles.modalButtons}>
            <button style={styles.cancelButton} onClick={onHide}>
              Cancel
            </button>
            <button style={styles.confirmButton} onClick={handleAddPetSubmit}>
              Confirm
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    );
  }
);

// Export multiple modals
const Modals = {
  DeleteModal,
  UpdateModal,
  ImageModal,
  AddPetModal,
};

export default Modals;
