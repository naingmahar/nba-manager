import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Player, PlayerState, ApiPlayer } from '@/types'; // Assuming you have ApiPlayer type
import { RootState } from '../store';

// Define the shape of the API response data, reflecting the structure you provided
interface FetchPlayersResponse {
    data: ApiPlayer[]; // The raw player data from the API
    meta: {
        next_cursor: number | null; // Used for pagination
        per_page: number;
    };
}

const initialState: PlayerState = {
  players: [], 
  status: 'idle', 
  error: null,
  // Using 'cursor' instead of 'currentPage' for clarity based on the API response
  nextCursor: 0, // 0 means start from the beginning
  hasMore: true,
};

// --- Async Thunk for API Call (Fetching and Pagination) ---

export const fetchPlayers = createAsyncThunk<
    { data: Player[], meta: FetchPlayersResponse['meta'] }, // Return type of the payload
    number, // Argument type (the cursor/page number to request)
    { rejectValue: string, state: RootState } // Type for the error value and access to state
>(
  'players/fetchPlayers',
  async (cursor: number, { rejectWithValue, getState }) => {
    try {
      console.log(`Fetching players for cursor: ${cursor}`);
        // Use the cursor value to request the next page of players.
        // Assuming the API supports both 'page' and 'cursor' or that 'cursor' acts as the page number.
        const response = await fetch(
            `https://api.balldontlie.io/v1/players?cursor=${cursor}&per_page=10`,
            {
                method: 'GET',  
                headers: {
                  "Authorization": "a7ba4237-f844-48fa-9839-c32ffac28401",
                  "Content-Type": "application/json"
                }
            }
        );
        
        if (!response.ok) {
            return rejectWithValue(`Failed to fetch players: HTTP ${response.status}`);
        }
        
        const data: FetchPlayersResponse = await response.json();

        // Retrieve existing players from the current state to maintain assignment status
        const existingPlayers = getState().players.players;

        // Map the raw API players to the internal Player interface
        const playersWithTeamId: Player[] = data.data.map(rawPlayer => {
            // Find existing player to maintain assignment state on rehydration/refetch
            const existing = existingPlayers.find(p => p.id === rawPlayer.id);

            return {
                ...rawPlayer,
                // If the player exists in state, keep their teamId. Otherwise, initialize to null.
                teamId: existing ? existing.teamId : null, 
            } as Player; // Cast to your internal Player type
        });

        return {
            data: playersWithTeamId,
            meta: data.meta,
        };
    } catch (error) {
        return rejectWithValue('A network error occurred while fetching players.');
    }
  }
);


const playerSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    // 1. Assign a player to a specific team
    assignPlayer: (state, action: PayloadAction<{ playerId: number, teamId: string }>) => {
      const { playerId, teamId } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      
      // Constraint check: Player should only be assigned if currently unassigned
      if (player && !player.teamId) { 
        player.teamId = teamId;
      }
    },
    // 2. Unassign a player from their team
    unassignPlayer: (state, action: PayloadAction<{ playerId: number }>) => {
      const { playerId } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      if (player) {
        player.teamId = null;
      }
    },
    // 3. Unassign multiple players (used when a team is deleted)
    unassignPlayersByTeam: (state, action: PayloadAction<string>) => {
        const teamId = action.payload;
        state.players.forEach(player => {
            if (player.teamId === teamId) {
                player.teamId = null;
            }
        });
    }
  },
  extraReducers: (builder) => {
    builder
      // PENDING: Set loading state
      .addCase(fetchPlayers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // FULFILLED: Handle successful fetch and append data
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // 🛑 CRITICAL FIX: Update the nextCursor based on the API response
        state.nextCursor = action.payload.meta.next_cursor || 0;
        state.hasMore = action.payload.meta.next_cursor !== null;
        
        // Append new players, avoiding duplicates if state already contains them
        const newPlayers = action.payload.data.filter(
            (newPlayer) => !state.players.some((existing) => existing.id === newPlayer.id)
        );
        state.players.push(...newPlayers);
      })
      // REJECTED: Handle errors
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch players data.';
      });
  },
});

export const { assignPlayer, unassignPlayer, unassignPlayersByTeam } = playerSlice.actions;
export default playerSlice.reducer;

