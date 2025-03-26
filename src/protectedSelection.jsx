import React from 'react';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
const ProtectedRouteSelection = ({ children }) => {
  const { event_id } = useParams();
  const isAuthenticated = localStorage.getItem('authSelToken');
  
  localStorage.setItem('eventUUID', event_id)
  if (!isAuthenticated) {
    return <Navigate to="/authpageselection" replace />; 
  }

  return children; 
};

export default ProtectedRouteSelection;
