import React from 'react';
import './ActionButton.css';

const ActionButton = ({ appState, progress, onProcess, onDownload }) => {
  if (appState === 'idle') {
    return (
      <button className="action-button" onClick={onProcess}>
        Run Conversion
      </button>
    );
  }

  if (appState === 'processing') {
    return (
      <button className="action-button processing" disabled>
        {`Processing... ${progress}%`}
      </button>
    );
  }

  if (appState === 'complete') {
    return (
      <button className="action-button complete" onClick={onDownload}>
        Download All
      </button>
    );
  }

  return null;
};

export default ActionButton;
