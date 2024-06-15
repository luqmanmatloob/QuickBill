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
        <div className="max-w-sm mx-auto mt-10 p-6 bg-gray-100 rounded-md shadow-md">
            {loggedIn ? (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Welcome, {username}!</h2>
                    <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600" onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Login</h2>
                    <input className="w-full mb-4 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input className="w-full mb-4 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600" onClick={handleLogin}>Login</button>
                </div>
            )}
        </div>
    );
};

export default UserComponent;
