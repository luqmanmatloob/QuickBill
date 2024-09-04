// utils/auth.js
export const isAuthenticated = () => {
    const token = localStorage.getItem('token'); // or use cookies
    // Add more checks if needed, such as token expiration
    return !!token;
  };
  