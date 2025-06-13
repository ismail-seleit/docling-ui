import React from 'react';
import './DownloadButton.css';

const DownloadButton = ({ processedFiles, onDownload }) => {
  if (processedFiles.length === 0) {
    return null;
  }

  return (
    <button className="download-button" onClick={onDownload}>
      Download All
    </button>
  );
};

export default DownloadButton;
