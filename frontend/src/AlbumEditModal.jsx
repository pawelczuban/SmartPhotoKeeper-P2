import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { uploadFilesWithProgress } from "./uploadService";
import { fetchDataWithAuth } from "./api";

const AlbumEditModal = ({ show, handleClose, album, handleSave }) => {
  // handleSave is passed as a prop
  const [title, setTitle] = useState(album?.label || "");
  const [description, setDescription] = useState(album?.description || "");
  const [cover, setCover] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const handleCoverChange = (event) => {
    setCover(event.target.files[0]);
  };

  const handleSubmit = async () => {
    setIsLoading(true); // Start loading
    const updatedAlbum = {
      ...album,
      label: title,
      description,
    };

    try {
      let finalAlbum = updatedAlbum;

      if (cover) {
        // If a cover file is selected, upload it first
        await uploadFilesWithProgress(
          [cover],
          album.id,
          null,
          async (uploadedFile) => {
            if (uploadedFile && uploadedFile.id) {
              finalAlbum.cover = {
                filename: uploadedFile.filename,
                id: uploadedFile.id,
              };
            }

            // Send PUT request only after the file upload
            finalAlbum = await sendUpdateRequest(finalAlbum);
          },
        );
      } else {
        // If no cover file is selected, directly update the album
        finalAlbum = await sendUpdateRequest(finalAlbum);
      }

      // Success: Close the modal and call handleSave
      handleClose();
      handleSave(finalAlbum); // Pass the final updated album to handleSave
    } catch (error) {
      console.error("Error updating album:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const sendUpdateRequest = async (albumData) => {
    try {
      const response = await fetchDataWithAuth(
        `http://localhost:8080/albums/${albumData.id}`,
        "PUT",
        albumData,
      );
      return response; // Return the updated album
    } catch (error) {
      throw new Error("Failed to update the album");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edytuj Album</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formAlbumTitle">
            <Form.Label>Tytuł</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading} // Disable input if loading
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formAlbumDescription">
            <Form.Label>Opis</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading} // Disable input if loading
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formAlbumCover">
            <Form.Label>Okładka Albumu</Form.Label>
            <Form.Control
              type="file"
              onChange={handleCoverChange}
              disabled={isLoading} // Disable input if loading
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Anuluj
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading} // Disable button if loading
        >
          {isLoading ? "Zapisywanie..." : "Zapisz zmiany"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlbumEditModal;
