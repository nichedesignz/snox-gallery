import '../../CSS/gallerystyle.css';

const ImageGrid = ({
  images,
  imageLoaded,
  setImageLoaded,
  onImageClick,
  onToggleSelection,
  showSelection = false,
  selectedOption = 'allphotos'
}) => {
  const filteredImages = selectedOption === 'allphotos'
    ? images
    : images.filter(image => image.is_selected);

  return (
    <div className="masonry-container">
      {filteredImages.length > 0 ? (
        filteredImages.map((image, index) => (
          <div key={image.id} className="masonry-item" style={{ position: 'relative' }}>
            <img
              src={image.small.url}
              alt={`Image ${index + 1}`}
              className="img-fluid"
              onLoad={() => setImageLoaded(prev => ({ ...prev, [image.id]: true }))}
              style={{
                opacity: imageLoaded[image.id] ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out'
              }}
              onClick={() => {
                const fullIndex = images.findIndex(img => img.id === image.id);
                if (fullIndex !== -1) onImageClick(fullIndex);
              }}
            />

            {imageLoaded[image.id] && showSelection && (
              <div
                className="checkbox-wrapper-18"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  zIndex: 10,
                }}
              >
                <div className="round">
                  <input
                    type="checkbox"
                    id={`checkbox-${image.id}`}
                    checked={image.is_selected || false}
                    onChange={() => onToggleSelection(image.id)}
                  />
                  <label htmlFor={`checkbox-${image.id}`}></label>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No images available.</p>
      )}
    </div>
  );
};

export default ImageGrid;
