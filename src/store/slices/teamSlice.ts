import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { Team, TeamState } from '@/types';
// We must import the action from the player slice to handle the side effect on delete
import { unassignPlayersByTeam } from './playerSlices'; 
import { AppDispatch, RootState } from '../store';

const initialState: TeamState = {
  teams: [],
};

const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    // 1. Create Team (using prepare to generate unique ID)
    addTeam: {
        reducer: (state, action: PayloadAction<Team>) => {
            state.teams.push(action.payload);
        },
        prepare: (teamData: Omit<Team, 'id' | 'playerIds' | 'playerCount'>) => {
            return {
                payload: {
                    id: nanoid(), // Generate unique ID
                    ...teamData,
                    playerIds: [],
                    playerCount: 0, 
                } as Team
            };
        }
    },
    // 2. Update Team Details (name, region, country)
    updateTeam: (state, action: PayloadAction<{ id: string, updates: Partial<Team> }>) => {
        const { id, updates } = action.payload;
        const index = state.teams.findIndex(t => t.id === id);
        if (index !== -1) {
            // Only update mutable fields (name, region, country)
            state.teams[index] = { 
                ...state.teams[index], 
                name: updates.name || state.teams[index].name,
                region: updates.region || state.teams[index].region,
                country: updates.country || state.teams[index].country,
            };
        }
    },
    // 3. Add Player to Team Roster
    addPlayerToTeam: (state, action: PayloadAction<{ teamId: string, playerId: number }>) => {
        const { teamId, playerId } = action.payload;
        const team = state.teams.find(t => t.id === teamId);
        if (team && !team.playerIds.includes(playerId)) {
            team.playerIds.push(playerId);
            team.playerCount = team.playerIds.length;
        }
    },
    // 4. Remove Player from Team Roster
    removePlayerFromTeam: (state, action: PayloadAction<{ teamId: string, playerId: number }>) => {
        const { teamId, playerId } = action.payload;
        const team = state.teams.find(t => t.id === teamId);
        if (team) {
            team.playerIds = team.playerIds.filter(id => id !== playerId);
            team.playerCount = team.playerIds.length;
        }
    },
    // 5. Internal action for deletion (used by the thunk below)
    removeTeam: (state, action: PayloadAction<string>) => {
        const teamId = action.payload;
        state.teams = state.teams.filter(t => t.id !== teamId);
    }
  },
});

export const { 
    addTeam, 
    updateTeam, 
    addPlayerToTeam, 
    removePlayerFromTeam, 
    removeTeam // Exported as a private action for the thunk
} = teamSlice.actions;


/**
 * Thunk to delete a team and handle the side effect of unassigning players.
 * This ensures the constraint: "The players will be removed from the team if the team is deleted."
 */
export const deleteTeamAndUnassignPlayers = (teamId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    // 1. Dispatch the internal action to remove the team from the teams slice
    dispatch(removeTeam(teamId)); 
    
    // 2. Dispatch the action from the player slice to unassign all players from this team
    dispatch(unassignPlayersByTeam(teamId));
};


export default teamSlice.reducer;