import React from "react";
import styles from "./styles";
import COLORS from "../../colors";
import {
  Form,
  Container,
  Row,
  Col,
  Stack,
  Offcanvas,
  Button,
  Modal,
} from "react-bootstrap";

// Delete Modal Component
const DeleteModal = ({ onClose, show, children, onConfirm }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>WARNING!</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button
          style={{
            backgroundColor: COLORS.subtitle,
            color: "white",
            border: "none",
          }}
          onClick={onClose}
        >
          Close
        </Button>
        <Button
          style={{
            backgroundColor: COLORS.prim,
            color: "white",
            border: "none",
          }}
          onClick={onConfirm}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Update Modal Component
const UpdateModal = ({
  handleImageChange,
  handleInputChange,
  handleEditSubmit,
  petInfo,
  show,
  onHide,
}) => {
  return (
    <Offcanvas
      show={show}
      onHide={onHide} // Wrap in a function
      scroll={true}
      backdrop={true}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title style={styles.modalTitle}>
          Edit Pet Information
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form>
          {/* Select for order */}
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="name"
              placeholder="Name"
              style={styles.inputField}
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
              style={styles.inputField}
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
              style={styles.inputField}
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
                  style={styles.inputField}
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
                  style={styles.inputField}
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
            {petInfo.imagePreview && (
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
                    petInfo.imagePreview || require("../../../const/user.png")
                  }
                  alt="Pet"
                  style={styles.infoPicture}
                />
              </div>
            )}
            <Form.Label>Change Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*" // Allow only image files
              onChange={handleImageChange} // Handle the file selection
            />
          </Form.Group>
        </Form>
        <div style={styles.modalButtons}>
          <button style={styles.cancelButton} onClick={onHide}>
            Cancel
          </button>
          <button style={styles.confirmButton} onClick={handleEditSubmit}>
            Confirm
          </button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};
// Image Modal Component
const InformationModal = ({ petInfo, onClose }) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <Container>
          <Row style={{ borderBottom: `4px solid ${COLORS.prim}` }}>
            <Col xs={1}></Col>
            <Col>
              <h3 style={styles.modalTitle}>Pet Information</h3>
            </Col>
            <Col xs={1} className="text-end">
              <ion-icon
                style={styles.closeIcon}
                onClick={onClose}
                name="close-circle-outline"
                onMouseOver={(e) => {
                  e.currentTarget.style.color = COLORS.hover;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = COLORS.prim;
                }}
              ></ion-icon>
            </Col>
          </Row>
          <Row>
            <Col className="text-start">
              <Stack gap={1}>
                <div className="pt-4">
                  <div style={styles.title}>Name</div>
                  <p style={{ paddingLeft: "20px", margin: 0 }}>
                    {petInfo.name}{" "}
                  </p>
                </div>
                <div className="pt-2">
                  <div style={styles.title}>Gender</div>
                  <p style={{ paddingLeft: "20px", margin: 0 }}>
                    {petInfo.gender}{" "}
                  </p>
                </div>
                <div className="pt-2">
                  <div style={styles.title}>Type</div>
                  <p style={{ paddingLeft: "20px", margin: 0 }}>
                    {petInfo.type}{" "}
                  </p>
                </div>
                <div className="pt-2">
                  <div style={styles.title}>Breed</div>
                  <p style={{ paddingLeft: "20px", margin: 0 }}>
                    {petInfo.breed}{" "}
                  </p>
                </div>
                <div className="pt-2">
                  <div style={styles.title}>Posted By</div>
                  <p style={{ paddingLeft: "20px", margin: 0 }}>
                    {petInfo.userId}
                  </p>
                </div>
                <div className="pt-2">
                  <div style={styles.title}>Adopted By</div>
                  <p style={{ paddingLeft: "20px", margin: 0 }}>
                    {petInfo.adoptedBy || "N/A"}
                  </p>
                </div>
                <div className="pt-2">
                  <div style={styles.title}>Description</div>
                  <div
                    style={{
                      paddingLeft: "20px",
                      margin: 0,
                      maxHeight: "100px", // Fixed height for scrollable area
                      overflowY: "auto", // Enable vertical scrolling
                      padding: "5px", // Optional: padding for content
                    }}
                  >
                    {petInfo.description.split('\n').map((line, index) => (
                      <div key={index}>{line}</div> // Use <div> for each line
                    ))}
                  </div>
                </div>
              </Stack>
            </Col>
            <Col className="text-start">
              <Stack gap={1}>
                <div className="pt-2">
                  <img
                    src={petInfo.images || require("../../../const/user.png")}
                    alt="Profile"
                    style={styles.infoPicture}
                  />
                </div>
                <div className="pt-2">
                  <div style={styles.title}>Age</div>
                  <p style={{ paddingLeft: "20px", margin: 0 }}>
                    {petInfo.age}
                  </p>
                </div>
                <div className="pt-2">
                  <div style={styles.title}>Weight</div>
                  <p style={{ paddingLeft: "20px", margin: 0 }}>
                    {petInfo.weight} kg
                  </p>
                </div>
                <div className="pt-2">
                  <div style={styles.title}>Date Posted</div>
                  <p style={{ paddingLeft: "20px", margin: 0 }}>
                    {petInfo.petPosted}{" "}
                  </p>
                </div>
                <div className="pt-2">
                  <div style={styles.title}>Price</div>
                  <p style={{ paddingLeft: "20px", margin: 0 }}>
                    {petInfo.petPrice ? `PHP ${petInfo.petPrice}` : "N/A"}
                  </p>
                </div>

                <div className="pt-2">
                  <div style={styles.title}>Location</div>
                  <p style={{ paddingLeft: "20px", margin: 0 }}>
                    {petInfo.location}
                  </p>
                </div>
              </Stack>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

// Export multiple modals
const Modals = {
  DeleteModal,
  UpdateModal,
  InformationModal,
};

export default Modals;
