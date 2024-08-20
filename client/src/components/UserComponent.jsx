import React, { useState } from 'react';

const UserComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (password === process.env.REACT_APP_PASSWORD) {
      setLoggedIn(true);
    } else {
      alert('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <div className="mx-auto mt-10 max-w-sm rounded-md bg-gray-100 p-6 shadow-md">
      {loggedIn ? (
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Welcome, {username}!</h2>
          <button className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Login</h2>
          <input className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600" onClick={handleLogin}>
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default UserComponent;
