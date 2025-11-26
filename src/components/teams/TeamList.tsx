'use client';
import React, { useState } from 'react';
import { deleteTeamAndUnassignPlayers } from '@/store/slices/teamSlice'; // Import the thunk
import { Team } from '@/types';
import TeamModal from './TeamModal';
import { useAppDispatch, useAppSelector } from '@/store/hook';

const TeamList: React.FC = () => {
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.teams.teams);

  // State for Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState<Team | null>(null);

  const handleOpenCreateModal = () => {
    setTeamToEdit(null); // Clear any team being edited
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (team: Team) => {
    setTeamToEdit(team);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTeamToEdit(null);
  };

  const handleDelete = (teamId: string, teamName: string) => {
    // Confirmation before deleting
    if (window.confirm(`Are you sure you want to delete the team "${teamName}"? All ${teams.find(t => t.id === teamId)?.playerIds.length || 0} players will be unassigned.`)) {
      // Dispatch the thunk to delete the team AND unassign players
      dispatch(deleteTeamAndUnassignPlayers(teamId));
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h2 className="text-2xl font-bold text-gray-800">Team Management ({teams.length})</h2>
        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition duration-150 shadow-md"
        >
          + Create New Team
        </button>
      </div>

      <div className="space-y-4">
        {teams.length === 0 ? (
          <p className="text-gray-500 text-lg p-6 text-center bg-gray-50 rounded-lg">
            No teams created yet. Click "Create New Team" to start managing your roster!
          </p>
        ) : (
          teams.map((team) => (
            <div 
              key={team.id} 
              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition duration-150 bg-white"
            >
              <div>
                <h3 className="text-xl font-semibold text-blue-700">{team.name}</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Region:</span> {team.region} | 
                  <span className="font-medium ml-2">Country:</span> {team.country}
                </p>
                <p className={`text-sm font-bold mt-1 ${team.playerCount > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                    Players: {team.playerCount}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenEditModal(team)}
                  className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(team.id, team.name)}
                  className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <TeamModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        teamToEdit={teamToEdit}
      />
    </div>
  );
};

export default TeamList;