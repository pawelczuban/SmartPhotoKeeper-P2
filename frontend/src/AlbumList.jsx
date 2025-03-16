import React, { useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import AlbumEditModal from "./AlbumEditModal";
import "./AlbumList.css";

const AlbumList = () => {
  const { albumsData, onAlbumClick } = useOutletContext();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const handleEditClick = (album) => {
    setSelectedAlbum(album);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedAlbum(null);
  };

  const handleSave = () => {
    window.location.reload();
  };

  return (
    <>
      <Row>
        {albumsData.map((album) => (
          <Col key={album.id} xs={12} md={4} className="mb-4">
            <Card onClick={() => onAlbumClick(album.id)} className="album-card">
              <Card.Img variant="top" src={album.src} />
              <Card.Body className="card-body">
                <Card.Title className="mb-0">{album.label}</Card.Title>
                <i
                  className="bi bi-pencil-fill edit-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(album);
                  }}
                ></i>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {selectedAlbum && (
        <AlbumEditModal
          show={showModal}
          handleClose={handleModalClose}
          album={selectedAlbum}
          handleSave={handleSave}
        />
      )}
    </>
  );
};

export default AlbumList;
