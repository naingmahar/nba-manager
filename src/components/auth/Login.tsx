'use client'; // This component uses client-side hooks (useState, Redux hooks)

import React, { useState, FormEvent } from 'react';
import { login, logout } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import LogoutButton from './LogoutButton'; // Assuming you have this component
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";


/**
 * Login Component
 * Displays a login form if the user is not authenticated.
 * If authenticated, displays a welcome message and a LogoutButton.
 */
const Login: React.FC = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const username = useAppSelector((state) => state.auth.username);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch(login({ username: name, password }));
      setName('');
    }
  };

  // If already authenticated, show a welcome message and the LogoutButton
  if (isAuthenticated) {
    return (
      <div className="text-center">
        <p className="text-lg text-gray-700 mb-4">
          Logged in as <span className="font-semibold text-blue-600">{username}</span>
        </p>
        <LogoutButton />
      </div>
    );
  }

  // Otherwise, show the login form
  return (
    <div className="w-full max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
          Login to Continue
        </h3>
        
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            id="username"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
            placeholder="Enter your name"
            required
            aria-label="Username"
          />
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 mt-3">
            Your Password
          </label>
           <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
            placeholder="Enter your password"
            required
            aria-label="password"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 shadow-lg transform hover:scale-105"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;