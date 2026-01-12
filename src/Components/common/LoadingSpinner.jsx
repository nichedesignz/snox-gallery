import React from 'react';
import '../../CSS/gallerystyle.css';

const LoadingSpinner = ({ fullPage = false }) => {
  return (
    <div className={fullPage ? "loader-wrapper" : "loading-spinner"}>
      <div className="loader"></div>
    </div>
  );
};

export default LoadingSpinner;
