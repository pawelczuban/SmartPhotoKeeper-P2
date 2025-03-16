import React, { useState } from "react";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import Spinner from "./Spinner";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import EditIcon from "./EditIcon"; // Import the EditIcon component

function PhotoAlbum({ photos, isLoading, onFileInputClick }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const handleClick = (clickedIndex) => {
    setIndex(clickedIndex);
    setOpen(true);
  };

  const handleEditClick = (event, photoId) => {
    event.stopPropagation(); // Prevent the click from propagating to the parent
    console.log(`Edit photo with ID: ${photoId}`);
    // navigate(`/edit/${photoId}`); // Navigate to the edit page
  };

  return (
    <div className="photos-viewport scrollable">
      {isLoading ? (
        <Spinner />
      ) : photos.length > 0 ? (
        <>
          <RowsPhotoAlbum
            photos={photos}
            targetRowHeight={250}
            rowConstraints={{ singleRowMaxHeight: 250 }}
            onClick={({ index }) => handleClick(index)} // Enable click to open Lightbox
          />
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            slides={photos.map((photo) => ({
              src: photo.src,
              alt: photo.title,
              width: photo.width,
              height: photo.height,
              id: photo.id, // Ensure each photo has a unique ID
            }))}
            index={index}
            toolbar={{
              buttons: [
                <button
                  key="edit-button"
                  type="button"
                  className="yarl__button"
                  onClick={(e) => handleEditClick(e, photos[index].id)} // Call edit function
                >
                  <EditIcon />
                </button>,
                "close",
              ],
            }}
            plugins={[Slideshow, Thumbnails, Zoom, Fullscreen]} // Include necessary plugins
          />
        </>
      ) : (
        <div
          className="drag-drop-placeholder d-flex align-items-center justify-content-center text-center"
          onClick={onFileInputClick}
        >
          <p className="text-muted">
            Drag and drop photos here or click to upload.
          </p>
        </div>
      )}
    </div>
  );
}

export default PhotoAlbum;
