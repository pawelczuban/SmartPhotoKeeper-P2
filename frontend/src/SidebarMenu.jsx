import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/js/dist/dropdown";
import "./SidebarMenu.css";

function SidebarMenu({ albums, selectedAlbumId, onAlbumClick }) {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const logoutUser = async (e) => {
    e.preventDefault();
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="sidebar-menu bg-dark col-auto col-md-2 vh-100 sticky-top d-flex justify-content-between flex-column">
      <div>
        <Link
          to="/albums"
          className="text-decoration-none text-white d-none d-sm-inline d-flex align-items-center ms-3 mt-2"
        >
          <span className="ms-1 fs-4 d-none d-sm-inline">SmartPhotoKeep</span>
        </Link>
        <hr className="text-secondary d-none d-sm-block" />

        <ul className="nav nav-pills flex-column mt-3 mt-sm-0">
          {albums.map((album, index) => (
            <li className="nav-item text-white fs-4" key={index}>
              <a
                className={`nav-link fs-5 my-1 py-2 py-sm-0 ${selectedAlbumId === album.id ? "active" : "text-white"}`}
                onClick={() => onAlbumClick(album.id)}
                aria-current="page"
              >
                <i
                  className={`fs-4 bi ${selectedAlbumId === album.id ? "bi-folder2-open" : "bi-folder-fill"}`}
                ></i>
                <span className="ms-3 d-none d-sm-inline">{album.label}</span>
              </a>
            </li>
          ))}
          <li className="nav-item text-white fs-4">
            <a
              className="nav-link text-white fs-5 my-1 py-2 py-sm-0"
              onClick={() => onAlbumClick(null)}
              aria-current="page"
            >
              <i className="fs-4 bi bi-folder-plus"></i>
              <span className="ms-3 d-none d-sm-inline">Add album</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="dropdown open">
        <a
          className="text-decoration-none text-white dropdown-toggle p-3"
          type="button"
          id="triggerId"
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <i className="bi bi-person-circle"></i>{" "}
          <span className="ms-2 d-none d-sm-inline">
            {user?.email.split("@")[0]}
          </span>
        </a>
        <div className="dropdown-menu" aria-labelledby="triggerId">
          <button className="dropdown-item">Profile</button>
          <button className="dropdown-item" onClick={logoutUser}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default SidebarMenu;
