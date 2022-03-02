import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authenticationService } from '../services/authentication.service';

export function PrivateRoute({ children }) {
  const location = useLocation();
  const currentUser = authenticationService.currentUserValue;

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}
