import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import PhotoAlbum from "./PhotoAlbum";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchDataWithAuth } from "./api";
import { uploadFilesWithProgress } from "./uploadService"; // Import the new upload service
import UploadStatus from "./UploadStatus";
import "./AlbumDetail.css";

function AlbumDetail() {
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);
  const { albumId } = useParams();

  useEffect(() => {
    loadAlbumData();
  }, []);

  const loadAlbumData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDataWithAuth(
        `http://localhost:8080/albums/${albumId}`,
      );
      setAlbum(data.album);
      setPhotos(data.photos);
    } catch (error) {
      console.error("Failed to load album data:", error);
    }
    setIsLoading(false);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      uploadFiles(files);
    }
  };

  const uploadFiles = (files) => {
    setUploading(true);
    uploadFilesWithProgress(
      files,
      albumId,
      (updatedProgress) => setUploadProgress(updatedProgress),
      (newPhoto) => setPhotos((prevPhotos) => [...prevPhotos, newPhoto]),
    ).then(() => {
      setUploading(false);
      setUploadProgress([]);
    });
  };

  const handleFileInputClick = () => {
    fileInput.current.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      uploadFiles(files);
    }
  };

  return (
    <div className="container">
      <div className="sticky-header d-flex justify-content-between align-items-center mb-3">
        <h2>{album?.label}</h2>
        {uploading && <UploadStatus uploadProgress={uploadProgress} />}
        <button className="btn btn-primary" onClick={handleFileInputClick}>
          Add Photos
        </button>
      </div>

      <div
        className={`photos-viewport ${dragging ? "dragging" : ""}`}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          ref={fileInput}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <PhotoAlbum
          photos={photos}
          isLoading={isLoading}
          onFileInputClick={handleFileInputClick}
        />
      </div>
    </div>
  );
}

export default AlbumDetail;
