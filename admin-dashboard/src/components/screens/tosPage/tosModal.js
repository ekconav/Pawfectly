import React from "react";
import styles from "./styles";
import { Form, Row, Col } from "react-bootstrap";

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

// Add TOS Modal Component
const CreateTOSModal = ({
  createTOS,
  handleInputChange,
  handleCreateTOS,
  handleCloseCreateTOSModal,
  handleOrderChange,
  availableOrders,
}) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2>Add New Terms Of Service</h2>
        <Form>
          {/* Select for order */}
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="title"
              placeholder="Title"
              value={createTOS.title}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              name="description"
              value={createTOS.description}
              onChange={handleInputChange}
              as="textarea"
              rows={3}
              placeholder="description"
              required
              style={{
                width: '100%', 
                maxHeight: '50vh', 
                resize: 'vertical',  
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Row className="align-items-center">
              <Col xs="auto" className="text-start ">
                <Form.Label className="m-0">Order #</Form.Label>
              </Col>
              <Col>
                <Form.Select
                  aria-label="Select Order"
                  name="order"
                  value={createTOS.order}
                  onChange={handleOrderChange}
                  required
                  style={{ width: "10vw" }}
                >
                  {availableOrders.map((order) => (
                    <option key={order} value={order}>
                      {order}
                    </option>
                  ))}
                  <option value={availableOrders.length + 1}>
                    {availableOrders.length + 1}
                  </option>
                </Form.Select>
              </Col>
            </Row>
          </Form.Group>
        </Form>
        <div style={styles.modalButtons}>
          <button onClick={handleCreateTOS} style={styles.confirmButton}>
            Confirm
          </button>
          <button
            onClick={handleCloseCreateTOSModal}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Export multiple modals
const Modal = {
  DeleteModal,
  CreateTOSModal,
};

export default Modal;
