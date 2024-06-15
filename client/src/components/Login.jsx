import React, { useState } from 'react';

const AuthComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const register = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Error registering user');
            }

            alert('User registered');
        } catch (error) {
            console.error(error);
            alert('Error registering user');
        }
    };

    const login = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Error logging in');
            }

            const data = await response.json();
            setToken(data.token);
            localStorage.setItem('token', data.token);
            alert('User logged in');
        } catch (error) {
            console.error(error);
            alert('Error logging in');
        }
    };

    const changePassword = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, oldPassword: password, newPassword }),
            });

            if (!response.ok) {
                throw new Error('Error changing password');
            }

            alert('Password changed');
        } catch (error) {
            console.error(error);
            alert('Error changing password');
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        alert('User logged out');
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Auth Component</h2>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <div className="flex flex-col space-y-2">
                    <button 
                        onClick={register} 
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Register
                    </button>
                    <button 
                        onClick={login} 
                        className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Login
                    </button>
                    <button 
                        onClick={changePassword} 
                        className="w-full py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                        Change Password
                    </button>
                    <button 
                        onClick={logout} 
                        className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthComponent;
