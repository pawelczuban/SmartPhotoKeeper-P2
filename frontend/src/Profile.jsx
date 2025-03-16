import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import SidebarMenu from "./SidebarMenu";
import Spinner from "./Spinner";
import { fetchDataWithAuth } from "./api";
import ModalNewAlbum from "./ModalNewAlbum";

const Profile = () => {
  const navigate = useNavigate();
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [albumsData, setAlbumsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadAlbums();
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadAlbums = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDataWithAuth("http://localhost:8080/albums");
      setAlbumsData(data);
    } catch (error) {
      console.error("Failed to load albums:", error);
    }
    setIsLoading(false);
  };

  const onAlbumClick = (albumId) => {
    if (albumId === null) {
      setIsModalOpen(true);
    } else {
      setSelectedAlbumId(albumId);
      navigate(`/albums/${albumId}`);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNewAlbumSubmit = async (newAlbum) => {
    try {
      const createdAlbum = await fetchDataWithAuth(
        "http://localhost:8080/albums",
        "POST",
        newAlbum,
      );
      setAlbumsData([createdAlbum, ...albumsData]);
      setSelectedAlbumId(createdAlbum.id);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error while creating new album:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <SidebarMenu
          albums={albumsData}
          selectedAlbumId={selectedAlbumId}
          onAlbumClick={onAlbumClick}
        />
        <div className="col-md-10">
          {isLoading ? (
            <Spinner />
          ) : (
            <Outlet context={{ albumsData, onAlbumClick }} />
          )}
        </div>
        <ModalNewAlbum
          show={isModalOpen}
          handleClose={closeModal}
          onSubmit={handleNewAlbumSubmit}
        />
      </div>
    </div>
  );
};

export default Profile;
