import React from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children, navigate, auth, ...rest }) {
  return auth ? children : <Navigate to={navigate} />;
}
