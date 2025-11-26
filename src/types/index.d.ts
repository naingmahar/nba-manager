// --- 1. Player Types ---

/**
 * Interface for the raw Player data as returned directly by the Ball Don't Lie API.
 * This is used to accurately type the response payload in fetchPlayers thunk.
 */
export interface ApiPlayer {
    id: number;
    first_name: string;
    last_name: string;
    position: string;
    height: string | null;
    weight: string | null;
    jersey_number: string | null;
    college: string | null;
    country: string | null;
    draft_year: number | null;
    draft_round: number | null;
    draft_number: number | null;
    team: { // The player's actual NBA team
        id: number;
        conference: string;
        division: string;
        city: string;
        name: string;
        full_name: string;
        abbreviation: string;
    };
}

/**
 * Interface for the Player object stored in our Redux state.
 * It extends ApiPlayer but includes our custom 'teamId' for management.
 */
export interface Player extends ApiPlayer {
    // This custom field tracks which of YOUR teams the player is assigned to
    teamId: string | null; 
}


// --- 2. Team Types ---

/**
 * Interface for a custom Team object managed by the user.
 */
export interface Team {
    id: string; // nanoid generated ID
    name: string;
    region: string;
    country: string;
    playerIds: number[]; // List of IDs of assigned players
    playerCount: number;
}


// --- 3. Redux State Interfaces (Slices) ---

/**
 * Interface for the Auth Redux Slice State.
 */
export interface AuthState {
    isAuthenticated: boolean;
    username: string | null;
    password: string | null;
}

/**
 * Interface for the Team Redux Slice State.
 */
export interface TeamState {
    teams: Team[];
}

/**
 * Interface for the Player Redux Slice State.
 * Uses cursor-based pagination fields.
 */
export interface PlayerState {
    players: Player[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    // Pagination fields for infinite scrolling:
    nextCursor: number; // The cursor value to use for the next API call (0 for start)
    hasMore: boolean; // True if more data can be fetched
}