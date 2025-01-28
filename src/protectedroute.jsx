import React from 'react';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { event_uuid } = useParams();
  const isAuthenticated = localStorage.getItem('authToken');
  localStorage.setItem('eventUUID', event_uuid)

  if (!isAuthenticated) {
    return <Navigate to="/authpage" replace />; 
  }

  return children; 
};

export default ProtectedRoute;
