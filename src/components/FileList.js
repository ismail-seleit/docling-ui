import React from 'react';
import './FileList.css';

const FileList = ({ files }) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="file-list">
      <ul>
        {files.map((fileObj, i) => (
          <li key={i}>
            <span>{fileObj.file.name}</span>
            <span className={`status ${fileObj.status}`}>{fileObj.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
