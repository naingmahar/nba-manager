import React from 'react';;
import { addPlayerToTeam, removePlayerFromTeam } from '@/store/slices/teamSlice';
import { Player, Team } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { assignPlayer, unassignPlayer } from '@/store/slices/playerSlices';

// Define the component's props interface
interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const dispatch = useAppDispatch();
  const allTeams = useAppSelector((state) => state.teams.teams);
  
  // Find the team the player is currently assigned to
  const assignedTeam: Team | undefined = allTeams.find(t => t.id === player.teamId);
  const isAssigned = !!assignedTeam;

  // Handler for selecting a team from the dropdown
  const handleAssignPlayer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const teamId = e.target.value;
    
    // Safety check: Player should not be assigned if they are already on a team.
    if (!isAssigned && teamId) {
        // 1. Update the player's status in the player slice
        dispatch(assignPlayer({ playerId: player.id, teamId }));
        // 2. Update the team's roster in the team slice
        dispatch(addPlayerToTeam({ teamId, playerId: player.id }));
    }
  };

  // Handler for removing a player from their current team
  const handleRemovePlayer = () => {
    if (assignedTeam) {
        // 1. Remove player ID from the team's roster
        dispatch(removePlayerFromTeam({ teamId: assignedTeam.id, playerId: player.id }));
        // 2. Clear player's teamId in the player slice
        dispatch(unassignPlayer({ playerId: player.id }));
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition duration-150">
      <h4 className="font-bold text-lg text-gray-800">
        {player.first_name} {player.last_name}
      </h4>
      <p className="text-sm text-gray-500">Position: **{player.position || 'N/A'}**</p>
      
      {isAssigned ? (
        // UI when player is assigned
        <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded-md">
          <p className="text-sm font-medium text-yellow-800">
            Assigned to: **{assignedTeam.name}**
          </p>
          <button
            onClick={handleRemovePlayer}
            className="mt-2 w-full text-sm bg-red-600 text-white p-1.5 rounded-md hover:bg-red-700 transition"
          >
            Remove from Team
          </button>
        </div>
      ) : (
        // UI for assigning a player
        <div className="mt-3">
          <label htmlFor={`assign-select-${player.id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Assign to Team:
          </label>
          <select 
            id={`assign-select-${player.id}`}
            onChange={handleAssignPlayer} 
            className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-blue-500 focus:border-blue-500"
            defaultValue=""
          >
            <option value="" disabled>-- Select a Team --</option>
            {allTeams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name} ({team.playerIds.length} players)
              </option>
            ))}
          </select>
          {allTeams.length === 0 && (
             <p className="text-xs text-red-500 mt-1">Create a team first!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerCard;