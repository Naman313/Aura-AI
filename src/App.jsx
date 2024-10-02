import React, { useState } from 'react';
import './App.css'; // Import the external stylesheet

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // Detect file type
    const type = selectedFile.type;
    setFileType(type);

    // Create a preview URL for the file
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(previewUrl);
  };

  const renderPreview = () => {
    if (!file) return null;

    if (fileType.startsWith('image/')) {
      return (
        <div>
          <img 
            src={previewUrl} 
            alt="Image Preview" 
            className="preview" 
          />
        </div>
      );
    } else if (fileType.startsWith('video/')) {
      return (
        <video controls className="preview">
          <source src={previewUrl} type={fileType} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (fileType.startsWith('audio/')) {
      return (
        <audio controls className="audio-preview">
          <source src={previewUrl} type={fileType} />
          Your browser does not support the audio element.
        </audio>
      );
    } else if (fileType === 'application/pdf') {
      return (
        <iframe 
          src={previewUrl} 
          title="PDF Preview" 
          className="preview pdf-preview"
        ></iframe>
      );
    } else {
      return <p>File preview not available</p>;
    }
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setUploadMessage(result.message);
    } catch (error) {
      setUploadMessage('File upload failed');
    }
  };

  return (
    <div className="container">
      <div className="upload-box">
        <h2>Upload and Preview File</h2>
        <input type="file" onChange={handleFileChange} className="file-input" />
        {file && (
          <div className="preview-container">
            <h3>Preview:</h3>
            {renderPreview()}
            <button onClick={handleFileUpload} className="upload-button">Upload</button>
          </div>
        )}
        {uploadMessage && <p>{uploadMessage}</p>}
      </div>
    </div>
  );
};

export default FileUpload;
