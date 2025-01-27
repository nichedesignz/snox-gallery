import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRouteSelection = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authSelToken'); 

  if (!isAuthenticated) {
    return <Navigate to="/authpageselection" replace />; 
  }

  return children; 
};

export default ProtectedRouteSelection;
