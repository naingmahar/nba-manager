import React from 'react';
// Import the client wrapper
import ClientAuthWrapper from '@/components/auth/ClientAuthWrapper'; 
import PlayerList from '@/components/players/PlayerList';
import TeamList from '@/components/teams/TeamList';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-extrabold text-blue-800">
          NBA Team Manager
        </h1>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Use the wrapper here to manage the conditional rendering logic */}
        <ClientAuthWrapper>
            {/* The children passed here will only render if the user is authenticated */}
            <TeamList />
            <PlayerList />
        </ClientAuthWrapper>
      </main>
    </div>
  );
};

export default Home;