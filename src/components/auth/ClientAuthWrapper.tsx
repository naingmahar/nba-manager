// src/components/auth/ClientAuthWrapper.tsx
'use client';

import React from 'react';
import Login from './Login'; // Import Login to handle the form and Logout button
import { useAppSelector } from '@/store/hook';

/**
 * ClientAuthWrapper Component
 * This component checks the global authentication state via Redux 
 * and conditionally renders the main application content or a login prompt.
 *
 * It is marked 'use client' because it uses the Redux hook useAppSelector.
 */
const ClientAuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the typed selector to get authentication status and username
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const username = useAppSelector((state) => state.auth.username);

  if (!isAuthenticated) {
    // Renders the login form and a prompt when not authenticated
    return (
      <>
        {/* Render the Login component, which shows the form when not logged in */}
        <section className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Authentication</h2>
                <Login />
            </div>
        </section>
        
        {/* Render the message taking up the rest of the space */}
        {/* <section className="lg:col-span-2 flex items-center justify-center">
            <div className="p-10 bg-white rounded-xl shadow-2xl text-center">
                <p className="text-2xl font-semibold text-red-500">
                    Please login to access team and player management.
                </p>
            </div>
        </section> */}
      </>
    );
  }

  // Renders a welcome message and the main content when authenticated
  return (
    <>
      {/* 1. Authentication Column (Shows Welcome/Logout) */}
      <section className="lg:col-span-1 space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Authentication</h2>
            {/* Login component will automatically render LogoutButton when isAuthenticated is true */}
            <Login /> 
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome Back!</h2>
            <p className="text-lg text-gray-600">
                You are logged in as: <span className="font-semibold text-blue-600">{username}</span>.
            </p>
        </div>
      </section>

      {/* 2. Main Content (TeamList & PlayerList) */}
      <div className="lg:col-span-2 space-y-8">
        {children}
      </div>
    </>
  );
};

export default ClientAuthWrapper;