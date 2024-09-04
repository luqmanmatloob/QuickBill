
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const isAuthenticated = async () => {
  const token = localStorage.getItem('token'); // or use cookies

  if (!token) {
    return false;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/user/checkvalidity`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // or however you're passing the token
      },
    });

    const data = await response.json();
    return data.valid;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};
