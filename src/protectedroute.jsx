import React from 'react';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { event_id } = useParams();
  const isAuthenticated = localStorage.getItem('authToken');
  localStorage.setItem('eventUUID', event_id)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />; 
  }

  return children; 
};

export default ProtectedRoute;
