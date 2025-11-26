import React, { useState, useEffect, FormEvent } from 'react';
import { addTeam, updateTeam } from '@/store/slices/teamSlice';
import { Team } from '@/types'; // Import the Team interface
import { useAppDispatch, useAppSelector } from '@/store/hook';

// Define the component's props interface
interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamToEdit?: Team | null; // Optional team object for editing
}

const TeamModal: React.FC<TeamModalProps> = ({ isOpen, onClose, teamToEdit }) => {
  const dispatch = useAppDispatch();
  const existingTeams = useAppSelector((state) => state.teams.teams);
  
  const isEditing = !!teamToEdit;

  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');

  // Effect to populate form when editing a team
  useEffect(() => {
    if (isEditing && teamToEdit) {
      setName(teamToEdit.name);
      setRegion(teamToEdit.region);
      setCountry(teamToEdit.country);
    } else {
      // Reset state for creating a new team
      setName('');
      setRegion('');
      setCountry('');
    }
    setError('');
  }, [teamToEdit, isEditing, isOpen]);

  const validate = (): boolean => {
    const trimmedName = name.trim();
    const trimmedRegion = region.trim();
    const trimmedCountry = country.trim();

    if (!trimmedName || !trimmedRegion || !trimmedCountry) {
      setError('All fields (Name, Region, Country) are required.');
      return false;
    }

    // Validation: Team name must be unique
    const isDuplicate = existingTeams.some(team => 
        team.name.toLowerCase() === trimmedName.toLowerCase() && 
        team.id !== teamToEdit?.id // Exclude the current team when editing
    );

    if (isDuplicate) {
      setError(`The team name "${trimmedName}" is already taken and must be unique.`);
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const teamData = {
      name: name.trim(),
      region: region.trim(),
      country: country.trim(),
      // playerCount and playerIds are managed by Redux actions, not form input
    };

    if (isEditing && teamToEdit) {
      // Dispatch update action
      dispatch(updateTeam({ 
          id: teamToEdit.id, 
          updates: teamData 
      }));
    } else {
      // Dispatch creation action (playerCount and playerIds will be initialized in the slice)
      dispatch(addTeam(teamData));
    }

    onClose();
  };

  if (!isOpen) return null;

  // Modal backdrop and centered container
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          {isEditing ? 'Edit Team Details' : 'Create New Team'}
        </h3>
        <form onSubmit={handleSubmit}>
          
          {/* Team Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Team Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              placeholder="e.g., Redux Rockets"
            />
          </div>
          
          {/* Region Field */}
          <div className="mb-4">
            <label htmlFor="region" className="block text-sm font-semibold text-gray-700">Region *</label>
            <input
              id="region"
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
              placeholder="e.g., North America"
            />
          </div>
          
          {/* Country Field */}
          <div className="mb-4">
            <label htmlFor="country" className="block text-sm font-semibold text-gray-700">Country *</label>
            <input
              id="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
              placeholder="e.g., USA"
            />
          </div>

          {/* Player Count (Read-only when editing) */}
          {isEditing && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-blue-700">Current Player Count: {teamToEdit.playerCount}</p>
                <p className="text-xs text-blue-500">Player roster is managed separately.</p>
            </div>
          )}

          {/* Error State */}
          {error && <p className="text-red-500 text-sm mb-4 font-medium p-2 bg-red-100 border border-red-300 rounded-md">{error}</p>}
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 shadow-lg shadow-blue-200"
            >
              {isEditing ? 'Save Changes' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TeamModal;