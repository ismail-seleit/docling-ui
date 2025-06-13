import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Dropzone from './components/Dropzone';
import FileList from './components/FileList';
import ActionButton from './components/ActionButton';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [files, setFiles] = useState([]);
  const [appState, setAppState] = useState('idle'); // idle, processing, complete
  const [downloadUrl, setDownloadUrl] = useState('');
  const [processedFileCount, setProcessedFileCount] = useState(0);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('file-processing-start', ({ filename }) => {
      setFiles(prevFiles =>
        prevFiles.map(f =>
          f.file.name === filename ? { ...f, status: 'processing' } : f
        )
      );
    });

    socket.on('file-processing-complete', ({ filename }) => {
      setProcessedFileCount(prevCount => prevCount + 1);
      setFiles(prevFiles =>
        prevFiles.map(f =>
          f.file.name === filename ? { ...f, status: 'complete' } : f
        )
      );
    });

    socket.on('file-processing-error', ({ filename }) => {
      setFiles(prevFiles =>
        prevFiles.map(f =>
          f.file.name === filename ? { ...f, status: 'error' } : f
        )
      );
    });

    socket.on('all-files-complete', ({ downloadUrl }) => {
      setAppState('complete');
      setDownloadUrl(downloadUrl);
    });

    return () => {
      socket.off('connect');
      socket.off('file-processing-start');
      socket.off('file-processing-complete');
      socket.off('file-processing-error');
      socket.off('all-files-complete');
    };
  }, []);

  const handleDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      status: 'waiting'
    }));
    setFiles(newFiles);
    setAppState('idle');
    setProcessedFileCount(0);
  };

  const handleProcess = () => {
    const formData = new FormData();
    files.forEach(fileObj => {
      formData.append('files', fileObj.file);
    });
    formData.append('socketId', socket.id);

    setAppState('processing');

    axios.post('http://localhost:5000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  };

  const handleDownload = () => {
    window.location.href = downloadUrl;
  };

  const progress = files.length > 0 ? Math.round((processedFileCount / files.length) * 100) : 0;

  return (
    <div className="App">
      <main className="main-content">
        <h1>Docling Converter</h1>
        <p>Drag and drop your documents to convert them to Markdown.</p>
        <Dropzone onDrop={handleDrop} />
        <FileList files={files} />
        <ActionButton appState={appState} progress={progress} onProcess={handleProcess} onDownload={handleDownload} />
      </main>
    </div>
  );
}

export default App;
