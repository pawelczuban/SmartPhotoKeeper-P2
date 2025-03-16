// uploadService.js
import { fetchDataWithAuth } from "./api";

export const uploadFilesWithProgress = async (
  files,
  albumId,
  onProgressUpdate,
  onComplete,
) => {
  const progress = Array.from(files).map((file) => ({
    fileName: file.name,
    progress: 0,
    error: null,
  }));

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const img = new Image();
    img.src = URL.createObjectURL(file);

    // Wait for image dimensions to load
    const imageDimensions = await new Promise((resolve) => {
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src); // Free up memory
      };
    });

    try {
      // Get presigned URL data
      const presignedData = await fetchDataWithAuth(
        `http://localhost:8080/albums/${albumId}/photos`,
        "POST",
        {
          filename: file.name,
          width: imageDimensions.width,
          height: imageDimensions.height,
        },
      );

      // Upload the file to the presigned URL
      const response = await fetch(presignedData.url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (response.ok) {
        // Update progress to 100%
        progress[i].progress = 100;

        // Check if onProgressUpdate is provided and call it
        if (onProgressUpdate) {
          onProgressUpdate([...progress]);
        }

        // Fetch and return the newly uploaded photo
        const newPhoto = await fetchDataWithAuth(
          `http://localhost:8080/albums/${albumId}/photos/${presignedData.id}`,
          "GET",
        );

        onComplete(newPhoto);
      } else {
        progress[i].error = `Failed to upload ${file.name}`;

        // Check if onProgressUpdate is provided and call it
        if (onProgressUpdate) {
          onProgressUpdate([...progress]);
        }
      }
    } catch (error) {
      progress[i].error = `Error uploading ${file.name}: ${error.message}`;

      // Check if onProgressUpdate is provided and call it
      if (onProgressUpdate) {
        onProgressUpdate([...progress]);
      }

      console.error("Error during file upload:", error);
    }
  }
};
