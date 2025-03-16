import React from "react";

const UploadStatus = ({ uploadProgress }) => {
  return (
    <div className="upload-status">
      {uploadProgress.map((fileStatus, index) => (
        <div key={index} className="file-status">
          <span>{fileStatus.fileName}</span>
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${fileStatus.progress}%` }}
              aria-valuenow={fileStatus.progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {fileStatus.progress > 0 && `${fileStatus.progress}%`}
            </div>
          </div>
          {fileStatus.error && (
            <div className="text-danger">{fileStatus.error}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UploadStatus;
