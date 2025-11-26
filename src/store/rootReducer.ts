import { combineReducers } from '@reduxjs/toolkit'; // Use @reduxjs/toolkit's combineReducers
import { HYDRATE } from 'next-redux-wrapper';
import authReducer, { resetAppState } from './slices/authSlice';
import teamReducer from './slices/teamSlice';
import playerReducer from './slices/playerSlices';
import { RootState } from './store'; 

// 1. Combine Reducers
const combinedReducer = combineReducers({
  auth: authReducer,
  teams: teamReducer,
  players: playerReducer,
});

// We rely on the types inferred from `combinedReducer`
// The type of this variable is essentially `CombinedState`
export type AppState = ReturnType<typeof combinedReducer>; 

const rootReducer = (state: RootState | undefined, action: any) => {

// ... rest of the HYDRATE logic ...
    return combinedReducer(state, action);
}

export default rootReducer;