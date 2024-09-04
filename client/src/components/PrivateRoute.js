
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth'; // Adjust the import path as needed

const ProtectedRoute = ({ element }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await isAuthenticated();
      setAuthenticated(result);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    // You can display a loading spinner or nothing while the auth check is in progress
    return <div>Loading...</div>;
  }

  return authenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;

