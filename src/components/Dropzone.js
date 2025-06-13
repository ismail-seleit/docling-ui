import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './Dropzone.css';

const Dropzone = ({ onDrop }) => {
  const onDropCallback = useCallback(acceptedFiles => {
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({ onDrop: onDropCallback, noClick: true });

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} />
      <div className="dropzone-content">
        <p>Drag and drop your documents here</p>
        <button type="button" onClick={open} className="select-files-button">
          Select Files
        </button>
      </div>
    </div>
  );
};

export default Dropzone;
