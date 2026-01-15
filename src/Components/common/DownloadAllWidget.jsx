import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CONFIG from '../../config';
import '../../CSS/downloadAllWidget.css';

const DownloadAllWidget = ({ galleryId }) => {
  const [status, setStatus] = useState(null); // null, 'pending', 'completed'
  const [zipJobId, setZipJobId] = useState(null);
  const [zipFiles, setZipFiles] = useState([]);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const pollingIntervalRef = useRef(null);

  // Reset widget when gallery changes
  useEffect(() => {
    setStatus(null);
    setZipJobId(null);
    setZipFiles([]);
    setError(null);
    setIsVisible(false);
    
    // Clear any existing polling
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, [galleryId]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Request zip creation
  const handleDownloadAllClick = async () => {
    if (!galleryId) {
      setError('No gallery selected');
      return;
    }

    setIsVisible(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${CONFIG.API_BASE_URL}public/api/v1/gallery/${galleryId}/request-zip/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.result) {
        const { zip_job_id, status: jobStatus, files } = response.data.data;
        setZipJobId(zip_job_id);
        setStatus(jobStatus);

        if (jobStatus === 'completed' && files) {
          setZipFiles(files);
        } else if (jobStatus === 'pending') {
          // Start polling
          startPolling(zip_job_id);
        }
      } else {
        setError('Failed to request zip creation');
      }
    } catch (err) {
      console.error('Error requesting zip:', err);
      setError('Failed to request zip creation. Please try again.');
    }
  };

  // Poll for zip status
  const startPolling = (jobId) => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.post(
          `${CONFIG.API_BASE_URL}public/api/v1/gallery/${galleryId}/request-zip/`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.result) {
          const { status: jobStatus, files } = response.data.data;
          setStatus(jobStatus);

          if (jobStatus === 'completed' && files) {
            setZipFiles(files);
            // Stop polling
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
          }
        }
      } catch (err) {
        console.error('Error polling zip status:', err);
      }
    }, 30000); // Poll every 30 seconds
  };

  // Download individual zip file
  const handleDownloadZip = (url, index) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `gallery-batch-${index + 1}.zip`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="download-all-widget">
      {!isVisible ? (
        <button className="download-all-btn" onClick={handleDownloadAllClick}>
          Download All Images
        </button>
      ) : (
        <div className="download-widget-content">
          {error && (
            <div className="widget-error">
              <p>{error}</p>
              <button onClick={() => setIsVisible(false)}>Close</button>
            </div>
          )}

          {status === 'pending' && (
            <div className="widget-pending">
              <div className="pending-header">
                <h4>Preparing Your Download</h4>
                <button className="close-widget-btn" onClick={() => setIsVisible(false)}>
                  ×
                </button>
              </div>
              <p>We're creating zip files for your gallery. This may take a few moments...</p>
              <div className="progress-bar">
                <div className="progress-bar-fill"></div>
              </div>
              <p className="pending-note">You can close this and come back later. We'll keep preparing your files.</p>
            </div>
          )}

          {status === 'completed' && zipFiles.length > 0 && (
            <div className="widget-completed">
              <div className="completed-header">
                <h4>Your Download is Ready!</h4>
                <button className="close-widget-btn" onClick={() => setIsVisible(false)}>
                  ×
                </button>
              </div>
              <p className="completed-message">
                Your gallery has been split into {zipFiles.length} zip file{zipFiles.length > 1 ? 's' : ''}.
              </p>
              <div className="zip-files-list">
                {zipFiles.map((file, index) => (
                  <div key={index} className="zip-file-item">
                    <div className="zip-file-info">
                      <span className="zip-file-name">Batch {index + 1}</span>
                      <span className="zip-file-size">{formatFileSize(file.size)}</span>
                    </div>
                    <button
                      className="download-zip-btn"
                      onClick={() => handleDownloadZip(file.url, index)}
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DownloadAllWidget;
