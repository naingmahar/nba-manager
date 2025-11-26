// src/components/players/PlayerList.tsx
'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import PlayerCard from './PlayerCard';
import { Player } from '@/types'; // Assuming Player type is imported from here
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { fetchPlayers } from '@/store/slices/playerSlices';

const PlayerList: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Destructure the state using the new 'nextCursor' field
  const { players, status, nextCursor, hasMore, error } = useAppSelector((state) => state.players);
  
  const loading = status === 'loading';
  const observerTarget = useRef<HTMLDivElement>(null);

  // Memoized function to load the next page using the cursor
  const loadNextPage = useCallback(() => {
    // Only fetch if there are more results and we are not currently loading
    if (hasMore && !loading) {
      // Dispatch the thunk with the nextCursor value (0 on first load, then the API-provided cursor)
      dispatch(fetchPlayers(nextCursor||0)); 
    }
  }, [hasMore, loading, nextCursor, dispatch]);

  // --- Initial Data Fetch ---
  useEffect(() => {
    // Only fetch if the player list is empty AND the status is 'idle' (first run)
    if (players.length === 0 && status === 'idle') {
      // loadNextPage(); // Starts fetching page 1 (cursor 0)
      dispatch(fetchPlayers(nextCursor||0)); 
    }
  }, [loadNextPage, players.length, status]);

  // --- Infinite Scroll Logic (IntersectionObserver) ---
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    // Callback function for the Intersection Observer
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      // If the target element is visible and we have more pages to load, trigger loadNextPage
      if (entry.isIntersecting) {
        loadNextPage();
      }
    };

    // Create and start the observer
    const observer = new IntersectionObserver(observerCallback, {
      root: null, // relative to the viewport
      rootMargin: '0px',
      threshold: 1.0, // Trigger when 100% of the target is visible
    });

    observer.observe(target);

    // Cleanup function: disconnect the observer when the component unmounts
    return () => observer.unobserve(target);
    
  }, [loadNextPage, players.length]); // Dependencies include players.length to re-run after new data loads

  // --- Render Functions ---

  const renderContent = () => {
    if (error) {
      return <div className="text-red-600 p-4 border border-red-300 rounded-md">Error: {error}</div>;
    }
    
    if (players.length === 0 && loading) {
        return <p className="text-gray-500 p-4">Loading initial players...</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player: Player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
        NBA Player List ({players.length} Loaded)
      </h2>
      
      {renderContent()}

      {/* 🛑 Intersection Observer Target */}
      {hasMore && (
        <div ref={observerTarget} className="text-center py-4">
          {loading ? (
            <p className="text-blue-500 font-semibold">Loading more players...</p>
          ) : (
            <p className="text-gray-500">Scroll down to load more...</p>
          )}
        </div>
      )}

      {!hasMore && players.length > 0 && (
        <div className="text-center py-4 border-t mt-4">
          <p className="text-green-600 font-semibold">
            All players have been loaded!
          </p>
        </div>
      )}
    </div>
  );
};

export default PlayerList;