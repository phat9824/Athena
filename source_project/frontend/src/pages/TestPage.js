import React, { useState } from "react";
import { useAppContext } from '../AppContext.js';
const TestPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const { getCSRFToken, getCookie, baseUrl, login} = useAppContext();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file before uploading!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
        await getCSRFToken();
        const xsrfToken = getCookie('XSRF-TOKEN');
        const response = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        headers: {
            'Accept': "application/json",
            'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
        },
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setUploadStatus(`Image uploaded successfully: ${data.path}`);
    } catch (error) {
      console.error(error);
      setUploadStatus("Failed to upload image. Please try again.");
    }
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button onClick={handleUpload}>Upload</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default TestPage;
