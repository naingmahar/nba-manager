import React from 'react';
import type { NextPage } from 'next';
import { useAppSelector } from '@/store/hooks'; // Import typed selector
import Login from '@/components/auth/Login';
import PlayerList from '@/components/players/PlayerList';
import TeamList from '@/components/teams/TeamList';

const Home: NextPage = () => {
  // Use the typed selector to get authentication status
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const username = useAppSelector((state) => state.auth.username);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-extrabold text-blue-800">
          NBA Team Manager App
        </h1>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === Column 1: Authentication & Navigation === */}
        <section className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Authentication</h2>
            {/* The Login component handles both login form and logged-in display/logout button */}
            <Login /> 
          </div>

          {isAuthenticated && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome Back!</h2>
              <p className="text-lg text-gray-600">
                You are logged in as: <span className="font-semibold text-blue-600">{username}</span>.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Start by creating teams and assigning players below.
              </p>
            </div>
          )}
        </section>

        {/* === Column 2 & 3: Main Application Content === */}
        {isAuthenticated ? (
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Team Management Section */}
            <section>
              <TeamList />
            </section>
            
            {/* 2. Player Fetching and Assignment Section */}
            <section>
              <PlayerList />
            </section>
          </div>
        ) : (
          <section className="lg:col-span-2 flex items-center justify-center">
            {/* <div className="p-10 bg-white rounded-xl shadow-2xl text-center">
              <p className="text-2xl font-semibold text-red-500">
                Please login to access team and player management.
              </p>
            </div> */}
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;