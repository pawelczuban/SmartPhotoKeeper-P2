import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalNewAlbum = ({ show, handleClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading state

    const payload = {
      label: name,
      description: description,
    };

    try {
      // On success, submit the data and close the modal
      onSubmit(payload); // Pass the payload to the parent component
      handleClose(); // Close modal after submission
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error saving album:", error);
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Dodaj album</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="albumName">
            <Form.Label>Nazwa</Form.Label>
            <Form.Control
              type="text"
              placeholder="Wprowadź nazwę albumu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading} // Disable if loading
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="albumDescription">
            <Form.Label>Opis</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Wprowadź opis albumu"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isLoading} // Disable if loading
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={isLoading} // Disable button if loading
        >
          Anuluj
        </Button>
        <Button
          variant="primary"
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading} // Disable button if loading
        >
          {isLoading ? "Zapisywanie..." : "Zapisz zmiany"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalNewAlbum;
