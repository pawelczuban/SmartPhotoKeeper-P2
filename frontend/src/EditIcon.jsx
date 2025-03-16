// EditIcon.js
import React from "react";
import "./EditIcon.css"; // Import the CSS file

const EditIcon = ({ onClick }) => {
  return (
    <div className="edit-icon" onClick={onClick}>
      <i
        className="bi bi-pencil-fill"
        style={{ fontSize: "20px", color: "#FFF" }}
      ></i>
    </div>
  );
};

export default EditIcon;
