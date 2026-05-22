import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { storage } from '../utils/storage';

export function ProtectedRoute() {
  const isAuthenticated = !!storage.getToken();

  // Additional token structure validation could be done here (e.g. jwt-decode)
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
