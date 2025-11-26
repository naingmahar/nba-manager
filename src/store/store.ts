import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { persistStore, persistReducer } from 'redux-persist'; 
import storage from 'redux-persist/lib/storage'; 
import { Reducer } from 'redux';
import rootReducer from './rootReducer';
import { AuthState, PlayerState, TeamState } from '@/types'; 
import { CombinedState } from '@reduxjs/toolkit/query';

// --- FIX: Manual definition for PersistPartial ---
/**
 * Represents the internal metadata added by redux-persist to the state tree.
 * This is the type that was causing the "not found" error.
 */
interface ManualPersistPartial {
    _persist: {
        version: number;
        rehydrated: boolean;
    };
}

// 1. Define the RootState Type
export type RootState = {
    auth: AuthState;
    teams: TeamState;
    players: PlayerState;
};

// 2. Define the PersistedState Type using the manual definition
export type PersistedState = RootState & ManualPersistPartial;

// 3. Type the Root Reducer
const rootReducerTyped: Reducer<PersistedState, any> = rootReducer as Reducer<PersistedState, any>;

// Redux Persist Configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'teams', 'players'], 
};

// 4. Create the Persisted Reducer with Explicit Type
const persistedReducer: Reducer<PersistedState, any> = persistReducer(persistConfig, rootReducerTyped);


// Function to create and configure the store
export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
        },
      }),
  });
  
  // Attach the persistor
  (store as any).__persistor = persistStore(store); 
  return store;
};

// Define types for the store and dispatch function
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];

// Export the Next.js Redux wrapper
export const wrapper = createWrapper<AppStore>(makeStore);