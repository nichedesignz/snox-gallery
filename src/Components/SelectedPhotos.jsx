
import React, { useEffect, useState } from 'react';
import '../CSS/gallerystyle.css';  

function SelectedPhotos({ images }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (images.length < 1 && message !== "No photos selected") {
      setMessage("No photos selected!!");
    } else if (images.length > 0 && message !== "") {
      setMessage(""); 
    }
  }, [images, message]);

  return (
    <div className="selectedimagestyle">
    <div className="masonry-container">
        {images.map((image, index) => (
          <div key={image.id} className="masonry-item" style={{ position: 'relative' }}>
            <img
              src={image.src}
              alt={image.alt}
              className="img-fluid"
            />
          </div>
        ))}
      </div>

    
      {message && (
        <div style={{ color: 'black', display: 'flex', justifyContent: 'center', fontFamily: 'initial' }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default SelectedPhotos;
