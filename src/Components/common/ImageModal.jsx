import React from 'react';
import download from '../../assets/download.png';
import nextArrow from '../../assets/next.png';
import previousArrow from '../../assets/back.png';
import '../../CSS/gallerystyle.css';

const ImageModal = ({
  openedImage,
  currentIndex,
  images,
  onClose,
  onNext,
  onPrevious,
  onDownload,
  onToggleSelection,
  showSelection = false,
  tickIcon = null
}) => {
  if (!openedImage) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="download-btn" onClick={onDownload}>
          <img src={download} alt="Download" />
        </button>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <button className="prev-btn" onClick={onPrevious}>
          <img src={previousArrow} alt="Previous" />
        </button>
        <img src={openedImage} alt="Full view" className="modal-image" />
        <button className="next-btn" onClick={onNext}>
          <img src={nextArrow} alt="Next" />
        </button>

        {showSelection && tickIcon && (
          <button
            className={`selecttick ${images[currentIndex]?.is_selected ? 'selected' : ''}`}
            onClick={() => images[currentIndex] && onToggleSelection(images[currentIndex].id)}
          >
            <img src={tickIcon} alt="Select" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
